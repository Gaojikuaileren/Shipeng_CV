/* ============================================================
   china-biz.js — ⑤ 中德商务开发 / 采购对接 / 项目协调
     · 双用途：既投德国 Business Development / Procurement / China Sourcing /
       Project Coordination / Import-Export 类职位，
       也可直接发给德国 Beschaffungsagentur / Einkaufsagentur / Sourcing-Agentur 谈合作。

   写作原则（务必保持）：
     · 只重新解释真实经历，不新增不存在的经历、订单、客户、供应商、KPI、从业年限。
     · 中国端采购与跨境物流一律写成「接入 / 协作既有网络」，绝不写成自有仓储或物流设施。
     · 日期 / 公司 / 学历 / 职位名 / 语言等级全部沿用 base.js —— 与其它四个变体不冲突。
       本文件只用 itemOverrides 换叙述侧重（同一段经历，换讲法）。
     · 能力不打点数（hideSkillLevels: true）：商务类能力目前没有年限背书，不自称「5 星专家」。
   ============================================================ */
window.RESUME_VARIANT = {
  id: "china-biz",

  headline: {
    zh: "中德商务开发 · 采购对接 / 产品调研 / 项目协调",
    ja: "中独ビジネス開発 · 調達サポート / 製品リサーチ / プロジェクト調整",
    en: "China–Germany Business Development · Sourcing / Product Research / Project Coordination",
    de: "Business Development China–Deutschland · Sourcing / Produktrecherche / Projektkoordination",
  },

  intro: {
    zh: "常驻德国科隆，中文母语。产品设计与媒体艺术双重背景，具备跨学科项目开发、调研、技术沟通与跨文化协调的实际经验。为德国与中国之间的商务沟通与项目推进提供支持，并可将明确定义的需求对接到中国端成熟的采购与跨境物流合作网络。",
    ja: "ケルン在住、中国語ネイティブ。プロダクトデザインとメディアアートの背景に、学際的なプロジェクト開発・リサーチ・技術的コミュニケーション・異文化間の調整の実務経験を重ねてきました。ドイツと中国のあいだのビジネスコミュニケーションとプロジェクト推進を支援し、明確化された要件を中国側の確立された調達・越境物流ネットワークにつなぐことができます。",
    en: "Based in Cologne and a native Chinese speaker, I combine a background in Product Design and Media Arts with interdisciplinary project development, research, technical communication and cross-cultural coordination. I support China–Germany business communication and project development, and can connect clearly defined requirements with an established China-side sourcing and cross-border logistics network.",
    de: "Ich lebe in Köln, bin chinesischer Muttersprachler und verbinde einen Hintergrund in Produktdesign und Medienkunst mit interdisziplinärer Projektentwicklung, Recherche, technischer Kommunikation und interkultureller Koordination. Ich unterstütze die Geschäftskommunikation und Projektentwicklung zwischen Deutschland und China und kann klar definierte Anforderungen mit einem etablierten Netzwerk für Beschaffung und grenzüberschreitende Logistik auf chinesischer Seite verbinden.",
  },

  greeting: null, // 发给某家 Agentur / 公司时可在这里加一句定制问候

  /* —— 第一屏就说清：人在科隆 ＋ 求职与合作双开放 ————————————— */
  profileFields: [
    { key: "location",
      label: { zh: "所在地", ja: "所在地", en: "Location", de: "Standort" },
      value: { zh: "德国 科隆", ja: "ドイツ・ケルン", en: "Cologne, Germany", de: "Köln, Deutschland" },
      visibility: "public" },
    { key: "availability",
      label: { zh: "可接受", ja: "対応形態", en: "Availability", de: "Verfügbarkeit" },
      value: { zh: "正式雇佣 · 项目合作", ja: "正規雇用 · プロジェクト協業", en: "Employment · Project cooperation", de: "Festanstellung · Projektkooperation" },
      visibility: "public" },
    // 语言不在这里重复 —— 侧边栏「语言」板块已排到最前（sections.order），紧跟在这两行下面
  ],

  /* —— 板块顺序：语言前置（本变体的核心职业价值），协作板块紧跟自我介绍 —— */
  sections: {
    order: [
      "languages", "skills", "contact",                                  // 侧边栏
      "intro", "collab", "work", "education", "projects", "toolset",     // 主区
    ],
    hide: ["portfolio", "moreWorks"],   // 这版不是艺术作品集
    emphasize: ["collab", "contact"],
  },

  /* —— 板块标题：按本页语境改写（机制通用，只在本变体生效）—————— */
  sectionTitles: {
    skills:   { zh: "核心能力",       ja: "コアコンピテンシー", en: "Core Competencies",             de: "Kernkompetenzen" },
    collab:   { zh: "中德协作",       ja: "中独間の協働",       en: "China–Germany Collaboration",   de: "Zusammenarbeit China–Deutschland" },
    projects: { zh: "代表项目背景",   ja: "主要プロジェクト経験", en: "Selected Project Background", de: "Ausgewählte Projekterfahrung" },
    toolset:  { zh: "技术与创意背景", ja: "技術・クリエイティブ基盤", en: "Technical & Creative Background", de: "Technischer & kreativer Hintergrund" },
    contact:  { zh: "联系与合作",     ja: "連絡・協業",         en: "Contact & Cooperation",         de: "Kontakt & Kooperation" },
  },

  /* —— 本变体核心板块：CV 与 Cooperation Profile 的分界线 ——————————
     三块：德国端（我本人做的）／中国端（协作网络做的）／技术与产品理解（差异化）。
     中国端一律「接入 / 协作」措辞 —— 不暗示自有仓储、车队或物流公司。
  ———————————————————————————————————————————————————————————— */
  collab: [
    {
      id: "cb-de",
      title: { zh: "德国端", ja: "ドイツ側", en: "Germany-side", de: "Deutschland-Seite" },
      note: {
        zh: "在德国本地直接沟通（德语 / 英语），本人亲自负责。",
        ja: "ドイツ現地での直接コミュニケーション（ドイツ語・英語）。本人が担当。",
        en: "Direct communication on site in Cologne, in German and English — handled personally.",
        de: "Direkte Kommunikation vor Ort in Köln, auf Deutsch und Englisch — persönlich betreut.",
      },
      items: [
        { zh: "客户与合作方沟通", ja: "顧客・パートナーとの連絡", en: "Client & partner communication", de: "Kunden- und Partnerkommunikation" },
        { zh: "需求澄清与规格梳理", ja: "要件のヒアリングと仕様整理", en: "Requirement clarification & specification", de: "Anforderungsklärung und Spezifikation" },
        { zh: "市场与产品调研", ja: "市場・製品リサーチ", en: "Market & product research", de: "Markt- und Produktrecherche" },
        { zh: "合作方开发与初步接洽", ja: "パートナー開拓と初期コンタクト", en: "Partner development & first contact", de: "Partnerakquise und Erstkontakt" },
        { zh: "项目协调与过程文档", ja: "プロジェクト調整と記録", en: "Project coordination & documentation", de: "Projektkoordination und Dokumentation" },
      ],
    },
    {
      id: "cb-cn",
      title: { zh: "中国端网络", ja: "中国側ネットワーク", en: "China-side Network", de: "Netzwerk in China" },
      note: {
        zh: "通过与中国端成熟合作网络协作实现 —— 本人不自有仓储或物流设施。",
        ja: "中国側の確立されたネットワークとの協働により対応（自社倉庫・物流設備は保有していません）。",
        en: "In collaboration with an established China-side network — no own warehouses or logistics infrastructure.",
        de: "In Zusammenarbeit mit einem etablierten Netzwerk in China — keine eigene Lager- oder Logistikinfrastruktur.",
      },
      items: [
        { zh: "供应商寻源支持", ja: "サプライヤー探索のサポート", en: "Supplier search support", de: "Unterstützung bei der Lieferantensuche" },
        { zh: "供应商对接与跟进", ja: "サプライヤーとの調整・フォローアップ", en: "Supplier coordination & follow-up", de: "Lieferantenkoordination und Nachverfolgung" },
        { zh: "集货并单", ja: "貨物の集約", en: "Consolidation", de: "Konsolidierung von Sendungen" },
        { zh: "中国端执行落地", ja: "中国側での実務対応", en: "China-side execution", de: "Abwicklung auf chinesischer Seite" },
        { zh: "跨境物流", ja: "越境物流", en: "Cross-border logistics", de: "Grenzüberschreitende Logistik" },
      ],
    },
    {
      id: "cb-tech",
      title: { zh: "技术与产品理解", ja: "技術・製品の理解", en: "Technical & Product Understanding", de: "Technik- & Produktverständnis" },
      note: {
        zh: "产品设计学历 ＋ 实际技术项目经验 —— 与纯销售背景的区别所在。",
        ja: "プロダクトデザインの学歴と実際の技術プロジェクト経験 —— 純粋な営業職との違い。",
        en: "Product Design degree plus hands-on technical project work — the difference from a purely sales-side profile.",
        de: "Studium im Produktdesign und praktische technische Projektarbeit — der Unterschied zu einem rein vertrieblichen Profil.",
      },
      items: [
        { zh: "产品理解（产品设计背景）", ja: "製品理解（プロダクトデザイン背景）", en: "Product understanding (Product Design background)", de: "Produktverständnis (Hintergrund Produktdesign)" },
        { zh: "CAD / 3D 建模能力", ja: "CAD・3D モデリングの実務知識", en: "CAD / 3D literacy", de: "CAD- und 3D-Kenntnisse" },
        { zh: "技术需求的沟通与转译", ja: "技術要件のコミュニケーションと橋渡し", en: "Technical requirement communication", de: "Kommunikation technischer Anforderungen" },
        { zh: "展示、媒体与互动硬件的理解", ja: "ディスプレイ・メディア・インタラクティブ機器の理解", en: "Display, media & interactive hardware literacy", de: "Verständnis für Display-, Medien- und interaktive Hardware" },
        { zh: "可视化与数字化呈现", ja: "ビジュアライゼーションと資料作成", en: "Visualization & digital presentation", de: "Visualisierung und digitale Präsentation" },
      ],
    },
  ],

  /* —— 侧边栏能力：不打点数（hideSkillLevels），中性列举 ————————— */
  sidebar: ["cap-xcult", "cap-client", "cap-req", "cap-research", "cap-coord", "cap-techprod", "cap-proddes", "cap-viscom"],
  hideSkillLevels: true,

  /* —— 工具集：只留对商务 / 产品 / 项目呈现真正有用的（不摆 UE5 工具墙）——
     base.js 里没有 Office 类工具 → 不凭空添加。 */
  onlyTools: [
    "t-ue5",                                          // 技术背景，不高亮
    "t-arduino", "t-esp32",                           // 硬件理解，不高亮
    "t-shapr3d", "t-blender",                         // CAD / 3D
    "t-html",                                         // 网页 / 数字化呈现
    "t-ps", "t-affinity", "t-canva", "t-webflow",     // 视觉与提案材料
    "t-pr", "t-davinci",                              // 影像沟通
  ],
  highlightTools: ["t-shapr3d", "t-blender", "t-ps", "t-affinity", "t-canva", "t-webflow", "t-pr", "t-html"],

  /* —— 同一段真实经历，换本页语境的叙述侧重 ————————————————————
     日期 / 公司 / 学校 / 学历名称一律沿用 base.js（不覆盖）→ 各变体事实一致。
  ———————————————————————————————————————————————————————————— */
  itemOverrides: {
    // ① 自由职业：强调独立执行 / 需求澄清 / 协调 / 交付（UE5 退为技术基础）
    "work-freelance": {
      role: {
        zh: "自由职业 · 数字与技术项目开发",
        ja: "フリーランス · デジタル／技術プロジェクト開発",
        en: "Freelance · Digital & Technical Project Development",
        de: "Freiberuflich · Digitale & technische Projektentwicklung",
      },
      summary: {
        zh: "独立承接项目：与委托方澄清需求、发展概念、评估技术可行性、跨专业协调，并负责交付与呈现材料。合作以远程为主。技术基础为实时 3D、VR/MR 与传感器系统。",
        ja: "独立して案件を担当：依頼者と要件を整理し、コンセプトを立案、技術的な実現可能性を検証し、分野をまたいで調整して成果物と提案資料を納品。協働は主にリモート。技術的基盤はリアルタイム 3D、VR/MR、センサーシステム。",
        en: "Independent project work for art projects, media productions and private clients: clarifying requirements, developing concepts, assessing technical feasibility, coordinating across disciplines, and delivering the result including visualization and presentation material. Mostly remote collaboration; technical basis in real-time 3D, VR/MR and sensor-based systems.",
        de: "Selbstständige Projektarbeit für Kunstprojekte, Medienproduktionen und private Auftraggeber: Anforderungen klären, Konzepte entwickeln, technische Machbarkeit prüfen, disziplinübergreifend koordinieren und das Ergebnis inklusive Visualisierung und Präsentationsmaterial liefern. Überwiegend remote; technische Basis in Echtzeit-3D, VR/MR und sensorbasierten Systemen.",
      },
      tags: ["Project Development", "Requirement Clarification", "Research", "Coordination", "Remote Collaboration", "Visualization"],
    },

    // ② 作品集辅导：职位名保持诚实（不改成 Sales Consultant），描述体现咨询与客户沟通
    "work-portfolio": {
      summary: {
        zh: "为艺术院校申请者提供一对一咨询：了解个人需求、筛选与梳理项目、制定申请策略、准备呈现方式；全程客户沟通与个别指导。",
        ja: "美術大学志望者への個別コンサルティング：ニーズの把握、プロジェクトの選定と構成、出願戦略の立案、プレゼンテーションの準備。全過程でのクライアント対応と個別指導。",
        en: "One-to-one consulting for art-school applicants: assessing individual needs, selecting and structuring projects, developing an application strategy and preparing the presentation. Client communication and guidance throughout the process.",
        de: "Einzelberatung für Kunsthochschul-Bewerber: individuelle Bedarfsklärung, Auswahl und Strukturierung der Projekte, Entwicklung einer Bewerbungsstrategie und Vorbereitung der Präsentation. Durchgehende Kommunikation und Begleitung der Kunden.",
      },
      tags: ["Consulting", "Needs Assessment", "Client Communication", "Strategy", "Presentation"],
    },

    // ③ 换车网：强调数字产品与商业内容沟通（不虚构销售 / 运营 / 投放）
    "work-design": {
      summary: {
        zh: "为二手车线上交易平台制作数字产品与推广内容 —— 把商品与商业信息转化为清晰的网页与广告视觉。",
        ja: "中古車オンライン取引プラットフォーム向けにデジタル製品・販促コンテンツを制作 —— 商材と商業情報を分かりやすいウェブ・広告ビジュアルへ変換。",
        en: "Digital product and promotional content for an online used-car marketplace — translating commercial offerings into clear web and advertising visuals.",
        de: "Digitale Produkt- und Werbeinhalte für einen Online-Marktplatz für Gebrauchtwagen — kommerzielle Angebote in klare Web- und Werbevisuals übersetzt.",
      },
      tags: ["Digital Content", "Product Communication", "Online Marketplace", "Web", "Advertising Visuals"],
    },

    // ④ KHM：学历名称不动，detail 改为研究 / 项目开发 / 协作 / 呈现优先，技术在后
    "edu-khm": {
      detail: {
        zh: "以研究为基础的独立项目开发：田野与访谈调研、概念发展、跨学科协作、技术协调、媒体制作与公开呈现 —— 从最初构想到完整展出作品全程负责。技术方向：实时 3D、VR、数字媒体与交互系统。",
        ja: "リサーチに基づく自立したプロジェクト開発：フィールド／インタビュー調査、コンセプト構築、学際的な協働、技術面の調整、メディア制作、公開発表 —— 着想から完成・展示までを一貫して担当。技術面はリアルタイム 3D、VR、デジタルメディア、インタラクティブシステム。",
        en: "Independent, research-based project development: field and interview research, concept development, interdisciplinary collaboration, technical coordination, media production and public presentation — carried from the first idea to a finished, exhibited work. Technical focus: real-time 3D, VR, digital media and interactive systems.",
        de: "Eigenständige, forschungsbasierte Projektentwicklung: Feld- und Interviewrecherche, Konzeptentwicklung, interdisziplinäre Zusammenarbeit, technische Koordination, Medienproduktion und öffentliche Präsentation — von der ersten Idee bis zur ausgestellten Arbeit. Technische Schwerpunkte: Echtzeit-3D, VR, digitale Medien und interaktive Systeme.",
      },
    },

    // ⑤ 产品设计学士：学历名称不动，detail 改为产品 / 市场 / 用户 / 项目管理优先
    //    「竞品」保守写成「设计项目中的市场与竞品调研」，不夸大成独立市场分析岗经验
    "edu-hbut": {
      detail: {
        zh: "方向：产品调研与用户需求、设计项目中的市场与竞品调研、产品开发与概念设计、原型制作、产品呈现与项目管理 —— 以工业设计 / 产品设计为基础。",
        ja: "重点：製品リサーチとユーザーニーズ、デザインプロジェクト内での市場・競合調査、製品開発とコンセプトワーク、プロトタイピング、製品プレゼンテーション、プロジェクトマネジメント —— 工業デザイン／プロダクトデザインを基礎とする。",
        en: "Focus: product research and user needs, market and competitor research within design projects, product development and concept work, prototyping, product presentation and project management — grounded in industrial and product design.",
        de: "Schwerpunkte: Produktrecherche und Nutzerbedürfnisse, Markt- und Wettbewerbsrecherche innerhalb von Designprojekten, Produktentwicklung und Konzeptarbeit, Prototyping, Produktpräsentation und Projektmanagement — auf Basis von Industrie- und Produktdesign.",
      },
    },

    // ⑥ 千声之室：不写 UE5 / MR 艺术，改写成完整项目执行能力的证据
    "prj-room": {
      role: {
        zh: "项目开发 · 技术规划 · 落地实现",
        ja: "プロジェクト開発 · 技術設計 · 実装",
        en: "Project Development · Technical Planning · Realisation",
        de: "Projektentwicklung · technische Planung · Umsetzung",
      },
      type: {
        zh: "完整项目流程：概念 → 原型 → 公开呈现",
        ja: "一貫したプロジェクト：コンセプト → プロトタイプ → 公開展示",
        en: "End-to-end project: concept → prototype → public presentation",
        de: "Projekt von Anfang bis Ende: Konzept → Prototyp → öffentliche Präsentation",
      },
      summary: {
        zh: "从概念、技术规划、原型制作、软硬件集成到公开呈现全程负责；协调内容、技术与现场搭建等不同环节，装置在观众面前长时间稳定运行。",
        ja: "コンセプト、技術設計、プロトタイプ制作、ハードとソフトの統合、公開展示までを一貫して担当。内容・技術・現場設営という異なる領域を調整し、来場者の前で長時間安定して稼働させた。",
        en: "Developed end to end: concept, technical planning, prototyping, hardware and software integration, and public presentation. Coordination across content, technology and on-site setup, with the installation running reliably in front of an audience.",
        de: "Von Anfang bis Ende entwickelt: Konzept, technische Planung, Prototyping, Integration von Hard- und Software sowie öffentliche Präsentation. Koordination von Inhalt, Technik und Aufbau vor Ort, mit stabilem Betrieb der Installation vor Publikum.",
      },
      tags: ["Project Development", "Technical Planning", "Prototyping", "Interdisciplinary", "Public Presentation", "KHM"],
    },

    // ⑦ 养老院项目：改写成访谈调研 + 机构方沟通 + 多专业协作 + 技术落地
    "prj-grau": {
      role: {
        zh: "访谈调研 · 机构方沟通 · 技术实现",
        ja: "聞き取り調査 · 関係者調整 · 技術実装",
        en: "Interview Research · Stakeholder Communication · Technical Implementation",
        de: "Recherche · Stakeholder-Kommunikation · technische Umsetzung",
      },
      type: {
        zh: "德国养老院访谈调研项目",
        ja: "ドイツの介護施設での聞き取り調査プロジェクト",
        en: "Interview-based research project in a German care home",
        de: "Interviewbasiertes Rechercheprojekt in einem deutschen Pflegeheim",
      },
      summary: {
        zh: "在德国一家养老院开展访谈调研：进行并记录访谈、与机构方现场沟通协调，并将素材落地为技术实现的数字档案；在多专业团队中协作完成。",
        ja: "ドイツの介護施設で入居者とスタッフへの聞き取り調査を実施：インタビューの実施と記録、施設側との現場調整、集めた素材を技術的に実装したデジタルアーカイブへ。多分野チームでの協働。",
        en: "Interview-based research with residents and staff of a care home in Germany: conducting and documenting interviews, coordinating on site with the institution, and turning the material into a technically implemented digital archive — in a multidisciplinary team.",
        de: "Interviewbasierte Recherche mit Bewohnern und Personal eines Pflegeheims in Deutschland: Interviews führen und dokumentieren, Abstimmung vor Ort mit der Einrichtung und Umsetzung des Materials in ein technisch realisiertes digitales Archiv — in einem multidisziplinären Team.",
      },
      tags: ["Interview Research", "Stakeholder Communication", "Documentation", "Technical Implementation", "Teamwork"],
    },
  },

  /* —— 项目条目重点色：两个项目都是本页要的「项目能力」证据 —— */
  emphasizeItems: ["prj-room", "prj-grau"],

  /* —— 联系：职业邮箱；GitHub / Instagram 对本方向无关，隐去 —— */
  hideItems: ["email-freelance", "github", "instagram"],
  order: { contact: ["email-pro", "phone", "linkedin", "web"] },

  /* —— CTA：求职 ＋ 项目合作双身份（§15）—— */
  contactNote: {
    zh: "可接受正式雇佣，同时欢迎自由职业项目与中德商务合作洽谈。",
    ja: "正規雇用に加え、フリーランス案件および中国・ドイツ間のビジネス協業のご相談も歓迎します。",
    en: "Open to permanent employment as well as freelance projects and China–Germany business cooperation.",
    de: "Offen für eine Festanstellung sowie für freiberufliche Projekte und deutsch-chinesische Geschäftskooperationen.",
  },
};
