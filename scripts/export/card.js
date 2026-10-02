/* ============================================================
   export/card.js — 名片（与 PDF 完整简历彻底不同）
   点 Card → 弹出名片卡片窗口，右上角 分享 / 下载 PNG。
   名片 = 极简（名字＋头衔＋核心联系＋二维码）。PNG 用 canvas 离线绘制，无依赖。

   两种名片，由变体数据决定：
     · 变体写了 card.images → **图片名片**：四语各一张画好的图，预览显示的、下载到的、
       分享出去的都是图片本身，这里一个像素都不重画。目前只有 ?v=fl ——
       那张名片上的姓名是本人手绘的字，没有字库，用任何字体都排不出来。
     · 没写 → 本文件里这张现排的横版（HTML 预览 ＋ canvas 画 PNG），与加图片名片之前一模一样。
   弹窗、关闭、键盘这些外壳两种共用。
   ============================================================ */
(function () {
  "use strict";
  const t = (f) => window.I18n.t(f);
  let bound = false;
  let lastFocus = null;

  /* 图片名片：变体给了 card.images（{ zh, ja, en, de } → 图片地址）就走这条路，取当前语言那一张。
     返回 null ＝ 这个变体没有图片名片，用下面现排的横版。 */
  function imageCard(data) {
    const c = data && data.card;
    const src = c && c.images ? t(c.images) : "";
    if (!src) return null;
    return { src: src, file: src.split("/").pop(), alt: (c.alt && t(c.alt)) || cardName(data), size: c.size || null };
  }

  window.Exporter = window.Exporter || {};
  window.Exporter.card = function (data) {
    const modal = document.getElementById("card-modal");
    if (!modal) return;
    modal._data = data;
    const ic = imageCard(data);
    if (ic) buildImagePreview(ic); else buildPreview(data);
    lastFocus = document.activeElement; // 关闭后把焦点还回去
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("open"));
    bindOnce();
    // 打开后焦点必须进到弹窗里，否则键盘用户还停在背景上，Tab 一路走的是被遮住的内容
    const first = modal.querySelector("[data-share]") || modal.querySelector("[data-close]");
    if (first) first.focus();
  };

  // 名片放的联系：网站 / 邮箱 / Vimeo（最多 3 条）
  function pickContacts(data) {
    return data.contact.filter((c) => ["website", "email", "social"].includes(c.type)).slice(0, 3);
  }
  // 二维码指向：优先 Vimeo 作品集，否则当前简历 URL
  function cardUrl(data) {
    const v = data.contact.find((c) => /vimeo/i.test(c.label));
    return v ? v.value : location.href;
  }
  function el(tag, cls, txt) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  // 名片用简短名字：去掉括号注音（避免日语全名过长换行）
  function cardName(data) {
    return t(data.profile.name).replace(/[（(][^）)]*[)）]/g, "").trim();
  }

  function buildPreview(data) {
    const host = document.getElementById("card-preview");
    host.innerHTML = "";
    const card = el("div", "bcard");
    const main = el("div", "bcard-main");
    main.appendChild(el("div", "bcard-name", cardName(data)));
    main.appendChild(el("div", "bcard-title", t(data.profile.title)));
    card.appendChild(main);
    const foot = el("div", "bcard-foot");
    const lines = el("div", "bcard-lines");
    pickContacts(data).forEach((c) => lines.appendChild(el("div", "bcard-line", c.value.replace(/^https?:\/\//, ""))));
    foot.appendChild(lines);
    const qr = el("div", "bcard-qr");
    if (typeof qrcode !== "undefined") {
      const q = qrcode(0, "M"); q.addData(cardUrl(data)); q.make();
      qr.innerHTML = q.createSvgTag({ cellSize: 2, margin: 0 });
    }
    foot.appendChild(qr);
    card.appendChild(foot);
    host.appendChild(card);
  }

  const blobs = {}; // 图片地址 → 已取回的图片数据（分享 / 复制时要当场交出去，见 shareImage）
  function buildImagePreview(card) {
    const host = document.getElementById("card-preview");
    host.innerHTML = "";
    const img = el("img", "vcard");
    img.alt = card.alt;
    // 先把宽高写上：图片回来之前就按这个比例占位，弹窗不会先瘪后撑
    if (card.size) { img.width = card.size[0]; img.height = card.size[1]; }
    img.decoding = "async";
    img.src = card.src;
    host.appendChild(img);
    /* 顺手把图片数据取回来放着。分享与复制都要求「在点击的那一刻」就把数据交出去 ——
       点了之后才去取，等网络回来时浏览器已经不认这是用户手势了（Safari 会直接拒绝）。 */
    if (!blobs[card.src] && window.fetch)
      fetch(card.src).then((r) => (r.ok ? r.blob() : null))
        .then((b) => { if (b) blobs[card.src] = b; }).catch(() => {});
  }

  const canNativeShare = typeof navigator.share === "function";
  // 这台设备能不能把**图片文件**交给系统分享（手机基本都行，桌面看浏览器）
  function canShareFile() {
    try {
      return typeof navigator.canShare === "function" && typeof File === "function" &&
        navigator.canShare({ files: [new File([""], "card.png", { type: "image/png" })] });
    } catch (e) { return false; }
  }
  const canCopyImage = () => !!(navigator.clipboard && navigator.clipboard.write && window.ClipboardItem);

  function bindOnce() {
    if (bound) return;
    bound = true;
    const modal = document.getElementById("card-modal");
    modal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", close));
    // 动态设置 Share 按钮标签：它实际会做什么，就写什么。
    //   横版：系统分享链接（iOS/Mac）/ 复制链接（其余）
    //   图片名片：系统分享图片 / 复制图片 / 都不行就只剩保存
    const shareBtn = document.getElementById("btn-card-share");
    if (shareBtn) shareBtn.textContent = !imageCard(modal._data)
      ? (canNativeShare ? "⤴ Share" : "⎘ Copy Link")
      : (canShareFile() ? "⤴ Share" : canCopyImage() ? "⎘ Copy Image" : "↓ Save");
    modal.querySelector("[data-share]").addEventListener("click", () => {
      const ic = imageCard(modal._data);
      if (ic) shareImage(ic, modal._data); else share(modal._data);
    });
    modal.querySelector("[data-download]").addEventListener("click", () => {
      const ic = imageCard(modal._data);
      if (ic) downloadImage(ic); else downloadPNG(modal._data);
    });
    document.addEventListener("keydown", (e) => {
      const m = document.getElementById("card-modal");
      if (!m || m.hidden) return;           // 弹窗没开就别抢键盘
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      // 焦点圈住：aria-modal 只是告诉辅助技术「后面的别读」，它挡不住 Tab 键
      const f = [].slice.call(m.querySelectorAll("button, [href], input, [tabindex]:not([tabindex='-1'])"))
        .filter((el) => !el.hidden && el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  function close() {
    const m = document.getElementById("card-modal");
    m.classList.remove("open");
    setTimeout(() => (m.hidden = true), 200);
    if (lastFocus && lastFocus.focus) lastFocus.focus(); // 焦点还给点开它的那个按钮
    lastFocus = null;
  }

  /* —— 图片名片：分享与下载的都是图片本身 ————————————————————————
     分享按「能把图片交出去的最直接的办法」逐级退：
       1) 系统分享面板带上图片文件（手机上就是发给微信 / WhatsApp / 邮件的那个面板）；
       2) 把图片复制到剪贴板，对方窗口里粘贴即可；
       3) 都不行（或图片数据还没取回来）→ 保存到本地，至少图到手了。 */
  function shareImage(card, data) {
    const blob = blobs[card.src];
    const type = (blob && blob.type) || "image/png";
    // 两个 try：这些接口在不支持的环境里有的是返回被拒绝的 Promise，有的是当场抛异常
    //（非 https、被策略禁用、不认这个文件类型）。哪种都不能让按钮点了没反应 —— 落到下一级。
    if (blob && canShareFile()) {
      try {
        navigator.share({ files: [new File([blob], card.file, { type: type })], title: cardName(data) })
          .catch(() => {}); // 用户在面板里点了取消也会进这里，不算出错
        return;
      } catch (e) { /* 往下退 */ }
    }
    if (blob && canCopyImage()) {
      try {
        const item = {}; item[type] = blob;
        navigator.clipboard.write([new ClipboardItem(item)]).then(
          () => window.toast && window.toast("图片已复制 / Image copied"),
          () => downloadImage(card));
        return;
      } catch (e) { /* 往下退 */ }
    }
    downloadImage(card);
  }
  function downloadImage(card) {
    const a = document.createElement("a");
    a.href = card.src;       // 就是站内那个文件本身，不经过任何重绘或转码
    a.download = card.file;  // 文件名带语言（shipeng-card-de.png），四语各存各的
    a.click();
    window.toast && window.toast("名片已下载 / Card saved");
  }

  function share(data) {
    const url = cardUrl(data);
    const title = t(data.profile.name) + " — " + t(data.profile.title);
    if (navigator.share) navigator.share({ title, url }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => window.toast && window.toast("链接已复制 / Link copied"));
    else window.toast && window.toast(url);
  }

  // —— 下载 PNG：canvas 离线绘制（等字体就绪，避免字体未加载）——
  function downloadPNG(data) {
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => draw(data));
  }
  function draw(data) {
    const scale = 4, MM = 3.7795 * scale, px = (mm) => Math.round(mm * MM);
    const cw = px(85), ch = px(55);
    const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
    const ctx = cv.getContext("2d");
    const accent = (getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()) || "#2f5043";
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = accent; ctx.fillRect(0, 0, px(2.2), ch);
    const padX = px(8);
    ctx.textBaseline = "top";
    ctx.fillStyle = "#141414"; ctx.font = '700 ' + px(6.2) + 'px "Hanken Grotesk", sans-serif';
    ctx.fillText(cardName(data), padX, px(8));
    ctx.fillStyle = "#565656"; ctx.font = '500 ' + px(2.7) + 'px "Hanken Grotesk", sans-serif';
    wrap(ctx, t(data.profile.title), padX, px(16.5), cw - padX - px(8), px(3.6));
    ctx.fillStyle = "#141414"; ctx.font = '400 ' + px(2.7) + 'px "Hanken Grotesk", sans-serif';
    const cs = pickContacts(data);
    let cy = ch - px(7) - px(3.6) * cs.length;
    cs.forEach((c) => { ctx.fillText(c.value.replace(/^https?:\/\//, ""), padX, cy); cy += px(3.6); });
    // QR
    if (typeof qrcode !== "undefined") {
      const q = qrcode(0, "M"); q.addData(cardUrl(data)); q.make();
      const img = new Image();
      img.onload = () => { const s = px(17); ctx.drawImage(img, cw - s - px(8), ch - s - px(7), s, s); cv.toBlob(save); };
      img.onerror = () => cv.toBlob(save); // QR 解码失败也照常导出名片（仅无二维码）
      img.src = q.createDataURL(6, 0);
    } else cv.toBlob(save);
  }
  function wrap(ctx, text, x, y, maxW, lh) {
    const words = String(text).split(" "); let line = "", yy = y;
    words.forEach((w) => {
      const test = line + w + " ";
      if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line.trim(), x, yy); line = w + " "; yy += lh; }
      else line = test;
    });
    ctx.fillText(line.trim(), x, yy);
  }
  function save(blob) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "shipeng-card.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    window.toast && window.toast("名片已下载 / Card saved");
  }
})();
