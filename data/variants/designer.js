/* designer.js — ③ 网页/平面/产品/交互 设计师（退而求其次的求职方向） */
window.RESUME_VARIANT = {
  id: "designer",
  headline: {
    zh: "设计师 · 网页 / 平面 / 产品 / 交互",
    ja: "デザイナー · Web / グラフィック / プロダクト / インタラクション",
    en: "Designer · Web / Graphic / Product / Interaction",
    de: "Designer · Web / Grafik / Produkt / Interaction",
  },
  intro: {
    zh: "工业设计学士（湖北工业大学），KHM 媒体艺术 Diplom。横跨网页、平面、产品与交互设计，兼具工程实现能力。从用户研究到落地，注重系统性与视觉细节。",
    ja: "湖北工業大学プロダクトデザイン学士、KHM メディアアーツ Diplom。Web・グラフィック・プロダクト・インタラクションデザインを横断し、実装能力も兼ね備える。リサーチから実装まで、システム的思考とビジュアル細部にこだわる。",
    en: "B.A. Product Design (Hubei UT) and KHM Media Arts Diploma. Spans web, graphic, product and interaction design with hands-on implementation skills. From research to delivery — systematic thinking and attention to visual detail.",
    de: "B.A. Produktdesign (Hubei UT) und KHM Diplom in Media Arts. Übergreifend in Web-, Grafik-, Produkt- und Interaktionsdesign, mit praktischen Umsetzungskenntnissen. Von der Recherche bis zur Lieferung — systematisches Denken und visuelles Detail.",
  },
  greeting: null,
  sections: {
    order: ["intro", "work", "education", "toolset", "projects"],
    hide: ["portfolio", "moreWorks"],
    emphasize: ["work", "education"],
  },
  // sidebar → 侧边栏核心能力（设计相关，宏观能力描述）
  sidebar: ["cap-webgfx", "cap-gfx", "cap-proddes", "cap-3d"],
  // highlightTools → 工具集高亮（设计/视频/3D 软件）
  highlightTools: [
    "t-ps", "t-affinity", "t-canva", "t-webflow",
    "t-pr", "t-ae", "t-davinci",
    "t-blender", "t-zbrush", "t-nomad", "t-shapr3d",
  ],
  // hideTools → 工具集黑名单：AI 组是 ue5-tech 变体专用，设计师版不显示
  hideTools: [
    "t-claudecode", "t-codex", "t-comfyui", "t-triposplat", "t-birefnet", "t-llamacpp",
    // MediaPipe 已从 ai 组挪到 interactive 组 —— 仍要挡，否则会漏进本变体的工具集
    "t-mediapipe", "t-controlnet"
  ],
  // emphasizeItems → 工作条目重点色
  emphasizeItems: ["work-portfolio", "work-design", "work-freelance"],
  // 本变体显示 projects（moreWorks 整块已 hide）→ 两个个人产品项目要逐条挡
  hideItems: ["email-freelance", "github", "prj-versewiki", "prj-vp"],
  order: {},
};
