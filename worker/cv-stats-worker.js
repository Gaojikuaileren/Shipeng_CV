/* ============================================================
   cv-stats-worker.js — Cloudflare Worker：访问统计后端
   只记录「访问次数 + 时间戳」，绝不记录 IP / cookie / 任何个人数据。
   端点：
     POST /hit  → 记录一次访问（总数+1、本周+1、追加时间戳，最多存 100 条）
     GET  /data → 返回 { total, thisWeek, log: [ISO时间戳…] }

   —— 部署步骤（一次性，约 5 分钟）——
   1. 注册 Cloudflare（免费）→ dashboard.cloudflare.com
   2. 左侧 Storage & Databases → KV → Create namespace，命名：CV_STATS
   3. Workers & Pages → Create → Worker，命名如 cv-stats → Deploy（先占位）
   4. 进入该 Worker → Edit code，把本文件内容整段粘贴进去 → Deploy
   5. Worker → Settings → Bindings → Add → KV namespace：
        Variable name 填 CV_STATS，选刚建的 CV_STATS namespace → Save
   6. 复制 Worker 的网址（形如 https://cv-stats.你的子域.workers.dev）
   7. 把它填到 scripts/stats.js 的 URL，然后 git push
   （想换允许来源/自定义域名，改下面 ALLOW_ORIGINS）
   ============================================================ */

const ALLOW_ORIGINS = [
  "https://gaojikuaileren.github.io",
  "http://localhost:5180",
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allow = ALLOW_ORIGINS.indexOf(origin) !== -1 ? origin : ALLOW_ORIGINS[0];
    const headers = {
      "Access-Control-Allow-Origin": allow,
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers });

    const KV = env.CV_STATS;
    if (!KV) return new Response(JSON.stringify({ error: "KV not bound" }), { status: 500, headers });

    const week = isoWeek(new Date());

    if (url.pathname === "/hit" && request.method === "POST") {
      const total = (parseInt((await KV.get("total")) || "0", 10) || 0) + 1;
      let wk = JSON.parse((await KV.get("week")) || '{"id":"","n":0}');
      if (wk.id !== week) wk = { id: week, n: 0 };
      wk.n += 1;
      let log = JSON.parse((await KV.get("log")) || "[]");
      log.push(new Date().toISOString());
      if (log.length > 100) log = log.slice(log.length - 100); // 只留最近 100 条
      await KV.put("total", String(total));
      await KV.put("week", JSON.stringify(wk));
      await KV.put("log", JSON.stringify(log));
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    if (url.pathname === "/data" && request.method === "GET") {
      const total = parseInt((await KV.get("total")) || "0", 10) || 0;
      const wk = JSON.parse((await KV.get("week")) || '{"id":"","n":0}');
      const thisWeek = wk.id === week ? wk.n : 0;
      const log = JSON.parse((await KV.get("log")) || "[]");
      return new Response(JSON.stringify({ total, thisWeek, log }), { headers });
    }

    return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers });
  },
};

// ISO 周标识（如 "2026-W23"），用于「本周」计数按周自动重置
function isoWeek(d) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (date.getUTCDay() + 6) % 7;
  date.setUTCDate(date.getUTCDate() - dayNum + 3);
  const firstThursday = date.getTime();
  date.setUTCMonth(0, 1);
  if (date.getUTCDay() !== 4) date.setUTCMonth(0, 1 + ((4 - date.getUTCDay()) + 7) % 7);
  const week = 1 + Math.ceil((firstThursday - date.getTime()) / 604800000);
  return date.getUTCFullYear() + "-W" + (week < 10 ? "0" + week : week);
}
