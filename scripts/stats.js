/* ============================================================
   stats.js — 访问统计前端接口（对接 Cloudflare Worker）
   只发「记录一次访问」和「读取统计」两个请求，不涉及任何个人数据。
   URL 未填时一切静默跳过，站点照常工作（部署 Worker 前不报错）。
   ============================================================ */
window.Stats = {
  // UPDATE：部署 worker/cv-stats-worker.js 后，把 Worker 网址填这里，然后 git push
  // 例： URL: "https://cv-stats.你的子域.workers.dev",
  URL: "",

  _ready: function () {
    return /^https?:\/\/.+/.test(this.URL) && !/你的子域|YOUR-/.test(this.URL);
  },

  // 记录一次访问（访客打开简历时调用；失败静默）
  ping: function () {
    if (!this._ready()) return;
    try {
      fetch(this.URL + "/hit", { method: "POST", mode: "cors", keepalive: true }).catch(function () {});
    } catch (e) {}
  },

  // 读取统计 → { total, thisWeek, log: [...] }
  data: function () {
    if (!this._ready()) return Promise.reject(new Error("stats URL not configured"));
    return fetch(this.URL + "/data", { mode: "cors" }).then(function (r) { return r.json(); });
  },
};
