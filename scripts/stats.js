/* ============================================================
   stats.js — 访问统计前端接口（对接 Cloudflare Worker）
   只发「访问 / PDF 导出 / 读取 / 清零」请求，按职业区分，不涉及任何个人数据。
   失败一律静默，站点照常工作。
   ============================================================ */
window.Stats = {
  // 已部署：cv-stats Worker（Cloudflare），后端 worker/cv-stats-worker.js
  URL: "https://cv-stats.weur-apps.workers.dev",

  /* 本机开发不打点。
     CORS 只管浏览器让不让读响应，**挡不住计数** —— 请求照样打到 worker、数字照样 +1。
     于是本地每刷一次页面，线上计数器就永久多一次：2026-08-18 一天就这样刷进去 324 次
     （4 变体 × 4 语言的逐个打开，一轮 16 次），把真实访问量彻底淹了。
     读取（/data）不拦：本地开着控制台看数字是正常需求，也不改变任何数据。 */
  _isLocal: function () {
    if (location.protocol === "file:") return true;
    var h = location.hostname;
    return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h === "::1" ||
      /\.local$/.test(h) || /^192\.168\./.test(h) || /^10\./.test(h);
  },

  _ready: function () {
    return /^https?:\/\/.+/.test(this.URL);
  },

  _post: function (path) {
    if (!this._ready()) return;
    if (this._isLocal()) { console.info("[stats] 本机环境，跳过打点：" + path); return; }
    try {
      fetch(this.URL + path, { method: "POST", mode: "cors", keepalive: true }).catch(function () {});
    } catch (e) {}
  },

  // 记录一次访问（按职业；访客打开简历时调用）
  ping: function (variant) {
    if (!variant) return;
    this._post("/hit?v=" + encodeURIComponent(variant));
  },

  // 记录一次「作品页被打开」（纸质 PDF 上的二维码被扫进来）
  worksHit: function (variant) {
    if (!variant) return;
    this._post("/works?v=" + encodeURIComponent(variant));
  },

  // 记录一次 PDF 导出（按职业）
  pdfHit: function (variant) {
    if (!variant) return;
    this._post("/pdf?v=" + encodeURIComponent(variant));
  },

  // 读取统计 → { variants: {id:{visits,pdf,thisWeek,log}}, total, thisWeek, totalPdf }
  data: function () {
    if (!this._ready()) return Promise.reject(new Error("stats URL not configured"));
    return fetch(this.URL + "/data", { mode: "cors" }).then(function (r) { return r.json(); });
  },

  /* ★ 清零（/reset）**故意不在这里**。
     这个文件随每一份简历发给每一位 HR —— 密钥写在这儿等于随简历一起送出去，
     任何人打开开发者工具就能把统计清空。清零的实现搬进了 hub.html，
     而且那里也不存密钥：用的时候现问，只在本次会话里记着。 */
};
