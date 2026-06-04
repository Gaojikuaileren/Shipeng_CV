/* ============================================================
   export/qr.js — 作品集二维码
   屏幕端作品名是超链接（→ Vimeo）；导出 PDF/打印时换成「二维码＋作品名」。
   QR 矢量(SVG)，离线生成，无外部请求。render.js 渲染后会调用 QR.renderAll()。
   ============================================================ */
window.QR = {
  renderAll() {
    if (typeof qrcode === "undefined") return; // 库未加载则跳过
    document.querySelectorAll(".cv-pprint-qr[data-url]").forEach((el) => {
      const url = el.dataset.url;
      if (!url || el.dataset.done === url) return; // 已生成同一 url 则跳过
      try {
        const q = qrcode(0, "M"); // type auto, 纠错级 M
        q.addData(url);
        q.make();
        el.innerHTML = q.createSvgTag({ cellSize: 2, margin: 0 });
        el.dataset.done = url;
      } catch (e) {
        console.warn("[qr]", url, e);
      }
    });
  },
};
