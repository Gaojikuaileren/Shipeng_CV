/* ============================================================
   ai-agent.js — ⑥ AI Agent 开发者（?v=ag）：投德国 Agent / Agentic AI 类岗位
   2026-10-07 新建。

   定位（本人定）：「做创意和媒体工具的 AI Agent 开发者」。主讲真实做过的 Agent 系统，
   UE5 / 3D / 媒体背景压成简介里的一句和侧栏一行，作为别人没有的加分项。
   不主攻大企业的纯后端 Agent 岗位。德国这类岗位的常见标题是 AI Engineer (Agentic) /
   Agentic Software Engineer / AI Agent Architect，筛选看 LLM、Agent、Tool Calling、MCP、
   Python、TypeScript、编排、质量验证、Human-in-the-Loop、本地推理 —— 头衔与侧栏按这些词写。

   写作原则（与 ue5-tech 相同，务必保持）：
     · 只重新解释真实经历，不新增不存在的项目、客户、交付、年限。
     · 项目事实逐条来自各项目自己的文档（SCOPE / STATE / README），经本人确认。
       还在开发的能力只写进句末的「正在开发」，不写成已实现。
     · 新项目、新能力、新工具写在 base.js 里，并标 onlyIn: ["ai-agent"] ——
       只有本变体看得见，其余变体的输出一字不变（不用去它们的文件里 hideItems）。
     · 没部署 / 同步的项目不写链接（本人：项目本身暂不公开）。
     · 侧栏用经验年限（skillDisplay: "since"）；AI 相关四条的起始月 2026-07 由本人确认。
     · 求职版：只留求职邮箱，接单 / 对外邮箱都挡掉。
     · FilmGen 的背景措辞沿用 base.js，不在这里改写。
     · PDF 目标 ≤ 3 页（本人定）。为此做的取舍都在下面就地注明，本人 2026-10-08 确认全部保留；
       每一条仍可单独撤回。四语目前都只剩约 1 行余量 —— 改这个文件之后先跑 tools/snapshot.py 看页数。
   ============================================================ */
window.RESUME_VARIANT = {
  id: "ai-agent",

  /* en / de 直接用德国招聘里的英文岗位名（本人同意）—— 那边的 JD 标题本来就不翻译。 */
  headline: {
    zh: "AI Agent 开发者 · 本地模型 / 工具调用 / 创意与媒体工具",
    ja: "AI エージェント開発者 · ローカル LLM / ツール呼び出し / クリエイティブ・メディアツール",
    en: "AI Engineer (Agentic) · Local LLMs / Tool Calling / Creative & Media Tools",
    de: "AI Engineer (Agentic) · Lokale LLMs / Tool Calling / Kreativ- & Medienwerkzeuge",
  },

  /* 简介讲「我」（本人 2026-10-09 定稿：B 的开头 ＋ C 的内容）：站在创作工具两边 → 性格与做事方式 →
     产品设计与媒体艺术各教会我什么 → 带进 AI Agent（模型操作真实软件、人始终看得见管得住）→ 所在地与语言。
     技术细节交给下面的项目。原先写在简介里的两项按本人要求挪到侧栏：「记忆」并进 cap-agent，
     「Claude Code / Codex 多会话并行」成了 cap-agentic（Agentic Coding）。
     ⚠️ 与自由职业版（?v=fl）的简介刻意写得不同：本页的「其他版本」能直接点过去，两段雷同会像复制粘贴。 */
  intro: {
    zh: "我一直站在创作工具的两边：一边自己用 UE5 和 Blender 做作品，一边写工具，把重复的活交给程序。我好奇、动手快，也有点较真：一个想法会一路做到能用为止，再把它做稳。产品设计让我先想人怎么用，媒体艺术让我习惯在技术和表达之间来回切换；这两年我把这种习惯带进了 AI Agent——让模型去操作真实软件，同时让人始终看得见、管得住。现居科隆，用中、德、英、日四种语言工作。",
    ja: "私はずっと、クリエイティブツールの両側に立ってきました。UE5 や Blender で自分の作品をつくる一方で、繰り返しの作業をプログラムに任せるツールを書いています。好奇心が強く、手を動かすのが早く、少しこだわりも強い——アイデアは使えるところまでやり切り、それから安定させます。プロダクトデザインでは「人がどう使うか」から考えることを、メディアアートでは技術と表現を行き来することを身につけました。この 2 年ほどはその姿勢を AI エージェントに持ち込み、モデルに実際のソフトウェアを操作させながら、人がいつでも状況を見て制御できるようにしています。ケルン在住、中国語・ドイツ語・英語・日本語で仕事をしています。",
    en: "I've always worked on both sides of creative tools: making my own work in UE5 and Blender, and writing tools that hand the repetitive parts to software. I'm curious, quick to build and a bit of a stickler: an idea goes all the way to something usable, and then I make it solid. Product design taught me to think first about how people will use a thing; media art got me used to switching between technology and expression. Over the past two years I've carried that into AI agents — letting models operate real software while people can always see what's happening and stay in control. Based in Cologne, working in Chinese, German, English and Japanese.",
    de: "Ich arbeite seit jeher auf beiden Seiten kreativer Werkzeuge: Ich gestalte eigene Arbeiten in UE5 und Blender und schreibe Werkzeuge, die das Wiederkehrende an Software abgeben. Ich bin neugierig, setze schnell um und bin ziemlich gründlich: Eine Idee bringe ich bis zu etwas Brauchbarem — und mache es dann stabil. Das Produktdesign hat mich gelehrt, zuerst an die Nutzung zu denken, die Medienkunst, zwischen Technik und Ausdruck zu wechseln. In den letzten zwei Jahren habe ich das auf KI-Agenten übertragen: Modelle bedienen echte Software, und Menschen sehen jederzeit, was passiert, und behalten die Kontrolle. Ich lebe in Köln und arbeite auf Chinesisch, Deutsch, Englisch und Japanisch.",
  },

  greeting: null,

  /* 与 ue5-tech 同一口径：可正式雇佣，不否认现在的自由职业身份。dd 只有约 231px，四语都一行。 */
  profileFields: [
    { key: "location",
      label: { zh: "所在地", ja: "所在地", en: "Location", de: "Standort" },
      value: { zh: "德国 科隆", ja: "ドイツ・ケルン", en: "Cologne, Germany", de: "Köln, Deutschland" },
      visibility: "public" },
    { key: "status",
      label: { zh: "状态", ja: "ステータス", en: "Status", de: "Status" },
      value: { zh: "自由职业 · 可远程 · 可正式雇佣",
               ja: "フリーランス · リモート可 · 正規雇用可",
               en: "Freelance · Remote · Employment",
               de: "Freelance · Remote · Festanstellung" },
      visibility: "public" },
  ],

  /* 顺序：项目（主证据）→ 工具集（ATS 关键词）→ 工作 → 教育。为守 3 页而隐藏的板块（各自可撤回）：
       · portfolio「作品示例」：本变体只有 Verse Wiki 与 DeskDrawer 两条带链接，约 60mm 换来的信息太少；
       · moreWorks「更多作品」：SP_lessons / LiveTracker 等的技术栈已在工具集里；
       · collab「开发方式」：现在由侧栏 cap-agentic 一行代替（数据仍在下面 collab 里，从 hide 拿掉即可恢复）。 */
  sections: {
    order: ["intro", "projects", "collab", "toolset", "moreWorks", "work", "education"],
    hide: ["portfolio", "moreWorks", "collab"],
    emphasize: ["projects", "collab"],
  },

  sectionTitles: {
    collab: { zh: "开发方式", ja: "開発の進め方", en: "How I Build", de: "Arbeitsweise" },
  },

  /* —— 开发方式（本人同意公开写出 Claude Code / Codex 并行开发）——————————————
     证据：LilPainter 的 A–P 并行会话派发与 Codex 项目技能；JobFinder 的 17 条规则与自检；
     Embobo 的六道 pre-commit 闸门；本仓库自己的 tools/check.js 与 tools/snapshot.py。
     ⚠️ 两块都要有 note：collab 用 subgrid 让「标题 / 说明 / 列表」横向对齐，缺一块就错位。 */
  collab: [
    { id: "hb-parallel",
      title: { zh: "多会话并行开发", ja: "複数セッションの並行開発", en: "Parallel Agent Sessions", de: "Parallele Agenten-Sitzungen" },
      note: "Claude Code · Codex",
      items: [
        { zh: "多个会话同时推进，每个会话有明确的写入归属与交接文档",
          ja: "複数のセッションを同時に進め、各セッションに書き込み範囲と引き継ぎ文書を明確に割り当てる",
          en: "Several sessions in parallel, each with a clear write scope and handoff document",
          de: "Mehrere Sitzungen parallel, jede mit klarem Schreibbereich und Übergabedokument" },
        { zh: "项目规范文件（CLAUDE.md / AGENTS.md）和项目技能约束每个会话的做法",
          ja: "プロジェクト規約ファイル（CLAUDE.md / AGENTS.md）とプロジェクトスキルで各セッションの作法を統一",
          en: "Project rule files (CLAUDE.md / AGENTS.md) and project skills keep every session on the same conventions",
          de: "Projektregeln (CLAUDE.md / AGENTS.md) und Projekt-Skills halten alle Sitzungen auf denselben Konventionen" },
      ] },
    { id: "hb-verify",
      title: { zh: "先验证，再说完成", ja: "完了の前に検証", en: "Verify Before Done", de: "Erst prüfen, dann fertig" },
      note: { zh: "门禁与回归，让每次改动都有据可查", ja: "ゲートと回帰テストで、すべての変更を追跡可能に", en: "Gates and regression checks make every change traceable", de: "Gates und Regressionsprüfungen machen jede Änderung nachvollziehbar" },
      items: [
        { zh: "pre-commit 闸门、自检脚本与针对闸门本身的黄金测试",
          ja: "pre-commit ゲート、自己検査スクリプト、ゲート自体のゴールデンテスト",
          en: "Pre-commit gates, self-check scripts and golden tests for the gates themselves",
          de: "Pre-Commit-Gates, Selbsttest-Skripte und Golden Tests für die Gates selbst" },
        { zh: "输出快照回归：改动前后逐份比对 DOM 与 PDF 版面",
          ja: "出力スナップショット回帰：変更前後で DOM と PDF レイアウトを照合",
          en: "Output snapshot regression: DOM and PDF layout compared before and after each change",
          de: "Snapshot-Regression: DOM und PDF-Layout vor und nach jeder Änderung verglichen" },
      ] },
  ],

  /* —— 侧栏：本人给的顺序。cap-aiops（本地 AI，2026-02 起）沿用 ue5-tech 那一条，名称不改；
     其余五条是 onlyIn 只对本变体开放的新能力。年限由 since 实时算出。 */
  skillDisplay: "since",
  sidebar: ["cap-agent", "cap-agentic", "cap-pyts", "cap-aiops", "cap-orch", "cap-webbe", "cap-ue3d"],

  /* —— 工具集：内容与其余变体相同，另多出六条 onlyIn 工具（TypeScript / FastAPI / Next.js /
     Electron / Cloudflare Workers / Supabase）。高亮只挑本人真用过、与 Agent 岗位相关的。 */
  highlightTools: [
    "t-py", "t-ts", "t-claudecode", "t-codex", "t-llamacpp", "t-comfyui",
    "t-fastapi", "t-nextjs", "t-electron", "t-cfworkers", "t-supabase", "t-csharp",
  ],

  printFullWidth: ["work", "education"],
  /* 工具集只保留与 Agent 岗位相关的四组（引擎 / AI / 代码 / 交互），技术美术、3D、设计、影像四组不显示 ——
     PDF 守 3 页用（2026-10-07 实测：全量工具集四语都是 4 页）。这是「工具集全站统一」（2026-08-21）
     的一个例外，本人 2026-10-08 确认保留。用 hideTools 而不是 onlyTools 白名单：将来往前四组加新工具会自动出现，不会被白名单漏掉。 */
  hideTools: ["t-shader", "t-light", "t-niagara", "t-env", "t-vp", "t-opt", "t-blender", "t-zbrush", "t-maya", "t-3dsmax", "t-substance", "t-md", "t-rizom", "t-rokoko", "t-nomad", "t-shapr3d", "t-ps", "t-affinity", "t-canva", "t-webflow", "t-pr", "t-ae", "t-aseprite", "t-procreate", "t-davinci"],

  /* —— 同一段真实经历换讲法（事实字段仍来自 base.js）———————————————————— */
  itemOverrides: {
    /* PDF 守 3 页：教育只留学校与学位，不印「方向」行（detail: null）。 */
    // 自由职业一条在本变体里略写（同一段经历，只是少列两项服务），也是为守 3 页
    "work-freelance": { summary: {
      zh: "为艺术项目、制作团队与独立客户提供 Unreal Engine、实时 3D、VR/MR、交互系统、AI 视频生成管线与数字资产制作；德国本地与远程。",
      ja: "芸術プロジェクト、制作チーム、独立クライアント向けに Unreal Engine、リアルタイム 3D、VR/MR、インタラクティブシステム、AI 動画生成パイプライン、デジタルアセット制作を提供。ドイツ国内およびリモート。",
      en: "UE5, real-time 3D, VR/MR, interactive systems, AI video generation pipelines and digital assets — for art projects, media productions and independent clients, in Germany and remote.",
      de: "UE5, Echtzeit-3D, VR/MR, interaktive Systeme, KI-Videopipelines und digitale Assets für Kunstprojekte, Medienproduktionen und unabhängige Kunden — in Deutschland und remote." } },
    "edu-khm": { detail: null },
    "edu-hbut": { detail: null },
    // FilmGen 从「编排」角度讲。背景（context）沿用 base.js 的「影视制作管线」，不改。
    "prj-filmgen": {
      role: { zh: "多阶段生成管线编排", ja: "多段生成パイプラインのオーケストレーション", en: "Multi-stage Generation Pipeline Orchestration", de: "Orchestrierung einer mehrstufigen Generierungspipeline" },
      type: { zh: "ComfyUI 编排 · 自定义节点 · 本地部署", ja: "ComfyUI オーケストレーション · カスタムノード · ローカル", en: "ComfyUI Orchestration · Custom Nodes · Local Deployment", de: "ComfyUI-Orchestrierung · Custom Nodes · lokal betrieben" },
      summary: {
        zh: "把 UE5 预演导出的白盒、深度与姿态信号接进 ComfyUI 多阶段管线，串联视频生成、深度估计、姿态提取与人脸修复；自定义节点按参考图独立调权、显存不足自动降档重试；以原生工作流 JSON 经 API 批量提交，无人值守跑单变量对照实验定参数。全部本地部署。",
        ja: "UE5 プリビズのブロックアウト・深度・ポーズ信号を ComfyUI の多段パイプラインへ取り込み、動画生成・深度推定・ポーズ抽出・顔補正をつなぐ。カスタムノードで参照ごとに重みを調整し、VRAM 不足時は自動で段階を下げる。ネイティブのワークフロー JSON を API でバッチ投入し、無人で単一変数の比較実験を実行。すべてローカル。",
        en: "Feeds blockout, depth and pose signals from a UE5 previs into a multi-stage ComfyUI pipeline — video generation, depth estimation, pose extraction, face refinement; custom nodes weight each reference separately and step down automatically when VRAM runs out; native workflow JSON is batch-submitted via API for unattended single-variable experiments. Fully local.",
        de: "Führt Blockout-, Tiefen- und Posensignale einer UE5-Previs in eine mehrstufige ComfyUI-Pipeline — Videogenerierung, Tiefenschätzung, Posenerkennung, Gesichtskorrektur; eigene Nodes gewichten jede Referenz einzeln und stufen bei VRAM-Mangel automatisch herunter; native Workflow-JSONs gehen per API im Batch in unbeaufsichtigte Einzelvariablen-Tests. Vollständig lokal.",
      },
      tags: ["ComfyUI", "Python", "Orchestration", "MiniMax H3"],
    },
    // Verse Wiki 从「上线的产品」角度讲（本人同意）。
    "prj-versewiki": {
      role: { zh: "全栈开发与上线", ja: "フルスタック開発・公開", en: "Full-Stack Development & Launch", de: "Full-Stack-Entwicklung & Launch" },
      type: { zh: "上线产品 · 在线课程平台（账号与支付）", ja: "公開中の製品 · オンライン講座（アカウント・決済）", en: "Live Product · Online Course Platform (Accounts & Payments)", de: "Live-Produkt · Online-Kursplattform (Konten & Zahlung)" },
      summary: {
        zh: "独立做完并上线的双语付费课程站：账号（Supabase）、在线支付（Stripe）、部署在 Cloudflare 并持续发布；面向有蓝图经验的作者，9 章 30 节把 Blueprint 概念逐条映射到 UE Verse。",
        ja: "単独で構築・公開した二言語の有料講座サイト。アカウント（Supabase）、オンライン決済（Stripe）、Cloudflare 上で継続的に公開。全 9 章 30 レッスンで、ブループリントの概念を UE Verse に一つずつ対応づける。",
        en: "A bilingual paid course site built and launched single-handedly: accounts (Supabase), online payment (Stripe), deployed on Cloudflare with continuous publishing; 30 lessons in 9 chapters map Blueprint concepts onto UE Verse for authors who already know Blueprints.",
        de: "Eigenständig gebaute und veröffentlichte zweisprachige Bezahl-Kursseite: Konten (Supabase), Online-Zahlung (Stripe), auf Cloudflare mit fortlaufender Veröffentlichung; 30 Lektionen in 9 Kapiteln bilden Blueprint-Konzepte auf UE Verse ab.",
      },
    },
  },

  emphasizeItems: ["prj-lilpainter", "prj-jobfinder", "prj-embobo", "prj-filmgen", "prj-versewiki", "prj-deskdrawer", "prj-cvsite"],

  /* hideItems：
       · 接单 / 对外邮箱 —— 求职版只留求职邮箱；
       · 三个 UE 项目 —— 背景已压进简介与侧栏，不再单列；
       · 两份 2017–2020 的早年非技术工作（作品集辅导、平面设计）—— 为守 3 页（本人确认保留此取舍）；
       · 更多作品只留软件类（SP_lessons / LiveTracker / Spoy Wiki / 个人站），
         mw-deskdrawer 已升成项目，mw-localai 按本人要求不出现 localAI 字样。 */
  hideItems: [
    "email-freelance", "email-biz",
    "work-portfolio", "work-design",
    "prj-room", "prj-grau", "prj-vp",
    "mw-deskdrawer", "mw-localai", "mw-naiken", "mw-umzug", "mw-testvideo",
    "mw-mirror", "mw-surreal", "mw-gochurch", "mw-cogshift", "mw-sound", "mw-campusvr",
  ],
  order: {
    contact: ["email-pro", "phone", "github"],
    // prj-cvsite（本简历站）排最后：放在两个上线产品之后，「其他版本」链接行顺带当演示
    projects: ["prj-lilpainter", "prj-jobfinder", "prj-embobo", "prj-filmgen", "prj-versewiki", "prj-deskdrawer", "prj-cvsite"],
  },
};
