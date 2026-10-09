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
   - onlyIn: ["变体ID", …] → 这一条（项目 / 更多作品 / 工具 / 能力）只对列出的变体可见；
     不写 = 所有变体可见（现有条目都不写）。专为某一份简历加的内容用它，不要去别的变体里 hideItems：
     新变体默认看不见 onlyIn 条目，不会悄悄多出一条。机制见 data-loader.js 的 _visibleIn，check.js 第 ⑭ 项核对。
     ⚠️ onlyIn 只挡渲染、不挡下发：本文件整份发给每个访客，写进来的每个字都是公开的。
   - project.pages: [{ v: "<短链>", label }] ＋ pagesLabel → 条目下多一行「其他版本」链接（render.js 的 itemPages），
     PDF 里也是可点的链接。短链须已登记、不许指向兼职页 mn（check.js 第 ⑮ 项）。目前只有 prj-cvsite 用。
   ============================================================ */
window.RESUME_BASE = {
  meta: {
    langs: ["zh", "ja", "en", "de"],
    defaultLang: "en",
    langLabels: { zh: "中", ja: "日", en: "EN", de: "DE" },
    updated: "2026-09",
    /* 变体白名单。新增变体在这里加一行，works.html 就自动认得它。
       index.html 头部的裸入口判定不读这里，读的是 scripts/variants.js 的 ALIAS / PAGE
       （它在 body 渲染前同步执行，那时本文件还没加载）—— 两处都要登记，README「新变体登记」有清单。
       （2026-10-07 更正：此前这里写的「index.html 内联白名单」已不存在，头部脚本改调 VARIANTS.resolve 了。） */
    variants: ["ue5-tech", "art-vr", "designer", "china-biz", "ai-agent"],
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
    /* cap-unreal = 虚幻 / 蓝图 / 着色器 三合一，现在所有变体都用它。
       下面 cap-ue5 / cap-bp / cap-shader 三条已经没有变体引用（cap-ue5 只剩 defaultSidebar
       用于裸入口占位）—— 暂不删：它们是拆开叙述用的备件，删了以后想分开写要重建。 */
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
       cap-genai 的 since（2024-08）由世鹏本人确认（2026-09-28），不再是待核事项。 */
    { id: "cap-genai",   level: 4, since: "2024-08", name: { zh: "视觉生成 AI 管线", ja: "ビジュアル生成AIパイプライン", en: "Visual Generative AI Pipeline", de: "Visuelle Generative-KI-Pipeline" } },
    { id: "cap-aiops",   level: 4, since: "2026-02", name: { zh: "本地 AI", ja: "ローカルAI", en: "Local AI", de: "Lokale KI" } },
    /* —— AI Agent 能力（ai-agent 变体用，2026-10-07 加；起始月 2026-07 为本人确认）——
       cap-ue3d = 把 UE5 / 3D / 媒体背景压成侧栏一行，起始月沿用 cap-unreal 的 2022-01。 */
    { id: "cap-agent",   level: 4, since: "2026-07", onlyIn: ["ai-agent"], name: { zh: "LLM Agent / 工具调用 / 记忆 / MCP", ja: "LLM エージェント / ツール呼び出し / 記憶 / MCP", en: "LLM Agents / Tool Calling / Memory / MCP", de: "LLM-Agenten / Tool Calling / Gedächtnis / MCP" } },
    // cap-agentic：本人「用 Claude Code / Codex 并行开发」的公开说法（2026-10-09 从简介挪到侧栏）。
    // 证据：LilPainter 的并行会话派发与 Codex 项目技能、JobFinder 的 Claude Code 规则与命令、本仓库的多会话开发。
    { id: "cap-agentic", level: 4, since: "2026-07", onlyIn: ["ai-agent"], name: { zh: "Agentic Coding（Claude Code / Codex 多会话并行）", ja: "エージェンティック・コーディング（Claude Code / Codex 並行セッション）", en: "Agentic Coding (parallel Claude Code / Codex sessions)", de: "Agentic Coding (parallele Claude-Code-/Codex-Sitzungen)" } },
    { id: "cap-pyts",    level: 4, since: "2026-07", onlyIn: ["ai-agent"], name: { zh: "Python / TypeScript", ja: "Python / TypeScript", en: "Python / TypeScript", de: "Python / TypeScript" } },
    { id: "cap-orch",    level: 4, since: "2026-07", onlyIn: ["ai-agent"], name: { zh: "编排与质量验证", ja: "オーケストレーションと品質検証", en: "Orchestration & Quality Gates", de: "Orchestrierung & Qualitätsprüfung" } },
    { id: "cap-webbe",   level: 4, since: "2026-07", onlyIn: ["ai-agent"], name: { zh: "Web 后端 / 全栈", ja: "Web バックエンド / フルスタック", en: "Web Backend / Full-Stack", de: "Web-Backend / Full-Stack" } },
    { id: "cap-ue3d",    level: 5, since: "2022-01", onlyIn: ["ai-agent"], name: { zh: "UE5 / 3D / 媒体制作", ja: "UE5 / 3D / メディア制作", en: "UE5 / 3D / Media Production", de: "UE5 / 3D / Medienproduktion" } },
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
    { id: "t-mrq",        name: "Movie Render Queue",      group: "engine" },
    { id: "t-unity",      name: "Unity",                   group: "engine" },
    { id: "t-godot",      name: "Godot",                   group: "engine" },
    /* ai —— 清单已由世鹏逐条裁定（2026-08-18）：Flux 不列（本机只有 VAE、无主模型）；
       Stable Diffusion / SDXL、InstantID、LivePortrait 不列（全盘搜索零命中）；
       ControlNet 保留 —— 他本人确认用过，本机无痕不等于没用过。
       ⚠️ 注意 base.js 是一整份静态文件发给每个访客：hideTools / onlyTools 只挡渲染、不挡下发。
       这里写的每一条，push 之后对所有访客都明文可见 —— 「先写上、发布前再删」行不通。
       工具集内容现在全站统一（本人 2026-08-21 定的口径：会用什么工具是客观事实，
       不按投递方向增删）—— 没有变体再用 hideTools / onlyTools 挡它，机制本身留着备用。
       2026-09-28 随 FilmGen 加入视频生成四条（本人逐条确认用过）：MiniMax H3 / Wan VACE /
       Video Depth Anything 在交付管线里；Seedance 只在对照实验中用过 → 只进工具集，项目概述不提。 */
    { id: "t-claudecode", name: "Claude Code",             group: "ai" },
    { id: "t-codex",      name: "Codex",                   group: "ai" },
    { id: "t-comfyui",    name: "ComfyUI",                 group: "ai" },
    { id: "t-minimaxh3",  name: "MiniMax H3",              group: "ai" },
    { id: "t-wanvace",    name: "Wan VACE",                group: "ai" },
    { id: "t-seedance",   name: "Seedance",                group: "ai" },
    { id: "t-controlnet", name: "ControlNet",              group: "ai" },
    { id: "t-vda",        name: "Video Depth Anything",    group: "ai" },
    { id: "t-triposplat", name: "TripoSplat",              group: "ai" },
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
    { id: "t-ffmpeg",     name: "FFmpeg",                  group: "code" },
    // 以下六条只在 ai-agent 变体显示（本人 2026-10-07 定）。证据：TypeScript / Electron＝LiveTracker，
    // FastAPI＝Embobo 网关与 Spoy Wiki，Next.js / Cloudflare Workers＝SP_lessons，Supabase＝Verse Wiki。
    { id: "t-ts",         name: "TypeScript",              group: "code", onlyIn: ["ai-agent"] },
    { id: "t-fastapi",    name: "FastAPI",                 group: "code", onlyIn: ["ai-agent"] },
    { id: "t-nextjs",     name: "Next.js",                 group: "code", onlyIn: ["ai-agent"] },
    { id: "t-electron",   name: "Electron",                group: "code", onlyIn: ["ai-agent"] },
    { id: "t-cfworkers",  name: "Cloudflare Workers",      group: "code", onlyIn: ["ai-agent"] },
    { id: "t-supabase",   name: "Supabase",                group: "code", onlyIn: ["ai-agent"] },
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
      /* 背景 / 角色 / 技术内容 / 数字均经世鹏本人逐条确认（2026-09-28）。
         context 的措辞是本人定的，别改成别的说法。没有 link：暂不公开作品。 */
      id: "prj-filmgen",
      period: "2026",
      role: {
        zh: "管线架构 · 技术美术 · UE 预演",
        ja: "パイプライン設計 · テクニカルアート · UE プリビズ",
        en: "Pipeline Architecture · Technical Art · UE Previs",
        de: "Pipeline-Architektur · Technical Art · UE-Previs",
      },
      org: "FilmGen",
      context: {
        zh: "影视制作管线",
        ja: "映像制作パイプライン",
        en: "Film production pipeline",
        de: "Filmproduktions-Pipeline",
      },
      type: {
        zh: "UE5 白盒预演 → 本地 AI 视频生成",
        ja: "UE5 ブロックアウト・プリビズ → ローカル AI 動画生成",
        en: "UE5 Blockout Previs → Local AI Video Generation",
        de: "UE5-Blockout-Previs → lokale KI-Videogenerierung",
      },
      summary: {
        zh: "搭建本地部署的「UE5 白盒预演 → AI 视频生成」量产管线：Sequencer 设计机位与动作时序，ComfyUI 中按首帧与角色设定板生成镜头，布局与动作节奏跟随预演。主导设计模块化工作流与自定义节点，覆盖关键帧、角色一致性、姿态动作控制与多镜头长片生成。",
        ja: "ローカル環境に「UE5 ブロックアウト・プリビズ → AI 動画生成」の量産パイプラインを構築：Sequencer でカメラワークと動作タイミングを設計し、ComfyUI で先頭フレームとキャラクターシートからショットを生成、レイアウトと動作のリズムはプリビズに追従する。モジュール式ワークフローとカスタムノードの設計を主導し、キーフレーム、キャラクターの一貫性、ポーズによる動作制御、複数ショットの長尺生成までをカバー。",
        en: "Built a locally deployed production pipeline that turns UE5 blockout previs into AI video: camera and action timing designed in Sequencer, shots generated in ComfyUI from a first frame and character sheets, with layout and action rhythm following the previs. Led the design of modular workflows and custom nodes covering keyframes, character consistency, pose-driven motion control and multi-shot long-form generation.",
        de: "Lokal betriebene Produktionspipeline, die UE5-Blockout-Previs in KI-Video überführt: Kamera- und Bewegungs-Timing im Sequencer, Shots in ComfyUI aus Startframe und Character Sheets, Layout und Rhythmus folgen der Previs. Konzeption modularer Workflows und eigener Nodes für Keyframes, Figurenkonsistenz, posenbasierte Bewegungssteuerung und Langform aus mehreren Shots.",
      },
      // 本人定的四个标签（2026-09-28）。「白盒预演」「虚幻」要按语言换写法 → 用四语对象（render.js 支持）
      tags: [
        { zh: "白盒预演", ja: "ブロックアウト・プリビズ", en: "Blockout Previs", de: "Blockout-Previs" },
        "ComfyUI",
        "MiniMax H3",
        { zh: "虚幻", ja: "Unreal", en: "Unreal", de: "Unreal" },
      ],
    },
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
        de: "Benutzer erkunden einen virtuellen Raum, per Echtzeit-Sensorfeedback mit physischen Objekten verbunden — ein Hybridraum aus körperlicher Präsenz, digitalem Gedächtnis und immersivem Storytelling.",
      },
      tags: ["UE5", "MR", "VR", "Sensors"],
      video: "https://vimeo.com/showcase/11909785", // 千声之室 作品集
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
      video: "https://vimeo.com/showcase/12281904", // 我的灰发 作品集
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

    /* ———— 以下五条只对 ai-agent 变体开放（onlyIn）。2026-10-07 加，事实逐条来自各项目文档、经本人确认 ————
       · 没有部署 / 同步的项目一律不写链接，也不写「开源」「可访问」（本人：项目本身暂不公开）。
       · 「正在开发」只写在句末，和已交付的能力分开 —— 别把计划写成已实现。
       · DeskDrawer 已在「更多作品」里有一条（指产品官网）；这里的项目条目链接指 Microsoft Store，
         两条地址不同，check.js ⑧ 不撞车；ai-agent 里把「更多作品」那条挡掉，页面上只出现一次。 */
    {
      id: "prj-lilpainter",
      onlyIn: ["ai-agent"],
      period: "2026",
      role: { zh: "Agent 架构与开发", ja: "エージェント設計・開発", en: "Agent Architecture & Development", de: "Agenten-Architektur & Entwicklung" },
      org: "LilPainter",
      context: { zh: "个人项目", ja: "個人プロジェクト", en: "Personal project", de: "Eigenes Projekt" },
      type: { zh: "本地游戏美术资产制作 Agent", ja: "ローカルのゲームアセット制作エージェント", en: "Local Agent for Game Asset Production", de: "Lokaler Agent für Game-Asset-Produktion" },
      summary: {
        zh: "让游戏开发者用少量输入批量制作 3D 道具、像素动画、配乐与音效。本地视觉语言模型（Qwen 27B / 35B-A3B，GGUF 量化，llama.cpp）读取冻结的任务包与参考图，生成受控的操作计划，由脚本执行器驱动 Blender（Python）与 Aseprite（Lua）；版本与分支本地持久化。加载模型逐次请求许可、用完释放显存，执行全程浮窗可见、可随时停止，成果过技术核验与来源门禁才保存。正在开发：结构化规格、独立质量门禁与 MCP 接入。",
        ja: "ゲーム開発者向けに、少ない入力から 3D プロップ、ピクセルアニメ、BGM、効果音をまとめて制作。ローカルの視覚言語モデル（Qwen 27B / 35B-A3B、GGUF 量子化、llama.cpp）が凍結したタスクと参照画像を読んで制御された操作計画を立て、スクリプト実行器が Blender（Python）と Aseprite（Lua）で実行。バージョンとブランチはローカルに保存。モデルの読み込みは毎回許可制で終了後に VRAM を解放、実行中はオーバーレイからいつでも停止でき、成果は技術検証とソースゲートを通ってから保存。開発中：構造化仕様、独立した品質ゲート、MCP 連携。",
        en: "Batch-produces 3D props, pixel animations, music and sound effects for game developers from minimal input. A local vision-language model (Qwen 27B / 35B-A3B, GGUF-quantized, llama.cpp) reads a frozen task package and reference images and plans controlled operations that a script executor runs in Blender (Python) and Aseprite (Lua); versions and branches persist locally. Each model load needs explicit permission and frees VRAM afterwards, a live overlay can stop any run, and results are saved only after technical checks and a source gate. In development: structured specs, an independent quality gate, MCP integration.",
        de: "Erzeugt für Spieleentwickler aus wenigen Angaben 3D-Props, Pixel-Animationen, Musik und Soundeffekte im Batch. Ein lokales Vision-Language-Modell (Qwen 27B / 35B-A3B, GGUF-quantisiert, llama.cpp) liest Aufgabenpaket und Referenzbilder und plant kontrollierte Bedienschritte, die ein Skript-Executor in Blender (Python) und Aseprite (Lua) ausführt; Versionen und Branches lokal gespeichert. Modelle laden nur nach Freigabe und geben den VRAM danach frei, ein Overlay stoppt jeden Lauf; gespeichert wird erst nach technischer Prüfung und Quellen-Gate. In Entwicklung: strukturierte Spezifikationen, unabhängiges Quality Gate, MCP-Anbindung.",
      },
      tags: ["Local LLM", "Tool Use", "Blender", "llama.cpp"],
    },
    {
      id: "prj-jobfinder",
      onlyIn: ["ai-agent"],
      period: "2026",
      role: { zh: "Agent 工作流设计与开发", ja: "エージェントワークフロー設計・開発", en: "Agent Workflow Design & Development", de: "Agenten-Workflow & Entwicklung" },
      org: "JobFinder",
      context: { zh: "个人工具", ja: "個人用ツール", en: "Personal tool", de: "Eigenes Werkzeug" },
      type: { zh: "求职 Agent · Claude Code ＋ MCP 浏览器工具", ja: "求職エージェント · Claude Code ＋ MCP ブラウザツール", en: "Job-Search Agent · Claude Code + MCP Browser Tools", de: "Jobsuche-Agent · Claude Code + MCP-Browser-Tools" },
      summary: {
        zh: "把德国求职里重复的搜岗、筛选、写信和填表交给 Agent，最后一步留给人。Claude Code 按 17 条项目规则运行：经 Claude in Chrome（MCP）在招聘平台搜岗，按 YAML 里的关键词、权重与阈值打分，从信件库挑信填槽、选对应简历，为每家生成材料包与一键复制的表单字段。状态与记忆存于只追加的 JSONL，Python 自检带闸门黄金测试。不编经历、不碰验证码，最终提交由人点击。",
        ja: "ドイツでの求職の繰り返し作業（求人探し・選別・書類作成・フォーム入力）をエージェントに任せ、最後の一歩は人に残す。Claude Code が 17 条のプロジェクト規則で動き、Claude in Chrome（MCP）で求人サイトを検索、YAML のキーワード・重み・しきい値で採点し、書類ライブラリから選んで差し込み、対応する履歴書と、コピーするだけのフォーム項目付きの企業別パッケージを用意する。状態と記憶は追記専用の JSONL に保存、Python の自己検査がゲート自体をゴールデンテストで確認。経歴は作らず CAPTCHA には触れず、最終送信は人がクリック。",
        en: "Hands the repetitive parts of a job search in Germany — finding, screening, writing, form-filling — to an agent and leaves the last step to a human. Claude Code runs under 17 project rules: searches job platforms via Claude in Chrome (MCP), scores postings by YAML-defined keywords, weights and thresholds, fills a letter from a curated library, picks the matching CV and builds a per-company packet with copy-ready form fields. State and memory live in append-only JSONL; a Python self-check golden-tests its own gates. No invented experience, no CAPTCHA handling — a human clicks submit.",
        de: "Ein Agent übernimmt die wiederkehrenden Teile der Jobsuche in Deutschland — Suchen, Sichten, Anschreiben, Formulare; den letzten Schritt macht ein Mensch. Claude Code arbeitet nach 17 Projektregeln: Jobportale über Claude in Chrome (MCP), Scoring nach Keywords, Gewichten und Schwellen aus YAML, Anschreiben aus kuratierter Bibliothek, passende CV-Variante, je Firma ein Paket mit kopierfertigen Formularfeldern. Zustand und Gedächtnis in Append-only-JSONL, Python-Selbsttest mit Golden Tests für die eigenen Gates. Nichts erfunden, keine CAPTCHAs — abgeschickt wird von Menschenhand.",
      },
      tags: ["Claude Code", "MCP", "Python", "Human-in-the-Loop"],
    },
    {
      id: "prj-embobo",
      onlyIn: ["ai-agent"],
      period: "2026",
      role: { zh: "架构与全栈开发", ja: "アーキテクチャ・フルスタック開発", en: "Architecture & Full-Stack Development", de: "Architektur & Full-Stack-Entwicklung" },
      org: "Embobo",
      context: { zh: "个人项目", ja: "個人プロジェクト", en: "Personal project", de: "Eigenes Projekt" },
      type: { zh: "本地私人 AI 助手", ja: "ローカルのパーソナル AI アシスタント", en: "Local Personal AI Assistant", de: "Lokaler persönlicher KI-Assistent" },
      summary: {
        zh: "数据不出本机的私人 AI 助手。Python FastAPI 模型网关按需拉起 llama.cpp 服务、由显存仲裁决定装载；记忆库（PostgreSQL ＋ Qdrant）完成单机验收；局域网配对准入；统一客户端（WPF：对话、翻译）两台真机验收；六道 pre-commit 闸门守住接口契约。正在开发：桌面宠物、同声传译与日程。",
        ja: "データが手元の PC から出ないパーソナル AI アシスタント。Python の FastAPI ゲートウェイが VRAM アービターのもとで llama.cpp サーバーを必要時に起動。記憶ストア（PostgreSQL ＋ Qdrant）は単体検証済み、LAN 端末はペアリングと認可で接続、WPF の統合クライアント（チャット・翻訳）は実機 2 台で検収済み、6 段の pre-commit ゲートがインターフェース契約を守る。開発中：デスクトップコンパニオン、同時通訳、スケジュール管理。",
        en: "A private AI assistant whose data never leaves the machine. A Python FastAPI gateway starts llama.cpp servers on demand under a VRAM arbiter; a memory store (PostgreSQL + Qdrant) passed standalone acceptance; LAN devices are paired and admitted; the unified WPF client (chat, translation) was signed off on two real PCs; six pre-commit gates guard the interface contracts. In development: desktop companion, simultaneous interpretation, scheduling.",
        de: "Privater KI-Assistent, dessen Daten den Rechner nie verlassen. Ein FastAPI-Gateway (Python) startet llama.cpp-Server bei Bedarf, ein VRAM-Arbiter entscheidet über das Laden; ein Gedächtnisspeicher (PostgreSQL + Qdrant) hat die Einzelplatz-Abnahme bestanden; LAN-Geräte werden gekoppelt und zugelassen; der WPF-Client (Chat, Übersetzung) wurde auf zwei echten PCs abgenommen; sechs Pre-Commit-Gates sichern die Schnittstellenverträge. In Entwicklung: Desktop-Begleiter, Simultandolmetschen, Terminplanung.",
      },
      tags: ["FastAPI", "llama.cpp", "Qdrant", "WPF"],
    },
    {
      id: "prj-deskdrawer",
      onlyIn: ["ai-agent"],
      period: "2026",
      role: { zh: "产品开发与发布", ja: "製品開発・リリース", en: "Product Development & Release", de: "Produktentwicklung & Release" },
      org: "DeskDrawer",
      context: { zh: "自有产品", ja: "自作製品", en: "Own product", de: "Eigenes Produkt" },
      type: { zh: "Windows 桌面整理工具 · 已上架并产生营收", ja: "Windows デスクトップ整理ツール · 販売中・収益あり", en: "Windows Desktop Organizer · Shipping, Revenue-generating", de: "Windows-Desktop-Organizer · im Verkauf, mit Umsatz" },
      summary: {
        zh: "把桌面图标分组进透明收纳板，需要时把一块板变成真实文件夹。本地优先、一次性买断，无广告、无遥测、无订阅；在 Microsoft Store 销售，配完整文档站。",
        ja: "デスクトップのアイコンを透明なボードにまとめ、必要ならボードを本物のフォルダーに変える。ローカル優先・買い切りで、広告・テレメトリ・サブスクなし。Microsoft Store で販売し、ドキュメントサイトも整備。",
        en: "Groups desktop icons into transparent boards and can turn a board into a real folder. Local-first, one-time purchase, no ads, telemetry or subscription; sold on the Microsoft Store with a full documentation site.",
        de: "Sortiert Desktop-Symbole in transparente Ablagen und macht auf Wunsch einen echten Ordner daraus. Local-first, Einmalkauf, ohne Werbung, Telemetrie oder Abo; im Microsoft Store erhältlich, mit vollständiger Dokumentation.",
      },
      tags: ["C#", ".NET", "WinForms", "Microsoft Store"],
      link: "https://apps.microsoft.com/detail/9n904wfphzfz",
      linkKind: "store",
    },
    {
      /* 这个简历网站本身（本人 2026-10-07 要求写进 AI Agent 版，并把其他版本放出来当演示）。
         事实只取本仓库自己能证明的：README（零构建 / 零依赖 / PDF 导出 / 无 cookie 统计）、tools/check.js（15 项）、
         tools/snapshot.py（6 变体 × 4 语 DOM＋PDF ＋ 3 个作品页 × 4 语 DOM）。改了这些数字记得同步这里。
         pages = 「其他版本」链接行（render.js 的 itemPages）：只放面向职位的简历版本；
         兼职独立页（mn）与私人控制台 hub.html 不放（check.js ⑮ 挡 mn）。 */
      id: "prj-cvsite",
      onlyIn: ["ai-agent"],
      period: "2026",
      role: { zh: "设计与全栈开发", ja: "設計・フルスタック開発", en: "Design & Full-Stack Development", de: "Konzeption & Full-Stack" },
      org: "Shipeng_CV",
      context: { zh: "本简历网站", ja: "この履歴書サイト", en: "This CV site", de: "Diese CV-Website" },
      type: { zh: "多版本简历站 · 四语 · PDF 导出", ja: "多バージョン履歴書サイト · 4 言語 · PDF 出力", en: "Multi-version CV Site · 4 Languages · PDF Export", de: "CV-Website in mehreren Versionen · 4 Sprachen · PDF" },
      summary: {
        zh: "这份简历本身：零构建、零依赖的数据驱动静态站，一份数据按职位生成 6 个版本 × 4 种语言并导出矢量 A4 PDF；访问统计跑在 Cloudflare Worker 上、不用 cookie。用 Claude Code 开发，守卫脚本让每次改动可检验：check.js 核对 15 类数据错误，snapshot.py 比对 36 组 DOM 与 PDF 版面。",
        ja: "この履歴書そのもの。ビルド不要・依存ゼロのデータ駆動型静的サイトで、1 つのデータから職種別 6 バージョン × 4 言語とベクター A4 PDF を生成。アクセス統計は Cookie を使わない Cloudflare Worker。Claude Code で開発し、検査スクリプトで変更を検証可能に：check.js が 15 種類のデータミスを検出、snapshot.py が 36 グループの DOM と PDF レイアウトを比較。",
        en: "This CV itself: a data-driven static site with no build step or dependencies — one dataset renders six job-targeted versions in four languages and exports vector A4 PDFs; visitor stats run on a cookie-free Cloudflare Worker. Built with Claude Code; guard scripts make every change checkable — check.js catches 15 classes of data errors, snapshot.py compares DOM and PDF layout across 36 groups.",
        de: "Dieser Lebenslauf selbst: datengetriebene statische Website ohne Build und Abhängigkeiten — ein Datensatz ergibt sechs stellenspezifische Versionen in vier Sprachen samt Vektor-PDF; Statistik über einen Cloudflare Worker ohne Cookies. Mit Claude Code entwickelt und durch Prüfskripte abgesichert: check.js erkennt 15 Fehlerklassen, snapshot.py vergleicht DOM und PDF-Layout über 36 Gruppen.",
      },
      pagesLabel: { zh: "其他版本", ja: "ほかのバージョン", en: "Other versions", de: "Weitere Versionen" },
      pages: [
        { v: "ue", label: { zh: "UE5 技术美术", ja: "UE5 テクニカルアート", en: "UE5 Tech Art", de: "UE5 Tech Art" } },
        { v: "fl", label: { zh: "自由职业", ja: "フリーランス", en: "Freelance", de: "Freiberuflich" } },
        { v: "ds", label: { zh: "设计", ja: "デザイン", en: "Design", de: "Design" } },
        { v: "cd", label: { zh: "中德商务", ja: "中独ビジネス", en: "China–Germany", de: "China–Deutschland" } },
      ],
      tags: ["JavaScript", "Cloudflare Workers", "Python", "i18n"],
    },
  ],

  /* —— 次要作品（仅在特定变体显示，如 ue5-tech）——
     数组顺序 = 显示顺序（moreWorks 没有 order 钩子），按年份从新到旧排。 */
  moreWorks: [
    /* —— 2026 软件 / AI 项目：与下面 KHM 时期作品同一密度，每条控制在一行 —— */
    { id: "mw-deskdrawer", year: "2026", title: "DeskDrawer",
      type: { zh: "Windows 桌面工具", ja: "Windows デスクトップツール", en: "Windows desktop utility", de: "Windows-Desktop-Tool" },
      tags: ["C#", ".NET", "WinForms"],
      // link/linkKind → 同时进「作品示例」板块与 works.html（判定见 render.js 的 workLink）
      // 指自己的产品页而不是 Microsoft Store：自己的页面能讲清楚产品是什么、截图与说明都在，
      // 商店页只是一个下载入口。纸上要照着敲的地址也短得多（本站是 24 字符，商店 46）。
      link: "https://deskdrawer.pages.dev/", linkKind: "web" },
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
      tags: ["UE5", "ESP32", "OpenCV", "Webcam"] },  // KHM 去掉：同期的 KHM 作品都没写，且已超 4 个上限
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
        zh: "为艺术项目、制作团队与独立客户提供 Unreal Engine、实时 3D、VR/MR、交互系统、传感器集成、可视化、AI 视频生成管线及数字资产制作服务。服务范围涵盖德国本地与远程合作。",
        ja: "芸術プロジェクト、制作チーム、独立クライアント向けに Unreal Engine、リアルタイム 3D、VR/MR、インタラクティブシステム、センサー統合、ビジュアライゼーション、AI 動画生成パイプライン、デジタルアセット制作を提供。ドイツ国内およびリモートで対応。",
        en: "UE5, real-time 3D, VR/MR, interactive systems, sensor integration, visualization, AI video generation pipelines and digital asset production — for art projects, media productions and independent clients across Germany and remote.",
        de: "UE5, Echtzeit-3D, VR/MR, interaktive Systeme, Sensor-Integration, Visualisierung, KI-Videogenerierungs-Pipelines und digitale Asset-Produktion für Kunstprojekte, Medienproduktionen und unabhängige Kunden — in Deutschland und remote.",
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
  /* ⚠️ languages[].cefr 全站没有任何代码读它（渲染用的是 level）。
     留着是因为它记录了比 level 更细的口径（中文 level 写「母语」，cefr 才是 C2），
     但改它不会让页面发生任何变化 —— 要改显示请改 level。 */
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
     email-freelance → 旧的自由职业接单邮箱，目前**没有任何变体在用**（art-vr 改用了 email-biz）。
                       暂不删：四个变体的 hideItems 里都还列着它，且地址本身仍然有效。
     变体通过 hide:["email-pro"] 或 hide:["email-freelance"] 控制显示哪个。
     web → 部署后替换为实际域名 URL。
  ————————————————————————————————————————————— */
  contact: [
    { id: "email-pro",       type: "email",   label: "Email",     value: "shipengouyang@gmail.com",                 visibility: "private", protected: true },
    { id: "email-freelance", type: "email",   label: "Email",     value: "freeketchup@icloud.com",                  visibility: "private", protected: true },
    /* 对外接单用的正式邮箱。**只有 art-vr（?v=fl）显示它**，其余变体都在各自的
       hideItems 里挡掉了 —— 改这一行的 value 只影响自由职业那份。
       2026-08-24 从 contact@s-gjklr.work 换成 iCloud 地址：自有域名那个的 MX 一直没配，
       寄来的信会退回，而退信的人不会再试第二次；换 iCloud 是为了立刻能收信，不用等 DNS。
       前缀用 contact.gjklr，不用下面 email-freelance 那个玩笑词 —— 发给付费客户不掉价。 */
    { id: "email-biz",       type: "email",   label: "Email",     value: "contact.gjklr@icloud.com",                visibility: "private", protected: true },
    { id: "phone",           type: "phone",   label: "Tel",       value: "+49 176 64161464",                        visibility: "private", protected: true },
    // 链接默认顺序：Portfolio → LinkedIn → GitHub → Instagram
    { id: "web",             type: "website", label: "Portfolio", value: "https://s-gjklr.work/",                   visibility: "public" },
    { id: "linkedin",        type: "social",  label: "LinkedIn",  value: "https://linkedin.com/in/shipeng-ouyang/", visibility: "public" },
    // GitHub 仅 ue5-tech / art-vr 显示（designer / odd 通过 hideItems 隐藏）；ue5-tech 用 order.contact 提到链接最前
    { id: "github",          type: "social",  label: "GitHub",    value: "https://github.com/Gaojikuaileren",       visibility: "public" },
    { id: "instagram",       type: "social",  label: "Instagram", value: "https://instagram.com/s.gjklr/",          visibility: "public" },
  ],
};
