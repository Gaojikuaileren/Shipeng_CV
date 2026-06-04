/* ============================================================
   i18n.js — 四语：检测 / 切换 / fallback
   优先级：URL ?lang=  >  localStorage  >  浏览器语言  >  默认语言
   ============================================================ */
window.I18n = {
  current: "en",
  langs: ["en"],
  default: "en",
  _listeners: [],

  init(meta) {
    this.langs = meta.langs || ["en"];
    this.default = meta.defaultLang || this.langs[0];
    this.current = this._detect();
    document.documentElement.lang = this.current;
  },

  _detect() {
    const urlLang = new URLSearchParams(location.search).get("lang");
    if (urlLang && this.langs.includes(urlLang)) return urlLang;

    const saved = localStorage.getItem("cv-lang");
    if (saved && this.langs.includes(saved)) return saved;

    const nav = (navigator.language || "").slice(0, 2).toLowerCase();
    if (this.langs.includes(nav)) return nav;

    return this.default;
  },

  set(lang) {
    if (!this.langs.includes(lang) || lang === this.current) return;
    this.current = lang;
    localStorage.setItem("cv-lang", lang);
    document.documentElement.lang = lang;
    this._listeners.forEach((fn) => fn(lang));
  },

  // 订阅语言变化（用于重渲染）
  onChange(fn) {
    this._listeners.push(fn);
  },

  // 取多语字段值：传入 { zh, ja, en, de } 返回当前语言的串，带 fallback
  t(field) {
    if (field == null) return "";
    if (typeof field === "string") return field;
    return field[this.current] || field[this.default] || "";
  },
};
