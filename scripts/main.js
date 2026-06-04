/* ============================================================
   main.js — 入口：串联 身份 → 语言 → 数据 → 渲染 → UI 绑定
   ============================================================ */
(function () {
  "use strict";

  function boot() {
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
      } catch (e) {
        console.error("[cv] render failed", e);
        var root = document.getElementById("cv-root");
        if (root) root.innerHTML = '<p style="padding:2rem;color:#565656">内容加载出错，请刷新页面。<br>If this persists, please reload.</p>';
      }
    });

    window.I18n.onChange(() => {
      try {
        window.Render.all(window.__DATA__);
        syncLangSwitcher();
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

  document.addEventListener("DOMContentLoaded", boot);
})();
