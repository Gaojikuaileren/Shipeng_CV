/* art-vr.js — ② 媒体艺术自由职业（名片身份）

   读者是**要付钱委托我做东西的人**：艺术机构、文化项目、策展人。
   不是 HR，也不是招驻留的评审 —— 这一条决定了本文件的所有措辞：
     · 不提「驻留 / Residenz」。把驻留与委托并列，等于告诉付费客户我在找机会
       而不是在提供服务，议价地位当场下降；
     · intro 里除了气质句，必须有一句「你给什么、我交付什么」；
     · 联系方式用自有域名的对外邮箱，不用私人邮箱。
   ⚠️ 当前用的 email-biz（contact@s-gjklr.work）MX 还没配好，见 base.js 那条 TODO。 */
window.RESUME_VARIANT = {
  id: "art-vr",
  headline: {
    zh: "自由职业媒体艺术开发者 · 沉浸式装置 / VR / 实时交互",
    ja: "フリーランス・メディアアーツ・デベロッパー · 没入型インスタレーション / VR / リアルタイムインタラクション",
    en: "Freelance Media Arts Developer · Immersive Installation / VR / Real-time Interaction",
    de: "Freiberuflicher Medienkunst-Entwickler · Immersive Installation / VR / Echtzeit-Interaktion",
  },
  intro: {
    zh: "KHM 媒体艺术 Diplom，自由职业媒体艺术开发者。把空间、身体与实时影像编织成沉浸式现场体验。从你的 3D 数据、场地条件与既有素材出发，交付可运行的实时程序、配套的装置系统，以及同一工程导出的渲染影像 —— 技术方案、现场搭建到长时间稳定运行，一人贯通。当前可接项目。",
    ja: "KHM メディアアーツ Diplom、フリーランス・メディアアーツ・デベロッパー。空間・身体・リアルタイム映像を没入型ライブ体験へと織り上げる。お手元の 3D データ・会場条件・既存素材から、動作するリアルタイムアプリケーション、それを支えるインスタレーションのシステム、同じ工程から書き出す映像までを納品 —— 技術設計から現場設営、長時間の安定稼働まで一人で通す。現在プロジェクトを受注可能。",
    en: "KHM Media Arts Diploma, freelance media arts developer. I weave space, body and real-time imagery into immersive live experiences. From your 3D data, the site and existing material I deliver a running real-time application, the installation system around it and rendered footage from the same project — technical concept, on-site build and long-run stability from one hand. Currently available for projects.",
    de: "KHM Diplom in Media Arts, freiberuflicher Medienkunst-Entwickler. Ich verwebe Raum, Körper und Echtzeit-Bilder zu immersiven Live-Erlebnissen. Aus Ihren 3D-Daten, den Gegebenheiten des Orts und vorhandenem Material entsteht eine lauffähige Echtzeit-Anwendung, das Installationssystem darum herum und daraus gerendertes Bildmaterial — von der technischen Konzeption über den Aufbau vor Ort bis zum Dauerbetrieb aus einer Hand. Aktuell für Projekte verfügbar.",
  },
  greeting: null, // 发给特定客户时可以改这里，加定制问候
  sections: {
    order: ["intro", "projects", "portfolio", "education"],
    hide: ["work", "toolset", "moreWorks"],
    emphasize: ["projects", "portfolio", "contact"],
  },
  /* 侧边栏与 01 号 UE 版同一套（含年限）：同一个人对外只该有一套能力口径，
     两份简历的侧栏写法不一样，客户与 HR 交叉看到时会觉得其中一份在注水。
     顺序仍按本变体的说服力排：先艺术现场用得上的，再是背书最长的。 */
  skillDisplay: "since",
  sidebar: [
    "cap-unreal",  // 虚幻 / 蓝图 / 着色器（原 cap-ue5 + cap-bp + cap-shader 合并条）
    "cap-vr",
    "cap-sensor",
    // cap-techart 不列：它显示「1 年」，对付费客户是减分项。
    // 不改年限口径、也不关 skillDisplay —— 那会和求职版互相矛盾；
    // 名片版本来就是精选短列表，少列一条不构成履历矛盾。
    "cap-genai",
    "cap-3d",
    "cap-artdes",
  ],
  highlightTools: [
    "t-ue5", "t-bp", "t-metaxr", "t-osc", "t-arduino", "t-esp32",
    "t-shader", "t-niagara", "t-light",
    "t-blender", "t-zbrush", "t-md", "t-rokoko",
  ],
  /* 两条门面项目各补一句「可核验的规模」。客户看装置最先想知道的不是理念，而是
     「这东西在真实现场撑了多久、出没出事、几个人做的」。
     ⚠️ 数字一律留【待填】占位，不替你编 —— 这类数字被追问时对不上，比不写还糟。
        填完把方括号连同提示一起删掉即可。 */
  itemOverrides: {
    "prj-room": {
      summary: {
        zh: "用户在虚拟房间中穿行，通过实时传感器与现实物体的反馈相连，在物理在场、数字记忆与沉浸叙事之间构建混合空间。展期【待填：X 周】，现场连续运行【待填：每天 X 小时 / 共 X 天】，【待填：是否无人值守】；团队【待填：X 人】，我负责【待填：实时系统 / 传感器集成 / 现场搭建 …】。",
        ja: "ユーザーはバーチャルな部屋を探索し、物理オブジェクトからのリアルタイムセンサーフィードバックと接続。身体的存在・デジタル記憶・没入型ストーリーテリングの間に混合空間を生成する。会期【待填：X 週間】、現場では【待填：1 日 X 時間 / 計 X 日】連続稼働、【待填：無人運用かどうか】。チーム【待填：X 名】、担当は【待填：リアルタイムシステム / センサー統合 / 現場設営 …】。",
        en: "Users explore a virtual room connected to real-time sensor feedback from physical objects, creating a hybrid space between physical presence, digital memory and immersive storytelling. Shown for 【待填：X weeks】, running 【待填：X hours a day / X days total】 on site, 【待填：unattended or staffed】; team of 【待填：X】, my part: 【待填：real-time system / sensor integration / on-site build …】.",
        de: "Benutzer erkunden einen virtuellen Raum, der über Echtzeit-Sensorfeedback mit physischen Objekten verbunden ist — ein Hybridraum zwischen körperlicher Präsenz, digitalem Gedächtnis und immersivem Storytelling. Laufzeit 【待填：X Wochen】, vor Ort 【待填：X Stunden täglich / X Tage gesamt】 im Dauerbetrieb, 【待填：betreut oder unbeaufsichtigt】; Team 【待填：X Personen】, mein Teil: 【待填：Echtzeitsystem / Sensorintegration / Aufbau vor Ort …】.",
      },
    },
    "prj-grau": {
      summary: {
        zh: "通过面部扫描与访谈研究，将养老院老人的形象、记忆与故事重建为可交互探索的数字档案，结合数字人、VR 空间与社会关怀。共扫描重建【待填：X 位】老人，采集访谈【待填：X 小时】；展出【待填：X 周】，现场连续运行【待填：每天 X 小时】；团队【待填：X 人】，我负责【待填：数字人管线 / VR 场景 / 交互实现 …】。",
        ja: "顔スキャンとインタビューを通じて、ケアホームの高齢者の姿・記憶・人生の物語をデジタルアーカイブとして再構築。デジタルヒューマン、VR 空間、社会的ケアを統合した作品。【待填：X 名】の高齢者をスキャン・再構築し、インタビューは【待填：X 時間】。会期【待填：X 週間】、現場で【待填：1 日 X 時間】連続稼働。チーム【待填：X 名】、担当は【待填：デジタルヒューマン工程 / VR 空間 / インタラクション実装 …】。",
        en: "Elderly care home residents digitized through facial scanning and reconstructed in virtual space. Interviews and research create interactive life archives — combining digital human, VR space and social care. 【待填：X residents】 scanned and rebuilt, 【待填：X hours】 of interviews recorded; shown for 【待填：X weeks】, running 【待填：X hours a day】 on site; team of 【待填：X】, my part: 【待填：digital-human pipeline / VR scene / interaction …】.",
        de: "Pflegeheim-Bewohner wurden per Gesichtsscan digitalisiert und im virtuellen Raum rekonstruiert. Interviews und Recherche ergeben interaktive Lebensarchive — Digital Human, VR und soziale Fürsorge verbunden. 【待填：X Bewohnerinnen und Bewohner】 gescannt und rekonstruiert, 【待填：X Stunden】 Interviewmaterial; Laufzeit 【待填：X Wochen】, vor Ort 【待填：X Stunden täglich】 im Dauerbetrieb; Team 【待填：X Personen】, mein Teil: 【待填：Digital-Human-Pipeline / VR-Szene / Interaktion …】.",
      },
    },
  },

  // 两条艺术装置仍是本变体的门面（排在前、标绿竖线）；虚拟制片与 Verse Wiki 跟着一起显示，
  // 但不抢重点 —— 前者是 KHM 的教学工作坊，后者是自己做的产品，都能证明「接得住委托」。
  emphasizeItems: ["prj-room", "prj-grau"],
  // 挡掉两个不适合对外名片的邮箱：求职邮箱、以及私人域名的接单邮箱。本变体用 email-biz。
  hideItems: ["email-pro", "email-freelance"],
  order: { contact: ["email-biz"] }, // 对外邮箱排第一；电话与链接保持原顺序
  /* 联系方式下方的一段合作信息。客户（尤其德国机构）签约前真正会问的三件事：
     怎么签、怎么开票、雇一个外国人有没有手续风险 —— 一次说清，省得来回问。
     ⚠️ 页面上不放任何证件图片或证件号码，只写「可应要求提供」。 */
  contactNote: {
    zh: "自由职业，按项目签承揽合同（Werkvertrag），开具带德国税号的发票。居留许可允许在德国全境从事自由职业媒体开发 / 媒体艺术委托，有效至 2028-03-05；签约前可应要求提供居留卡与附页复印件。",
    ja: "フリーランスとして活動。案件ごとに請負契約（Werkvertrag）を締結し、ドイツの税番号付きで請求書を発行します。滞在許可によりドイツ全土でメディア開発・メディアアートの受託が可能で、有効期限は 2028 年 3 月 5 日。契約前であれば、滞在カードと付属書類の写しをご要望に応じて提示します。",
    en: "Working freelance, engaged per project under a work contract (Werkvertrag), invoicing with a German tax number. My residence permit allows freelance work as a media developer / media artist throughout Germany until 5 March 2028; copies of the permit and its supplementary sheet are available on request before signing.",
    de: "Freiberuflich tätig, Beauftragung per Werkvertrag, Rechnung mit deutscher Steuernummer. Der Aufenthaltstitel erlaubt die freiberufliche Tätigkeit als Medienentwickler/Medienkünstler bundesweit bis 05.03.2028; Kopie des Titels und des Zusatzblatts stelle ich auf Anfrage vor Vertragsschluss zur Verfügung.",
  },

  /* 作品集里现在有了非视频链接（Verse Wiki 是网站）→ 一个指向 Vimeo 的共用 QR 覆盖不到它，
     跟 01 号一样改指 works.html，那一页按本变体的可见条目列出全部可点链接。 */
  worksPage: true,
  /* ⧉ 复制按钮：只给「姓名 + 个人链接」。本变体面对的是客户与策展人，
     粘一份 HR 评分模板过去很奇怪。 */
  copyLinksOnly: true,
  /* 照片：**刻意**用艺术化兔子图而不是证件照 —— 本变体是名片身份，对面是艺术机构与策展人，
     一张证件照会把语境拉回「求职」。这是选择，不是遗漏，别顺手换掉。
     发给偏正式的客户时把下面两行对调即可。 */
  photo: "assets/photo/usagi.jpg",
  // photo: "assets/photo/FotoCV-2026.jpg", // 备选：本人照片，给需要看到人的客户
};
