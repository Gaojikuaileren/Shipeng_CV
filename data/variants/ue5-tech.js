/* ============================================================
   ue5-tech.js — ① UE5 技术美术 ＋ 视觉生成式 AI（主要求职方向）

   沿革：本变体原为「UE5 开发者 · 技术美术 / 艺术装置 / VR / 游戏」。
        2026-08-18 由 ue5-ai（第 9 号试作）整体取代 —— 加上视觉生成式 AI 层、
        侧边栏改用自动计算的经验年限、项目经历换成四条、新增作品链接页。
        URL 保持不变（?v=ue5-tech · 控制台 /s01），此前发出去的链接全部继续有效。

   写作原则（务必保持）：
     · 只重新解释真实经历，不新增不存在的项目、客户、交付、年限。
     · 侧边栏用**经验年限**而不是 5 点熟练度（skillDisplay: "since"）——
       年限可核验，点数是自封的；两者并排会互相打架。
       年限由 base.js 各 capability 的 since 起始月实时算出，不用手工维护。
     · 纯求职（Festanstellung）身份：用职业邮箱，隐藏接单邮箱。

   ★ 内容已定稿（2026-08-18，逐条经世鹏确认）：侧边栏九条的排序与年限、AI 工具清单、
     虚拟制片 Workshop 整条、网页设计 9 年。
   ★ 2026-09-28 加入 FilmGen（逐条经世鹏确认）：intro 补上视频生成与影视预演、
     项目排序改为 FilmGen → 千声之室、高亮加 MRQ 与 MiniMax H3；
     为让 PDF 保持三页，另加了一组 itemOverrides 压缩（见文件下方）。
   ============================================================ */
window.RESUME_VARIANT = {
  id: "ue5-tech",

  headline: {
    zh: "UE5 开发者 · 技术美术 / 实时 3D / 视觉生成式 AI",
    ja: "UE5 デベロッパー · テクニカルアート / リアルタイム 3D / ビジュアル生成AI",
    en: "UE5 Developer · Technical Art / Real-time 3D / Visual Generative AI",
    de: "UE5-Entwickler · Technical Art / Echtzeit-3D / Visuelle generative KI",
  },

  intro: {
    zh: "KHM 媒体艺术 Diplom，专注 UE5 实时系统：Blueprint、C++ 插件、技术美术、VR/MR、传感器硬件集成（OSC/ESP32）与现场长稳运行。近年把视觉生成式 AI 接进创作管线 —— 自建 ComfyUI 多阶段工作流，覆盖图像、图生 3D 与视频生成，并在本机自行部署、量化与调度模型。在艺术装置、虚拟制片、影视预演与游戏开发之间工作。",
    ja: "KHM メディアアーツ Diplom。UE5 リアルタイムシステムに注力：Blueprint、C++ プラグイン、テクニカルアート、VR/MR、センサー統合（OSC/ESP32）、現場での長期安定稼働。近年はビジュアル生成AIを制作パイプラインへ統合 —— ComfyUI の多段ワークフローを自作し、画像・画像から3D・動画生成を扱い、モデルの導入・量子化・運用も自ら行う。アートインスタレーション、バーチャルプロダクション、映像プリビズ、ゲーム開発のあいだで働く。",
    en: "KHM Media Arts Diploma. Focused on UE5 real-time systems: Blueprint, C++ plugins, technical art, VR/MR, sensor hardware integration (OSC/ESP32) and rock-solid on-site uptime. In recent years I have brought visual generative AI into my production pipeline — building multi-stage ComfyUI workflows across image, image-to-3D and video, and deploying, quantizing and scheduling models on my own machine. I work across art installation, virtual production, film previs and game development.",
    de: "KHM Diplom in Media Arts. Fokus auf UE5-Echtzeitsysteme: Blueprint, C++-Plugins, Technical Art, VR/MR, Sensorintegration (OSC/ESP32) und stabiler Vor-Ort-Betrieb. In den letzten Jahren habe ich visuelle generative KI in meine Produktionspipeline geholt — eigene mehrstufige ComfyUI-Workflows für Bild, Image-to-3D und Video sowie Aufbau, Quantisierung und Steuerung lokaler Modelle. Ich arbeite zwischen Kunstinstallation, Virtual Production, Film-Previs und Spieleentwicklung.",
  },

  greeting: null,

  /* —— 纯求职：状态行写清「可正式雇佣」，但不否认现在的自由职业身份 —— */
  profileFields: [
    { key: "location",
      label: { zh: "所在地", ja: "所在地", en: "Location", de: "Standort" },
      value: { zh: "德国 科隆", ja: "ドイツ・ケルン", en: "Cologne, Germany", de: "Köln, Deutschland" },
      visibility: "public" },
    { key: "status",
      label: { zh: "状态", ja: "ステータス", en: "Status", de: "Status" },
      // 侧边栏 dd 只有约 231px：en/de 的完整说法会折成两行。实测宽度后收到一行——
      // 德语保住 Festanstellung（HR 就扫这个词），Freelance 在德国招聘语境是通用词。
      value: { zh: "自由职业 · 可远程 · 可正式雇佣",
               ja: "フリーランス · リモート可 · 正規雇用可",
               en: "Freelance · Remote · Employment",
               de: "Freelance · Remote · Festanstellung" },
      visibility: "public" },
  ],

  sections: {
    order: ["intro", "projects", "portfolio", "toolset", "moreWorks", "work", "education"],
    hide: [],
    emphasize: ["projects", "portfolio"],
  },

  /* —— 侧边栏：年限替代点数 ————————————————————————————
     顺序 = 说服力顺序，不是年限降序：主身份(UE5) → 新方向(视觉生成式 AI) →
     最长背书(3D / 美术与设计) → UE5 的具体功夫(蓝图 / 着色器 / VR) → 网页设计 →
     短年限的两条 → 硬件。
     「实时交互系统」(cap-isys) 已挤出：与 VR/MR、传感器硬件语义重叠，删了不丢信息。
     ★ 排序与年限已由世鹏定稿（2026-08-18）。右边的年限是当下的值，由 since 实时算出，
       会随时间自己长大 —— 注释只作参考，不是需要手工维护的数字。 */
  skillDisplay: "since",
  sidebar: [
    "cap-unreal",  // 4 年   ← 原 cap-ue5 / cap-bp / cap-shader 三条合并
    "cap-genai",   // 2 年   ★
    "cap-techart", // 1 年
    "cap-webdes",  // 8 年
    "cap-aiops",   // 6 个月 ★
    "cap-artdes",  // 12 年
    "cap-3d",      // 12 年
    "cap-vr",      // 4 年
    "cap-sensor",  // 3 年
  ],

  /* —— 工具集：沿用 01 号的高亮（AI 组只在本变体出现，整组不再另行高亮）——— */
  highlightTools: [
    "t-ue5", "t-bp", "t-metaxr", "t-widgetbp", "t-animbp", "t-controlrig", "t-metasound", "t-metahuman", "t-levelseq", "t-mrq",
    "t-osc", "t-arduino", "t-esp32",
    "t-shader", "t-light", "t-niagara", "t-env", "t-vp", "t-opt",
    "t-blender", "t-rokoko", "t-cpp", "t-vs",
    // AI：Claude Code 与 ComfyUI 与上面这批同级高亮（描边）
    "t-claudecode", "t-comfyui", "t-minimaxh3",
  ],

  /* —— PDF 作品集的共用 QR → works.html（本变体独有）————————————————
     纸上点不了链接，而本变体的作品里已经有商店 / 网站这类非视频地址，一个指向 Vimeo
     的 QR 覆盖不了。开了这个开关，QR 改指向同目录的 works.html?v=<变体>&lang=…，
     那一页按本变体的可见条目列出每件作品的可点链接（手机友好）。
     01 号 ue5-tech 等老变体不开 → 它们的 PDF 与从前逐字节一致。 */
  worksPage: true,

  /* —— PDF 版式：工作经历 + 教育改走「全宽流」——————————————————————
     这两块在屏幕上仍在右栏（双栏不变）；只有导出 PDF 时脱离 34%/1fr 栅格，
     按整页宽度（184mm 而非 113mm）重排。
     原因：Chrome 分页时不丢 Grid 轨道 —— 侧栏内容在第 2 页就结束了，第 3 页却仍然
     保留那条空的 34% 轨道，实测整条左列（70mm × 269mm）通栏留白，
     三页空白合计约等于白扔一整张 A4 的正文面积。机制见 render.js 的 printFullWidth 段。 */
  printFullWidth: ["work", "education"],

  // 五条项目全部标重点（左侧绿竖线）；DeskDrawer 已降级到 moreWorks，改标 mw-deskdrawer
  emphasizeItems: ["prj-filmgen", "prj-room", "prj-grau", "prj-vp", "prj-versewiki", "mw-deskdrawer"],
  hideItems: ["email-freelance", "email-biz"], // 求职版只留求职邮箱；接单/对外邮箱都挡掉
  /* order.projects：折叠状态下网页只显示前两条（render.js 的 PRJ_COLLAPSED = 2），
     所以谁排前两位＝谁是这份简历的门面。2026-09-28 起选「FilmGen」（UE 预演 ＋ 生成式 AI，
     正对标题的新方向）与「千声之室」（实时交互装置 ＋ 现场长稳运行）；「虚拟制片」与 FilmGen
     同属影视管线，退到第三，避免门面两条讲同一件事。_order 的语义是「列出的排前面、其余保持
     原序」—— 虚拟制片要显式写上才排得到第三，否则会落到「我的灰发」后面。 */
  /* —— PDF 保三页的压缩（2026-09-28，本人确认）——————————————————————
     FilmGen 加进来之后 ja/en/de 的 PDF 溢出到第 4 页，而第 4 页只剩几行工具清单 ＋ 页脚。
     项目块在打印时不许跨页拆开，所以只省几行没用 —— 得让「虚拟制片」整块挤回第 1 页，
     后面才会整体上移。下面四处都只作用于本变体、只删细节不改事实：
       · 虚拟制片 / Verse Wiki：概述压到约 3 行（二者现在排在 FilmGen 与千声之室之后）；
       · 两段教育：「方向」只留与 UE / 实时 3D 相关的几项；
       · 两份早年非技术工作：去掉标签行。
     base.js 里的完整文字不动（别的变体与将来要展开时还在）。改这里之前先跑 snapshot 看页数。 */
  itemOverrides: {
    "prj-vp": { summary: {
      zh: "在 KHM 代课主持虚拟制片工作坊：搭建整套实时合成管线并带学员实操 —— Unreal Engine 5.5 配合 Composure 现场合成、LiveLink 实时相机追踪、与外部工具的 USD 资产交换。",
      ja: "KHM で代講としてバーチャルプロダクションのワークショップを担当：リアルタイム合成パイプラインを構築し受講者と実践 —— Unreal Engine 5.5 と Composure による現場合成、LiveLink のカメラトラッキング、外部ツールとの USD アセット連携。",
      en: "Taught KHM's virtual production workshop as substitute instructor: built the full real-time compositing pipeline and ran it hands-on — Unreal Engine 5.5 with Composure, live camera tracking via LiveLink, USD asset exchange with external tools.",
      de: "Virtual-Production-Workshop an der KHM in Vertretung geleitet: komplette Echtzeit-Compositing-Pipeline aufgebaut und praktisch durchgeführt — Unreal Engine 5.5 mit Composure, Live-Kameratracking über LiveLink, USD-Assetaustausch mit externen Werkzeugen." } },
    "prj-versewiki": { summary: {
      zh: "面向有蓝图经验的 Unreal Engine 作者，把 Branch、ForEach、Set、Event Dispatcher 等蓝图概念逐条映射到 Verse 语法；9 章 30 节，每节配「蓝图对照」，全站中英双语。",
      ja: "Unreal Engine のブループリント経験者向けに、Branch / ForEach / Set / Event Dispatcher などの概念を Verse の構文へ一つずつ対応づける。全 9 章 30 レッスン、各レッスンに「ブループリント対照」、中英バイリンガル。",
      en: "For Unreal Engine authors who know Blueprints: maps Branch, ForEach, Set, Event Dispatcher and more onto Verse syntax, one by one. 30 lessons in 9 chapters, each with a Blueprint comparison; fully bilingual (CN / EN).",
      de: "Für Unreal-Engine-Nutzer mit Blueprint-Erfahrung: Branch, ForEach, Set, Event Dispatcher u. a. einzeln auf Verse-Syntax abgebildet. 30 Lektionen in 9 Kapiteln, jeweils mit Blueprint-Vergleich; durchgehend zweisprachig (CN / EN)." } },
    "edu-khm": { detail: {
      zh: "方向：实时 3D、VR、游戏引擎、互动艺术、数字艺术装置、3D 扫描、建筑投影。",
      ja: "専門：リアルタイム 3D、VR、ゲームエンジン、インタラクティブアート、デジタルアートインスタレーション、3Dスキャン、建築プロジェクションマッピング。",
      en: "Focus: real-time 3D, VR, game engines, interactive art, digital installations, 3D scanning, projection mapping.",
      de: "Schwerpunkte: Echtzeit-3D, VR, Game Engines, Interaktive Kunst, digitale Installationen, 3D-Scanning, Architekturprojektion." } },
    "edu-hbut": { detail: {
      zh: "方向：工业设计、产品设计、3D 造型、交互设计基础。",
      ja: "専門：工業デザイン、プロダクトデザイン、3D モデリング、インタラクションデザイン基礎。",
      en: "Focus: industrial design, product design, 3D modelling, interaction design fundamentals.",
      de: "Schwerpunkte: Industriedesign, Produktdesign, 3D-Modellierung, Grundlagen Interaktionsdesign." } },
    "work-portfolio": { tags: [] },
    "work-design": { tags: [] },
  },

  order: {
    contact: ["email-pro", "phone", "github"],
    projects: ["prj-filmgen", "prj-room", "prj-vp"],
  },
};
