/* art-vr.js — ② 德国企业客户（?v=fl）

   ⚠️ 文件名与内部 ID 仍叫 art-vr，内容却是面向企业客户的 —— 这是**有意的**：
      内部 ID 是统计后端的计数键与 body.v-* 的排版类名，改名会把历史访问数断成两截、
      并要求重标 print.css。2026-08-24 本变体从「媒体艺术自由职业名片」整体换成
      「德国企业客户」版本（原先短暂存在过的 biz-3d 变体已并入这里），对外地址不变，仍是 ?v=fl。
      要看被顶替掉的艺术版内容：git show eb62e5b:data/variants/art-vr.js

   读者是**展台搭建公司、影视制作公司、建筑可视化工作室、数字代理商的项目经理与采购**。
   他们要判断的只有三件事：这人能不能交付、会不会在展会现场掉链子、签约有没有手续风险。

   由此推出的三条硬规则（改这个文件之前先读）：
     · 全文第一人称单数。不出现「我们 / wir / Team / Studio / Agentur」——
       个人自由职业者用复数会造成法律与税务上的误解（像在冒充一家公司）。
     · 不出现艺术词汇（艺术家 / Künstler / Medienkunst / 驻留 / Residenz / 策展 / 沉浸式体验）。
       同一批经历换一套讲法：装置→系统 / 应用，展览→连续运行 X 周且公开可访问，
       观众体验→用户操作，概念研究→需求分析与方案设计，实时影像→实时渲染，沉浸式→交互式 / 可操作。
     · 只重新解释 base.js 里已有的真实经历。日期 / 学校 / 学历 / 语言等级只来自 base.js，
       这里一律用 itemOverrides 换叙述，绝不新增不存在的项目、客户、交付或年限。

   ⚠️ 文案红线（2026-08-24 定，改本文件的文案前必读）：
     ① 不写「产品配置器」这个类目，也不写它的**等价描述**
        （把你的 CAD 数据做成可操作程序 ＋ 产品视频）—— 换个词不算数。
        顺带一提：base.js 里本来也没有任何一条配置器项目，删掉之后
        页面反而和证据对得上了。
     ② 不写「分包 / 承揽 / 白标」这套服务商叙事。改成强调本人亲自构思、
        亲自实现、亲自到场负责 —— 页面要传达的是「我本人做的」，
        不是「我能转包」。
     这两条背后有具体理由，**故意不写在这里**（本文件会原样下发给每个访客）；
     要改先问本人，不要因为「看着像是漏写了」就把它们加回去。

   联系邮箱用 email-biz（contact.gjklr@icloud.com）。这个条目只有本变体显示，
   其余变体都在 hideItems 里挡了它 —— 改 base.js 里那一行不会溢到别的简历上。 */
window.RESUME_VARIANT = {
  id: "art-vr", // 见文件头：ID 保持 art-vr 是为了统计计数键与排版类名不断档

  headline: {
    zh: "实时 3D 开发 · 虚拟展厅 / 互动展台",
    ja: "リアルタイム 3D 開発 · バーチャルショールーム / インタラクティブ展示",
    en: "Real-time 3D Developer · Virtual Showrooms / Interactive Exhibits",
    de: "Echtzeit-3D-Entwickler · Virtuelle Showrooms / Interaktive Messeexponate",
  },

  intro: {
    zh: "科隆自由职业媒体开发者。用 Unreal Engine 5 做实时 3D 应用——虚拟展厅、互动展台，离线跑在你的硬件上，整场展会无人值守也不掉链子。输入是你的 3D 数据与场地条件，输出是一个能上手操作的程序；同一个工程还能顺带出渲染影像。技术方案、实现到现场调试，都由我本人完成。",
    ja: "ケルンを拠点とするフリーランスのメディア開発者。Unreal Engine 5 でリアルタイム 3D アプリケーションを開発します——バーチャルショールーム、インタラクティブ展示。いずれも御社のハードウェア上でオフラインで動作し、展示会の全会期を無人で稼働し続けます。御社の 3D データと会場条件を入力に、操作できるアプリケーションを納品。同じプロジェクトからレンダリング映像も併せて出力します。技術設計・実装・現地調整は、すべて私自身が担当します。",
    en: "Freelance media developer based in Cologne. I build real-time 3D applications with Unreal Engine 5 — virtual showrooms and interactive exhibits that run offline on your hardware and survive a full trade-fair week unattended. Your 3D data and the conditions of the site go in; a usable application comes out, plus rendered footage from the same project. Concept, implementation and on-site commissioning are all my own work.",
    de: "Freiberuflicher Medienentwickler in Köln. Ich entwickle Echtzeit-3D-Anwendungen mit Unreal Engine 5 — virtuelle Showrooms und interaktive Exponate, die offline auf Ihrer Hardware laufen und einen ganzen Messeeinsatz ohne Betreuung durchhalten. Aus Ihren 3D-Daten und den Gegebenheiten des Orts entsteht eine bedienbare Anwendung, aus demselben Projekt zusätzlich gerendertes Bildmaterial. Konzeption, Umsetzung und Inbetriebnahme vor Ort verantworte ich selbst.",
  },

  greeting: null,

  /* 侧栏「状态」一行：dd 只有约 231px，四语都必须一行放得下，别加第四段。
     location 沿用 base.js 的写法。 */
  profileFields: [
    { key: "location",
      label: { zh: "所在地", ja: "所在地", en: "Location", de: "Standort" },
      value: { zh: "德国 科隆", ja: "ドイツ・ケルン", en: "Cologne, Germany", de: "Köln, Deutschland" },
      visibility: "public" },
    { key: "status",
      label: { zh: "状态", ja: "ステータス", en: "Status", de: "Status" },
      value: { zh: "自由职业 · 承揽合同 · 可远程", ja: "フリーランス · 請負契約 · リモート可", en: "Freelance · Work-for-hire · Remote", de: "Freiberuflich · Werkvertrag · remote" },
      visibility: "public" },
  ],

  /* 联系方式下方：专门消除「雇一个外国人有没有风险」这个顾虑。
     位置显眼但不抢主内容 —— 它在侧栏联系方式底下，不进正文。
     ⚠️ 页面上不放任何证件图片或证件号码，只写「可应要求提供」。 */
  contactNote: {
    zh: "居留许可依《居留法》第 21 条第 5 款签发——允许以媒体开发者 / 媒体从业者身份在德国全境从事自由职业，有效至 2028-03-05。签约前可应要求提供居留卡与附页复印件。开具带德国税号的发票。使用自有生产设备、自行安排工时、同时服务多个委托方。",
    ja: "滞在許可はドイツ滞在法第 21 条第 5 項に基づくもので、メディア開発者としてドイツ全土でのフリーランス活動が 2028 年 3 月 5 日まで認められています。契約前であれば、滞在カードと付属書類の写しをご提示します。請求書はドイツの税番号付きで発行。自前の設備を用い、稼働時間は自ら管理し、複数の発注者と取引しています。",
    en: "Residence permit under § 21 (5) of the German Residence Act — freelance work as a media developer is permitted throughout Germany until 5 March 2028. Copies of the permit and its supplementary sheet are available on request before signing. Invoicing with a German tax number. I work with my own equipment, set my own hours and serve several clients.",
    de: "Aufenthaltstitel nach § 21 Abs. 5 AufenthG — freiberufliche Tätigkeit als Medienentwickler/Medienkünstler, bundesweit erlaubt bis 05.03.2028. Kopie des Titels und des Zusatzblatts stelle ich auf Anfrage vor Vertragsschluss zur Verfügung. Rechnung mit deutscher Steuernummer. Ich arbeite mit eigenen Betriebsmitteln, eigener Zeiteinteilung und für mehrere Auftraggeber.",
  },

  /* 工具集不显示（本人 2026-08-24 定）：它是一整块长清单，把页面拉得很长，
     而这份的读者是采购 —— 他们看的是项目能不能交付，不是我会多少软件。
     下面的 highlightTools 因此目前不生效，留着：哪天又想显示，把 "toolset"
     从 hide 里拿走、加回 order 即可。 */
  sections: {
    order: ["intro", "projects", "portfolio", "education"],
    hide: ["work", "moreWorks", "toolset"],
    emphasize: ["projects", "portfolio", "contact"],
  },

  /* 板块标题按企业语境改写：「项目经历」听起来像履历，「项目案例」才是客户在找的东西。 */
  sectionTitles: {
    projects: { zh: "项目案例", ja: "実績", en: "Reference Projects", de: "Referenzprojekte" },
    portfolio: { zh: "作品示例", ja: "作例", en: "Work Samples", de: "Arbeitsproben" },
  },

  /* 顺序按对企业客户的说服力排：先是他们要买的（引擎与 3D），再是差异化能力，
     最后是年限最长的背书。
     cap-techart 不列 —— 它显示「1 年」，对企业客户是减分项；名片式的短列表少一条
     不构成履历矛盾（求职版仍然列，年限口径没有分叉）。 */
  skillDisplay: "since",
  sidebar: ["cap-unreal", "cap-3d", "cap-vr", "cap-sensor", "cap-artdes", "cap-genai"],

  /* 工具集突出企业客户认得出的名字：引擎与渲染管线、硬件对接、建模。 */
  highlightTools: [
    "t-ue5", "t-bp", "t-shader", "t-light", "t-niagara", "t-env", "t-opt", "t-levelseq",
    "t-vp", "t-metahuman", "t-metaxr", "t-blender", "t-osc", "t-arduino", "t-esp32",
  ],

  /* 四条项目全部按「任务 / 实现 / 结果 / 技术 / 角色」五段重写。
     「结果」那一段是**可核验的数字**，2026-08-24 由本人逐条给出并填入四语。
     ⚠️ 规矩不变：这些数字会被采购当场追问，改动前先确认对得上。宁可删掉一句，
        也不要写一个圆不回来的数字 —— 下面两处就是这么删的：
          · 我的灰发：访谈素材时长不是他处理的，整句去掉；
          · Verse Wiki：注册用户数与支付成功率按本人要求移除。 */
  itemOverrides: {
    "prj-room": {
      role: { zh: "实时系统开发", ja: "リアルタイムシステム開発", en: "Real-time System Development", de: "Echtzeitsystem-Entwicklung" },
      type: { zh: "交互式实时应用 · 传感器集成", ja: "インタラクティブ・リアルタイムアプリ · センサー統合", en: "Interactive Real-time Application · Sensor Integration", de: "Interaktive Echtzeit-Anwendung · Sensorintegration" },
      summary: {
        zh: "任务：在一个实体空间里，让来访者通过触碰现场物体来操作一套实时 3D 应用，全程无需工作人员讲解。实现：搭建 UE5 实时场景与状态机，把物理物体上的传感器信号接入引擎，做成可操作的交互流程。结果：现场连续运行 10 天，每天 5–8 小时，公开可访问 4 周，计划外重启 0 次。技术：Unreal Engine 5、Blueprint、传感器硬件（OSC / ESP32）、实时渲染。角色：独立完成技术方案、实现与现场调试，投入约 1 年。",
        ja: "課題：実空間で、来場者が現場の物体に触れるだけでリアルタイム 3D アプリを操作でき、係員の説明を要しない構成にすること。実装：UE5 のリアルタイムシーンとステートマシンを構築し、物体側のセンサー信号をエンジンへ取り込み、操作可能なインタラクションとして組み立てた。結果：現地で 10 日間、1 日 5〜8 時間の連続稼働、4 週間一般公開、予定外の再起動 0 回。技術：Unreal Engine 5、Blueprint、センサー機器（OSC / ESP32）、リアルタイムレンダリング。担当：技術設計・実装・現地調整を単独で担当、稼働は約 1 年。",
        en: "Task: let visitors operate a real-time 3D application in a physical space simply by touching objects on site, with no staff explanation needed. Implementation: built the UE5 real-time scene and state machine, fed sensor signals from the physical objects into the engine and turned them into an operable interaction flow. Result: ran on site for 10 days, 5–8 hours a day, publicly accessible for 4 weeks, zero unplanned restarts. Stack: Unreal Engine 5, Blueprint, sensor hardware (OSC / ESP32), real-time rendering. Role: sole responsibility for concept, implementation and on-site commissioning; roughly a year of work.",
        de: "Aufgabe: Besucher sollen eine Echtzeit-3D-Anwendung allein durch das Berühren von Objekten vor Ort bedienen können, ohne Erklärung durch Personal. Umsetzung: UE5-Echtzeitszene und Zustandsautomat aufgebaut, Sensorsignale der physischen Objekte in die Engine geführt und zu einem bedienbaren Ablauf verarbeitet. Ergebnis: 10 Tage im Dauerbetrieb vor Ort, täglich 5–8 Stunden, 4 Wochen öffentlich zugänglich, keine ungeplanten Neustarts. Technik: Unreal Engine 5, Blueprint, Sensorhardware (OSC / ESP32), Echtzeitrendering. Rolle: Konzeption, Umsetzung und Inbetriebnahme vor Ort allein verantwortet, Aufwand rund ein Jahr.",
      },
    },
    "prj-grau": {
      role: { zh: "3D 扫描与数字人管线", ja: "3D スキャンとデジタルヒューマン工程", en: "3D Scanning & Digital Human Pipeline", de: "3D-Scanning & Digital-Human-Pipeline" },
      type: { zh: "3D 扫描 · 数字人 · 可交互查看应用", ja: "3D スキャン · デジタルヒューマン · 閲覧アプリ", en: "3D Scanning · Digital Human · Interactive Viewer", de: "3D-Scanning · Digital Human · Interaktive Anwendung" },
      summary: {
        zh: "任务：把真人形象与访谈素材转成可在 VR 里自由查看的数字资料库，供非技术用户直接上手。实现：建立从面部扫描到可用数字人资产的完整管线（清理、重拓扑、绑定），并做出 VR 中的浏览与检索交互。结果：扫描并重建 4 位人物，交付 2 个打包好的 Windows x86 可执行程序。技术：Unreal Engine 5、3D 扫描、数字人管线、VR。角色：独立负责扫描处理、资产管线与 VR 实现，投入约 6 个月。",
        ja: "課題：実在の人物像とインタビュー素材を、VR 上で自由に閲覧できるデジタル資料として整備し、非技術者がそのまま扱えるようにすること。実装：顔スキャンから使用可能なデジタルヒューマンアセットまでの一貫した工程（クリーンアップ・リトポロジー・リグ）を構築し、VR 内での閲覧・検索インタラクションを実装した。結果：4 名をスキャン・再構築し、Windows x86 向けにビルドした実行ファイル 2 本を納品。技術：Unreal Engine 5、3D スキャン、デジタルヒューマン工程、VR。担当：スキャン処理・アセット工程・VR 実装を単独で担当、稼働は約 6 か月。",
        en: "Task: turn real portraits and interview material into a digital archive that can be browsed freely in VR by non-technical users. Implementation: built the full pipeline from facial scan to usable digital-human asset (cleanup, retopology, rigging) and implemented browsing and lookup interaction inside VR. Result: 4 people scanned and rebuilt, 2 packaged Windows x86 builds delivered. Stack: Unreal Engine 5, 3D scanning, digital-human pipeline, VR. Role: sole responsibility for scan processing, asset pipeline and VR implementation; roughly 6 months of work.",
        de: "Aufgabe: reale Porträts und Interviewmaterial in ein digitales Archiv überführen, das sich in VR frei durchsehen lässt und auch von Nicht-Technikern bedient werden kann. Umsetzung: durchgehende Pipeline vom Gesichtsscan bis zum einsatzfähigen Digital-Human-Asset aufgebaut (Bereinigung, Retopologie, Rigging) und die Navigation samt Suche in VR umgesetzt. Ergebnis: 4 Personen gescannt und rekonstruiert, 2 fertig gepackte Windows-x86-Builds geliefert. Technik: Unreal Engine 5, 3D-Scanning, Digital-Human-Pipeline, VR. Rolle: Scanverarbeitung, Asset-Pipeline und VR-Umsetzung allein verantwortet, Aufwand rund 6 Monate.",
      },
    },
    "prj-vp": {
      role: { zh: "实时合成管线搭建 / 培训", ja: "リアルタイム合成パイプライン構築・研修", en: "Real-time Compositing Pipeline & Training", de: "Echtzeit-Compositing-Pipeline & Schulung" },
      type: { zh: "虚拟制片 · 相机追踪 · 现场合成", ja: "バーチャルプロダクション · カメラトラッキング · 現場合成", en: "Virtual Production · Camera Tracking · On-set Compositing", de: "Virtual Production · Kameratracking · On-Set-Compositing" },
      summary: {
        zh: "任务：在一间普通场地里搭起可用的虚拟制片链路，让摄影机拍到的画面与实时 3D 背景当场合成，并让第一次接触的人当天就能独立操作。实现：Unreal Engine 5.5 配合 Composure 做现场合成，接入 Blackmagic 采集与实时相机追踪（Seemo / Lightcraft），打通与外部工具的 USD 资产交换，演示场景使用自有 3D 资产。结果：链路搭建 3 天完成，现场连续拍摄 4 小时，参训 12 人当天独立完成拍摄。技术：Unreal Engine 5.5、Composure、LiveLink、Blackmagic、USD。角色：独立完成链路搭建、现场调试与授课，代课讲师。",
        ja: "課題：通常の会場に実用可能なバーチャルプロダクションの一連の流れを構築し、カメラ映像とリアルタイム 3D 背景をその場で合成、初めて触れる人でも当日中に単独で操作できる状態にすること。実装：Unreal Engine 5.5 と Composure による現場合成、Blackmagic のキャプチャとリアルタイムカメラトラッキング（Seemo / Lightcraft）を接続し、外部ツールとの USD アセット連携までを通した。デモシーンには自作の 3D アセットを使用。結果：構築に 3 日、現場での連続撮影 4 時間、受講者 12 名が当日中に単独で撮影を完了。技術：Unreal Engine 5.5、Composure、LiveLink、Blackmagic、USD。担当：構築・現場調整・指導を単独で担当（代講）。",
        en: "Task: set up a working virtual-production chain in an ordinary room so that camera footage composites with a real-time 3D background on the spot, and first-time users can operate it independently the same day. Implementation: on-set compositing with Unreal Engine 5.5 and Composure, Blackmagic capture and live camera tracking (Seemo / Lightcraft) connected, plus a working USD asset exchange with external tools; demo scene built from my own 3D assets. Result: chain set up in 3 days, 4 hours of continuous shooting on site, 12 participants shooting independently by the end of the day. Stack: Unreal Engine 5.5, Composure, LiveLink, Blackmagic, USD. Role: set-up, on-site commissioning and instruction handled alone, as substitute instructor.",
        de: "Aufgabe: in einem gewöhnlichen Raum eine einsatzfähige Virtual-Production-Kette aufbauen, sodass Kamerabild und Echtzeit-3D-Hintergrund direkt vor Ort zusammengeführt werden und Erstnutzer sie noch am selben Tag selbstständig bedienen können. Umsetzung: On-Set-Compositing mit Unreal Engine 5.5 und Composure, Blackmagic-Capture und Live-Kameratracking (Seemo / Lightcraft) angebunden, dazu ein funktionierender USD-Assetaustausch mit externen Werkzeugen; Demo-Szene aus eigenen 3D-Assets. Ergebnis: Aufbau in 3 Tagen, 4 Stunden durchgehender Dreh vor Ort, 12 Teilnehmende drehten am selben Tag selbstständig. Technik: Unreal Engine 5.5, Composure, LiveLink, Blackmagic, USD. Rolle: Aufbau, Inbetriebnahme und Schulung allein verantwortet, als Vertretung.",
      },
    },
    "prj-versewiki": {
      role: { zh: "全栈开发与上线运营", ja: "フルスタック開発と運用", en: "Full-Stack Development & Operations", de: "Full-Stack-Entwicklung & Betrieb" },
      type: { zh: "在线课程平台 · 含支付与账号", ja: "オンライン講座プラットフォーム · 決済・アカウント対応", en: "Online Course Platform · Payments & Accounts", de: "Online-Kursplattform · Zahlung & Konten" },
      summary: {
        zh: "任务：把一套技术教学内容做成能自助购买、自助学习的双语站点，全流程无需人工介入。实现：独立完成前端、内容结构、账号与支付接入，部署在 Cloudflare 上并配好持续发布。结果：上线 9 章 30 课内容。技术：Cloudflare、Supabase、Stripe、UE Verse。角色：需求分析、设计、开发、上线与后续维护全部独立完成。",
        ja: "課題：技術教育コンテンツを、購入から受講まで利用者が自力で完結できる二言語サイトとして構築し、運用に人手を要しないようにすること。実装：フロントエンド、コンテンツ構造、アカウントと決済の接続をすべて単独で実装し、Cloudflare 上に配置して継続的な公開体制を整えた。結果：9 章 30 レッスンを公開。技術：Cloudflare、Supabase、Stripe、UE Verse。担当：要件整理・設計・開発・公開・保守まで単独で対応。",
        en: "Task: turn a body of technical training material into a bilingual site where users buy and study on their own, with no manual step in the loop. Implementation: built the front end, the content structure and the account and payment integration single-handedly, deployed on Cloudflare with continuous publishing in place. Result: 9 chapters and 30 lessons published. Stack: Cloudflare, Supabase, Stripe, UE Verse. Role: requirements, design, development, launch and ongoing maintenance all handled alone.",
        de: "Aufgabe: technisches Schulungsmaterial in eine zweisprachige Website überführen, auf der Nutzer selbstständig kaufen und lernen, ohne dass ein manueller Schritt nötig wird. Umsetzung: Frontend, Inhaltsstruktur sowie Konten- und Zahlungsanbindung eigenständig umgesetzt, auf Cloudflare bereitgestellt und mit fortlaufender Veröffentlichung eingerichtet. Ergebnis: 9 Kapitel mit 30 Lektionen veröffentlicht. Technik: Cloudflare, Supabase, Stripe, UE Verse. Rolle: Anforderungen, Entwurf, Entwicklung, Launch und Wartung allein verantwortet.",
      },
    },
  },

  emphasizeItems: ["prj-room", "prj-vp"], // 门面：一个现场长稳运行、一个当场交付且带培训

  // 挡掉两个不适合对外的邮箱（求职邮箱、私人域名接单邮箱），本变体用 email-biz
  hideItems: ["email-pro", "email-freelance"],
  order: {
    // order 只排序、不隐藏：没列到的 Portfolio / GitHub / Instagram 仍然会显示在后面。
    // 真要挡掉 Instagram，把 "instagram" 加进上面的 hideItems。
    contact: ["email-biz", "phone", "linkedin"],
    projects: ["prj-room", "prj-vp"],            // 折叠状态下先看到这两条
  },

  /* PDF 里给一个能扫的作品入口，指向 works.html（那一页按本变体的可见条目列出可点链接）。 */
  worksPage: true,

  /* ⧉ 复制按钮只给「姓名 + 联系方式」，不附 HR 评分模板 —— 对面是采购，不是 HR。 */
  copyLinksOnly: true,

  /* 照片：不设 photo，沿用 base.js 的申请照（深色外套、中性背景），**不是**自由职业版的兔子图。
     那张照片对企业客户够用；若日后拍了更正式的商务肖像，在这里加一行 photo 覆盖即可。 */
};
