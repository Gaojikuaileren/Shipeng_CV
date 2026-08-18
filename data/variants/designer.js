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
    order: ["intro", "work", "education", "portfolio", "moreWorks", "toolset"],
    hide: ["projects"], // 项目经历整块不展示：本变体讲设计履历，项目细节交给「作品示例」的链接
    emphasize: ["work", "education"],
  },
  // sidebar → 侧边栏核心能力（设计相关，宏观能力描述）
  sidebar: ["cap-webgfx", "cap-gfx", "cap-proddes", "cap-3d"],

  /* —— 页面底部通向 UE 开发版的按钮 ——————————————————————
     来看设计版的人里有一部分其实在找能写代码的设计师 —— 与其让他们猜，不如给一个入口。
     只在屏幕上出现；纸上点不了按钮，PDF 里整块隐藏（print.css）。 */
  /* PDF 里给一个能扫的作品入口：本变体隐藏了作品集板块（简历上不列链接），
     所以二维码放在侧栏末尾（见 render.js 的 renderAsideQr）。 */
  worksPage: true,

  crossLink: {
    to: "ue",
    label: {
      zh: "也在做 UE5 实时开发 —— 查看开发版简历",
      ja: "UE5 のリアルタイム開発も —— 開発版の履歴書を見る",
      en: "I also build real-time UE5 systems — see the developer CV",
      de: "Ich entwickle auch UE5-Echtzeitsysteme — zum Entwickler-Lebenslauf",
    },
  },
  // highlightTools → 工具集高亮（设计/视频/3D 软件）
  highlightTools: [
    "t-ps", "t-affinity", "t-canva", "t-webflow",
    "t-pr", "t-ae", "t-davinci",
    "t-blender", "t-zbrush", "t-nomad", "t-shapr3d",
  ],
  /* ★ 工具集的**内容**五份简历一律相同（本人要求），只有高亮不同 ——
     这里曾经用 hideTools 挡掉整个 AI 组。会用什么工具是客观事实，不该按投递方向增删；
     「这一份想强调什么」由上面的 highlightTools 表达就够了。
     机制本身留着（data-loader 仍支持 hideTools / onlyTools），将来真要分化改一行即可。 */
  // emphasizeItems → 工作条目重点色
  emphasizeItems: ["work-portfolio", "work-design", "work-freelance"],
  // 本变体显示 projects（moreWorks 整块已 hide）→ 两个个人产品项目要逐条挡
  // prj-versewiki 放出来：它是本人做的网站产品，属于设计作品，要出现在「作品示例」里。
  // prj-vp 仍挡着（没有可点链接，进不了作品示例，留着只会在别处冒出来）。
  hideItems: ["email-freelance", "github", "prj-vp"],
  order: {},
};
