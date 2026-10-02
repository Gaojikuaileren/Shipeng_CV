#!/usr/bin/env python3
"""
card-images.py — 把画好的名片稿做成站内用的名片图（assets/card/）

为什么需要它
    ?v=fl 的名片是**画好的图**，不是现排的：姓名是本人手绘的字，没有字库，任何字体都排不出来。
    所以站内的名片预览、下载、分享，用的都是图片本身。
    画稿上二维码的位置是一块写着「QR」的深色占位方块 —— 这个脚本做三件事：
      1. 从画稿里把卡片本体裁出来（去掉周围的衬底和角上的语言标签）；
      2. 把占位方块换成真的二维码（内容 = 变体的 card.qrUrl，用的是站内同一个二维码库、
         同一个纠错级，与 PDF 里那些二维码一致）；
      3. 四语裁成同样大小（变体的 card.size），存成 PNG，并写上物理尺寸（宽 55 mm）。
    除了二维码那一块，画稿上的像素一个都不动、也不缩放。

用法
    python tools/card-images.py --zh 稿/zh.webp --ja 稿/ja.webp --en 稿/en.webp --de 稿/de.webp
    只换某一种语言，就只给那一个参数。
    多个变体都有名片时用 --variant 指定内部 ID（现在只有 art-vr，不用写）。

画稿的要求
    · 浅色卡片放在比它深的衬底上（脚本靠亮度找卡片的四条边）；直接给一张不带衬底的卡片也行。
    · 二维码的位置是一块实心深色方块。找不到占位方块就报错停下，不会瞎贴。
    · 卡片大小要与变体里的 card.size 对得上（差几个像素会居中裁齐；差得多说明换了新尺寸的稿子，
      先把 card.size 改成新尺寸，四语要一致）。

二维码贴多大
    与占位方块等高、左上角对齐。33 × 33 个模块、约 248 px，每个模块 7–8 px，边界逐格取整，
    所以边缘是锐利的。注意画稿里说明文字离方块只有约 21 px（不到 3 个模块，规范要 4 个）——
    这是版式本身决定的，脚本不去挪画稿上的字；实测手机与两种解码库都能正常扫出。

依赖
    Python ＋ Pillow ＋ numpy；node（读变体数据、生成二维码矩阵）。
    装了 zxing-cpp 的话会把成品解码一遍核对内容。只是开发期工具，站点本身仍然零依赖。
"""

import argparse
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = ["zh", "ja", "en", "de"]
CARD_WIDTH_MM = 55.0  # 成品宽度，只用来往 PNG 里写物理分辨率

# 用 node 读变体的 card 字段，并用站内的二维码库把矩阵算出来 ——
# 数据文件与二维码库都是 JS，这里不另写解析器、也不引第二个二维码实现。
NODE_JS = r"""
const path = require("path"), fs = require("fs");
const root = process.argv[1];
const dir = path.join(root, "data", "variants");
const out = {};
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".js"))) {
  global.window = {};
  require(path.join(dir, f));
  const v = global.window.RESUME_VARIANT;
  if (v && v.card && v.card.images) out[v.id] = v.card;
}
const qrcode = require(path.join(root, "scripts", "lib", "qrcode.js"));
for (const id in out) {
  const q = qrcode(0, "M");
  q.addData(String(out[id].qrUrl || ""));
  q.make();
  const n = q.getModuleCount(), rows = [];
  for (let r = 0; r < n; r++) {
    let row = "";
    for (let c = 0; c < n; c++) row += q.isDark(r, c) ? "1" : "0";
    rows.push(row);
  }
  out[id].__qr = rows;
}
process.stdout.write(JSON.stringify(out));
"""


def read_cards():
    res = subprocess.run(["node", "-e", NODE_JS, ROOT], capture_output=True)
    if res.returncode != 0:
        sys.exit("读不到变体数据 / 生成不了二维码：\n" + res.stderr.decode("utf-8", "replace"))
    return json.loads(res.stdout.decode("utf-8"))


def find_card(a):
    """卡片在画稿里的范围 (x0, y0, x1, y1)，右下为开区间。没有衬底时就是整张图。"""
    import numpy as np
    mn = a.min(axis=2)
    h, w = mn.shape
    k = max(4, min(h, w) // 50)
    backdrop = np.median(np.concatenate([mn[:k, :k].ravel(), mn[:k, -k:].ravel(),
                                         mn[-k:, :k].ravel(), mn[-k:, -k:].ravel()]))
    paper = np.percentile(mn, 99)
    if paper - backdrop < 12:
        return 0, 0, w, h
    bright = mn > (backdrop + paper) / 2
    xs = np.where(bright.mean(axis=0) > 0.5)[0]
    ys = np.where(bright.mean(axis=1) > 0.5)[0]
    if not len(xs) or not len(ys):
        raise ValueError("找不到卡片：画稿里没有一块比衬底亮的矩形")
    return int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1


def longest_dark_run(row):
    """一行里最长的一段连续深色像素 → (长度, 起点)。"""
    import numpy as np
    d = np.diff(np.concatenate([[0], row.astype(np.int8), [0]]))
    starts, ends = np.where(d == 1)[0], np.where(d == -1)[0]
    if not len(starts):
        return 0, 0
    i = int(np.argmax(ends - starts))
    return int(ends[i] - starts[i]), int(starts[i])


def find_placeholder(card):
    """二维码占位方块在卡片里的范围 (x0, y0, x1, y1)。
    判据：连续深色像素超过卡片宽度 1/4 的那些行 —— 文字的笔画没有这么长的，只有那块方块有。"""
    import numpy as np
    dark = card.max(axis=2) < 80
    h, w = dark.shape
    runs = [longest_dark_run(dark[y]) for y in range(h)]
    hit = np.array([r[0] > w * 0.25 for r in runs])
    best, cur = None, None  # 最高的一段连续命中行 —— 方块里没被「QR」两个字打断的那部分
    for y in range(h + 1):
        if y < h and hit[y]:
            cur = [y, y] if cur is None else [cur[0], y]
        elif cur is not None:
            if best is None or cur[1] - cur[0] > best[1] - best[0]:
                best = cur
            cur = None
    if best is None:
        raise ValueError("找不到二维码占位方块（一块实心的深色方块）")
    x0 = int(np.median([runs[y][1] for y in range(best[0], best[1] + 1)]))
    x1 = x0 + int(np.median([runs[y][0] for y in range(best[0], best[1] + 1)]))
    # 方块中间写着白色的「QR」，那些行的深色被字打断、上面的判据认不出来。
    # 改看方块的左右两条边：只要这两条边还是深的，就还在方块里 → 从种子行向上下延伸。
    def in_block(y):
        return dark[y, x0 + 2:x0 + 10].all() and dark[y, x1 - 10:x1 - 2].all()
    y0, y1 = best[0], best[1] + 1
    while y0 > 0 and in_block(y0 - 1):
        y0 -= 1
    while y1 < h and in_block(y1):
        y1 += 1
    bw, bh = x1 - x0, y1 - y0
    fill = dark[y0:y1, x0:x1].mean()
    if not (0.85 < bw / bh < 1.18) or fill < 0.8 or bh < 60:
        raise ValueError("找到的深色块不像二维码占位方块（%d × %d，填充 %.0f%%）" % (bw, bh, fill * 100))
    return x0, y0, x1, y1


def build(src_path, card, qr_rows, out_path):
    import numpy as np
    from PIL import Image

    a = np.asarray(Image.open(src_path).convert("RGB")).astype(np.int16)
    cx0, cy0, cx1, cy1 = find_card(a)
    tw, th = card["size"]
    cw, ch = cx1 - cx0, cy1 - cy0
    if cw < tw or ch < th or cw - tw > 8 or ch - th > 8:
        raise ValueError("画稿里的卡片是 %d × %d，变体的 card.size 写的是 %d × %d。"
                         "换了新尺寸的稿子就把 card.size 改成新尺寸（四语要一致）。" % (cw, ch, tw, th))
    # 居中裁齐：各语言的稿子差一两个像素，裁掉的是纯纸色的边
    cx0 += (cw - tw) // 2
    cy0 += (ch - th) // 2
    img = a[cy0:cy0 + th, cx0:cx0 + tw].copy()

    qx0, qy0, qx1, qy1 = find_placeholder(img)
    ink = np.median(img[qy0 + 6:qy1 - 6, qx0 + 6:qx0 + 30].reshape(-1, 3), axis=0)

    # 先把占位方块盖回纸色，再画二维码。
    # 盖的范围比方块大一圈（PAD）：有损压缩会在深色块周围留下一圈比纸略暗的晕，
    # 只盖方块本身的话，新补的纸色比那圈晕亮一两级，放大看是一个淡淡的方框。
    # 也不能刷一个平色：纸面本身有极轻微的明暗过渡。所以用四条边外侧的纸色向内插值
    #（Coons 曲面）—— 补出来的这块在四条边上与周围的纸逐像素接得上。
    PAD, STRIP = 7, 3
    rx0, ry0, rx1, ry1 = qx0 - PAD, qy0 - PAD, qx1 + PAD, qy1 + PAD
    def smooth(edge):  # 沿边做一次滑动平均，免得纸面噪点被拉成一条条细纹
        k = 9
        pad = np.pad(edge, ((k // 2, k // 2), (0, 0)), mode="edge")
        return np.stack([np.convolve(pad[:, c], np.ones(k) / k, mode="valid") for c in range(3)], axis=1)
    left = smooth(img[ry0:ry1, rx0 - STRIP:rx0].mean(axis=1))
    right = smooth(img[ry0:ry1, rx1:rx1 + STRIP].mean(axis=1))
    top = smooth(img[ry0 - STRIP:ry0, rx0:rx1].mean(axis=0))
    bottom = smooth(img[ry1:ry1 + STRIP, rx0:rx1].mean(axis=0))
    rh, rw = ry1 - ry0, rx1 - rx0
    u = ((np.arange(rw) + 0.5) / rw)[None, :, None]
    v = ((np.arange(rh) + 0.5) / rh)[:, None, None]
    c00, c10 = (left[0] + top[0]) / 2, (right[0] + top[-1]) / 2
    c01, c11 = (left[-1] + bottom[0]) / 2, (right[-1] + bottom[-1]) / 2
    patch = ((1 - u) * left[:, None, :] + u * right[:, None, :] + (1 - v) * top[None, :, :] + v * bottom[None, :, :]
             - ((1 - u) * (1 - v) * c00 + u * (1 - v) * c10 + (1 - u) * v * c01 + u * v * c11))
    img[ry0:ry1, rx0:rx1] = np.clip(np.rint(patch), 0, 255)
    n = len(qr_rows)
    side = min(qx1 - qx0, qy1 - qy0)
    edge = [round(i * side / n) for i in range(n + 1)]
    for r in range(n):
        for c in range(n):
            if qr_rows[r][c] == "1":
                img[qy0 + edge[r]:qy0 + edge[r + 1], qx0 + edge[c]:qx0 + edge[c + 1]] = ink

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    dpi = tw / CARD_WIDTH_MM * 25.4
    Image.fromarray(img.astype(np.uint8), "RGB").save(out_path, optimize=True, dpi=(dpi, dpi))
    return {"card": (cx0, cy0, tw, th), "qr": (qx0, qy0, side), "module": side / n,
            "gap_below": None, "bytes": os.path.getsize(out_path)}


def decode(path):
    try:
        import zxingcpp
        from PIL import Image
    except ImportError:
        return None
    return [r.text for r in zxingcpp.read_barcodes(Image.open(path).convert("RGB"))]


def main():
    ap = argparse.ArgumentParser(description="把画好的名片稿做成站内用的名片图（裁出卡片、贴上真二维码）")
    for lang in LANGS:
        ap.add_argument("--" + lang, metavar="画稿", help="%s 版的画稿" % lang)
    ap.add_argument("--variant", help="变体的内部 ID（只有一个变体有名片时不用写）")
    args = ap.parse_args()

    cards = read_cards()
    if not cards:
        sys.exit("没有任何变体写了 card.images。")
    vid = args.variant or (list(cards)[0] if len(cards) == 1 else None)
    if vid not in cards:
        sys.exit("用 --variant 指定变体，可选：" + "、".join(cards))
    card = cards[vid]
    todo = [(lang, getattr(args, lang)) for lang in LANGS if getattr(args, lang)]
    if not todo:
        ap.error("至少给一种语言的画稿，例如 --de 稿/de.webp")

    failed = False
    for lang, src in todo:
        rel = card["images"][lang]
        out = os.path.join(ROOT, rel.replace("/", os.sep))
        try:
            info = build(src, card, card["__qr"], out)
        except (ValueError, OSError) as e:
            print("  %s  ✗ %s" % (lang, e))
            failed = True
            continue
        got = decode(out)
        ok = "" if got is None else ("  二维码 ✓" if got == [card["qrUrl"]] else "  二维码 ✗ 解出 %r" % got)
        if got is not None and got != [card["qrUrl"]]:
            failed = True
        print("  %s  %s  %d × %d  %d KB  二维码 %d px（每格 %.2f px）%s" % (
            lang, rel, card["size"][0], card["size"][1], info["bytes"] // 1024, info["qr"][2], info["module"], ok))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
