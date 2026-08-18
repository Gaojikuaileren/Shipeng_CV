/* ============================================================
   check.js — 内容守卫：加内容 / 加变体之前跑一遍
       node tools/check.js

   为什么需要它
       这个仓库没有构建、没有类型、没有测试，而数据全靠手写。出错的方式几乎都是**静默**的：
       四语漏一种 → i18n 的 fallback 用英文顶上，页面看着好好的；
       id 打错一个字母 → hideItems 挡不住那条，它照常出现在发给客户的简历上；
       新变体忘了在 worker 登记 → 它的访问量一次也记不上，控制台却一切正常。
       这些都不会报错，只会在某天被人看出来。这个脚本把它们变成命令行里的一行红字。

   跑什么
       ① 变体登记链路：短链表 ↔ meta.variants ↔ 数据文件 ↔ worker 白名单，四处必须对齐
       ② 四语完整性：凡是 {zh,ja,en,de} 形状的对象，四种语言一个都不能少
       ③ id 唯一性：同一个池子里不许重名（hideItems / emphasizeItems 都按 id 全局匹配）
       ④ 变体引用的 id 是否存在（sidebar / highlightTools / hideItems / … / order.*）
       ⑤ sections 里的板块名是否在 render.js 的注册表里
       ⑥ tags 数量：每条最多 4 个（本人定的「不超过一排」，超了会在窄栏里撑破或折行）
       ⑦ since 格式：YYYY-MM / YYYY-MM-DD，且必须是日历上真实存在的日期
       ⑧ 作品链接：不许两件作品指向同一个地址（曾经两条「▶ 视频」都指 Vimeo 主页）
       ⑨ CSS 里 body.v-* 的规则是否都对应一个已登记变体（失配时选择器静默不命中）
       ⑩ interactions 的变体门禁同理（不命中就直接 return，彩蛋悄悄不装）
       ⑪ tools/snapshot.py 的变体清单有没有跟上（漏一个＝那个变体没有护栏，却照样报「全部一致」）
       ⑫ 控制台 hub.html 的四张表有没有跟上（漏了只影响你自己，所以只提示不报错）

   退出码 0 = 全过；1 = 有问题，逐条列出。
   零依赖，不需要浏览器，也不需要本地服务器。
   ============================================================ */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.dirname(__dirname);
const LANGS = ["zh", "ja", "en", "de"];
const problems = [];
const notes = [];
const fail = (m) => problems.push(m);

/* 这些脚本都是「往 window 上挂一个对象」的写法，给个壳就能在 node 里读。 */
function load(rel) {
  global.window = global.window || {};
  delete require.cache[require.resolve(path.join(ROOT, rel))];
  require(path.join(ROOT, rel));
  return global.window;
}

const w = load("data/base.js");
const BASE = w.RESUME_BASE;
if (!BASE) { console.error("读不到 data/base.js 的 RESUME_BASE"); process.exit(1); }
load("scripts/variants.js");
const ALIAS = w.VARIANTS.alias;

/* ── ① 变体登记链路 ───────────────────────────────────────── */
const registered = Object.values(ALIAS);                  // 短链表认的内部 ID
const metaList = (BASE.meta && BASE.meta.variants) || []; // base.js 的白名单
const workerSrc = fs.readFileSync(path.join(ROOT, "worker/cv-stats-worker.js"), "utf8");
const workerList = (workerSrc.match(/const VARIANTS = \[([^\]]*)\]/) || [, ""])[1]
  .split(",").map((s) => s.trim().replace(/["']/g, "")).filter(Boolean);

registered.forEach((id) => {
  const isPage = id !== "odd"; // odd 是独立页面，没有 data/variants/odd.js
  if (isPage && !fs.existsSync(path.join(ROOT, "data/variants/" + id + ".js")))
    fail(`① 短链表登记了 ${id}，但 data/variants/${id}.js 不存在`);
  if (isPage && metaList.indexOf(id) === -1)
    fail(`① ${id} 不在 data/base.js 的 meta.variants 里（works.html 会认不出它）`);
  if (workerList.indexOf(id) === -1)
    fail(`① ${id} 不在 worker 的 VARIANTS 里 → /hit 返回 400，这个变体的访问量一次也记不上`);
});
metaList.forEach((id) => {
  if (registered.indexOf(id) === -1) fail(`① meta.variants 里的 ${id} 没在短链表登记，发不出短链`);
});
workerList.forEach((id) => {
  if (registered.indexOf(id) === -1) notes.push(`worker 白名单里的 ${id} 已不在前端 —— 退役变体的历史计数还留着，通常无害`);
});

/* ── ② 四语完整性 ─────────────────────────────────────────── */
function walkML(o, where, out) {
  if (!o || typeof o !== "object") return;
  if (Array.isArray(o)) return o.forEach((v, i) => walkML(v, `${where}[${i}]`, out));
  const keys = Object.keys(o);
  // 判定「这是一个多语对象」：出现任一语言键，且不含明显的非语言键
  if (keys.some((k) => LANGS.indexOf(k) !== -1)) {
    const miss = LANGS.filter((l) => !(l in o) || String(o[l]).trim() === "");
    if (miss.length) out.push(`${where} 缺 ${miss.join(" / ")}`);
    return;
  }
  keys.forEach((k) => walkML(o[k], `${where}.${k}`, out));
}
const mlBad = [];
walkML(BASE, "base", mlBad);

/* ── 载入各变体 ───────────────────────────────────────────── */
const variants = {};
registered.filter((id) => id !== "odd").forEach((id) => {
  delete w.RESUME_VARIANT;
  load("data/variants/" + id + ".js");
  variants[id] = w.RESUME_VARIANT;
  walkML(w.RESUME_VARIANT, id, mlBad);
});
mlBad.forEach((m) => fail("② 四语不全：" + m + "（会被 i18n 静默 fallback 成英文，页面看不出来）"));

/* ── ③ id 唯一性 ──────────────────────────────────────────── */
[["capabilities", BASE.capabilities], ["tools", BASE.tools], ["projects", BASE.projects],
 ["work", BASE.work], ["moreWorks", BASE.moreWorks], ["education", BASE.education],
 ["contact", BASE.contact], ["oddjobs", BASE.oddjobs]].forEach(([name, arr]) => {
  const seen = new Set();
  (arr || []).forEach((it) => {
    if (!it || !it.id) return;
    if (seen.has(it.id)) fail(`③ ${name} 里 id 重复：${it.id}（hideItems / emphasizeItems 按 id 全局匹配，会一起命中）`);
    seen.add(it.id);
  });
});

/* ── ④ 变体引用的 id 是否存在 ─────────────────────────────── */
const pool = [].concat(BASE.projects || [], BASE.work || [], BASE.moreWorks || [],
  BASE.education || [], BASE.contact || [], BASE.oddjobs || []);
const hasIn = (arr, id) => (arr || []).some((x) => x && x.id === id);
Object.entries(variants).forEach(([v, V]) => {
  const chk = (list, label, arr) => (list || []).forEach((id) => {
    if (!hasIn(arr, id)) fail(`④ ${v} 的 ${label} 指向不存在的 id：${id}`);
  });
  chk(V.sidebar, "sidebar", BASE.capabilities);
  chk(V.highlightTools, "highlightTools", BASE.tools);
  chk(V.onlyTools, "onlyTools", BASE.tools);
  chk(V.hideTools, "hideTools", BASE.tools);
  chk(V.hideItems, "hideItems", pool);
  chk(V.emphasizeItems, "emphasizeItems", pool);
  chk(Object.keys(V.itemOverrides || {}), "itemOverrides", pool);
  Object.entries(V.order || {}).forEach(([k, ids]) => chk(ids, `order.${k}`, pool));
});

/* ── ⑤ sections 里的板块名 ────────────────────────────────── */
// 唯一真源是 render.js 的注册表；它要 DOM 才能跑，所以这里按文本读那张表
const renderSrc = fs.readFileSync(path.join(ROOT, "scripts/render.js"), "utf8");
const specBlock = (renderSrc.match(/const SECTION_SPECS = \[([\s\S]*?)\n  \];/) || [, ""])[1];
const SECTION_KEYS = [...specBlock.matchAll(/key:\s*"([^"]+)"/g)].map((m) => m[1]).concat("profile");
if (SECTION_KEYS.length < 5) fail("⑤ 读不出 render.js 的 SECTION_SPECS —— 这张表的写法变了，本脚本要跟着改");
Object.entries(variants).forEach(([v, V]) => {
  const s = V.sections || {};
  [].concat(s.order || [], s.hide || [], s.emphasize || []).forEach((k) => {
    if (SECTION_KEYS.indexOf(k) === -1) fail(`⑤ ${v} 的 sections 里有未知板块名：${k}`);
  });
});

/* ── ⑥ tags 每条最多 4 个 ─────────────────────────────────── */
const TAG_MAX = 4;
[].concat(BASE.projects || [], BASE.work || [], BASE.moreWorks || []).forEach((it) => {
  if (it && it.tags && it.tags.length > TAG_MAX)
    fail(`⑥ ${it.id} 有 ${it.tags.length} 个 tag（上限 ${TAG_MAX}）—— 窄栏里会折行，打印时曾把整页缩到 66%`);
});
Object.entries(variants).forEach(([v, V]) => {
  Object.entries(V.itemOverrides || {}).forEach(([id, ov]) => {
    if (ov && ov.tags && ov.tags.length > TAG_MAX)
      fail(`⑥ ${v} 的 itemOverrides.${id} 有 ${ov.tags.length} 个 tag（上限 ${TAG_MAX}）`);
  });
});

/* ── ⑦ since 格式 ─────────────────────────────────────────── */
(BASE.capabilities || []).forEach((c) => {
  if (!c.since) return;
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(String(c.since).trim());
  let ok = !!m;
  if (m) {
    const y = +m[1], mo = +m[2], d = m[3] ? +m[3] : 1;
    const dt = new Date(Date.UTC(y, mo - 1, d));
    ok = mo >= 1 && mo <= 12 && dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d;
  }
  if (!ok) fail(`⑦ ${c.id} 的 since 非法：${c.since}（应为 YYYY-MM 或 YYYY-MM-DD 且真实存在）`);
});

/* ── ⑧ 作品链接不许撞车 ───────────────────────────────────── */
const links = new Map();
[].concat(BASE.projects || [], BASE.moreWorks || []).forEach((it) => {
  const u = it && (it.link || it.video);
  if (!u) return;
  if (links.has(u)) fail(`⑧ ${it.id} 与 ${links.get(u)} 指向同一个地址：${u}（作品示例里会并排出现两条一样的链接）`);
  else links.set(u, it.id);
  if (!/^https?:\/\//.test(u)) fail(`⑧ ${it.id} 的链接不是 http(s)：${u}`);
});

/* ── ⑨ body.v-* 的排版规则有没有对应的变体 ─────────────────── */
// print.css / screen.css 里按变体标定的规则挂在 body.v-<内部 ID> 上。变体改名或退役时
// 这些规则会静默失配 —— CSS 选择器不命中不报错，只是那份 PDF 悄悄少了几毫米。
const css = ["styles/print.css", "styles/screen.css"]
  .map((f) => fs.readFileSync(path.join(ROOT, f), "utf8")).join("\n");
const usedInCss = [...css.matchAll(/body\.v-([a-z0-9-]+)/g)].map((m) => m[1]);
[...new Set(usedInCss)].forEach((id) => {
  if (registered.indexOf(id) === -1)
    fail(`⑨ CSS 里有 body.v-${id} 的规则，但 ${id} 不是已登记的变体 —— 这条规则永远不会命中`);
});

/* ── ⑩ interactions 的变体门禁同理 ─────────────────────────── */
const inter = fs.readFileSync(path.join(ROOT, "scripts/interactions/index.js"), "utf8");
// 前面必须是引号或点：否则 cv-toolset / cv-photo 这类类名的尾巴也会被当成变体名
[...inter.matchAll(/["'.]v-([a-z0-9-]+)/g)].map((m) => m[1]).forEach((id) => {
  if (registered.indexOf(id) === -1 && id !== "art" && id !== "ue5")
    notes.push(`interactions 里提到 v-${id}，不在已登记变体里（可能是注释或过时的门禁）`);
});

/* ── ⑪ 护栏的变体清单有没有跟上 ───────────────────────────── */
// tools/snapshot.py 手抄了一份短链清单：漏掉一个变体，那个变体就等于没有护栏，
// 而它照样打印「全部一致」。
const snap = fs.readFileSync(path.join(ROOT, "tools/snapshot.py"), "utf8");
const snapList = (snap.match(/^VARIANTS = \[([^\]]*)\]/m) || [, ""])[1]
  .split(",").map((x) => x.trim().replace(/["']/g, "")).filter(Boolean);
Object.keys(ALIAS).forEach((short) => {
  if (snapList.indexOf(short) === -1)
    fail(`⑪ 短链 ${short} 不在 tools/snapshot.py 的 VARIANTS 里 → 这个变体没有护栏，却不会有人告诉你`);
});

/* ── ⑫ 控制台的清单有没有跟上 ─────────────────────────────── */
const hub = fs.readFileSync(path.join(ROOT, "hub.html"), "utf8");
Object.entries(ALIAS).forEach(([short, id]) => {
  const inRoutes = hub.indexOf('"?v=' + short + '"') !== -1 || (id === "odd" && hub.indexOf('"odd/"') !== -1);
  if (!inRoutes) notes.push(`控制台 hub.html 的 ROUTES 里没有 ${short}（${id}）—— 只影响你自己按 /sNN 跳转`);
  if (hub.indexOf('"' + id + '"') === -1)
    notes.push(`控制台 hub.html 的 NAMES/ORDER/CLEAN 里没有 ${id} —— 统计表里会漏掉这一行`);
});

/* ── 结果 ─────────────────────────────────────────────────── */
const stats = `变体 ${registered.length}｜能力 ${(BASE.capabilities || []).length}｜工具 ${(BASE.tools || []).length}｜` +
  `项目 ${(BASE.projects || []).length}｜更多作品 ${(BASE.moreWorks || []).length}`;
console.log(stats);
notes.forEach((n) => console.log("提示：" + n));
if (!problems.length) {
  console.log("全部通过 —— 12 项检查无异常。");
  process.exit(0);
}
console.log(`\n发现 ${problems.length} 处问题：`);
problems.forEach((p) => console.log("  · " + p));
process.exit(1);
