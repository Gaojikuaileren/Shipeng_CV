/* ============================================================
   cv-stats-worker.js — Cloudflare Worker：分职业访问统计后端
   只记录「访问次数 / PDF 导出次数 / 时间戳」，绝不记录 IP / cookie / 任何个人数据。

   端点（对外不变，hub.html / scripts/stats.js 无需改动）：
     POST /hit?v=职业    → 该职业访问 +1，追加时间戳（每职业最多存 100 条）
     POST /pdf?v=职业    → 该职业 PDF 导出 +1
     POST /reset?v=职业&k=密钥 → 清零该职业（v=all 清全部）
     GET  /data          → 返回各职业明细 + 汇总，本周数由时间戳现算

   合法职业：ue5-tech / art-vr / designer / odd / china-biz

   —— 为什么用 Durable Object 而不是 KV ——
   老版本把所有数字放在一个 KV key 里，每次 +1 都「读整个 JSON → 改 → 写回」。
   KV 是最终一致的，并发请求会读到旧快照再写回去，把别人的 +1 覆盖掉（计数变少）。
   现在所有读写都进同一个 Durable Object 实例（名字固定 "stats"），
   写操作再用 blockConcurrencyWhile 串行化 → 读-改-写不会交错，计数不再丢。

   —— 部署（wrangler）——
     worker/ 目录下：wrangler deploy
     （配置见同目录 wrangler.toml；DO 绑定变量名 CV_STATS_DO）
   注意：计数从 DO 里重新开始。老的 KV 数据没有删除，仍在 KV namespace 里，
   需要时可 `wrangler kv key get stats --namespace-id <id> --remote` 取回。
   ============================================================ */

const ALLOW_ORIGINS = [
  "https://gaojikuaileren.github.io",
  "http://localhost:5180",
];

// 合法职业白名单（防止任意字符串污染存储）
// ⚠️ 与前端的变体清单（data/base.js 的 meta.variants ＋ index.html 内联白名单）是两套东西：
//    这里漏登记不会报错，只会让 /hit 与 /pdf 返回 400 —— 那个变体的访问量一次也记不上。
//    改完必须在 worker/ 目录跑 wrangler deploy，不 deploy 不生效。
const VARIANTS = ["ue5-tech", "art-vr", "designer", "odd", "china-biz"];

// 清零密钥：hub.html 在公开仓库会暴露，仅用于挡随手乱扫的爬虫。
// 清零只把统计数字归零，不泄露任何数据，危害很低。
const RESET_KEY = "spoy-rst-c7f3a91e";

// DO 里存全部数据的 key（一个对象，结构与老版本一致）
const KEY = "stats";

// 每职业最多保留的时间戳条数
const LOG_MAX = 100;

function emptyBucket() { return { v: 0, p: 0, log: [] }; }

// 补齐缺失职业 / 修正坏类型（新增职业时老数据也能平滑接上）
function loadAll(raw) {
  const data = (raw && typeof raw === "object") ? raw : {};
  for (let i = 0; i < VARIANTS.length; i++) {
    const id = VARIANTS[i];
    if (!data[id] || typeof data[id] !== "object") data[id] = emptyBucket();
    if (typeof data[id].v !== "number") data[id].v = 0;
    if (typeof data[id].p !== "number") data[id].p = 0;
    if (!Array.isArray(data[id].log)) data[id].log = [];
  }
  return data;
}

/* ============================================================
   Durable Object：计数的唯一持有者
   同名实例全球只有一个 → 所有请求排队进来，天然没有并发读改写问题。
   变更操作再包一层 blockConcurrencyWhile，语义上明确「这段不许插队」。
   ============================================================ */
export class Stats {
  constructor(ctx) {
    this.ctx = ctx;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    const v = url.searchParams.get("v") || "";

    // —— 记录一次访问 ——
    if (path === "/hit") {
      await this._mutate((data) => {
        data[v].v += 1;
        data[v].log.push(new Date().toISOString());
        if (data[v].log.length > LOG_MAX) data[v].log = data[v].log.slice(-LOG_MAX);
      });
      return this._json({ ok: true });
    }

    // —— 记录一次 PDF 导出 ——
    if (path === "/pdf") {
      await this._mutate((data) => { data[v].p += 1; });
      return this._json({ ok: true });
    }

    // —— 清零（v=职业 或 v=all）；密钥已由外层校验 ——
    if (path === "/reset") {
      await this._mutate((data) => {
        if (v === "all") VARIANTS.forEach((id) => { data[id] = emptyBucket(); });
        else data[v] = emptyBucket();
      });
      return this._json({ ok: true, reset: v });
    }

    // —— 读取统计：各职业明细 + 汇总 ——
    if (path === "/data") {
      const data = loadAll(await this.ctx.storage.get(KEY));
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
      return this._json(out);
    }

    return this._json({ error: "not found" }, 404);
  }

  // 读-改-写串行化：blockConcurrencyWhile 期间不会有别的请求插进来
  _mutate(fn) {
    return this.ctx.blockConcurrencyWhile(async () => {
      const data = loadAll(await this.ctx.storage.get(KEY));
      fn(data);
      await this.ctx.storage.put(KEY, data);
    });
  }

  _json(obj, status) {
    return new Response(JSON.stringify(obj), {
      status: status || 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}

/* ============================================================
   外层 Worker：CORS ＋ 参数校验，然后转给那个唯一的 DO 实例
   （校验放外层，DO 里只管存取，职责清楚）
   ============================================================ */
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
    const reply = (obj, status) =>
      new Response(JSON.stringify(obj), { status: status || 200, headers });

    if (request.method === "OPTIONS") return new Response(null, { headers });

    if (!env.CV_STATS_DO) return reply({ error: "DO not bound" }, 500);

    const path = url.pathname;
    const v = url.searchParams.get("v") || "";
    const isWrite = path === "/hit" || path === "/pdf";

    // —— 校验：方法 / 职业白名单 / 清零密钥 ——
    if (isWrite) {
      if (request.method !== "POST") return reply({ error: "not found" }, 404);
      if (VARIANTS.indexOf(v) === -1) return reply({ error: "bad variant" }, 400);
    } else if (path === "/reset") {
      if (request.method !== "POST") return reply({ error: "not found" }, 404);
      if (url.searchParams.get("k") !== RESET_KEY) return reply({ error: "forbidden" }, 403);
      if (v !== "all" && VARIANTS.indexOf(v) === -1) return reply({ error: "bad variant" }, 400);
    } else if (path === "/data") {
      if (request.method !== "GET") return reply({ error: "not found" }, 404);
    } else {
      return reply({ error: "not found" }, 404);
    }

    // —— 转给唯一的 DO 实例（名字固定，全站共用一个）——
    const stub = env.CV_STATS_DO.get(env.CV_STATS_DO.idFromName("stats"));
    const res = await stub.fetch(new Request(url.toString(), { method: request.method }));
    return new Response(await res.text(), { status: res.status, headers });
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
