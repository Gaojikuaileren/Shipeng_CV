/* ============================================================
   export/card-portrait.js — 竖版名片（55 × 85 mm）

   变体写了 card 字段才会用到（目前只有 ?v=fl）；没写的变体仍是 card.js 里那张横版，
   这个文件对它们来说不存在 —— 字体也是点开名片时才去取，别的页面一个字节都不多下载。

   预览与下载是**同一个绘制函数**（draw）画出来的，只是分辨率不同：
   弹窗里看到什么，下载到的 PNG 就是什么。原来那张横版是「预览用 HTML、下载用 canvas」
   两份排版，两边的字号与换行本来就对不齐；这里不再走那条路。

   版式（下面 L / NAME / TEXT 三张表）是照着四语样稿量出来的，单位一律是**毫米**，
   画的时候再乘以「每毫米多少像素」。想调位置改这三张表，不用碰绘制代码。

   字体：
     · 衬线（姓名与身份行）随站点下发 —— assets/fonts/card/ 里的子集，见 tools/card-fonts.py。
       不能指望访客设备上的字体：中文在 Windows 上会掉到细宋体，同一张名片每台设备长得不一样。
     · 无衬线（方向行、二维码说明、联系方式）拉丁用全站那套 Hanken Grotesk，
       中日文用同目录下的 Noto Sans 子集。
     · 任何一个字体没取到都不拦着出图：照常画，只是那几个字掉回系统字体。
   ============================================================ */
(function () {
  "use strict";

  const W = 55, H = 85;            // 成品尺寸（mm）—— 与横版同一张纸，转了 90°
  const PREVIEW_PPMM = 16;         // 预览画布 880 × 1360，CSS 再缩到显示尺寸（高分屏上也够锐）
  const EXPORT_DPI = 600;          // 下载 1299 × 2008：印刷够用，发消息也不大
  const INK = "#111111", PAPER = "#ffffff";

  /* —— 版式：照样稿量的，单位 mm —————————————————————————————
     上半张（姓名 → 身份行 → 短横线 → 方向行）从上往下排，每一段的位置由上一段推出来；
     下半张（二维码 → 说明 → 两行联系方式）钉死在固定位置。
     这样姓名换成别的长度，上半张自己收放，下半张不动。 */
  const L = {
    left: 5.3,               // 左边距；右边距相同 → 文字栏宽 44.4
    nameOutdent: 0.3,        // 大字的墨迹比小字往左探出一点，视觉上才齐（样稿就是这么排的）
    ruleLen: 5.35,
    ruleWeight: 0.18,
    qrTop: 46.9,
    qrSize: 18,
    /* 二维码四周要留 ≥ 4 个模块的静区，否则掉扫描率。这个码 33 × 33 模块、18 mm 见方，
       4 个模块 = 2.2 mm。样稿里说明文字离码只有 1.5 mm，这里往下让了约 1 mm。 */
    qrQuiet: 2.2,
    labelBase: 68.6,
    rowBase: [75.3, 80.2],   // 两行联系方式的基线
    rowTextX: 12.5,
    rowSize: 2.32,           // 联系方式的字号（约 6.6 pt）
    iconStroke: 0.22,
  };

  /* 姓名分两种排法，按**内容**而不是按语言选：日文版用的也是拉丁写法。
       size   设计字号；任何一行超过 maxW 就整体缩小，绝不顶出右边距
       top    拉丁＝大写字母顶边，汉字＝第一行墨迹顶边
       lead   行距。拉丁按大写字母高度的倍数给 —— 行距很紧，上一行的 p / g 正好落在下一行
              小写字母的上方，这是为「Shipeng / Ouyang」排的；换成别的名字若上下打架，把它调大。
              汉字按字号的倍数给。
       gap    姓名最后一行基线 → 身份行基线 */
  const NAME = {
    latin: { weight: 600, size: 12.4,  maxW: 42,   lead: 1.16,  track: -0.012, top: 8.4, gap: 9.0 },
    cjk:   { weight: 900, size: 12.65, maxW: 44.4, lead: 1.012, track: 0,      top: 6.5, gap: 7.8 },
  };

  /* 姓名以下的小字，按语言选。三种文字的字面大小差得多，字号各给各的；
     每一行都会自动缩到栏宽以内，改长了文案也不会顶出右边距。
       title    身份行（衬线）。日文字距是负的：假名的字身比字面宽，不收一点 16 个字排不进一行；
                也不能再紧 —— 长音「ー」的字面几乎占满字身，再收就和邻字粘在一起。
       rule     身份行基线 → 短横线
       tagline  方向行（无衬线、疏排）。gap＝短横线 → 基线；dot＝分隔圆点离基线多高（× 字号）：
                拉丁对小写字母的中线，中日文对字身的中线。
       label    二维码下方的说明 */
  const TEXT = {
    latin: { title: { weight: 500, size: 3.85, track: 0 },     rule: 3.35,
             tagline: { size: 2.32, track: 0.1,  gap: 4.4, dot: 0.27 }, label: { size: 2.32, track: 0 } },
    zh:    { title: { weight: 600, size: 4.65, track: 0.04 },  rule: 3.3,
             tagline: { size: 2.45, track: 0.12, gap: 4.8, dot: 0.36 }, label: { size: 2.25, track: 0.04 } },
    ja:    { title: { weight: 500, size: 3.3,  track: -0.08 }, rule: 3.35,
             tagline: { size: 2.32, track: 0,    gap: 4.4, dot: 0.36 }, label: { size: 2.2,  track: 0 } },
  };
  /* 方向行的分隔点自己画（实心圆点），不用字体里的间隔号：那个字符在各家字体里大小、
     粗细、两侧留白都不一样，中日文字体里还是全角的 —— 四张名片摆在一起对不齐。
     d＝直径，side＝圆点到两侧文字的距离，都按字号的倍数给。 */
  const DOT = { d: 0.17, side: 0.74 };
  const SEP = /\s*[·・•]\s*/;

  /* —— 字体 ————————————————————————————————————————————————
     [家族名, 字重, 文件名, 哪种语言才需要（null = 都要）]
     文件由 tools/card-fonts.py 生成；这张表与那边的 PLAN 一一对应，
     node tools/check.js 第 13 项会核对「表里写的文件都在、目录里的文件都被引用」。 */
  const FONT_DIR = "assets/fonts/card/";
  const FACES = [
    ["CVCard Serif",    500, "card-serif-latin-500", null],
    ["CVCard Serif",    600, "card-serif-latin-600", null],
    ["CVCard Serif SC", 600, "card-serif-sc-600",    "zh"],
    ["CVCard Serif SC", 900, "card-serif-sc-900",    "zh"],
    ["CVCard Sans SC",  400, "card-sans-sc-400",     "zh"],
    ["CVCard Serif JP", 500, "card-serif-jp-500",    "ja"],
    ["CVCard Sans JP",  400, "card-sans-jp-400",     "ja"],
  ];
  const loading = {}; // 文件名 → Promise：反复点开名片不重复取

  function loadFace(family, weight, file) {
    if (loading[file]) return loading[file];
    if (typeof FontFace === "undefined" || !document.fonts) return (loading[file] = Promise.resolve());
    const face = new FontFace(family, 'url("' + FONT_DIR + file + '.woff2") format("woff2")',
      { weight: String(weight), style: "normal" });
    loading[file] = face.load().then(
      (f) => { document.fonts.add(f); },
      (e) => { console.warn("[card] 字体没取到，改用系统字体：" + file, e); });
    return loading[file];
  }

  /* 名片上用到的字体都到位之后再画。最多等 4 秒：网络再差也要把名片画出来。 */
  function ensureFonts(lang, sample) {
    const jobs = FACES.filter((f) => !f[3] || f[3] === lang).map((f) => loadFace(f[0], f[1], f[2]));
    // Hanken Grotesk 是 fonts.css 里按 unicode-range 分片声明的，要按实际文字触发加载
    if (document.fonts && document.fonts.load)
      jobs.push(document.fonts.load('400 20px "Hanken Grotesk"', sample).catch(() => {}));
    return Promise.race([
      Promise.all(jobs),
      new Promise((resolve) => setTimeout(resolve, 4000)),
    ]);
  }

  function stacks(lang) {
    if (lang === "zh") return {
      key: "zh",
      serif: '"CVCard Serif","CVCard Serif SC","Noto Serif SC","Source Han Serif SC","Songti SC","SimSun",serif',
      sans: '"Hanken Grotesk","CVCard Sans SC","PingFang SC","Noto Sans SC","Microsoft YaHei",sans-serif',
    };
    if (lang === "ja") return {
      key: "ja",
      serif: '"CVCard Serif","CVCard Serif JP","Noto Serif JP","Hiragino Mincho ProN","Yu Mincho",serif',
      sans: '"Hanken Grotesk","CVCard Sans JP","Hiragino Sans","Noto Sans JP","Yu Gothic UI",sans-serif',
    };
    return {
      key: "latin",
      serif: '"CVCard Serif",Georgia,"Times New Roman",serif',
      sans: '"Hanken Grotesk",-apple-system,"Segoe UI",Arial,sans-serif',
    };
  }

  /* —— 小工具 ————————————————————————————————————————————— */
  const curLang = () => (window.I18n && window.I18n.current) || "en";
  const tt = (f) => window.I18n.t(f);
  const isCJK = (s) => /[⺀-鿿豈-﫿＀-￯]/.test(s);
  const bare = (u) => String(u).replace(/^https?:\/\//, "").replace(/\/$/, "");

  /* 字距自己排，不用 canvas 的 letterSpacing —— Safari 至今不认那个属性，
     同一张名片在 iPhone 上下载会比别处窄一截。
     位置用「到这个字为止的整段宽度 − 这个字自己的宽度」算，字偶距（AV、To…）照样生效。 */
  function trackedWidth(ctx, text, tr) {
    const w = ctx.measureText(text).width;
    return tr ? w + tr * (Array.from(text).length - 1) : w;
  }
  function fillTracked(ctx, text, x, y, tr) {
    if (!tr) { ctx.fillText(text, x, y); return; }
    const cs = Array.from(text);
    let prefix = "";
    for (let i = 0; i < cs.length; i++) {
      prefix += cs[i];
      const at = ctx.measureText(prefix).width - ctx.measureText(cs[i]).width;
      ctx.fillText(cs[i], x + at + i * tr, y);
    }
  }

  /* 名片上的各段文字（按当前语言）。预览、下载、可访问名都从这里取，只有这一处。 */
  function content(data) {
    const c = data.card;
    const rows = (c.contacts || []).map((id) => (data.contact || []).find((x) => x.id === id))
      .filter(Boolean).slice(0, L.rowBase.length)
      .map((x) => ({ kind: x.type === "email" ? "mail" : "web", text: bare(x.value) }));
    return {
      name: String(tt(c.name) || tt(data.profile.name)).split("\n"),
      title: tt(c.title),
      tagline: String(tt(c.tagline)).split(SEP).filter(Boolean),
      qrUrl: c.qrUrl || location.href,
      qrLabel: tt(c.qrLabel),
      rows: rows,
    };
  }

  /* —— 绘制 ———————————————————————————————————————————————
     k = 每毫米多少像素。所有尺寸都是「毫米 × k」，所以预览与下载只差这一个数。 */
  function draw(ctx, k, data, lang) {
    const c = content(data);
    const st = stacks(lang);
    const P = TEXT[st.key];
    const N = c.name.some(isCJK) ? NAME.cjk : NAME.latin;
    const colW = (W - 2 * L.left) * k;
    const x0 = L.left * k;
    const font = (weight, mm, stack) => weight + " " + (mm * k) + "px " + stack;
    // 一行字在给定字号下有多宽（px）；字距按 em 给，跟着字号一起缩放
    const widthOf = (text, weight, mm, track, stack) => {
      ctx.font = font(weight, mm, stack);
      return trackedWidth(ctx, text, track * mm * k);
    };
    // 把一行字缩到 maxPx 以内，返回最终字号（mm）
    const fit = (text, weight, mm, track, stack, maxPx) => {
      const w = widthOf(text, weight, mm, track, stack);
      return w > maxPx ? mm * maxPx / w : mm;
    };
    // 方向行的总宽：各段文字 ＋ 段间的「留白 · 圆点 · 留白」
    const taglineWidth = (mm) => c.tagline.reduce((w, part) => w + widthOf(part, 400, mm, P.tagline.track, st.sans), 0) +
      (c.tagline.length - 1) * (2 * DOT.side + DOT.d) * mm * k;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = INK;
    ctx.strokeStyle = INK;
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";

    /* 上半张的位置（mm）。s 是整组的缩放：正常是 1；姓名行数多、把方向行挤进
       二维码的静区时，整组等比缩小到放得下为止。 */
    const layTop = (s) => {
      let size = N.size * s; // 最宽的一行决定字号
      c.name.forEach((ln) => { size = Math.min(size, fit(ln, N.weight, N.size * s, N.track, st.serif, N.maxW * k)); });
      ctx.font = font(N.weight, size, st.serif);
      const cjk = N === NAME.cjk;
      const asc = ctx.measureText(cjk ? c.name[0] : "H").actualBoundingBoxAscent / k;
      const step = cjk ? N.lead * size : N.lead * asc;
      const base0 = N.top + asc;
      const titleBase = base0 + step * (c.name.length - 1) + N.gap * s;
      const ruleY = titleBase + P.rule * s;
      return { size: size, base0: base0, step: step, titleBase: titleBase, ruleY: ruleY,
               taglineBase: ruleY + P.tagline.gap * s };
    };
    let scale = 1, top = layTop(1);
    for (let i = 0; i < 14 && top.taglineBase + P.tagline.size * 0.3 > L.qrTop - L.qrQuiet; i++)
      top = layTop(scale *= 0.95);

    // 姓名
    ctx.font = font(N.weight, top.size, st.serif);
    c.name.forEach((ln, i) => {
      // 大字按**墨迹**左对齐：字身左侧的空白在这个字号下有半毫米，不扣掉就和下面的小字对不齐。
      // actualBoundingBoxLeft＝墨迹从起笔点往左伸出多少（字身留白时为负）
      const inkLeft = ctx.measureText(ln).actualBoundingBoxLeft;
      fillTracked(ctx, ln, x0 - L.nameOutdent * k + inkLeft, (top.base0 + top.step * i) * k,
        N.track * top.size * k);
    });

    // 身份行
    const tSize = fit(c.title, P.title.weight, P.title.size * scale, P.title.track, st.serif, colW);
    ctx.font = font(P.title.weight, tSize, st.serif);
    fillTracked(ctx, c.title, x0, top.titleBase * k, P.title.track * tSize * k);

    // 短横线
    ctx.lineWidth = Math.max(1, L.ruleWeight * k);
    ctx.lineCap = "butt";
    ctx.beginPath();
    ctx.moveTo(x0, top.ruleY * k);
    ctx.lineTo(x0 + L.ruleLen * k, top.ruleY * k);
    ctx.stroke();

    // 方向行：文字一段一段画，段与段之间画圆点
    let gSize = P.tagline.size * scale;
    const gw = taglineWidth(gSize);
    if (gw > colW) gSize *= colW / gw;
    const em = gSize * k;
    let gx = x0;
    c.tagline.forEach((part, i) => {
      if (i) {
        gx += DOT.side * em;
        ctx.beginPath();
        ctx.arc(gx + DOT.d * em / 2, top.taglineBase * k - P.tagline.dot * em, DOT.d * em / 2, 0, Math.PI * 2);
        ctx.fill();
        gx += (DOT.d + DOT.side) * em;
      }
      ctx.font = font(400, gSize, st.sans);
      fillTracked(ctx, part, gx, top.taglineBase * k, P.tagline.track * em);
      gx += trackedWidth(ctx, part, P.tagline.track * em);
    });

    /* 下半张：位置固定。 */
    drawQr(ctx, c.qrUrl, x0, L.qrTop * k, L.qrSize * k);

    const lSize = fit(c.qrLabel, 400, P.label.size, P.label.track, st.sans, colW);
    ctx.font = font(400, lSize, st.sans);
    fillTracked(ctx, c.qrLabel, x0, L.labelBase * k, P.label.track * lSize * k);

    c.rows.forEach((row, i) => {
      const base = L.rowBase[i] * k;
      const cx = x0 + 1.83 * k, cy = base - 0.75 * k; // 图标中心：与文字的小写字母中线对齐
      ctx.lineWidth = Math.max(1, L.iconStroke * k);
      if (row.kind === "mail") iconMail(ctx, cx, cy, k); else iconGlobe(ctx, cx, cy, k);
      const rSize = fit(row.text, 400, L.rowSize, 0, st.sans, (W - L.left - L.rowTextX) * k);
      ctx.font = font(400, rSize, st.sans);
      ctx.fillText(row.text, L.rowTextX * k, base);
    });
    ctx.restore();
  }

  /* 二维码直接画方块，不经过图片：没有异步解码这一步，也不会被缩放插值糊掉。
     每一格的边界单独取整 —— 整个码的尺寸在任何分辨率下都一样，格子之间也不会露白缝。 */
  function drawQr(ctx, url, x, y, size) {
    if (typeof qrcode === "undefined") return;
    let q;
    try { q = qrcode(0, "M"); q.addData(url); q.make(); }
    catch (e) { console.warn("[card] 二维码生成失败", e); return; }
    const n = q.getModuleCount();
    const edge = (i) => Math.round(i * size / n);
    ctx.beginPath();
    for (let r = 0; r < n; r++)
      for (let col = 0; col < n; col++)
        if (q.isDark(r, col))
          ctx.rect(Math.round(x) + edge(col), Math.round(y) + edge(r), edge(col + 1) - edge(col), edge(r + 1) - edge(r));
    ctx.fill();
  }

  function iconMail(ctx, cx, cy, k) {
    const w = 3.65 * k, h = 2.55 * k, r = 0.18 * k;
    const l = cx - w / 2, t = cy - h / 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(l + r, t);
    ctx.arcTo(l + w, t, l + w, t + h, r);
    ctx.arcTo(l + w, t + h, l, t + h, r);
    ctx.arcTo(l, t + h, l, t, r);
    ctx.arcTo(l, t, l + w, t, r);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath(); // 信封口
    ctx.moveTo(l + 0.12 * k, t + 0.14 * k);
    ctx.lineTo(cx, t + h * 0.6);
    ctx.lineTo(l + w - 0.12 * k, t + 0.14 * k);
    ctx.stroke();
  }

  function iconGlobe(ctx, cx, cy, k) {
    const R = 1.83 * k;
    ctx.lineJoin = "round";
    ctx.lineCap = "butt";
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.46, R, 0, 0, Math.PI * 2); ctx.stroke(); // 经线
    ctx.beginPath();
    ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);   // 中轴
    ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);   // 赤道
    [-0.5, 0.5].forEach((f) => {                      // 两条纬线
      const half = Math.sqrt(1 - f * f) * R;
      ctx.moveTo(cx - half, cy + f * R); ctx.lineTo(cx + half, cy + f * R);
    });
    ctx.stroke();
  }

  /* —— 预览 ——————————————————————————————————————————————— */
  // 触发 Hanken Grotesk 加载用的样本：名片上所有走无衬线的字
  const sampleText = (c) => c.tagline.concat([c.qrLabel], c.rows.map((r) => r.text)).join(" ");

  function preview(host, data) {
    const lang = curLang();
    const c = content(data);
    host.textContent = "";
    const cv = document.createElement("canvas");
    cv.className = "vcard";
    cv.width = Math.round(W * PREVIEW_PPMM);
    cv.height = Math.round(H * PREVIEW_PPMM);
    // 画布对屏幕阅读器是一块空白 → 给一个可访问名。只放姓名与身份，
    // 不放邮箱：那是 protected 字段，明文不进 DOM（画在画布上的像素不算）
    cv.setAttribute("role", "img");
    cv.setAttribute("aria-label", c.name.join(" ") + " — " + c.title);
    const ctx = cv.getContext("2d");
    ctx.fillStyle = PAPER; // 字体到位之前先是一张白卡：尺寸已经占住，不会画完再跳一下
    ctx.fillRect(0, 0, cv.width, cv.height);
    host.appendChild(cv);
    ensureFonts(lang, sampleText(c)).then(() => {
      if (cv.isConnected) draw(ctx, cv.width / W, data, lang);
    });
  }

  /* —— 下载 PNG ————————————————————————————————————————————— */
  function download(data) {
    const lang = curLang();
    return ensureFonts(lang, sampleText(content(data))).then(() => {
      const cv = document.createElement("canvas");
      cv.width = Math.round(W * EXPORT_DPI / 25.4);
      cv.height = Math.round(H * EXPORT_DPI / 25.4);
      draw(cv.getContext("2d"), cv.width / W, data, lang);
      return new Promise((resolve) => cv.toBlob(resolve, "image/png"));
    }).then((blob) => (blob ? withDpi(blob, EXPORT_DPI) : null)).then((blob) => {
      if (!blob) { window.toast && window.toast("PNG ✕"); return; }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "shipeng-card-" + lang + ".png"; // 四语各一张，文件名带语言才不会互相覆盖
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      window.toast && window.toast("名片已下载 / Card saved");
    });
  }

  /* 把物理分辨率写进 PNG（pHYs 块）。canvas 导出的 PNG 不带这个信息，排版软件会按 72 dpi
     打开 —— 一张 55 mm 的名片变成 46 cm 宽。写上之后拖进 Word / InDesign 就是原大。
     失败了就原样返回：没有 pHYs 的 PNG 仍然是一张完整可用的图。 */
  function withDpi(blob, dpi) {
    if (!blob.arrayBuffer) return Promise.resolve(blob);
    return blob.arrayBuffer().then((buf) => {
      const src = new Uint8Array(buf);
      const IHDR_END = 33; // 8 字节签名 ＋ IHDR 块（4 长度 ＋ 4 类型 ＋ 13 数据 ＋ 4 校验）
      const sig = [137, 80, 78, 71, 13, 10, 26, 10];
      if (src.length < IHDR_END || sig.some((b, i) => src[i] !== b)) return blob;
      for (let i = IHDR_END; i + 8 < src.length;) { // 已经带 pHYs 就不再加第二个
        const len = ((src[i] << 24) | (src[i + 1] << 16) | (src[i + 2] << 8) | src[i + 3]) >>> 0;
        const type = String.fromCharCode(src[i + 4], src[i + 5], src[i + 6], src[i + 7]);
        if (type === "pHYs") return blob;
        if (type === "IDAT") break;
        i += 12 + len;
      }
      const ppm = Math.round(dpi / 0.0254); // 每米像素数
      const chunk = new Uint8Array(21);
      const dv = new DataView(chunk.buffer);
      dv.setUint32(0, 9);                                  // 数据长度
      chunk.set([112, 72, 89, 115], 4);                    // "pHYs"
      dv.setUint32(8, ppm); dv.setUint32(12, ppm); chunk[16] = 1; // 横、纵、单位＝米
      dv.setUint32(17, crc32(chunk.subarray(4, 17)));
      const out = new Uint8Array(src.length + 21);
      out.set(src.subarray(0, IHDR_END), 0);
      out.set(chunk, IHDR_END);
      out.set(src.subarray(IHDR_END), IHDR_END + 21);
      return new Blob([out], { type: "image/png" });
    }).catch(() => blob);
  }
  function crc32(bytes) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) {
      c ^= bytes[i];
      for (let b = 0; b < 8; b++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  window.CardPortrait = {
    preview: preview,
    download: download,
    // 分享用的地址与二维码是同一个：名片指向哪儿，分享就指向哪儿
    url: (data) => (data.card && data.card.qrUrl) || location.href,
  };
})();
