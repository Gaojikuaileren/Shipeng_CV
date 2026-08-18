#!/usr/bin/env python3
"""
snapshot.py — 输出回归护栏：证明「改完之后显示没变」

为什么需要它
    这个仓库没有构建、没有测试，而排版是它唯一的产品。任何一次重构（合并渲染函数、
    把板块改成配置驱动、动 print.css）都可能悄悄挪动一个类名或一个分页点，
    而这种变化肉眼要逐份 PDF 翻才看得出来。这个脚本把「看一遍」变成「跑一条命令」。

两层快照
    DOM   5 变体 × 4 语，Chrome 渲染完之后 dump 出 #cv-root 的 outerHTML，归一化后取哈希。
          抓的是屏幕态的结构：类名、元素顺序、属性，任何一处不同都会被抓到。
    PDF   同样 20 组，headless 导出 A4 PDF，比较**页数**与**每页每个文本块的坐标**（四舍五入到 0.1pt）。
          不比字节：PDF 里带生成时间与随机 ID，同样的输入两次导出字节流也不相同。

用法
    先起本地服务器：  node tools/serve.js
    存基线：          python tools/snapshot.py baseline
    改完之后核对：    python tools/snapshot.py check
    只看某几个：      python tools/snapshot.py check --only ue,cd
    只跑 DOM（快 10 倍，改 JS/HTML 时够用）：  python tools/snapshot.py check --dom-only

读结果
    全部一致 → 退出码 0，打印「20/20 一致」。
    有差异   → 退出码 1，逐条列出哪个变体哪种语言、差在 DOM 还是 PDF、PDF 差在第几页。
    DOM 变了会同时把归一化后的两份 HTML 写进 tools/.snapshot/diff/，可以直接 diff 看。

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

CHROME_DEFAULT = r"C:\Program Files\Google\Chrome\Application\chrome.exe"


def url_for(v, lang):
    base = "http://127.0.0.1:%d" % PORT
    # mn 指向独立页面 odd/；index.html 上的 ?v=mn 会整页跳过去，直接抓目标地址更稳
    if v == "mn":
        return "%s/odd/?lang=%s" % (base, lang)
    return "%s/index.html?v=%s&lang=%s" % (base, v, lang)


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
    m = re.search(r'<main id="cv-root".*?</main>', html, re.S)
    if m:
        html = m.group(0)
    for pat, rep in VOLATILE:
        html = pat.sub(rep, html)
    html = re.sub(r">\s+<", "><", html)          # 标签之间的空白不算内容
    return html.strip()


def dump_dom(chrome, url):
    out = subprocess.run(
        [chrome, "--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run",
         "--virtual-time-budget=7000", "--dump-dom", url],
        capture_output=True, timeout=120,
    )
    return out.stdout.decode("utf-8", "replace")


# ── PDF ──────────────────────────────────────────────────────────────────────

def pdf_fingerprint(chrome, url, tmp):
    subprocess.run(
        [chrome, "--headless=new", "--disable-gpu", "--no-sandbox", "--no-first-run",
         "--virtual-time-budget=7000", "--no-pdf-header-footer", "--print-to-pdf=" + tmp, url],
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

def collect(chrome, only, dom_only, have_fitz):
    os.makedirs(SNAP, exist_ok=True)
    tmp = os.path.join(SNAP, "_tmp.pdf")
    data = {}
    combos = [(v, l) for v in VARIANTS for l in LANGS if not only or v in only]
    for i, (v, lang) in enumerate(combos, 1):
        key = "%s-%s" % (v, lang)
        url = url_for(v, lang)
        sys.stdout.write("  [%2d/%d] %-6s " % (i, len(combos), key))
        sys.stdout.flush()
        dom = normalize_dom(dump_dom(chrome, url))
        rec = {"dom": digest(dom), "domLen": len(dom)}
        if not dom_only and have_fitz:
            n, pages = pdf_fingerprint(chrome, url, tmp)
            rec["pdfPages"] = n
            rec["pdf"] = digest(pages)
            rec["pdfPerPage"] = [digest(p) for p in pages]
            sys.stdout.write("dom=%s  pdf=%s (%d页)\n" % (rec["dom"], rec["pdf"], n))
        else:
            sys.stdout.write("dom=%s\n" % rec["dom"])
        data[key] = rec
        with open(os.path.join(SNAP, "dom-%s.html" % key), "w", encoding="utf-8") as f:
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
    data = collect(args.chrome, only, args.dom_only, have_fitz)

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
    print("\nDOM 的差异可以直接看：tools/.snapshot/dom-<变体>-<语言>.html（本次采集的），")
    print("跟 git stash 前的那一份对比即可。")
    return 1


if __name__ == "__main__":
    sys.exit(main())
