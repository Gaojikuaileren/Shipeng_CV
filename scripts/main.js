/* ============================================================
   main.js — 入口：串联 身份 → 语言 → 数据 → 渲染 → UI 绑定
   ============================================================ */
(function () {
  "use strict";

  function boot() {
    if (window.__BLANK__) return; // 裸入口占位（head 拦截脚本已处理显示），不渲染、不统计
    if (!window.RESUME_BASE) {
      console.error("[cv] base data missing — 检查 data/base.js 是否已加载");
      return;
    }
    window.Identity.init();
    window.I18n.init(window.RESUME_BASE.meta);
    if (window.Stats) window.Stats.ping(window.Identity.variant); // 记录一次访问（按职业，无 IP / cookie）

    window.DataLoader.load(window.Identity.variant).then((data) => {
      try {
        window.__DATA__ = data;
        window.Render.all(data);
        buildLangSwitcher();
        bindUI(data);
        if (window.Interactions) window.Interactions.init({ data: data, lang: window.I18n.current });
        if (window.PdfHint) window.PdfHint.show();
      } catch (e) {
        console.error("[cv] render failed", e);
        var root = document.getElementById("cv-root");
        if (root) root.innerHTML = '<p style="padding:2rem;color:#565656">内容加载出错，请刷新页面。<br>If this persists, please reload.</p>';
      }
    }).catch((e) => console.error("[cv] data load failed", e));

    window.I18n.onChange(() => {
      try {
        /* 切语言 = 整棵 DOM 重建。什么都不做的话会连着跳两下：
           ① 展开的板块被收回去 → 文档变短 → 浏览器把滚动位置截到新高度；
           ② 重建后浏览器按新文档重新定位，视口内容整体挪位。
           所以先把「哪些板块是展开的」和滚动位置记下来，渲染完原样恢复。
           选择器要精确：项目按钮同时带 .cv-mw-more（共用样式）与 .cv-prj-more，
           而它在 DOM 里排在「更多作品」之前 —— 只写 .cv-mw-more 会先抓到它。 */
        const TOGGLES = [".cv-prj-more", '[data-sec="moreWorks"] .cv-mw-more'];
        const wasOpen = TOGGLES.map((sel) => {
          const b = document.querySelector(sel);
          return !!b && b.getAttribute("aria-expanded") === "true";
        });
        /* 滚动位置不能按像素还原：德语比中文长，视口上方的内容本来就会变高，
           还原到同一个 y 只会停在不同的段落上。改记「内容锚点」——
           视口顶端是哪个板块、它距视口顶多少，渲染完把同一个板块摆回同一个位置。 */
        const y = window.scrollY;
        let anchor = null;
        // 只从主区取锚点：侧栏是 sticky 的，它的 rect.top 被钉住不动，
        // 拿它当锚点等于什么都没校正（实测 scrollBy 永远算出 0）。
        const secs = document.querySelectorAll(".cv-main [data-sec]");
        for (let i = 0; i < secs.length; i++) {
          const r = secs[i].getBoundingClientRect();
          if (r.bottom > 0) { anchor = { key: secs[i].getAttribute("data-sec"), top: r.top }; break; }
        }

        window.Render.all(window.__DATA__);
        syncLangSwitcher();

        TOGGLES.forEach((sel, i) => {
          if (!wasOpen[i]) return;
          const b = document.querySelector(sel);
          // 复用按钮自己的切换逻辑，不在这里抄第二份展开代码
          if (b && b.getAttribute("aria-expanded") !== "true") b.click();
        });
        // 锚点还原要在展开态恢复之后：先把内容补齐，再对位，否则对的是收起时的坐标
        const el = anchor && document.querySelector('.cv-main [data-sec="' + anchor.key + '"]');
        if (el) window.scrollBy(0, el.getBoundingClientRect().top - anchor.top);
        else window.scrollTo(0, y); // 没找到锚点（页面还在最顶上）就退回按像素还原
      } catch (e) { console.error("[cv] re-render failed", e); }
    });
  }

  function bindUI(data) {
    document.body.classList.add("v-" + window.Identity.variant); // 供 print.css 做变体专项排版
    on("#btn-pdf", () => {
      if (window.Stats) window.Stats.pdfHit(window.Identity.variant);
      window.Exporter && window.Exporter.resumePDF();
    });
    on("#btn-card", () => window.Exporter && window.Exporter.card(data));
    on("#btn-copy", () => window.Exporter && window.Exporter.copySummary(data));

    if (window.Identity.isFull()) {
      document.body.classList.add("is-full");
      on("#btn-exit-full", () => {
        window.Identity.exitFull();
        location.href = location.pathname; // 去掉参数刷新
      });
    }
    const badge = document.getElementById("variant-badge");
    if (badge) badge.textContent = window.Identity.variant;
  }

  /* —— 语言切换器 ————————————————————————————————— */
  function buildLangSwitcher() {
    const box = document.getElementById("lang-switch");
    if (!box) return;
    box.textContent = "";
    const meta = window.RESUME_BASE.meta;
    meta.langs.forEach((lng) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lang-btn" + (lng === window.I18n.current ? " active" : "");
      b.dataset.lang = lng;
      b.textContent = meta.langLabels[lng] || lng;
      b.addEventListener("click", () => window.I18n.set(lng));
      box.appendChild(b);
    });
  }
  function syncLangSwitcher() {
    document.querySelectorAll(".lang-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.lang === window.I18n.current);
    });
  }

  /* —— 小工具 ————————————————————————————————————— */
  function on(sel, fn) {
    const el = document.querySelector(sel);
    if (el) el.addEventListener("click", fn);
  }

  // 轻量 toast（导出/复制反馈）
  window.toast = function (msg) {
    let el = document.querySelector(".cv-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "cv-toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 1800);
  };

  // 照片防护：禁用右键菜单（配合 CSS 的禁选中 / 拖拽 / 长按，防止照片被取走）
  document.addEventListener("contextmenu", function (e) {
    if (e.target && e.target.closest && e.target.closest(".cv-photo")) e.preventDefault();
  });

  document.addEventListener("DOMContentLoaded", boot);
})();
