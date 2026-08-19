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

  /* 本人自己的访问不计数。
     没有 cookie 的前提下，唯一可靠的办法是在每台设备上做一次标记：
     开一次 ?me=1（处理见 index.html 头部），本机就记下 cv-me，从此这个浏览器永不打点。
     mode=full 也一并算本人 —— 那个标记只有你自己会有。
     代价：换浏览器 / 清数据 / 无痕窗口都要重新标一次。这是不用 cookie 的必然结果。 */
  _isOwner: function () {
    try {
      return localStorage.getItem("cv-me") === "1" || localStorage.getItem("cv-mode") === "full";
    } catch (e) { return false; } // 隐私模式下 localStorage 可能抛，抛了就当普通访客
  },

  _ready: function () {
    return /^https?:\/\/.+/.test(this.URL);
  },

  _post: function (path) {
    if (!this._ready()) return;
    if (this._isLocal()) { console.info("[stats] 本机环境，跳过打点：" + path); return; }
    if (this._isOwner()) { console.info("[stats] 本机已标记为本人，跳过打点：" + path); return; }
    try {
      fetch(this.URL + path, { method: "POST", mode: "cors", keepalive: true }).catch(function () {});
    } catch (e) {}
  },

  /* 记录一次访问。除了职业，另带两样**不指向任何个人**的信息：
       lang 对方实际读的是哪一语（判断某个语言版本值不值得继续打磨）
       dev  手机还是桌面（按视口宽度判断，不嗅探 UA）
     国家不在这里发 —— 那个由 worker 从 Cloudflare 的边缘信息里取，前端无从伪造。 */
  ping: function (variant, lang, dev) {
    if (!variant) return;
    this._post("/hit?v=" + encodeURIComponent(variant) +
      (lang ? "&lang=" + encodeURIComponent(lang) : "") +
      (dev ? "&dev=" + encodeURIComponent(dev) : ""));
  },

  /* 记录「读得深不深」：停留秒数 ＋ 滚动到的百分比。
     页面关闭那一刻才知道结果，那时普通 fetch 会被浏览器掐断 → 用 sendBeacon，
     它把请求交给浏览器在后台发完，不阻塞关闭。
     只发这一次、只发两个数，服务端也只累加总数 —— 单次停留时长是能用来认人的，总数不能。 */
  readHit: function (variant, sec, depth) {
    if (!variant || !this._ready() || this._isLocal() || this._isOwner()) return;
    if (!navigator.sendBeacon) return; // 老浏览器直接放弃，不值得为它降级成同步请求
    try {
      navigator.sendBeacon(this.URL + "/read?v=" + encodeURIComponent(variant) +
        "&sec=" + encodeURIComponent(sec) + "&depth=" + encodeURIComponent(depth));
    } catch (e) {}
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
