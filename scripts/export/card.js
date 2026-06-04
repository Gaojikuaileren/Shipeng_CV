/* ============================================================
   export/card.js — 名片（与 PDF 完整简历彻底不同）
   点 Card → 弹出名片卡片窗口，右上角 分享 / 下载 PNG。
   名片 = 极简（名字＋头衔＋核心联系＋二维码）。PNG 用 canvas 离线绘制，无依赖。
   ============================================================ */
(function () {
  "use strict";
  const t = (f) => window.I18n.t(f);
  let bound = false;

  window.Exporter = window.Exporter || {};
  window.Exporter.card = function (data) {
    const modal = document.getElementById("card-modal");
    if (!modal) return;
    modal._data = data;
    buildPreview(data);
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("open"));
    bindOnce();
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

  const canNativeShare = typeof navigator.share === "function";

  function bindOnce() {
    if (bound) return;
    bound = true;
    const modal = document.getElementById("card-modal");
    modal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", close));
    // 动态设置 Share 按钮标签（iOS/Mac = 分享，Windows/Android = 复制链接）
    const shareBtn = document.getElementById("btn-card-share");
    if (shareBtn) shareBtn.textContent = canNativeShare ? "⤴ Share" : "⎘ Copy Link";
    modal.querySelector("[data-share]").addEventListener("click", () => share(modal._data));
    modal.querySelector("[data-download]").addEventListener("click", () => downloadPNG(modal._data));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }
  function close() {
    const m = document.getElementById("card-modal");
    m.classList.remove("open");
    setTimeout(() => (m.hidden = true), 200);
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
