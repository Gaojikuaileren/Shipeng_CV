/* ============================================================
   variants.js — 变体注册表：短链 ↔ 内部 ID（全站唯一一份）

   为什么分两套名字：
     · **短链**（ue / fl / ds / mn / cd）是对外的名字 —— 印在二维码里、发在邮件里、
       念给人听，越短越好扫、越不容易抄错。
     · **内部 ID**（ue5-tech / art-vr / …）是对内的名字 —— 统计后端的计数键、
       print.css 里 body.v-* 的逐变体排版标定、data/variants/ 的文件名，全都用它。
   两套名字分开的好处：改短链不动内部 ID → 历史访问计数不断档、按变体标定的 PDF 版式
   一毫米不用重调。反过来，将来某个变体改名，也只需在这张表上改一行。

   旧链怎么办：已经发出去的 ?v=ue5-tech、以及印在 PDF 二维码里的长地址都必须永久有效。
   index.html 的头部脚本认出长 ID 后照常渲染，只用 history.replaceState 把地址栏
   静默换成短链 —— 不跳转、不重载，因此**不会多记一次访问**，也不会闪一下。

   新增变体要动的地方（保持这张表是唯一真相）：
     1) 这里加一行 ALIAS（顺带加进 PAGE 或 EXTERNAL）
     2) data/base.js 的 meta.variants
     3) data/variants/<id>.js
     4) worker/cv-stats-worker.js 的 VARIANTS ＋ wrangler deploy（不 deploy 则该变体不计数）
   ============================================================ */
(function () {
  "use strict";

  /* 短链 → 内部变体 ID */
  var ALIAS = {
    ue: "ue5-tech",   // 游戏 / UE5 + 视觉生成式 AI
    fl: "art-vr",     // 自由职业媒体艺术
    ds: "designer",   // 设计
    mn: "odd",        // 兼职 Mini-Job
    cd: "china-biz",  // 外贸 / 中德商务
  };

  /* 在 index.html 里渲染的变体 */
  var PAGE = { "ue5-tech": 1, "art-vr": 1, "designer": 1, "china-biz": 1 };

  /* 有自己独立页面的变体：解析到它就要整页跳过去，而不是在 index.html 里渲染 */
  var EXTERNAL = { odd: "odd/" };

  /* 退役的旧 ID → 现在归到哪个变体。
     发出去的链接收不回来，所以这张表只增不删：命中后照常渲染新变体，
     地址栏静默换成新短链。ue5-ai 在 2026-08-18 并进了 ue5-tech。 */
  var LEGACY = { "ue5-ai": "ue5-tech" };

  /* 内部 ID → 短链（旧链改写用），由 ALIAS 反推，不手写第二份 */
  var SHORT = {};
  Object.keys(ALIAS).forEach(function (k) { SHORT[ALIAS[k]] = k; });

  /* 裸对象做查表会连原型链上的键一起命中（?v=constructor / ?v=toString 都能骗过
     `if (MAP[v])`）→ 一律走 hasOwnProperty。 */
  function own(o, k) { return !!k && Object.prototype.hasOwnProperty.call(o, k); }

  window.VARIANTS = {
    alias: ALIAS,
    short: SHORT,
    page: PAGE,

    /* 解析 URL 上的 ?v=，短链与长 ID 都认。
       返回 { id, short, redirect }：
         id       内部变体 ID；认不出来是 ""（调用方据此走裸入口占位 / 缺省）
         short    对应短链；用于把旧链静默改写成短链
         redirect 需要整页跳走的目标（目前只有 odd/），不需要则 null */
    resolve: function (raw) {
      var v = String(raw || "").replace(/[^a-z0-9-]/gi, "").slice(0, 40).toLowerCase();
      var id = "";
      if (own(ALIAS, v)) id = ALIAS[v];
      else if (own(PAGE, v) || own(EXTERNAL, v)) id = v; // 旧的长 ID，继续认
      else if (own(LEGACY, v)) id = LEGACY[v];           // 退役 ID，转到接手的变体
      return {
        id: id,
        short: own(SHORT, id) ? SHORT[id] : "",
        redirect: own(EXTERNAL, id) ? EXTERNAL[id] : null,
      };
    },

    /* 内部 ID → 对外该用的 ?v= 值。没登记过的原样返回（调用方自己兜底）。 */
    toShort: function (id) { return own(SHORT, id) ? SHORT[id] : String(id || ""); },
  };
})();
