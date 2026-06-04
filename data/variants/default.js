/* default.js — 通用版（无 ?v= 时加载）
   sidebar 不写 → 用 base.defaultSidebar；highlightTools 不写 → 工具集无高亮 */
window.RESUME_VARIANT = {
  id: "default",
  headline: null, intro: null, greeting: null,
  sections: { order: [], hide: ["moreWorks"], emphasize: [] },
  hideItems: ["email-freelance", "github"],
  order: {},
};
