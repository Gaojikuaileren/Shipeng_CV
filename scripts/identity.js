/* ============================================================
   identity.js — 分发式身份 / 模式
   身份不靠"检测"，靠"分发"：
     · 本人  → 暗号 / ?mode=full（本地记住）→ 看完整版 + private 字段
     · HR/客户 → 你发的专属链接 ?v=xxx → 看为该岗位定制的版本
     · 爬虫/路人 → 无参数 → 默认通用版，private 默认隐藏

   ⚠️ 这是"模式开关"，不是安全边界。前端无真安全（见 SPEC.md）。
   ============================================================ */
window.Identity = {
  variant: "default",
  mode: "public", // public | full

  init() {
    const p = new URLSearchParams(location.search);

    // 变体：清洗，只允许 [a-z0-9-]，防路径穿越
    this.variant = this._sanitize(p.get("v")) || "ue5-tech";

    // 本人模式：?mode=full（骨架阶段先不加 PIN，TODO 见下）
    const urlFull = p.get("mode") === "full";
    const savedFull = localStorage.getItem("cv-mode") === "full";
    this.mode = urlFull || savedFull ? "full" : "public";
    if (urlFull) localStorage.setItem("cv-mode", "full");

    // TODO(本人模式): 接 PIN 暗号。例如首次 ?mode=full 要求输入 PIN，
    //   校验通过才写 localStorage。前端 PIN 仅"防君子"，绝密信息勿入静态站。
  },

  _sanitize(id) {
    if (!id) return "";
    return String(id).replace(/[^a-z0-9-]/gi, "").slice(0, 40);
  },

  isFull() {
    return this.mode === "full";
  },

  // 退出本人模式（清掉本地标记）
  exitFull() {
    localStorage.removeItem("cv-mode");
    this.mode = "public";
  },
};
