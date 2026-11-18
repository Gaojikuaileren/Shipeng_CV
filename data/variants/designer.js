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
    zh: "工业设计学士（湖北工业大学），KHM 媒体艺术 Diplom。横跨网页、平面、产品与交互设计，兼具工程实现能力。从用户研究到落地，注重系统性与视觉细节。近年以 AI 辅助设计：自建 ComfyUI 工作流，快速生成并迭代视觉效果参考，并把重复性工作自动化。",
    ja: "湖北工業大学プロダクトデザイン学士、KHM メディアアーツ Diplom。Web・グラフィック・プロダクト・インタラクションデザインを横断し、実装能力も兼ね備える。リサーチから実装まで、システム的思考とビジュアル細部にこだわる。近年は AI をデザインの補助として活用：ComfyUI のワークフローを自作し、ビジュアルの参考案を素早く生成・反復するほか、繰り返し作業を自動化している。",
    en: "B.A. Product Design (Hubei UT) and KHM Media Arts Diploma. Spans web, graphic, product and interaction design with hands-on implementation skills. From research to delivery — systematic thinking and attention to visual detail. In recent years I use AI as a design aid: self-built ComfyUI workflows to generate and iterate visual references quickly, and to automate repetitive work.",
    de: "B.A. Produktdesign (Hubei UT) und KHM Diplom in Media Arts. Übergreifend in Web-, Grafik-, Produkt- und Interaktionsdesign, mit praktischen Umsetzungskenntnissen. Von der Recherche bis zur Lieferung — systematisches Denken und visuelles Detail. In den letzten Jahren nutze ich KI als Entwurfshilfe: eigene ComfyUI-Workflows, um visuelle Referenzen schnell zu erzeugen und zu iterieren sowie wiederkehrende Arbeitsschritte zu automatisieren.",
  },
  greeting: null,
  sections: {
    order: ["intro", "work", "education", "portfolio", "moreWorks", "toolset"],
    hide: ["projects"], // 项目经历整块不展示：本变体讲设计履历，项目细节交给「作品示例」的链接
    emphasize: ["work", "education"],
  },

  // 条目排序（不是板块排序）：网页设计示例页排「作品示例」第一（项目板块本版隐藏，只影响作品示例的顺序）
  order: { projects: ["prj-websample"] },

  /* 自由职业那一条在本版讲网页设计（同一段经历换侧重；期间与单位仍来自 base.js）。
     只讲设计，不讲技术与实现（本人要求）。 */
  itemOverrides: {
    "work-freelance": {
      role: {
        zh: "自由职业网页设计师",
        ja: "フリーランス Web デザイナー",
        en: "Freelance Web Designer",
        de: "Freiberuflicher Webdesigner",
      },
      summary: {
        zh: "为餐饮门店设计网站：视觉风格、版式与动效。",
        ja: "飲食店向けの Web サイトをデザイン：ビジュアル、レイアウト、モーション。",
        en: "Websites for restaurants: visual style, layout and motion.",
        de: "Websites für Restaurants: Bildsprache, Layout und Animation.",
      },
      tags: ["Web Design", "Motion Design", "Art Direction"],
    },
  },
  /* sidebar → 侧边栏核心能力（设计相关，宏观能力描述）。
     cap-genai 放在设计三条之后：对设计岗它是差异化项，不是主身份。
     另有 cap-aiops（本地 AI 部署运行）没放进来 —— 那是工程侧的事，UE 版在讲。 */
  sidebar: ["cap-webgfx", "cap-gfx", "cap-proddes", "cap-genai", "cap-3d"],

  /* —— 页面底部通向 UE 开发版的按钮 ——————————————————————
     来看设计版的人里有一部分其实在找能写代码的设计师 —— 与其让他们猜，不如给一个入口。
     只在屏幕上出现；纸上点不了按钮，PDF 里整块隐藏（print.css）。 */
  /* PDF 里给一个能扫的作品入口：「作品示例」板块在本变体是显示的 —— 屏幕上是链接列表，
     纸上是一个共用二维码 ＋ 有序目录（render.js 的 renderPortfolio / portfolioPrint）。
     worksPage: true 让这个二维码指向 works.html（那一页把链接排成手机上点得中的大块）。 */
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
    // AI：出图 / 图生 3D 这几件与设计流程直接相关；Claude Code 同样高亮（本人指定）。
    // Codex / llama.cpp 仍在清单里（内容全站统一），只是不高亮。
    "t-comfyui", "t-controlnet", "t-triposplat", "t-claudecode",
  ],
  /* ★ 工具集的**内容**五份简历一律相同（本人要求），只有高亮不同 ——
     这里曾经用 hideTools 挡掉整个 AI 组。会用什么工具是客观事实，不该按投递方向增删；
     「这一份想强调什么」由上面的 highlightTools 表达就够了。
     机制本身留着（data-loader 仍支持 hideTools / onlyTools），将来真要分化改一行即可。 */
  // emphasizeItems → 工作条目重点色
  emphasizeItems: ["work-portfolio", "work-design", "work-freelance"],
  // 本变体隐藏 projects 板块（sections.hide），「更多作品」板块是显示的。但「作品示例」不看板块显隐，
  // 照样从 projects 里取带链接的条目（render.js 的 portfolioItems）→ 不想进作品示例的项目要在这里逐条挡。
  // prj-versewiki 放出来：它是本人做的网站产品，属于设计作品，要出现在「作品示例」里。
  // prj-vp 仍挡着（没有可点链接，进不了作品示例，留着只会在别处冒出来）。
  hideItems: ["email-freelance", "github", "prj-vp", "email-biz"],
};
