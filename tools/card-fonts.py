#!/usr/bin/env python3
"""
card-fonts.py — 生成竖版名片用的字体子集（assets/fonts/card/）

为什么需要它
    竖版名片（?v=fl 的 ▭ Card）是画在 canvas 上再导出 PNG 的。画布上的字用什么字体，
    取决于访客那台设备 —— 中文在 Windows 上会掉到宋体细字、在 macOS 上是另一种宋体，
    同一张名片在不同设备上下载下来长得不一样。名片是要发出去、印出来的东西，必须每台设备
    一个样，所以衬线字体随站点一起下发。
    整套思源宋体 24 MB，没法下发；但名片上的中日文一共就二十来个字，
    只切这几个字出来，每个文件只有 1–3 KB。

它做什么
    1. 读 data/variants/*.js 里每个写了 card 的变体，收集名片上实际用到的字；
    2. 从开源的 Noto 可变字体里切出这些字，并固定到名片用的字重（变成普通静态字体，
       canvas 里不依赖浏览器的可变字体支持）；
    3. 写 assets/fonts/card/*.woff2 ＋ coverage.json（每个文件里有哪些字）。
       node tools/check.js 的第 13 项拿 coverage.json 对名片文案：文案里出现了子集里
       没有的字就报错 —— 否则那个字会悄悄掉回系统字体，和旁边的字粗细对不上。

什么时候要重跑
    改了变体 card 里的中文 / 日文（name / title / tagline / qrLabel）之后。
    只改拉丁文字（英语、德语）不用重跑：拉丁字符是整套下发的。

    python tools/card-fonts.py            # 生成
    python tools/card-fonts.py --check    # 只核对现有子集够不够用，不写文件

源字体
    全部是 SIL Open Font License 1.1 的开源字体（许可全文见 assets/fonts/card/OFL.txt）：
      Noto Serif SC / JP、Noto Sans SC / JP 的可变字体版（文件名 Noto*-VF.ttf）。
    Windows 11 24H2 起系统自带这四个文件，默认就去 C:\\Windows\\Fonts 找；
    别的系统上从 https://fonts.google.com/noto 取同名字体，用 --src 指给它：
      python tools/card-fonts.py --src ~/Downloads/noto
    也可以把源字体放进 tools/.fontsrc/（已被 .gitignore 忽略，源文件不进仓库）。

依赖
    Python ＋ fonttools ＋ brotli（woff2 压缩）；另需 node 用来读变体数据。
    只是开发期工具，站点本身仍然零依赖。
"""

import argparse
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "fonts", "card")
LANGS = ["zh", "ja", "en", "de"]

# 拉丁字符整套下发：英语 / 德语的名片文案可以随便改，不用重切字体。
# 基本拉丁 ＋ Latin-1（ä ö ü ß é …）＋ 几个常用标点。
LATIN = (
    [chr(c) for c in range(0x20, 0x7F)]
    + [chr(c) for c in range(0xA0, 0x100)]
    + list("\u2013\u2014\u2018\u2019\u201C\u201D\u2026\u20AC")
)

# 输出文件 → (源字体, 字重, 这个文件负责哪些字)
#   "latin"            整套拉丁字符
#   [("zh", "name")…]  这些语言 / 字段里出现的**非拉丁**字符
# 字重是和 scripts/export/card-portrait.js 里的 FONT_FILES 一一对应的 —— 改这里要同时改那边。
PLAN = [
    ("card-serif-latin-600", "NotoSerifSC-VF.ttf", 600, "latin"),   # 姓名
    ("card-serif-latin-500", "NotoSerifSC-VF.ttf", 500, "latin"),   # 身份行
    ("card-serif-sc-900",    "NotoSerifSC-VF.ttf", 900, [("zh", "name")]),
    ("card-serif-sc-600",    "NotoSerifSC-VF.ttf", 600, [("zh", "title")]),
    ("card-sans-sc-400",     "NotoSansSC-VF.ttf",  400, [("zh", "tagline"), ("zh", "qrLabel")]),
    ("card-serif-jp-900",    "NotoSerifJP-VF.ttf", 900, [("ja", "name")]),
    ("card-serif-jp-500",    "NotoSerifJP-VF.ttf", 500, [("ja", "title")]),
    ("card-sans-jp-400",     "NotoSansJP-VF.ttf",  400, [("ja", "tagline"), ("ja", "qrLabel")]),
]


def read_cards():
    """用 node 把各变体的 card 字段读出来 —— 数据文件是 JS，不在这里另写一个解析器。"""
    js = r"""
      const fs = require("fs"), path = require("path");
      const dir = path.join(process.argv[1], "data", "variants");
      const out = {};
      fs.readdirSync(dir).filter((f) => f.endsWith(".js")).forEach((f) => {
        global.window = {};
        require(path.join(dir, f));
        const v = global.window.RESUME_VARIANT;
        if (v && v.card) out[v.id || f] = v.card;
      });
      process.stdout.write(JSON.stringify(out));
    """
    res = subprocess.run(["node", "-e", js, ROOT], capture_output=True)
    if res.returncode != 0:
        sys.exit("读不到变体数据：\n" + res.stderr.decode("utf-8", "replace"))
    return json.loads(res.stdout.decode("utf-8"))


def is_latin(ch):
    return ch in LATIN_SET or ch == "\n"


def wanted_chars(cards, spec):
    if spec == "latin":
        return "".join(LATIN)
    chars = []
    for card in cards.values():
        for lang, field in spec:
            text = (card.get(field) or {}).get(lang, "") if isinstance(card.get(field), dict) else ""
            for ch in text:
                if not is_latin(ch) and ch not in chars:
                    chars.append(ch)
    return "".join(chars)


LATIN_SET = set(LATIN)


def find_source(name, dirs):
    for d in dirs:
        p = os.path.join(d, name)
        if os.path.exists(p):
            return p
    return None


def build(src, weight, chars, out_path):
    from fontTools import subset
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer

    font = TTFont(src)
    opts = subset.Options()
    # 横排名片用得到的排版特性：字偶距、连字、本地化字形、组合符号定位
    opts.layout_features = ["kern", "liga", "locl", "ccmp", "mark", "mkmk"]
    # 保留版权与许可字段（OFL 要求随字体一起分发）
    opts.name_IDs = [0, 1, 2, 3, 4, 5, 6, 7, 13, 14]
    opts.name_languages = [0x409]
    opts.notdef_outline = True
    opts.glyph_names = False
    opts.hinting = False
    opts.drop_tables += ["vhea", "vmtx", "BASE", "STAT"]  # 竖排度量，横排用不到
    sub = subset.Subsetter(opts)
    sub.populate(text=chars)
    sub.subset(font)
    # 先切字再定字重：对二十几个字做实例化是瞬间的事，对整套 3 万字要几十秒
    static = instancer.instantiateVariableFont(font, {"wght": weight}, inplace=False)
    missing = [ch for ch in chars if ord(ch) not in static.getBestCmap() and ch != " "]
    static.flavor = "woff2"
    # 不重写「修改时间」：否则每跑一次，文案没变字体文件的字节也会变，git 里全是假改动
    static.recalcTimestamp = False
    static.save(out_path)
    return missing


def main():
    ap = argparse.ArgumentParser(description="生成竖版名片用的字体子集")
    ap.add_argument("--src", action="append", default=[], help="源字体所在目录（可多次给）")
    ap.add_argument("--check", action="store_true", help="只核对现有子集是否覆盖名片文案，不写文件")
    args = ap.parse_args()

    cards = read_cards()
    if not cards:
        print("没有任何变体写了 card —— 不需要名片字体。")
        return 0

    cov_path = os.path.join(OUT, "coverage.json")
    if args.check:
        if not os.path.exists(cov_path):
            sys.exit("还没有 coverage.json —— 先跑一次不带 --check 的。")
        with open(cov_path, encoding="utf-8") as f:
            have = json.load(f)["fonts"]
        bad = []
        for key, _src, _w, spec in PLAN:
            need = wanted_chars(cards, spec)
            got = set(have.get(key, {}).get("chars", ""))
            lack = [ch for ch in need if ch not in got]
            if lack:
                bad.append("%s 缺：%s" % (key, "".join(lack)))
        if bad:
            print("子集不够用，需要重跑 python tools/card-fonts.py：")
            for b in bad:
                print("  · " + b)
            return 1
        print("名片字体子集覆盖全部文案。")
        return 0

    dirs = [os.path.expanduser(d) for d in args.src] + [
        os.path.join(ROOT, "tools", ".fontsrc"),
        os.environ.get("CARD_FONT_SRC", ""),
        r"C:\Windows\Fonts",
        os.path.expanduser("~/Library/Fonts"),
        "/Library/Fonts",
        "/usr/share/fonts",
    ]
    dirs = [d for d in dirs if d and os.path.isdir(d)]

    os.makedirs(OUT, exist_ok=True)
    manifest = {}
    wrote = set()
    for key, src_name, weight, spec in PLAN:
        chars = wanted_chars(cards, spec)
        out_path = os.path.join(OUT, key + ".woff2")
        if not chars:
            # 这一栏在当前文案里没有非拉丁字符（比如日文版姓名用的是拉丁写法）→ 不生成空字体
            if os.path.exists(out_path):
                os.remove(out_path)
            continue
        src = find_source(src_name, dirs)
        if not src:
            sys.exit("找不到源字体 %s。\n已找过：%s\n用 --src 指定它所在的目录（见本文件开头的说明）。"
                     % (src_name, "、".join(dirs) or "（无）"))
        missing = build(src, weight, chars, out_path)
        if missing:
            sys.exit("%s 里没有这些字：%s —— 换一个源字体，或改文案。" % (src_name, "".join(missing)))
        manifest[key] = {"source": src_name, "weight": weight, "chars": chars}
        wrote.add(key + ".woff2")
        print("  %-24s %6d B  %s" % (key + ".woff2", os.path.getsize(out_path),
              "拉丁整套 %d 字" % len(chars) if spec == "latin" else chars))

    # 清掉 PLAN 里已经没有的旧文件，免得仓库里留着没人引用的字体
    for f in os.listdir(OUT):
        if f.endswith(".woff2") and f not in wrote:
            os.remove(os.path.join(OUT, f))
            print("  已删除不再需要的 " + f)

    # fields：名片上「哪种语言的哪一栏」由哪个子集负责。tools/check.js 靠它核对文案，
    # 不必在那边再抄一份上面的 PLAN。latin：整套下发、不需要逐字核对的字符。
    fields = {}
    for key, _src, _w, spec in PLAN:
        if spec != "latin":
            for lang, field in spec:
                fields["%s.%s" % (lang, field)] = key
    with open(cov_path, "w", encoding="utf-8", newline="\n") as f:
        json.dump({"note": "由 tools/card-fonts.py 生成，别手改。每个字体文件里有哪些字。",
                   "latin": "".join(LATIN), "fields": fields,
                   "fonts": manifest}, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("\n已写入 %s（%d 个字体）" % (os.path.relpath(OUT, ROOT), len(manifest)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
