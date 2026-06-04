/* odd/data.js — 兼职简历（彻底独立，不引用主站 base.js）
   只含：照片+信息 / 打工经历 / 语言 / 教育 / 联系方式
   不放技能 / 项目 / 作品集（避免 overqualified 印象）。 */
window.RESUME_BASE = {
  meta: { langs: ["zh", "ja", "en", "de"], defaultLang: "en",
    langLabels: { zh: "中", ja: "日", en: "EN", de: "DE" }, updated: "2026-06" },

  profile: {
    name: { zh: "欧阳世鹏", ja: "欧陽 世鵬（オーヤン・シュポン）", en: "Shipeng Ouyang", de: "Shipeng Ouyang" },
    title: {
      zh: "Mini-Job / Teilzeit | 服务 · 仓储 · 帮厨 · 杂工",
      ja: "ミニジョブ・アルバイト | サービス · 倉庫 · 調理補助 · 雑用",
      en: "Mini-Job & Part-time | Service · Warehouse · Kitchen Aid · General",
      de: "Mini-Job & Teilzeit | Service · Lager · Küchenhilfe · Aushilfe",
    },
    photo: "../assets/photo/FotoCV.jpg",
    photoAlt: { zh: "照片", ja: "顔写真", en: "Portrait", de: "Porträt" },
    fields: [
      { key: "location", label: { zh: "所在地", ja: "所在地", en: "Location", de: "Standort" },
        value: { zh: "杜塞尔多夫，德国", ja: "デュッセルドルフ、ドイツ", en: "Düsseldorf, Germany", de: "Düsseldorf, Deutschland" }, visibility: "public" },
      { key: "status", label: { zh: "状态", ja: "ステータス", en: "Status", de: "Status" },
        value: { zh: "可立即上岗 · 兼职", ja: "即日可 · アルバイト", en: "Available now · Part-time", de: "Sofort verfügbar · Teilzeit" }, visibility: "public" },
    ],
  },
  intro: {
    zh: "踏实可靠，做事认真细致，与同事相处融洽，能迅速适应新环境。中文母语，德语 B2，英语 C1，日语 N3，多语言工作环境无障碍。Mini-Job 及 Teilzeit 均可接受，可随时上岗。",
    ja: "誠実・丁寧・チームワーク重視で、新しい環境にもすぐに馴染めます。中国語（母語）・ドイツ語 B2・英語 C1・日本語 N3 の多言語対応可。ミニジョブ・アルバイト（Teilzeit）どちらも応相談、即日就業できます。",
    en: "Reliable, thorough and easy to work with. Adapts quickly to new environments and maintains good relationships with colleagues. Multilingual: Chinese (native), German B2, English C1, Japanese N3. Available for mini-jobs and part-time (Teilzeit), ready to start immediately.",
    de: "Zuverlässig, sorgfältig und teamfähig. Gutes Verhältnis zu Kolleginnen und Kollegen, schnelle Einarbeitung. Mehrsprachig: Chinesisch (Muttersprache), Deutsch B2, Englisch C1, Japanisch N3. Für Mini-Job und Teilzeit verfügbar, sofort einsatzbereit.",
  },
  oddjobs: [
    {
      id: "odd-soup", period: "2026",
      role: { zh: "店员", ja: "ストアスタッフ", en: "Restaurant Staff", de: "Servicekraft" },
      org: {
        zh: "Bowl Maker Society（汤人社），科隆",
        ja: "Bowl Maker Society（汤人社）、ケルン",
        en: "Bowl Maker Society, Cologne",
        de: "Bowl Maker Society, Köln",
      },
      mapUrl: "https://maps.app.goo.gl/1HdM7RHX94JuBzbL6",
      summary: {
        zh: "麻辣烫餐厅店员，负责点餐服务、出餐、收银与日常清洁，维持高效顺畅的堂食体验。",
        ja: "麻辣湯レストランにてストアスタッフ。注文受付、料理提供、レジ、清掃を担当。円滑な店内運営を維持。",
        en: "Restaurant staff at a Chinese hot-pot eatery. Order-taking, food service, register and cleaning.",
        de: "Servicekraft in einem chinesischen Hot-Pot-Restaurant. Bestellaufnahme, Speisenservice, Kasse und Reinigung.",
      },
      tags: [],
    },
    {
      id: "odd-lamda", period: "2025",
      role: { zh: "仓库管理员", ja: "倉庫スタッフ", en: "Warehouse Staff", de: "Lagermitarbeiter" },
      org: {
        zh: "Lamda Germany GmbH，马尔斯多夫，科隆",
        ja: "Lamda Germany GmbH、マールスドルフ、ケルン",
        en: "Lamda Germany GmbH, Marsdorf, Cologne",
        de: "Lamda Germany GmbH, Marsdorf, Köln",
      },
      mapUrl: "https://maps.app.goo.gl/s8YUVHPh5JuYQ9bD6",
      summary: {
        zh: "灯具批发仓库货品收发、分拣与库存管理。",
        ja: "照明卸売倉庫にて入出荷、仕分け、在庫管理を担当。",
        en: "Goods receiving and dispatch, sorting and inventory management at a lighting wholesale warehouse.",
        de: "Wareneingang und -ausgang, Sortieren und Bestandsverwaltung im Beleuchtungsgroßhandel.",
      },
      tags: [],
    },
    {
      id: "odd-teamate", period: "2022 – 2024",
      role: { zh: "兼职服务员", ja: "アルバイトスタッフ", en: "Part-time Service Staff", de: "Teilzeit-Servicekraft" },
      org: {
        zh: "Teamate 奶茶，科隆",
        ja: "Teamate バブルティー、ケルン",
        en: "Teamate, Cologne",
        de: "Teamate, Köln",
      },
      mapUrl: "https://maps.app.goo.gl/QrhX9L7Q9JamBwsd9",
      summary: {
        zh: "奶茶店兼职，负责饮品制作、收银与日常清洁，适应高客流量营业时段。",
        ja: "バブルティーカフェでアルバイト。ドリンク製造、レジ、清掃を担当。繁忙時間帯も安定して対応。",
        en: "Part-time at a bubble tea café. Drink preparation, register and cleaning. Reliable during peak hours.",
        de: "Teilzeit im Bubble-Tea-Café. Getränkezubereitung, Kasse und Reinigung. Zuverlässig in Stoßzeiten.",
      },
      tags: [],
    },
  ],
  languages: [
    { name: { zh: "中文普通话", ja: "中国語（普通話）", en: "Chinese (Mandarin)", de: "Chinesisch (Mandarin)" }, level: { zh: "母语", ja: "母語", en: "Native", de: "Muttersprache" } },
    { name: { zh: "德语", ja: "ドイツ語", en: "German", de: "Deutsch" }, level: { zh: "B2", ja: "B2", en: "B2", de: "B2" } },
    { name: { zh: "英语", ja: "英語", en: "English", de: "Englisch" }, level: { zh: "C1", ja: "C1", en: "C1", de: "C1" } },
    { name: { zh: "日语", ja: "日本語", en: "Japanese", de: "Japanisch" }, level: { zh: "JLPT N3", ja: "JLPT N3", en: "JLPT N3", de: "JLPT N3" } },
  ],
  education: [
    { id: "edu-khm", period: "2020 – 2025",
      school: { zh: "科隆媒体艺术学院（KHM）", ja: "ケルン・メディア芸術大学（KHM）", en: "Academy of Media Arts Cologne (KHM)", de: "Kunsthochschule für Medien Köln (KHM)" },
      degree: { zh: "媒体艺术 Diplom（本+硕）", ja: "メディアアーツ Diplom（学士・修士統合）", en: "Diploma in Media Arts (B.A. + M.A.)", de: "Diplom in Media Arts" },
      detail: { zh: "", ja: "", en: "", de: "" } },
    { id: "edu-hbut", period: "2013 – 2017",
      school: { zh: "湖北工业大学", ja: "湖北工業大学", en: "Hubei University of Technology", de: "Hubei University of Technology" },
      degree: { zh: "产品设计 本科", ja: "プロダクトデザイン 学士", en: "B.A. Product Design", de: "B.A. Produktdesign" },
      detail: { zh: "", ja: "", en: "", de: "" } },
  ],
  // 联系方式在兼职页直接公开（不防采集），方便 HR 快速联系
  contact: [
    { id: "phone",    type: "phone",   label: "Tel",   value: "+49 176 64161464",         visibility: "public" },
    { id: "email-pro",type: "email",   label: "Email", value: "shipengouyang@gmail.com",   visibility: "public" },
  ],
  skills: [], projects: [], work: [], moreWorks: [],
};
