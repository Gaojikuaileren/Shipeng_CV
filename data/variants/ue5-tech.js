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
    zh: "KHM 媒体艺术 Diplom，专注 UE5 实时系统：Blueprint、C++ 插件、技术美术、VR/MR、传感器硬件集成（OSC/ESP32）与现场长稳运行。近年把视觉生成式 AI 接进创作管线 —— 自建 ComfyUI 多阶段工作流，覆盖图像与图生 3D 方向，并在本机自行部署、运行与调度本地模型。在艺术装置、虚拟制片与游戏开发之间工作。",
    ja: "KHM メディアアーツ Diplom。UE5 リアルタイムシステムに注力：Blueprint、C++ プラグイン、テクニカルアート、VR/MR、センサー統合（OSC/ESP32）、現場での長期安定稼働。近年はビジュアル生成AIを制作パイプラインへ統合 —— ComfyUI の多段ワークフローを自作し、画像と画像から3Dを扱い、ローカルモデルの構築・運用も自ら行う。アートインスタレーション、バーチャルプロダクション、ゲーム開発のあいだで働く。",
    en: "KHM Media Arts Diploma. Focused on UE5 real-time systems: Blueprint, C++ plugins, technical art, VR/MR, sensor hardware integration (OSC/ESP32) and rock-solid on-site uptime. In recent years I have brought visual generative AI into my production pipeline — building multi-stage ComfyUI workflows across image and image-to-3D, and deploying, running and scheduling local models on my own machine. I work across art installation, virtual production and game development.",
    de: "KHM Diplom in Media Arts. Fokus auf UE5-Echtzeitsysteme: Blueprint, C++-Plugins, Technical Art, VR/MR, Sensor-Hardware-Integration (OSC/ESP32) und stabiler Vor-Ort-Betrieb. In den letzten Jahren habe ich visuelle generative KI in meine Produktionspipeline geholt — eigene mehrstufige ComfyUI-Workflows für Bild und Image-to-3D sowie Aufbau, Betrieb und Steuerung lokaler Modelle auf der eigenen Workstation. Ich arbeite zwischen Kunstinstallation, Virtual Production und Spieleentwicklung.",
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
    "t-ue5", "t-bp", "t-metaxr", "t-widgetbp", "t-animbp", "t-controlrig", "t-metasound", "t-metahuman", "t-levelseq",
    "t-osc", "t-arduino", "t-esp32",
    "t-shader", "t-light", "t-niagara", "t-env", "t-vp", "t-opt",
    "t-blender", "t-rokoko", "t-cpp", "t-vs",
    // AI：Claude Code 与 ComfyUI 与上面这批同级高亮（描边）
    "t-claudecode", "t-comfyui",
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

  // 四条项目全部标重点（左侧绿竖线）；DeskDrawer 已降级到 moreWorks，改标 mw-deskdrawer
  emphasizeItems: ["prj-room", "prj-grau", "prj-vp", "prj-versewiki", "mw-deskdrawer"],
  hideItems: ["email-freelance"],
  order: { contact: ["email-pro", "phone", "github"] },
};
