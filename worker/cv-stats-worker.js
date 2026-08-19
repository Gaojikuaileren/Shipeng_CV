/* ============================================================
   cv-stats-worker.js — Cloudflare Worker：分职业访问统计后端
   只记录「访问次数 / PDF 导出次数 / 时间戳」，绝不记录 IP / cookie / 任何个人数据。

   端点（对外不变，hub.html / scripts/stats.js 无需改动）：
     POST /hit?v=职业    → 该职业访问 +1，追加时间戳（每职业最多存 100 条）＋ 本周计数 +1
     POST /pdf?v=职业    → 该职业 PDF 导出 +1
     POST /works?v=职业  → 该职业的作品页被打开 +1（纸质 PDF 上的二维码被扫）
     POST /hit 另可带 &lang=（读的哪一语）与 &dev=（m 手机 / d 桌面）；
          国家由外层 worker 从 request.cf.country 填进 &cc=，前端不参与、也无从伪造
     POST /read?v=职业&sec=&depth= → 停留秒数与滚动百分比，页面关闭时 sendBeacon 发一次
     POST /reset?v=职业  → 清零该职业（v=all 清全部）。**不设密钥** ——
                            要防的只是误点，而那由控制台的二次确认挡住；
                            清零只把数字归零，不泄露任何数据。GET 一律 404，爬虫碰不到。
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

// DO 里存全部数据的 key（一个对象，结构与老版本一致）
const KEY = "stats";

// 每职业最多保留的时间戳条数
const LOG_MAX = 100;

/* 一个变体的全部计数。全是**聚合数**，不存任何一次访问的明细行 ——
   没有标识符、没有 cookie，因此天然不可追踪，也就不需要同意弹窗。
   代价说在前面：分不出「一个人开了 5 次」和「5 个人各开 1 次」，这些数字的口径
   永远是「被打开多少次」，不是「多少人看过」。
     v    访问数
     p    PDF 导出数
     w    作品页打开数（纸质二维码被扫）
     log  最近 100 条时间戳（看时段分布用）
     wk   按 ISO 周计数，留最近 8 周
     lang 读的是哪一语：{ zh: 12, de: 5, … }
     geo  来自哪个国家：{ DE: 9, CN: 4, … }（Cloudflare 直接给，前端不参与）
     dev  手机还是桌面：{ m: 3, d: 14 }
     rd   读得深不深：n 次数、sec 总秒数、depth 总滚动百分比（除以 n 得平均） */
function emptyBucket() {
  return { v: 0, p: 0, w: 0, log: [], wk: {}, lang: {}, geo: {}, dev: {}, rd: { n: 0, sec: 0, depth: 0 } };
}

// 计数用的小工具：键先过白名单/清洗，避免任意字符串把存储撑爆
function bump(map, key) { if (key) map[key] = (map[key] || 0) + 1; }
const LANGS = ["zh", "ja", "en", "de"];
const okLang = (x) => (LANGS.indexOf(x) !== -1 ? x : "");
const okDev = (x) => (x === "m" || x === "d" ? x : "");
const okCC = (x) => (/^[A-Z]{2}$/.test(x || "") ? x : "??");
// 停留时长与滚动深度要设上限：这两个数来自客户端，不设限等于让任何人往里灌垃圾
const clampSec = (n) => Math.max(0, Math.min(3600, Math.round(+n || 0)));
const clampDepth = (n) => Math.max(0, Math.min(100, Math.round(+n || 0)));

// wk 只留最近 8 周：够画一条趋势，又不会无限长
const WK_KEEP = 8;
function bumpWeek(b, now) {
  const k = isoWeek(now);
  b.wk[k] = (b.wk[k] || 0) + 1;
  const keys = Object.keys(b.wk).sort();
  while (keys.length > WK_KEEP) delete b.wk[keys.shift()];
}

// 补齐缺失职业 / 修正坏类型（新增职业时老数据也能平滑接上）
function loadAll(raw) {
  const data = (raw && typeof raw === "object") ? raw : {};
  for (let i = 0; i < VARIANTS.length; i++) {
    const id = VARIANTS[i];
    if (!data[id] || typeof data[id] !== "object") data[id] = emptyBucket();
    if (typeof data[id].v !== "number") data[id].v = 0;
    if (typeof data[id].p !== "number") data[id].p = 0;
    if (typeof data[id].w !== "number") data[id].w = 0;
    if (!Array.isArray(data[id].log)) data[id].log = [];
    if (!data[id].lang || typeof data[id].lang !== "object") data[id].lang = {};
    if (!data[id].geo || typeof data[id].geo !== "object") data[id].geo = {};
    if (!data[id].dev || typeof data[id].dev !== "object") data[id].dev = {};
    if (!data[id].rd || typeof data[id].rd !== "object") data[id].rd = { n: 0, sec: 0, depth: 0 };
    if (!data[id].wk || typeof data[id].wk !== "object") data[id].wk = {};
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
      const lang = okLang(url.searchParams.get("lang"));
      const dev = okDev(url.searchParams.get("dev"));
      const cc = okCC(url.searchParams.get("cc")); // 外层 worker 从 request.cf 填进来
      await this._mutate((data) => {
        const now = new Date();
        data[v].v += 1;
        bumpWeek(data[v], now); // 「本周」独立计数，不再从 log 现算
        bump(data[v].lang, lang);
        bump(data[v].geo, cc);
        bump(data[v].dev, dev);
        data[v].log.push(now.toISOString());
        if (data[v].log.length > LOG_MAX) data[v].log = data[v].log.slice(-LOG_MAX);
      });
      return this._json({ ok: true });
    }

    /* —— 读得深不深：页面关闭时由 sendBeacon 发一次 ——
       只累加总数，不存每次的值 —— 单次停留时长是能用来认人的，总数不能。 */
    if (path === "/read") {
      const sec = clampSec(url.searchParams.get("sec"));
      const depth = clampDepth(url.searchParams.get("depth"));
      await this._mutate((data) => {
        data[v].rd.n += 1;
        data[v].rd.sec += sec;
        data[v].rd.depth += depth;
      });
      return this._json({ ok: true });
    }

    // —— 记录一次作品页打开（PDF 上的二维码被扫进来）——
    if (path === "/works") {
      await this._mutate((data) => { data[v].w += 1; });
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
      const out = { variants: {}, total: 0, thisWeek: 0, totalPdf: 0, totalWorks: 0 };
      for (let i = 0; i < VARIANTS.length; i++) {
        const id = VARIANTS[i];
        const b = data[id];
        /* 「本周」以前是从 log 现算的 —— 而 log 每个变体只留 100 条，
           线上五个变体早就全部撞顶，W 恒等于 500，这个数字一直是假的。
           现在读独立的周计数器；老数据没有 wk 字段就退回按 log 算（不会更差）。 */
        let wkCount = b.wk[week];
        if (typeof wkCount !== "number") {
          wkCount = 0;
          for (let j = 0; j < b.log.length; j++) {
            if (isoWeek(new Date(b.log[j])) === week) wkCount++;
          }
        }
        const rd = b.rd || { n: 0, sec: 0, depth: 0 };
        out.variants[id] = {
          visits: b.v, pdf: b.p, works: b.w, thisWeek: wkCount, log: b.log,
          lang: b.lang, geo: b.geo, dev: b.dev,
          // 平均值在这里算好，控制台直接显示；n 为 0 时给 null，前端好区分「没有数据」与「0 秒」
          readN: rd.n,
          avgSec: rd.n ? Math.round(rd.sec / rd.n) : null,
          avgDepth: rd.n ? Math.round(rd.depth / rd.n) : null,
          weeks: b.wk,
        };
        out.total += b.v;
        out.totalPdf += b.p;
        out.totalWorks += b.w;
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
      Vary: "Origin", // 响应随 Origin 变化，缺了它中间缓存会把 A 站的头发给 B 站
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
    const isWrite = path === "/hit" || path === "/pdf" || path === "/works" || path === "/read";

    // —— 校验：方法 / 职业白名单 / 清零密钥 ——
    if (isWrite) {
      if (request.method !== "POST") return reply({ error: "not found" }, 404);
      if (VARIANTS.indexOf(v) === -1) return reply({ error: "bad variant" }, 400);
    } else if (path === "/reset") {
      if (request.method !== "POST") return reply({ error: "not found" }, 404);
      if (v !== "all" && VARIANTS.indexOf(v) === -1) return reply({ error: "bad variant" }, 400);
    } else if (path === "/data") {
      if (request.method !== "GET") return reply({ error: "not found" }, 404);
    } else {
      return reply({ error: "not found" }, 404);
    }

    // —— 转给唯一的 DO 实例（名字固定，全站共用一个）——
    /* 国家只有外层拿得到：request.cf 是 Cloudflare 在边缘填的，DO 收到的是转发请求，
       上面没有 cf。所以在这里读出来，当作查询参数带给 DO。
       只取两位国家码，不取城市、不取 IP —— 那些足以指向个人，国家不会。 */
    if (isWrite) {
      const cc = (request.cf && request.cf.country) || "";
      url.searchParams.set("cc", /^[A-Z]{2}$/.test(cc) ? cc : "??");
    }
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
