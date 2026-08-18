/* ============================================================
   base.js — 核心数据（四语，所有变体共享）

   编辑说明：
   - 每个多语字段是 { zh, ja, en, de }，只改引号里的值，别动结构。
   - 技术专名（Unreal Engine, Blueprint, OSC…）不翻译。
   - visibility: "public" 总显示 / "private" 默认隐藏（本人模式或点击显示）
   - protected: true → 明文不进 DOM，点击才解码（防采集）
   - skill.core: true → 显示在侧边栏（带点数）；所有 skill 无论 core 与否都进「工具集」
   - skill.group → 字符串 key（render.js 负责翻译组名）
   - project.link → 有值 = 进作品集；不写 = 只在项目经历。
     project.linkKind 决定作品集里的徽标："video" ▶视频 / "store" ↗商店 / "web" ↗网站（缺省 web）
     旧字段 project.video 仍然管用，等价于 link + linkKind:"video"
   - moreWorks → 次要作品，仅在特定变体（如 ue5-tech）显示
   - contact.id → 变体用 hide:["id"] 控制显示哪个邮箱
   ============================================================ */
window.RESUME_BASE = {
  meta: {
    langs: ["zh", "ja", "en", "de"],
    defaultLang: "en",
    langLabels: { zh: "中", ja: "日", en: "EN", de: "DE" },
    updated: "2026-06",
    /* 变体白名单的唯一真相。新增变体在这里加一行，works.html 就自动认得它。
       唯一的例外是 index.html 顶部那份内联白名单：它要在 body 渲染前同步判定，
       跑在 data/base.js 加载之前，读不到这里 → 必须手工同步（README「新变体登记」有清单）。 */
    variants: ["ue5-tech", "art-vr", "designer", "china-biz"],
  },

  /* —— 个人情报 ————————————————————————————————— */
  profile: {
    name: {
      zh: "欧阳世鹏",
      ja: "欧陽 世鵬（オーヤン・シュポン）",
      en: "Shipeng Ouyang",
      de: "Shipeng Ouyang",
    },
    title: {
      zh: "媒体艺术开发者 · UE5 / VR / 互动装置",
      ja: "メディアアーツ・デベロッパー · UE5 / VR / インタラクティブ・インスタレーション",
      en: "Media Arts Developer · UE5 / VR / Interactive Installation",
      de: "Medienkunst-Entwickler · UE5 / VR / Interaktive Installation",
    },
    photo: "assets/photo/FotoCV-2026.jpg",
    photoAlt: { zh: "照片", ja: "顔写真", en: "Portrait", de: "Porträt" },
    fields: [
      { key: "location",
        label: { zh: "所在地", ja: "所在地", en: "Location", de: "Standort" },
        value: { zh: "德国 科隆", ja: "ドイツ・ケルン", en: "Cologne, Germany", de: "Köln, Deutschland" },
        visibility: "public" },
      { key: "status",
        label: { zh: "状态", ja: "ステータス", en: "Status", de: "Status" },
        value: { zh: "自由职业 · 可远程", ja: "フリーランス · リモート可", en: "Freelance · Remote-friendly", de: "Freiberuflich · Remote möglich" },
        visibility: "public" },
    ],
  },

  /* —— 自我介绍（变体可覆盖）—————————————————— */
  intro: {
    zh: "科隆媒体艺术学院（KHM）媒体艺术系毕业，湖北工业大学产品设计学士。以虚幻引擎为核心工具，开发实时交互系统、VR/MR 体验与数字艺术装置——在艺术感知与技术精准之间工作。现驻科隆，承接德国本地与远程项目。",
    ja: "ケルン・メディア芸術大学（KHM）メディアアーツ卒業、湖北工業大学プロダクトデザイン学士。Unreal Engine を軸にリアルタイムインタラクティブシステム、VR/MR 体験、デジタルアートインスタレーションを開発。ケルン在住、ドイツ国内およびリモートでフリーランス活動中。",
    en: "Media Arts graduate of KHM Cologne and Product Design alumnus of Hubei University of Technology. I develop real-time interactive systems, VR/MR experiences and digital art installations using Unreal Engine — at the intersection of artistic sensibility and technical precision. Based in Cologne, available for projects across Germany and remote.",
    de: "Diplom-Absolvent der Kunsthochschule für Medien Köln (KHM) und Bachelor in Produktdesign (Hubei University of Technology). Ich entwickle Echtzeit-Interaktionssysteme, VR/MR-Erlebnisse und digitale Kunstinstallationen mit Unreal Engine — an der Schnittstelle von künstlerischer Sensibilität und technischer Präzision. Ansässig in Köln, freiberuflich in Deutschland und remote.",
  },

  /* ============================================================
     技能系统 = 两个独立结构（清晰好编辑）：

     1) capabilities —— 核心能力（侧边栏）。宏观能力描述，四语，带熟练度。
        变体用 sidebar:["cap-xxx", ...] 挑选并按数组顺序显示；不写则用 defaultSidebar。

     2) tools —— 工具集（主区）。具体软件名（不翻译），按 group 分组。
        变体用 highlightTools:["t-xxx", ...] 指定高亮，高亮项在组内自动排到最前。

     capability 的可选字段 since —— 经验年限，自动算，永不用手工更新：
       写法：since: "2024-03"（也接受 "2024-03-15"，精确到日则当月未到该日不计满月）。
       显示规则：页面每次渲染都拿「当前日期」跟 since 算整月差 →
         不足 1 个月（即起始月当月）**什么都不显示** —— 「0 个月」读不通，宁可先空着；
         不足 12 个月按月显示（1 Monat / 2 Monate…），满 12 个月起向下取整到整年、
         不显示零头（14 个月 → 1 年）。所以数字一年只跳一次，也永远不会夸大。
       写到「日」时按日历钳位：since="2024-01-31" 在只有 30 天的月份里，30 号那天就算满月。
       不写 since 的能力照旧，只是不显示年限；写错格式只会 console.warn，不影响渲染
         （日期得真实存在：2 月 31 日、平年 2 月 29 日都算写错）。
       另需变体设 skillDisplay: "since" 或 "both" 才会真的显示出来
         （默认 "level" = 只打 5 点熟练度，与加此字段前完全一致）。

     加新能力 = 往 capabilities 加一项 + 在需要的变体 sidebar 里引用。
     加新软件 = 往 tools 加一项（group 对应分组）+ 在相关变体 highlightTools 里引用。
   ============================================================ */
  defaultSidebar: ["cap-ue5", "cap-vr", "cap-isys", "cap-3d", "cap-techart"],
  capabilities: [
    /* cap-unreal = 虚幻 / 蓝图 / 着色器 三合一（ue5-tech 用）。下面 cap-ue5 / cap-bp /
       cap-shader 三条**暂不删**：01 号 ue5-tech 的侧边栏还在引用，删了它那三行会静默消失。
       art-vr 的侧边栏还在引用 cap-ue5 / cap-shader，所以这三条留着；cap-bp 目前无人引用。 */
    { id: "cap-unreal",  level: 5, since: "2022-01", name: { zh: "虚幻 / 蓝图 / 着色器", ja: "Unreal / Blueprint / シェーダー", en: "Unreal / Blueprint / Shader", de: "Unreal / Blueprint / Shader" } },
    { id: "cap-ue5",     level: 5, since: "2022-01", name: { zh: "虚幻引擎 5", ja: "Unreal Engine 5", en: "Unreal Engine 5", de: "Unreal Engine 5" } },
    { id: "cap-bp",      level: 5, since: "2022-01", name: { zh: "蓝图开发", ja: "Blueprint 開発", en: "Blueprint Development", de: "Blueprint-Entwicklung" } },
    { id: "cap-vr",      level: 5, since: "2022-01", name: { zh: "VR / MR 开发", ja: "VR / MR 開発", en: "VR / MR Development", de: "VR / MR Entwicklung" } },
    { id: "cap-isys",    level: 5, name: { zh: "实时交互系统", ja: "リアルタイム・インタラクション", en: "Interactive Systems", de: "Interaktive Systeme" } },
    { id: "cap-techart", level: 5, since: "2025-08", name: { zh: "技术美术", ja: "テクニカルアート", en: "Technical Art", de: "Technical Art" } },
    { id: "cap-shader",  level: 5, since: "2022-01", name: { zh: "着色器 / 材质", ja: "シェーダー / マテリアル", en: "Shader & Material", de: "Shader & Material" } },
    { id: "cap-3d",      level: 5, since: "2013-09", name: { zh: "3D / 动画 / 渲染", ja: "3D / アニメーション / レンダリング", en: "3D / Animation / Rendering", de: "3D / Animation / Rendering" } },
    { id: "cap-sensor",  level: 5, since: "2023-01", name: { zh: "传感器 / 硬件交互", ja: "センサー / ハードウェア", en: "Sensors / Hardware", de: "Sensoren / Hardware" } },
    { id: "cap-coding",  level: 4, name: { zh: "编程 / 技术开发", ja: "プログラミング / 技術開発", en: "Coding & Technical Development", de: "Programmierung & technische Entwicklung" } },
    { id: "cap-webgfx",  level: 5, name: { zh: "网页 / 平面设计", ja: "Web / グラフィックデザイン", en: "Web & Graphic Design", de: "Web- & Grafikdesign" } },
    { id: "cap-gfx",     level: 5, name: { zh: "图形 / 图像编辑", ja: "グラフィック / 画像編集", en: "Graphic & Image Editing", de: "Grafik- & Bildbearbeitung" } },
    { id: "cap-artdes",  level: 5, since: "2013-09", name: { zh: "美术与设计", ja: "アート & デザイン", en: "Art & Design", de: "Kunst & Design" } },
    { id: "cap-webdes",  level: 5, since: "2017-01", name: { zh: "网页设计", ja: "Web デザイン", en: "Web Design", de: "Webdesign" } },
    { id: "cap-proddes", level: 4, name: { zh: "产品设计", ja: "プロダクトデザイン", en: "Product Design", de: "Produktdesign" } },
    /* —— AI 能力（ue5-tech 变体用；年限由 since 实时算出，见文件头说明）——
       ★ cap-genai 的 since 是世鹏本人给的，本机只找得到 2026-08 起的生成式痕迹
       （ComfyUI 模型库 8 个文件全是 2026-08-13、产出图 9 张、保存的工作流 0 个）。
       侧边栏年限是本变体最大的卖点（「年限可核验，点数是自封的」）→ 发出去前请确认
       2024-08 以来拿得出实际产出，拿不出就把这个月份往后调。 */
    { id: "cap-genai",   level: 4, since: "2024-08", name: { zh: "视觉生成 AI 管线", ja: "ビジュアル生成AIパイプライン", en: "Visual Generative AI Pipeline", de: "Visuelle Generative-KI-Pipeline" } },
    { id: "cap-aiops",   level: 4, since: "2026-02", name: { zh: "本地 AI", ja: "ローカルAI", en: "Local AI", de: "Lokale KI" } },
    /* —— 商务 / 项目 / 跨文化能力（china-biz 变体用；该变体 hideSkillLevels:true 不显示点数）—— */
    { id: "cap-lang",    level: 5, name: { zh: "多语沟通（中 / 德 / 英）", ja: "多言語コミュニケーション（中／独／英）", en: "Multilingual Communication (CN / DE / EN)", de: "Mehrsprachige Kommunikation (CN / DE / EN)" } },
    { id: "cap-xcult",   level: 5, name: { zh: "跨文化沟通（中德）", ja: "異文化コミュニケーション（中独）", en: "Cross-cultural Communication (CN–DE)", de: "Interkulturelle Kommunikation (CN–DE)" } },
    { id: "cap-client",  level: 4, name: { zh: "客户沟通", ja: "クライアント対応", en: "Client Communication", de: "Kundenkommunikation" } },
    { id: "cap-req",     level: 4, name: { zh: "需求梳理与澄清", ja: "要件のヒアリングと整理", en: "Requirement Analysis", de: "Anforderungsanalyse" } },
    { id: "cap-research",level: 4, name: { zh: "产品与市场调研", ja: "製品・市場リサーチ", en: "Product & Market Research", de: "Produkt- & Marktrecherche" } },
    { id: "cap-coord",   level: 4, name: { zh: "项目协调", ja: "プロジェクト調整", en: "Project Coordination", de: "Projektkoordination" } },
    { id: "cap-techprod",level: 4, name: { zh: "技术与产品理解", ja: "技術・製品の理解", en: "Technical Product Understanding", de: "Technisches Produktverständnis" } },
    { id: "cap-viscom",  level: 5, name: { zh: "视觉与呈现沟通", ja: "ビジュアル・コミュニケーション", en: "Visual Communication", de: "Visuelle Kommunikation" } },
  ],

  tools: [
    // engine
    { id: "t-ue5",        name: "Unreal Engine 5",         group: "engine" },
    { id: "t-bp",         name: "Blueprint",               group: "engine" },
    { id: "t-metaxr",     name: "MetaXR / Meta Quest SDK", group: "engine" },
    { id: "t-widgetbp",   name: "Widget Blueprint (UMG)",  group: "engine" },
    { id: "t-animbp",     name: "Animation Blueprint",     group: "engine" },
    { id: "t-controlrig", name: "Control Rig",             group: "engine" },
    { id: "t-metasound",  name: "MetaSound",               group: "engine" },
    { id: "t-metahuman",  name: "MetaHuman",               group: "engine" },
    { id: "t-levelseq",   name: "Level Sequences",         group: "engine" },
    { id: "t-unity",      name: "Unity",                   group: "engine" },
    { id: "t-godot",      name: "Godot",                   group: "engine" },
    /* ai —— 清单已由世鹏逐条裁定（2026-08-18）：Flux 不列（本机只有 VAE、无主模型）；
       Stable Diffusion / SDXL、InstantID、LivePortrait 不列（全盘搜索零命中）；
       ControlNet 保留 —— 他本人确认用过，本机无痕不等于没用过。
       ⚠️ 注意 base.js 是一整份静态文件发给每个访客：hideTools / onlyTools 只挡渲染、不挡下发。
       这里写的每一条，push 之后对所有访客都明文可见 —— 「先写上、发布前再删」行不通。
       本组只在 ue5-tech 显示：designer 用 hideTools 挡掉，art-vr 隐藏整个工具集，
       china-biz 走 onlyTools 白名单。增删条目时这三处要同步。 */
    { id: "t-claudecode", name: "Claude Code",             group: "ai" },
    { id: "t-codex",      name: "Codex",                   group: "ai" },
    { id: "t-comfyui",    name: "ComfyUI",                 group: "ai" },
    { id: "t-controlnet", name: "ControlNet",              group: "ai" },
    { id: "t-triposplat", name: "TripoSplat",              group: "ai" },
    { id: "t-birefnet",   name: "BiRefNet",                group: "ai" },
    { id: "t-llamacpp",   name: "llama.cpp",               group: "ai" },
    // interactive
    { id: "t-osc",        name: "OSC Protocol",            group: "interactive" },
    { id: "t-arduino",    name: "Arduino IDE",             group: "interactive" },
    { id: "t-esp32",      name: "ESP32",                   group: "interactive" },
    { id: "t-opencv",     name: "OpenCV",                  group: "interactive" },
    // MediaPipe 是追踪 / 姿态推理库，不是生成式模型 —— 放在「AI & 生成式」组里会被面试官
    // 当成生成式经验来问。实际用处是 LiveTracker 的实时动捕 → 归 interactive。
    { id: "t-mediapipe",  name: "MediaPipe",               group: "interactive" },
    // techArt
    { id: "t-shader",     name: "Shader & Material",       group: "techArt" },
    { id: "t-light",      name: "Lighting & Post",         group: "techArt" },
    { id: "t-niagara",    name: "Niagara",                 group: "techArt" },
    { id: "t-env",        name: "Environment & Terrain",   group: "techArt" },
    { id: "t-vp",         name: "Virtual Production",       group: "techArt" },
    { id: "t-opt",        name: "Optimization",            group: "techArt" },
    // 3d
    { id: "t-blender",    name: "Blender",                 group: "3d" },
    { id: "t-zbrush",     name: "ZBrush",                  group: "3d" },
    { id: "t-maya",       name: "Maya",                    group: "3d" },
    { id: "t-3dsmax",     name: "3DS Max",                 group: "3d" },
    { id: "t-substance",  name: "Substance Painter",       group: "3d" },
    { id: "t-md",         name: "Marvelous Designer",      group: "3d" },
    { id: "t-rizom",      name: "RizomUV",                 group: "3d" },
    { id: "t-rokoko",     name: "Rokoko",                  group: "3d" },
    { id: "t-nomad",      name: "Nomad Sculpt",            group: "3d" },
    { id: "t-shapr3d",    name: "Shapr3D",                 group: "3d" },
    // code
    { id: "t-cpp",        name: "C++",                     group: "code" },
    { id: "t-csharp",     name: "C#",                      group: "code" },
    { id: "t-py",         name: "Python",                  group: "code" },
    { id: "t-html",       name: "HTML / CSS",              group: "code" },
    { id: "t-vs",         name: "Visual Studio",           group: "code" },
    // design
    { id: "t-ps",         name: "Photoshop",               group: "design" },
    { id: "t-affinity",   name: "Affinity Suite",          group: "design" },
    { id: "t-canva",      name: "Canva",                   group: "design" },
    { id: "t-webflow",    name: "Webflow",                 group: "design" },
    // video
    { id: "t-pr",         name: "Premiere Pro",            group: "video" },
    { id: "t-ae",         name: "After Effects",           group: "video" },
    { id: "t-aseprite",   name: "Aseprite",                group: "video" },
    { id: "t-procreate",  name: "Procreate",               group: "video" },
    { id: "t-davinci",    name: "DaVinci Resolve",         group: "video" },
  ],

  /* —— 项目经历（video 有值 → 进作品集）————————— */
  projects: [
    {
      id: "prj-room",
      period: "2022 – 2026",
      role: {
        zh: "虚幻引擎开发 / 交互系统设计",
        ja: "Unreal Engine 開発 / インタラクティブシステム設計",
        en: "UE5 Developer · Interactive System Design",
        de: "UE5-Entwickler · Interaktives System-Design",
      },
      org: {
        zh: "千声之室",
        ja: "千の声の部屋",
        en: "The Room of a Thousand Voices",
        de: "The Room of a Thousand Voices",
      },
      context: {
        zh: "KHM — 科隆媒体艺术学院",
        ja: "KHM — ケルン・メディア芸術大学",
        en: "KHM – Academy of Media Arts Cologne",
        de: "KHM – Kunsthochschule für Medien Köln",
      },
      type: {
        zh: "混合现实艺术装置",
        ja: "MR アートインスタレーション",
        en: "Mixed-Reality Art Installation",
        de: "Mixed-Reality Kunstinstallation",
      },
      summary: {
        zh: "用户在虚拟房间中穿行，通过实时传感器与现实物体的反馈相连，在物理在场、数字记忆与沉浸叙事之间构建混合空间。",
        ja: "ユーザーはバーチャルな部屋を探索し、物理オブジェクトからのリアルタイムセンサーフィードバックと接続。身体的存在・デジタル記憶・没入型ストーリーテリングの間に混合空間を生成する。",
        en: "Users explore a virtual room connected to real-time sensor feedback from physical objects, creating a hybrid space between physical presence, digital memory and immersive storytelling.",
        de: "Benutzer erkunden einen virtuellen Raum, der über Echtzeit-Sensorfeedback mit physischen Objekten verbunden ist — ein Hybridraum zwischen körperlicher Präsenz, digitalem Gedächtnis und immersivem Storytelling.",
      },
      tags: ["UE5", "MR", "VR", "Sensors"],
      video: "https://vimeo.com/user169301773", // TODO: 替换为该作品的具体 Vimeo 链接
    },
    {
      id: "prj-grau",
      period: "2023 – 2026",
      role: {
        zh: "UE5 开发 / VR 重建 / 数字人管线",
        ja: "UE5 開発 / VR 再構築 / デジタルヒューマン",
        en: "UE5 Developer · VR Reconstruction · Digital Human Pipeline",
        de: "UE5-Entwickler · VR-Rekonstruktion · Digital Human Pipeline",
      },
      org: {
        zh: "我的灰发",
        ja: "私の白髪を愛することを学ぶ",
        en: "Wie ich lerne, meine grauen Haare zu umarmen",
        de: "Wie ich lerne, meine grauen Haare zu umarmen",
      },
      context: {
        zh: "养老院数字化项目",
        ja: "ケアホーム デジタル化プロジェクト",
        en: "Care home digitalization project",
        de: "Digitalisierungsprojekt im Pflegeheim",
      },
      type: {
        zh: "VR 档案 / 数字人 / 交互纪录片",
        ja: "VR アーカイブ / デジタルヒューマン / インタラクティブ記録映像",
        en: "VR Archive · Digital Human · Interactive Documentary",
        de: "VR-Archiv · Digital Human · Interaktiver Dokumentarfilm",
      },
      summary: {
        zh: "通过面部扫描与访谈研究，将养老院老人的形象、记忆与故事重建为可交互探索的数字档案，结合数字人、VR 空间与社会关怀。",
        ja: "顔スキャンとインタビューを通じて、ケアホームの高齢者の姿・記憶・人生の物語をデジタルアーカイブとして再構築。デジタルヒューマン、VR 空間、社会的ケアを統合した作品。",
        en: "Elderly care home residents digitized through facial scanning and reconstructed in virtual space. Interviews and research create interactive life archives — combining digital human, VR space and social care.",
        de: "Pflegeheim-Bewohner wurden per Gesichtsscan digitalisiert und im virtuellen Raum rekonstruiert. Interviews und Recherche ergeben interaktive Lebensarchive — Digital Human, VR und soziale Fürsorge verbunden.",
      },
      tags: ["UE5", "VR", "Digital Human", "3D Scan"],
      video: "https://vimeo.com/user169301773", // TODO: 替换为具体视频链接
    },
    {
      /* 周期 / 角色 / 技术内容均经世鹏本人确认（2026-08-18）。合作者姓名按他的意思不写。 */
      id: "prj-vp",
      period: "2026",
      role: {
        zh: "工作坊讲师（代课）",
        ja: "ワークショップ講師（代講）",
        en: "Workshop Instructor (substitute)",
        de: "Workshop-Leitung (Vertretung)",
      },
      org: {
        zh: "虚拟制片 Workshop",
        ja: "バーチャルプロダクション・ワークショップ",
        en: "Virtual Production Workshop",
        de: "Virtual-Production-Workshop",
      },
      context: {
        zh: "KHM — 科隆媒体艺术学院",
        ja: "KHM — ケルン・メディア芸術大学",
        en: "KHM – Academy of Media Arts Cologne",
        de: "KHM – Kunsthochschule für Medien Köln",
      },
      type: {
        zh: "教学工作坊 · 实时合成 / 相机追踪",
        ja: "教育ワークショップ · リアルタイム合成 / カメラトラッキング",
        en: "Teaching Workshop · Real-time Compositing & Camera Tracking",
        de: "Lehr-Workshop · Echtzeit-Compositing & Kameratracking",
      },
      summary: {
        zh: "在 KHM 代课主持虚拟制片工作坊：搭建整套实时合成管线并带学员实操 —— Unreal Engine 5.5 配合 Composure 做现场合成，接入 LiveLink 实时相机追踪，并打通与外部工具之间的 USD 资产交换；演示场景使用自有 3D 资产。",
        ja: "KHM で代講としてバーチャルプロダクションのワークショップを担当：リアルタイム合成パイプラインを構築し、受講者と実践 —— Unreal Engine 5.5 と Composure による現場合成、LiveLink によるリアルタイム・カメラトラッキング、外部ツールとの USD アセット連携までを通した。デモシーンには自作の 3D アセットを使用。",
        en: "Taught the virtual production workshop at KHM as substitute instructor: built the full real-time compositing pipeline and ran it hands-on with the participants — on-set compositing with Unreal Engine 5.5 and Composure, live camera tracking via LiveLink, and a working USD asset exchange with external tools. Demo scene built from my own 3D assets.",
        de: "Leitung des Virtual-Production-Workshops an der KHM in Vertretung: Aufbau der kompletten Echtzeit-Compositing-Pipeline und praktische Durchführung mit den Teilnehmenden — On-Set-Compositing mit Unreal Engine 5.5 und Composure, Live-Kameratracking über LiveLink sowie ein funktionierender USD-Assetaustausch mit externen Werkzeugen. Demo-Szene aus eigenen 3D-Assets.",
      },
      tags: ["UE5", "Blackmagic", "Seemo", "Lightcraft"],
    },
    {
      id: "prj-versewiki",
      period: "2026",
      role: {
        zh: "网页全栈开发",
        ja: "Web のフルスタック開発",
        en: "Full-Stack Web Development",
        de: "Full-Stack-Webentwicklung",
      },
      org: "Verse Wiki",
      type: {
        zh: "UE Verse 中文互动课程站",
        ja: "UE Verse 中国語インタラクティブ講座サイト",
        en: "Interactive UE Verse Course Site (Chinese)",
        de: "Interaktive UE-Verse-Kursseite (Chinesisch)",
      },
      summary: {
        zh: "面向已有 Unreal Engine 蓝图经验的作者：把 Branch、ForEach、Set、Event Dispatcher 这些既有蓝图概念，逐条映射到 Verse 的语法与规则。9 章 30 节主课，每节配一个「蓝图对照」区块，另有术语对照表与速查卡；全站中英双语。",
        ja: "Unreal Engine のブループリント経験者に向けて、Branch / ForEach / Set / Event Dispatcher といった既存の概念を Verse の構文とルールへ一つずつ対応づける。全 9 章 30 レッスン、各レッスンに「ブループリント対照」セクションを置き、用語対照表とチートシートを併設。サイト全体が中英バイリンガル。",
        en: "Written for authors who already know Unreal Engine Blueprints: maps familiar concepts — Branch, ForEach, Set, Event Dispatcher — one by one onto Verse syntax and rules. 30 lessons across 9 chapters, each with a Blueprint-comparison block, plus a terminology table and quick-reference cards. Fully bilingual (Chinese / English).",
        de: "Für Unreal-Engine-Nutzer mit Blueprint-Erfahrung: bekannte Konzepte wie Branch, ForEach, Set und Event Dispatcher werden einzeln auf Verse-Syntax und -Regeln abgebildet. 30 Lektionen in 9 Kapiteln, jede mit einem Blueprint-Vergleichsblock, dazu Begriffstabelle und Kurzreferenzkarten. Durchgehend zweisprachig (Chinesisch / Englisch).",
      },
      tags: ["UE Verse", "Cloudflare", "Supabase", "Stripe"],
      link: "https://verse-wiki.pages.dev",
      linkKind: "web",
    },
  ],

  /* —— 次要作品（仅在特定变体显示，如 ue5-tech）——
     数组顺序 = 显示顺序（moreWorks 没有 order 钩子），按年份从新到旧排。 */
  moreWorks: [
    /* —— 2026 软件 / AI 项目：与下面 KHM 时期作品同一密度，每条控制在一行 —— */
    { id: "mw-deskdrawer", year: "2026", title: "DeskDrawer",
      type: { zh: "Windows 桌面工具", ja: "Windows デスクトップツール", en: "Windows desktop utility", de: "Windows-Desktop-Tool" },
      tags: ["C#", ".NET", "WinForms"],   // 不写 Microsoft Store：作品集那条已是「↗ 商店」并直链，重复且会把这一行撑破
      // link/linkKind → 同时进「作品集」板块与 works.html（判定见 render.js 的 workLink）
      link: "https://apps.microsoft.com/detail/9N904WFPHZFZ", linkKind: "store" },
    { id: "mw-splessons", year: "2026", title: "SP_lessons",
      type: { zh: "课程报名系统", ja: "講座申込システム", en: "Course registration system", de: "Kursanmeldungssystem" },
      tags: ["Next.js", "Cloudflare Workers", "CI/CD"] },
    { id: "mw-livetracker", year: "2026", title: "LiveTracker",
      type: { zh: "实时动捕（原型）", ja: "リアルタイム動作追跡（試作）", en: "Motion capture (prototype)", de: "Motion Capture (Prototyp)" },
      tags: ["MediaPipe", "TypeScript", "Electron"] },
    { id: "mw-localai",  year: "2026", title: "localAI",
      type: { zh: "本地 AI 环境（自用）", ja: "ローカル AI 環境（自分用）", en: "Local AI runtime (personal)", de: "Lokale KI-Umgebung (privat)" },
      tags: ["llama.cpp", "Local Inference"] },
    { id: "mw-uenote",   year: "2026", title: "Spoy Wiki",
      type: { zh: "UE 笔记知识库", ja: "UE ノート知識ベース", en: "UE notes knowledge base", de: "UE-Notizen-Wissensbasis" },
      tags: ["MkDocs", "FastAPI", "Cloudflare"] },
    { id: "mw-naiken",   year: "2026", title: "NaikenScore",
      type: { zh: "房源评分工具", ja: "物件評価ツール", en: "Property scoring tool", de: "Wohnungs-Bewertungstool" },
      tags: ["Web", "Mobile-first", "CN / JP"] },
    { id: "mw-umzug",    year: "2026", title: "Umzug",
      type: { zh: "搬家流程站", ja: "引越し管理サイト", en: "Relocation planner", de: "Umzugsplaner" },
      tags: ["HTML", "Workflow"] },
    { id: "mw-profile",  year: "2026", title: "s-gjklr.work",
      type: { zh: "个人主页 / 作品集", ja: "個人サイト / ポートフォリオ", en: "Personal site / portfolio", de: "Persönliche Website / Portfolio" },
      tags: ["JavaScript", "Vercel"] },
    { id: "mw-testvideo", year: "2026", title: "test-video",
      type: { zh: "播放器测试", ja: "プレイヤーテスト", en: "Video player test", de: "Videoplayer-Test" },
      tags: ["Web", "Video"] },
    { id: "mw-mirror",   year: "2024", title: "Mirror",
      type: { zh: "互动装置", ja: "インタラクティブ・インスタレーション", en: "Interactive Installation", de: "Interaktive Installation" },
      tags: ["UE5", "ESP32", "OpenCV", "Webcam", "KHM"] },
    { id: "mw-surreal",  year: "2023", title: "Surreal-RPG",
      type: { zh: "VR 交互艺术", ja: "VR インタラクティブアート", en: "VR Interactive Art", de: "VR Interaktive Kunst" },
      tags: ["UE5", "VR", "MetaQuest", "Spatial Audio"] },
    { id: "mw-gochurch", year: "2023", title: "goChurch",
      type: { zh: "2D 像素游戏", ja: "2D ピクセルゲーム", en: "2D Pixel Game", de: "2D Pixel-Spiel" },
      tags: ["Unity", "C#", "Pixel Art", "Aseprite"] },
    { id: "mw-cogshift", year: "2023", title: "Cognitive Shifts",
      type: { zh: "KHM 研究 / 论文", ja: "KHM 研究論文", en: "KHM Research / Thesis", de: "KHM Forschung / Thesis" },
      tags: ["KHM", "Research"] },
    { id: "mw-sound",    year: "2022", title: "Installed Sound",
      type: { zh: "声音艺术 / 论文", ja: "サウンドアート / 論文", en: "Sound Art / Thesis", de: "Klangkunst / Thesis" },
      tags: ["KHM", "Sound Art"] },
    { id: "mw-campusvr", year: "2022", title: "Campus VR Film",
      type: { zh: "360° VR 影片", ja: "360° VR 映像", en: "360° VR Film", de: "360°-VR-Film" },
      tags: ["360°", "VR Film"] },
  ],

  /* —— 工作经历 ————————————————————————————————— */
  work: [
    {
      id: "work-freelance",
      period: "2025 – present",
      role: {
        zh: "自由职业媒体艺术开发者",
        ja: "フリーランス・メディアアーツ・デベロッパー",
        en: "Freelance Media Arts Developer",
        de: "Freiberuflicher Medienkunst-Entwickler",
      },
      org: {
        zh: "独立",
        ja: "独立",
        en: "Independent",
        de: "Selbstständig",
      },
      summary: {
        zh: "为艺术项目、制作团队与独立客户提供 Unreal Engine、实时 3D、VR/MR、交互系统、传感器集成、可视化及数字资产制作服务。服务范围涵盖德国本地与远程合作。",
        ja: "芸術プロジェクト、制作チーム、独立クライアント向けに Unreal Engine、リアルタイム 3D、VR/MR、インタラクティブシステム、センサー統合、ビジュアライゼーション、デジタルアセット制作を提供。ドイツ国内およびリモートで対応。",
        en: "UE5, real-time 3D, VR/MR, interactive systems, sensor integration, visualization and digital asset production — for art projects, media productions and independent clients across Germany and remote.",
        de: "UE5, Echtzeit-3D, VR/MR, interaktive Systeme, Sensor-Integration, Visualisierung und digitale Asset-Produktion für Kunstprojekte, Medienproduktionen und unabhängige Kunden — in Deutschland und remote.",
      },
      tags: ["UE5", "VR/MR", "Sensors", "Real-time 3D"],
    },
    {
      id: "work-portfolio",
      period: "2019 – 2020",
      role: {
        zh: "作品集辅导教师（远程）",
        ja: "ポートフォリオ指導教師（リモート）",
        en: "Portfolio Instructor (remote)",
        de: "Portfolio-Dozent (remote)",
      },
      org: {
        zh: "高凡留学 Godfery Education（杭州）",
        ja: "ゴッドフリー教育 Godfery Education（杭州）",
        en: "Godfery Education, Hangzhou",
        de: "Godfery Education, Hangzhou",
      },
      summary: {
        zh: "为艺术院校申请者提供作品集辅导：项目选择、视觉呈现、叙事结构与申请策略。",
        ja: "美術大学志望者向けポートフォリオ指導：プロジェクト選定、ビジュアル構成、作品ナラティブ、出願戦略。",
        en: "Portfolio coaching for art school applicants: project selection, visual presentation, narrative structure and application strategy.",
        de: "Portfolio-Coaching für Kunsthochschul-Bewerber: Projektauswahl, visuelle Präsentation, Narration und Bewerbungsstrategie.",
      },
      tags: ["Art Direction", "Coaching", "Portfolio"],
    },
    {
      id: "work-design",
      period: "2017 – 2018",
      role: {
        zh: "平面 / 网页设计师",
        ja: "グラフィック / Web デザイナー",
        en: "Graphic & Web Designer",
        de: "Grafik- & Webdesigner",
      },
      org: {
        zh: "换车网网络科技有限公司（武汉）",
        ja: "Huànchēwǎng Network Tech., Wuhan",
        en: "Huànchēwǎng Network Tech. Co., Ltd., Wuhan",
        de: "Huànchēwǎng Network Tech. Co., Ltd., Wuhan",
      },
      summary: {
        zh: "为二手车交易平台设计网页与广告视觉内容，涵盖界面视觉与平面物料制作。",
        ja: "中古車取引プラットフォーム向けにウェブと広告ビジュアルを制作。UI ビジュアルとグラフィックデザイン業務。",
        en: "Visual content for a used-car trading platform: web design, UI visuals and advertising graphics.",
        de: "Visuelle Inhalte für eine Gebrauchtwagenplattform: Webdesign, UI-Visuals und Werbegrafik.",
      },
      tags: ["Web Design", "Graphic Design", "UI", "3D"],
    },
  ],

  /* —— 语言能力 ————————————————————————————————— */
  languages: [
    { name: { zh: "中文普通话", ja: "中国語（普通話）", en: "Chinese (Mandarin)", de: "Chinesisch (Mandarin)" }, level: { zh: "母语", ja: "母語", en: "Native", de: "Muttersprache" }, cefr: "C2" },
    { name: { zh: "德语", ja: "ドイツ語", en: "German", de: "Deutsch" },             level: { zh: "B2", ja: "B2", en: "B2", de: "B2" }, cefr: "B2" },
    { name: { zh: "英语", ja: "英語", en: "English", de: "Englisch" },               level: { zh: "C1", ja: "C1", en: "C1", de: "C1" }, cefr: "C1" },
    { name: { zh: "日语", ja: "日本語", en: "Japanese", de: "Japanisch" },           level: { zh: "JLPT N3", ja: "JLPT N3", en: "JLPT N3 (approx. B2 spoken)", de: "JLPT N3 (ca. B2 gesprochen)" }, cefr: "B1-B2" },
  ],

  /* —— 教育经历 ————————————————————————————————— */
  education: [
    {
      id: "edu-khm",
      period: "2020 – 2025",
      school: {
        zh: "科隆媒体艺术学院（KHM）",
        ja: "ケルン・メディア芸術大学（KHM）",
        en: "Academy of Media Arts Cologne (KHM)",
        de: "Kunsthochschule für Medien Köln (KHM)",
      },
      degree: {
        zh: "媒体艺术 Diplom（本科＋硕士综合学位）",
        ja: "メディアアーツ Diplom（学士・修士統合課程）",
        en: "Diploma in Media Arts (integrated B.A. + M.A. equivalent)",
        de: "Diplom in Media Arts",
      },
      detail: {
        zh: "方向：媒体艺术、互动艺术、实时 3D、VR、游戏引擎、空间与记忆、数字艺术装置、动画、全景拍摄、3D 扫描、影视后期、建筑投影。",
        ja: "専門：メディアアート、インタラクティブアート、リアルタイム 3D、VR、ゲームエンジン、空間と記憶、デジタルアートインスタレーション、アニメーション、360°撮影、3Dスキャン、映像ポストプロダクション、建築プロジェクションマッピング。",
        en: "Focus: media art, interactive art, real-time 3D, VR, game engines, space & memory, digital art installations, animation, 360° photography, 3D scanning, film/video post-production, architectural projection mapping.",
        de: "Schwerpunkte: Medienkunst, Interaktive Kunst, Echtzeit-3D, VR, Game Engines, Raum & Erinnerung, digitale Kunstinstallationen, Animation, 360°-Fotografie, 3D-Scanning, Film-/Video-Postproduktion, Architekturprojektion.",
      },
    },
    {
      id: "edu-hbut",
      period: "2013 – 2017",
      school: {
        zh: "湖北工业大学",
        ja: "湖北工業大学",
        en: "Hubei University of Technology",
        de: "Hubei University of Technology",
      },
      degree: {
        zh: "产品设计 本科",
        ja: "プロダクトデザイン 学士",
        en: "B.A. Product Design",
        de: "B.A. Produktdesign",
      },
      detail: {
        zh: "方向：工业设计、产品设计、3D 造型、视觉设计、交互与设计基础、市场调研、项目管理。",
        ja: "専門：工業デザイン、プロダクトデザイン、3D モデリング、ビジュアルデザイン、インタラクションデザイン基礎、市場調査、プロジェクトマネジメント。",
        en: "Focus: industrial design, product design, 3D modelling, visual design, interaction design fundamentals, market research, project management.",
        de: "Schwerpunkte: Industriedesign, Produktdesign, 3D-Modellierung, Visuelles Design, Grundlagen Interaktionsdesign, Marktforschung, Projektmanagement.",
      },
    },
  ],

  /* —— 联系方式
     email-pro      → 职业求职邮箱（默认变体和职位变体用）
     email-freelance → 自由职业接单邮箱（art-vr 变体用）
     变体通过 hide:["email-pro"] 或 hide:["email-freelance"] 控制显示哪个。
     web → 部署后替换为实际域名 URL。
  ————————————————————————————————————————————— */
  contact: [
    { id: "email-pro",       type: "email",   label: "Email",     value: "shipengouyang@gmail.com",                 visibility: "private", protected: true },
    { id: "email-freelance", type: "email",   label: "Email",     value: "freeketchup@icloud.com",                  visibility: "private", protected: true },
    { id: "phone",           type: "phone",   label: "Tel",       value: "+49 176 64161464",                        visibility: "private", protected: true },
    // 链接默认顺序：Portfolio → LinkedIn → GitHub → Instagram
    { id: "web",             type: "website", label: "Portfolio", value: "https://s-gjklr.work/",                   visibility: "public" },
    { id: "linkedin",        type: "social",  label: "LinkedIn",  value: "https://linkedin.com/in/shipeng-ouyang/", visibility: "public" },
    // GitHub 仅 ue5-tech / art-vr 显示（designer / odd 通过 hideItems 隐藏）；ue5-tech 用 order.contact 提到链接最前
    { id: "github",          type: "social",  label: "GitHub",    value: "https://github.com/Gaojikuaileren",       visibility: "public" },
    { id: "instagram",       type: "social",  label: "Instagram", value: "https://instagram.com/s.gjklr/",          visibility: "public" },
  ],
};
