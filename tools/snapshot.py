#!/usr/bin/env python3
"""
snapshot.py — 输出回归护栏：证明「改完之后显示没变」

为什么需要它
    这个仓库没有构建、没有测试，而排版是它唯一的产品。任何一次重构（合并渲染函数、
    把板块改成配置驱动、动 print.css）都可能悄悄挪动一个类名或一个分页点，
    而这种变化肉眼要逐份 PDF 翻才看得出来。这个脚本把「看一遍」变成「跑一条命令」。

覆盖面
    简历   5 变体 × 4 语 = 20 组（DOM ＋ PDF）
    作品页 3 变体 × 4 语 = 12 组（只 DOM —— 它是屏幕页，导 PDF 没有意义）
    hub.html 不进护栏：它显示实时访问计数，每次跑都不一样。

两层快照
    DOM   Chrome 渲染完之后 dump 出 #cv-root（作品页是 #wk-root）的 outerHTML，归一化后取哈希。
          抓的是结构：类名、元素顺序、属性，任何一处不同都会被抓到。
    PDF   headless 导出 A4，比较**页数**与**每页每个文本块的坐标**（四舍五入到 0.1pt）。
          不比字节：PDF 里带生成时间，且字体子集会让同样内容产出不同字节。

抓不到什么（别拿它当万能）
    · 交互之后的状态：折叠展开、切语言恢复 —— 那些代码只在点击时才跑，快照里看不见。
      实测漏过一次「折叠按钮点了没反应」，只能靠真点一下。
    · 纯屏幕层的可见性：漏了一条 display:none 会让打印专用块出现在网页上，
      而它在 DOM 里本来就该存在 —— 快照全绿，页面却是坏的。

用法
    先起本地服务器：  node tools/serve.js
    存基线：          python tools/snapshot.py baseline
    改完之后核对：    python tools/snapshot.py check
    只看某几个：      python tools/snapshot.py check --only ue,cd
    只跑 DOM（快 10 倍，改 JS/HTML 时够用）：  python tools/snapshot.py check --dom-only

读结果
    全部一致 → 退出码 0，打印「n/n 一致」。
    有差异   → 退出码 1，逐条列出哪个变体哪种语言、差在 DOM 还是 PDF、PDF 差在第几页，
               并给出可直接执行的 diff 命令。基线那份留在 .snapshot/base/，
               本次那份在 .snapshot/now/，两边都在，能逐字对。

依赖
    Chrome（Windows 默认路径已内置，可用 --chrome 覆盖）＋ Python。
    PDF 那一层需要 pymupdf；没装就自动退化成只跑 DOM，并明确告诉你。
    这些只是开发期工具，站点本身仍然零依赖。

时间
    DOM 全量约 40 秒，PDF 全量约 3 分钟（每份要等 Chrome 跑完 JS 与二维码）。
"""

import argparse
import hashlib
import json
import os
import re
import socket
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SNAP = os.path.join(ROOT, "tools", ".snapshot")
PORT = 5180

# 短链与语言：唯一真相在 scripts/variants.js，这里是它的镜像。
# 加变体时两处都要改 —— 护栏漏掉一个变体，那个变体就等于没有护栏。
VARIANTS = ["ue", "fl", "ds", "cd", "mn"]
LANGS = ["zh", "ja", "en", "de"]

# 作品页（PDF 二维码扫进来的落地页）也要有基线 —— 它渲染的是同一份数据的另一种排布，
# 改 render.js 或数据同样会波及它，而它以前完全在护栏之外。
# 只覆盖开了 worksPage 的变体：别的变体 PDF 里根本没有指向它的二维码。
# hub.html 不进护栏：它显示实时访问计数，每次跑都不一样，没法比。
WORKS_VARIANTS = ["ue", "fl", "ds"]

CHROME_DEFAULT = r"C:\Program Files\Google\Chrome\Application\chrome.exe"


def url_for(v, lang):
    base = "http://127.0.0.1:%d" % PORT
    # mn 指向独立页面 odd/；index.html 上的 ?v=mn 会整页跳过去，直接抓目标地址更稳
    if v == "mn":
        return "%s/odd/?lang=%s" % (base, lang)
    if v.startswith("works-"):
        return "%s/works.html?v=%s&lang=%s" % (base, v[6:], lang)
    return "%s/index.html?v=%s&lang=%s" % (base, v, lang)


def all_combos(only):
    """[(key, variant, lang)]。作品页只抓 DOM —— 它是屏幕页，导 PDF 没有意义。"""
    out = []
    for v in VARIANTS:
        if not only or v in only:
            for lang in LANGS:
                out.append(("%s-%s" % (v, lang), v, lang))
    for v in WORKS_VARIANTS:
        if not only or v in only:
            for lang in LANGS:
                out.append(("works-%s-%s" % (v, lang), "works-" + v, lang))
    return out


def server_up():
    s = socket.socket()
    s.settimeout(0.6)
    try:
        s.connect(("127.0.0.1", PORT))
        return True
    except OSError:
        return False
    finally:
        s.close()


# ── DOM ──────────────────────────────────────────────────────────────────────

# 会随时间自己变的内容：经验年限由 since 实时算出，今天存基线、下个月核对必然对不上。
# 把它替换成占位符 —— 我们关心的是结构有没有变，不是「4 年」有没有变成「5 年」。
VOLATILE = [
    (re.compile(r'(<span class="cv-skill-since"[^>]*>)[^<]*(</span>)'), r"\1{SINCE}\2"),
    (re.compile(r'(aria-label="[^"]*?)\d+(\s*(?:年|Jahre|years?|年間)[^"]*")'), r"\1{N}\2"),
]


def normalize_dom(html):
    # 简历是 #cv-root，作品页是 #wk-root；两个都截不到就整页比（至少不会假绿）
    m = re.search(r'<main id="cv-root".*?</main>', html, re.S) or         re.search(r'<main id="wk-root".*?</main>', html, re.S)
    if m:
        html = m.group(0)
    for pat, rep in VOLATILE:
        html = pat.sub(rep, html)
    html = re.sub(r">\s+<", "><", html)          # 标签之间的空白不算内容
    return html.strip()


# 独立 profile：不带这个，headless 会去抢用户正在使用的那个 Chrome 单例 ——
# 表现是脚本卡住或拿到一张空页面，排查起来毫无头绪。目录在 .snapshot 下，随快照一起被忽略。
PROFILE = os.path.join(SNAP, "_chrome")
BASE_FLAGS = ["--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run",
              "--user-data-dir=" + PROFILE, "--virtual-time-budget=7000"]


def dump_dom(chrome, url):
    out = subprocess.run(
        [chrome] + BASE_FLAGS + ["--dump-dom", url],
        capture_output=True, timeout=120,
    )
    return out.stdout.decode("utf-8", "replace")


# ── PDF ──────────────────────────────────────────────────────────────────────

def pdf_fingerprint(chrome, url, tmp):
    subprocess.run(
        [chrome] + BASE_FLAGS + ["--no-pdf-header-footer", "--print-to-pdf=" + tmp, url],
        capture_output=True, timeout=180,
    )
    import fitz
    doc = fitz.open(tmp)
    pages = []
    for pg in doc:
        # 只取文本块的坐标与内容：图形的包围盒在不同 Chrome 小版本间会有 ±0.01 的抖动，
        # 文本块坐标稳定，而且分页点一旦挪动，第一个块的 y 立刻就变了。
        blocks = [
            (round(b[0], 1), round(b[1], 1), round(b[2], 1), round(b[3], 1), b[4].strip())
            for b in pg.get_text("blocks") if b[4].strip()
        ]
        blocks.sort(key=lambda b: (b[1], b[0]))
        pages.append(blocks)
    doc.close()
    return len(pages), pages


def digest(obj):
    return hashlib.sha256(json.dumps(obj, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()[:16]


# ── 主流程 ───────────────────────────────────────────────────────────────────

def collect(chrome, only, dom_only, have_fitz, outdir):
    """outdir：归一化后的 DOM 落到哪个目录。baseline → base/，check → now/。
    两边都留一份，差异出现时才有得 diff —— 以前 check 会把基线那份直接覆盖掉，
    文件头上写的 diff/ 目录从来就没存在过。"""
    os.makedirs(outdir, exist_ok=True)
    tmp = os.path.join(SNAP, "_tmp.pdf")
    data = {}
    combos = all_combos(only)
    for i, (key, v, lang) in enumerate(combos, 1):
        url = url_for(v, lang)
        sys.stdout.write("  [%2d/%d] %-13s " % (i, len(combos), key))
        sys.stdout.flush()
        dom = normalize_dom(dump_dom(chrome, url))
        rec = {"dom": digest(dom), "domLen": len(dom)}
        # 作品页是屏幕页，导 PDF 没有意义
        if not dom_only and have_fitz and not key.startswith("works-"):
            n, pages = pdf_fingerprint(chrome, url, tmp)
            rec["pdfPages"] = n
            rec["pdf"] = digest(pages)
            rec["pdfPerPage"] = [digest(p) for p in pages]
            sys.stdout.write("dom=%s  pdf=%s (%d页)\n" % (rec["dom"], rec["pdf"], n))
        else:
            sys.stdout.write("dom=%s\n" % rec["dom"])
        data[key] = rec
        with open(os.path.join(outdir, key + ".html"), "w", encoding="utf-8") as f:
            f.write(dom)
    if os.path.exists(tmp):
        os.remove(tmp)
    return data


def main():
    ap = argparse.ArgumentParser(description="输出回归护栏：证明改完之后显示没变")
    ap.add_argument("mode", choices=["baseline", "check"])
    ap.add_argument("--only", help="只跑这几个变体，逗号分隔，如 ue,cd")
    ap.add_argument("--dom-only", action="store_true", help="跳过 PDF（快很多）")
    ap.add_argument("--chrome", default=CHROME_DEFAULT)
    args = ap.parse_args()

    if not os.path.exists(args.chrome):
        sys.exit("找不到 Chrome：%s\n用 --chrome 指定路径。" % args.chrome)
    if not server_up():
        sys.exit("本地服务器没起。先在另一个终端跑：node tools/serve.js")

    have_fitz = True
    try:
        import fitz  # noqa: F401
    except ImportError:
        have_fitz = False
        if not args.dom_only:
            print("! 没装 pymupdf，PDF 那一层跳过（pip install pymupdf 可开启）。DOM 仍然会比。\n")

    only = set(args.only.split(",")) if args.only else None
    print("采集中（%s）…" % ("仅 DOM" if args.dom_only or not have_fitz else "DOM + PDF"))
    outdir = os.path.join(SNAP, "base" if args.mode == "baseline" else "now")
    data = collect(args.chrome, only, args.dom_only, have_fitz, outdir)

    path = os.path.join(SNAP, "baseline.json")
    if args.mode == "baseline":
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=1)
        print("\n基线已存：%s（%d 组）" % (path, len(data)))
        return 0

    if not os.path.exists(path):
        sys.exit("还没有基线。先跑：python tools/snapshot.py baseline")
    with open(path, encoding="utf-8") as f:
        base = json.load(f)

    diffs = []
    for key, now in sorted(data.items()):
        old = base.get(key)
        if not old:
            diffs.append("%s：基线里没有这一组（新增的变体？）" % key)
            continue
        if old["dom"] != now["dom"]:
            diffs.append("%s：DOM 变了（长度 %d → %d）" % (key, old.get("domLen", 0), now["domLen"]))
        if "pdf" in now and "pdf" in old:
            if old["pdfPages"] != now["pdfPages"]:
                diffs.append("%s：PDF 页数 %d → %d" % (key, old["pdfPages"], now["pdfPages"]))
            elif old["pdf"] != now["pdf"]:
                bad = [str(i + 1) for i, (a, b) in enumerate(zip(old["pdfPerPage"], now["pdfPerPage"])) if a != b]
                diffs.append("%s：PDF 第 %s 页排版变了" % (key, "、".join(bad)))

    print()
    if not diffs:
        print("%d/%d 一致 —— 输出没有变化。" % (len(data), len(data)))
        return 0
    print("发现 %d 处差异：" % len(diffs))
    for d in diffs:
        print("  · " + d)
    print()
    print("DOM 差异逐字对比（基线 vs 本次）：")
    print("  diff tools/.snapshot/base/<组名>.html tools/.snapshot/now/<组名>.html")
    print("组名就是上面每条前面那个，例如 ds-zh、works-ue-de。")
    return 1


if __name__ == "__main__":
    sys.exit(main())
