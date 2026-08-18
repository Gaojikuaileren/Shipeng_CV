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

  /* —— 板块顺序：语言前置（本变体的核心职业价值），协作板块紧跟自我介绍 ——
     项目经历不出现：媒体艺术项目与采购 / 协调方向无关，写了反而分散注意力。
     工具集（技术与创意背景）不出现：软件清单对本方向没有说服力，
     真正的说服力在「中德协作」＋「工作经历」两块。 */
  sections: {
    order: [
      "languages", "skills", "contact",        // 侧边栏
      "intro", "collab", "education", "work",  // 主区：自我介绍 → 协作 → 教育 → 工作
    ],
    hide: ["projects", "portfolio", "moreWorks", "toolset"],
    emphasize: ["collab", "contact"],
  },

  /* —— 板块标题：按本页语境改写（机制通用，只在本变体生效）—————— */
  sectionTitles: {
    skills:   { zh: "核心能力",       ja: "コアコンピテンシー", en: "Core Competencies",             de: "Kernkompetenzen" },
    collab:   { zh: "中德协作",       ja: "中独間の協働",       en: "China–Germany Collaboration",   de: "Zusammenarbeit China–Deutschland" },
    toolset:  { zh: "技术与创意背景", ja: "技術・クリエイティブ基盤", en: "Technical & Creative Background", de: "Technischer & kreativer Hintergrund" },
    contact:  { zh: "联系与合作",     ja: "連絡・協業",         en: "Contact & Cooperation",         de: "Kontakt & Kooperation" },
  },

  /* —— 本变体核心板块：CV 与 Cooperation Profile 的分界线 ——————————
     两块：德国端（我本人做的）／中国端（协作网络做的）。
     中国端一律「接入 / 协作」措辞 —— 措辞本身已表明是协作网络，不暗示自有仓储或物流公司。
  ———————————————————————————————————————————————————————————— */
  collab: [
    {
      id: "cb-de",
      title: { zh: "德国端", ja: "ドイツ側", en: "Germany-side", de: "Deutschland-Seite" },
      note: {
        zh: "自 2018 年常驻德国，在本地直接沟通（德语 / 英语）。",
        ja: "2018 年よりドイツ在住、現地で直接コミュニケーション（ドイツ語・英語）。",
        en: "Based in Germany since 2018 — direct communication on site in Cologne, in German and English.",
        de: "Seit 2018 in Deutschland — direkte Kommunikation vor Ort in Köln, auf Deutsch und Englisch.",
      },
      items: [
        { zh: "客户与合作方沟通", ja: "顧客・パートナーとの折衝", en: "Client & partner communication", de: "Kunden- und Partnerkommunikation" },
        { zh: "需求对接与文档梳理", ja: "要件のすり合わせと資料整理", en: "Requirement alignment & documentation", de: "Anforderungsabstimmung und Dokumentation" },
        { zh: "市场与产品调研", ja: "市場・製品リサーチ", en: "Market & product research", de: "Markt- und Produktrecherche" },
        { zh: "项目协调与管理", ja: "プロジェクトの調整と管理", en: "Project coordination & management", de: "Projektkoordination und -steuerung" },
        { zh: "网页与可视化沟通", ja: "ウェブ・ビジュアルによる情報伝達", en: "Web & visual communication", de: "Web- und Visualisierungskommunikation" },
      ],
    },
    {
      id: "cb-cn",
      title: { zh: "中国端网络", ja: "中国側ネットワーク", en: "China-side Network", de: "Netzwerk in China" },
      note: {
        zh: "通过与中国端成熟合作网络协作实现。",
        ja: "中国側の確立されたネットワークとの協働により対応。",
        en: "In collaboration with an established China-side network.",
        de: "In Zusammenarbeit mit einem etablierten Netzwerk in China.",
      },
      items: [
        { zh: "供应商资源支持", ja: "サプライヤーリソースの提供", en: "Supplier resource support", de: "Unterstützung mit Lieferantenressourcen" },
        { zh: "供应商直接对接", ja: "サプライヤーとの直接対応", en: "Direct supplier liaison", de: "Direkter Lieferantenkontakt" },
        { zh: "集货并单", ja: "貨物の集約・混載", en: "Consolidation of shipments", de: "Konsolidierung von Sendungen" },
        { zh: "全流程执行落地", ja: "全工程の実行・遂行", en: "End-to-end execution", de: "Durchgängige Abwicklung" },
        { zh: "跨境物流商直接对接", ja: "越境物流業者との直接対応", en: "Direct liaison with cross-border logistics providers", de: "Direkter Kontakt zu grenzüberschreitenden Logistikdienstleistern" },
      ],
    },
  ],

  /* —— 侧边栏能力：不打点数（hideSkillLevels），中性列举 —————————
     只留五项：语言 / 项目协调 / 跨文化沟通 / 技术与产品理解 / 视觉与呈现沟通。
     base.js 里的 cap-client / cap-req / cap-research / cap-proddes 保留备用，本变体不展示。 */
  sidebar: ["cap-lang", "cap-coord", "cap-xcult", "cap-techprod", "cap-viscom"],
  hideSkillLevels: true,

  /* —— 工具集：只留对商务 / 产品 / 项目呈现真正有用的（不摆 UE5 工具墙）——
     base.js 里没有 Office 类工具 → 不凭空添加。
     ⚠️ 当前 sections.hide 含 "toolset" → 本板块不渲染，下面两个数组暂时不生效。
        保留配置是为了将来想放回来时一行即可（从 hide 里删掉 "toolset"）。 */
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
    // ① 自由职业：措辞收拢到「面向产品呈现与客户沟通的交互式数字应用 / 平台」——
    //    比原来的 UE5 / VR / 传感器写法模糊、更贴商务语境，但每一项仍对应真实做过的事。
    "work-freelance": {
      role: {
        zh: "自由职业 · 数字与技术项目开发",
        ja: "フリーランス · デジタル／技術プロジェクト開発",
        en: "Freelance · Digital & Technical Project Development",
        de: "Freiberuflich · Digitale & technische Projektentwicklung",
      },
      summary: {
        zh: "独立开发面向产品呈现与客户沟通的交互式数字应用与平台：与委托方澄清需求、发展概念、技术实现与交付。合作以远程为主。",
        ja: "製品プレゼンテーションと顧客コミュニケーションに向けたインタラクティブなデジタルアプリケーション／プラットフォームを独立して開発：依頼者と要件を整理し、コンセプトを立案、技術実装から納品まで担当。協働は主にリモート。",
        en: "Independent development of interactive digital applications and platforms for product presentation and customer-facing communication: clarifying requirements with clients, developing concepts, technical implementation and delivery. Mostly remote collaboration.",
        de: "Selbstständige Entwicklung interaktiver digitaler Anwendungen und Plattformen für Produktpräsentation und Kundenkommunikation: Anforderungen mit Auftraggebern klären, Konzepte entwickeln, technische Umsetzung und Lieferung. Überwiegend remote.",
      },
      tags: ["Digital Platforms", "Product Presentation", "Client Communication", "Requirement Clarification", "Remote Collaboration"],
    },

    // ② 作品集辅导：职位名保持诚实（不改成 Sales Consultant），描述收拢到客户服务侧
    "work-portfolio": {
      summary: {
        zh: "一对一客户服务与咨询：了解客户需求、协助材料的筛选与整理、制定方案，并跟进至最终提交。",
        ja: "個別のクライアント対応とコンサルティング：ニーズの把握、資料の選定・整理のサポート、方針の立案、提出までのフォロー。",
        en: "One-to-one client service and consulting: assessing individual needs, guiding the selection and preparation of materials, developing a strategy and supporting clients through to submission.",
        de: "Individuelle Kundenbetreuung und Beratung: Bedarfsklärung, Begleitung bei Auswahl und Aufbereitung der Unterlagen, Entwicklung einer Strategie und Betreuung bis zur Einreichung.",
      },
      tags: ["Client Service", "Consulting", "Needs Assessment", "Communication"],
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
        zh: "以研究为基础的独立项目开发：实地与访谈调研、概念发展、跨学科协作、技术协调、媒体制作与公开呈现 —— 从最初构想到完整展出作品全程负责。技术方向：实时 3D、VR、数字媒体与交互系统。",
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

    // 注：项目经历整段在本变体隐藏（sections.hide），因此不需要 prj-* 的改写。
  },

  /* —— 联系：职业邮箱 ＋ 电话 ＋ LinkedIn。
     GitHub / Instagram 对本方向无关；个人主页（作品集）也不放 —— 内容偏媒体艺术，
     对采购 / 商务方向没有说服力，反而把注意力带走。 —— */
  hideItems: ["email-freelance", "github", "instagram", "web"],
  order: { contact: ["email-pro", "phone", "linkedin"] },

  /* —— CTA：求职 ＋ 项目合作双身份（§15）—— */
  contactNote: {
    zh: "可接受正式雇佣，同时欢迎自由职业项目与中德商务合作洽谈。",
    ja: "正規雇用に加え、フリーランス案件および中国・ドイツ間のビジネス協業のご相談も歓迎します。",
    en: "Open to permanent employment as well as freelance projects and China–Germany business cooperation.",
    de: "Offen für eine Festanstellung sowie für freiberufliche Projekte und deutsch-chinesische Geschäftskooperationen.",
  },
};
