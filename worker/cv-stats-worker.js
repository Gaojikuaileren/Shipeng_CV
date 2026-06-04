/* ============================================================
   cv-stats-worker.js — Cloudflare Worker：分职业访问统计后端
   只记录「访问次数 / PDF 导出次数 / 时间戳」，绝不记录 IP / cookie / 任何个人数据。

   端点：
     POST /hit?v=职业    → 该职业访问 +1，追加时间戳（每职业最多存 100 条）
     POST /pdf?v=职业    → 该职业 PDF 导出 +1
     POST /reset?v=职业&k=密钥 → 清零该职业（v=all 清全部）
     GET  /data          → 返回各职业明细 + 汇总，本周数由时间戳现算

   合法职业：ue5-tech / art-vr / designer / odd

   —— 部署（wrangler）——
     worker/ 目录下：wrangler deploy
     （配置见同目录 wrangler.toml；KV 绑定变量名 CV_STATS）
   ============================================================ */

const ALLOW_ORIGINS = [
  "https://gaojikuaileren.github.io",
  "http://localhost:5180",
];

// 合法职业白名单（防止任意字符串污染 KV）
const VARIANTS = ["ue5-tech", "art-vr", "designer", "odd"];

// 清零密钥：hub.html 在公开仓库会暴露，仅用于挡随手乱扫的爬虫。
// 清零只把统计数字归零，不泄露任何数据，危害很低。
const RESET_KEY = "spoy-rst-c7f3a91e";

// 全部数据存在单个 KV key 里（一次读、一次写）
const KEY = "stats";

function emptyBucket() { return { v: 0, p: 0, log: [] }; }

function loadAll(raw) {
  let data = {};
  try { data = JSON.parse(raw || "{}"); } catch (e) { data = {}; }
  for (let i = 0; i < VARIANTS.length; i++) {
    const id = VARIANTS[i];
    if (!data[id] || typeof data[id] !== "object") data[id] = emptyBucket();
    if (typeof data[id].v !== "number") data[id].v = 0;
    if (typeof data[id].p !== "number") data[id].p = 0;
    if (!Array.isArray(data[id].log)) data[id].log = [];
  }
  return data;
}

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

    const v = url.searchParams.get("v") || "";
    const data = loadAll(await KV.get(KEY));

    // —— 记录一次访问 ——
    if (url.pathname === "/hit" && request.method === "POST") {
      if (VARIANTS.indexOf(v) === -1) return new Response(JSON.stringify({ error: "bad variant" }), { status: 400, headers });
      data[v].v += 1;
      data[v].log.push(new Date().toISOString());
      if (data[v].log.length > 100) data[v].log = data[v].log.slice(data[v].log.length - 100);
      await KV.put(KEY, JSON.stringify(data));
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    // —— 记录一次 PDF 导出 ——
    if (url.pathname === "/pdf" && request.method === "POST") {
      if (VARIANTS.indexOf(v) === -1) return new Response(JSON.stringify({ error: "bad variant" }), { status: 400, headers });
      data[v].p += 1;
      await KV.put(KEY, JSON.stringify(data));
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    // —— 清零（v=职业 或 v=all），需密钥 ——
    if (url.pathname === "/reset" && request.method === "POST") {
      if (url.searchParams.get("k") !== RESET_KEY) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers });
      if (v === "all") {
        for (let i = 0; i < VARIANTS.length; i++) data[VARIANTS[i]] = emptyBucket();
      } else if (VARIANTS.indexOf(v) !== -1) {
        data[v] = emptyBucket();
      } else {
        return new Response(JSON.stringify({ error: "bad variant" }), { status: 400, headers });
      }
      await KV.put(KEY, JSON.stringify(data));
      return new Response(JSON.stringify({ ok: true, reset: v }), { headers });
    }

    // —— 读取统计：各职业明细 + 汇总 ——
    if (url.pathname === "/data" && request.method === "GET") {
      const week = isoWeek(new Date());
      const out = { variants: {}, total: 0, thisWeek: 0, totalPdf: 0 };
      for (let i = 0; i < VARIANTS.length; i++) {
        const id = VARIANTS[i];
        const b = data[id];
        let wkCount = 0;
        for (let j = 0; j < b.log.length; j++) {
          if (isoWeek(new Date(b.log[j])) === week) wkCount++;
        }
        out.variants[id] = { visits: b.v, pdf: b.p, thisWeek: wkCount, log: b.log };
        out.total += b.v;
        out.totalPdf += b.p;
        out.thisWeek += wkCount;
      }
      return new Response(JSON.stringify(out), { headers });
    }

    return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers });
  },
};

// ISO 周标识（如 "2026-W23"），用于「本周」计数
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
