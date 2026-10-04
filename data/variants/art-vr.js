/* art-vr.js — ② 自由职业（?v=fl）：网页设计 ＋ 实时 3D / 交互媒体 ＋ 3D · 动画 · 影像

   ⚠️ 文件名与内部 ID 仍叫 art-vr，内容却早已不是「艺术 / VR」—— 这是**有意的**：
      内部 ID 是统计后端的计数键与 body.v-* 的排版类名，改名会把历史访问数断成两截、
      并要求重标 print.css。对外地址一直是 ?v=fl。沿革：
        · 最初是「媒体艺术自由职业名片」；
        · 2026-08-24 整体换成「德国企业客户」版本（原先短暂存在过的 biz-3d 变体已并入这里）。
          要看被顶替掉的艺术版内容：git show eb62e5b:data/variants/art-vr.js
        · 2026-10-02 加入网页设计业务，定位放宽为「设计师与媒体艺术家」，三条业务并列：
            ① 网页设计与数字形象
            ② 实时 3D、虚拟展厅、互动展台与交互媒体
            ③ 3D、动画、渲染与本地影像制作流程
          企业客户版原有的内容（项目案例与其中的数字、侧栏年限、居留说明）一字未动，
          只是前面多了「服务范围」一块，头衔与简介改成覆盖三条业务。
        · 2026-10-04（本人定）：去掉一切行业 / 客群指向的用词；「服务范围」收成四个大类、
          每类一句简介、不列细目：实时 3D 交互 / 网页设计与搭建 / 美术资产制作 / 影视后期。
          原来的「合作方式」一块撤掉、不再保留（本人确认）；简介改成讲「我」，不再罗列服务。

   读者现在是两类人：
     · **小型企业、机构和个人**（网页业务）；
     · **展台搭建公司、影视制作公司、建筑可视化工作室、数字代理商的项目经理与采购**（原读者）。
   他们要判断的仍是那三件事：这人能不能交付、会不会在现场掉链子、签约有没有手续风险。

   由此推出的三条硬规则（改这个文件之前先读）：
     · 全文第一人称单数。不出现「我们 / wir / Team / Studio / Agentur」——
       个人自由职业者用复数会造成法律与税务上的误解（像在冒充一家公司）。
     · 艺术词汇只用在**出身与身份**上：头衔、简介的第一句、教育经历、名片。
       （2026-10-02 之前这条是「一概不出现」；本人要求保留媒体艺术背景后放宽到这里为止。）
       身份全站只有一个说法：「设计师与媒体艺术家 / Designer & Medienkünstler」。
       名片是画好的图、上面的字改不了，所以头衔与简介向名片看齐（本人 2026-10-02 定）——
       别再写回「媒体开发者」，否则页面和名片又成了两个身份。
       项目案例仍按交付口径写，不写驻留 / Residenz / 策展 / 沉浸式体验；
       同一批经历的讲法：装置→系统 / 应用，展览→连续运行 X 周且公开可访问，
       观众体验→用户操作，概念研究→需求分析与方案设计，实时影像→实时渲染，沉浸式→交互式 / 可操作。
     · 只重新解释 base.js 里已有的真实经历。日期 / 学校 / 学历 / 语言等级只来自 base.js，
       这里一律用 itemOverrides 换叙述，绝不新增不存在的项目、客户、交付或年限。

   业务怎么写（2026-10-02 定，2026-10-04 修订）：
     · 不写任何行业或客群的具体指向（本人 2026-10-04 要求去掉）。
     · 「服务范围」四个类名，每类一句简介，不列细目；要加细目先问本人。
     · 不讲战绩：在有已上线、且客户同意公开的案例之前，不写客户名，也不写「已为多少家……」。
       在建的试点与静态演示不算案例；将来要加，按「在建试点 / 静态演示 / 已上线」分别标明。
     · 不写套餐表、价格、折扣、付款与维护条件 —— 这些都还没定。
     · 「本地运行、素材不上传云端」只属于 3D 预演 → 影片镜头那条 AI 管线（FilmGen），
       不要泛化到网页或别的业务上。

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

  /* 头衔 = 身份 ＋ 三个方向。身份与名片上那一行逐字相同（见文件头），
     三个方向的顺序与下面「服务范围」、名片上的方向行一致（网页在前）。
     「自由职业」不进头衔：侧栏状态行与简介第一句都已经写了，三处重复只会把这一行撑长。 */
  headline: {
    zh: "设计师与媒体艺术家 · 网页设计 / 实时 3D / 交互媒体",
    ja: "デザイナー & メディアアーティスト · Web デザイン / リアルタイム 3D / インタラクティブメディア",
    en: "Designer & Media Artist · Web Design / Real-time 3D / Interactive Media",
    de: "Designer & Medienkünstler · Webdesign / Echtzeit-3D / Interaktive Medien",
  },

  /* 简介 = 首屏，讲「我」：身份与出身 → 我怎么做事 → 我看重什么 → 我怎么和人合作。
     服务清单不进这里（下面「服务范围」每类一句）。本人 2026-10-04 定：简介更多是表达我。
     ⚠️ 艺术词汇只在第一、二句的身份与出身里出现（见文件头）；第一人称单数；不写行业或客群指向。
        「设计师与媒体艺术家」与名片同一个说法，别换。 */
  intro: {
    zh: "我是住在科隆的自由职业设计师与媒体艺术家。先在湖北工业大学读产品设计，后在科隆媒体艺术学院（KHM）完成媒体艺术 Diplom。我喜欢把一个想法一路做到真正能用：先想清楚它给谁用、该是什么样子，再亲手把它做出来，调到稳定为止。设计和技术对我来说是同一件事的两面——画面要好看，结构要清楚，东西要经得起长时间使用。我用中文、德语、英语和日语工作，习惯和背景各不相同的人一起把事情做成。",
    ja: "ケルンを拠点とするフリーランスのデザイナー兼メディアアーティストです。湖北工業大学でプロダクトデザインを学んだ後、ケルン・メディア芸術大学（KHM）でメディアアーツの Diplom を取得しました。アイデアを、実際に使えるものになるまで仕上げるのが好きです。誰がどう使うのか、どんな姿であるべきかを考え抜き、自分の手で形にして、安定して動くまで調整します。私にとってデザインと技術は同じものの表と裏——見た目が美しく、構造が明快で、長く使えること。中国語・ドイツ語・英語・日本語で仕事をし、さまざまな背景を持つ人と一緒にものをつくることに慣れています。",
    en: "I'm a freelance designer and media artist based in Cologne. I studied product design at Hubei University of Technology and completed my Diploma in Media Arts at KHM Cologne. What I enjoy most is taking an idea all the way to something people can actually use: working out who it is for and what it should look like, then building it myself and tuning it until it runs reliably. To me, design and technology are two sides of the same thing — it should look right, be clearly structured and hold up in long-term use. I work in Chinese, German, English and Japanese, and I'm used to getting things done with people from very different backgrounds.",
    de: "Ich bin freiberuflicher Designer und Medienkünstler in Köln. Nach dem Produktdesign-Studium an der Hubei University of Technology habe ich an der Kunsthochschule für Medien Köln (KHM) mein Diplom in Media Arts gemacht. Am liebsten bringe ich eine Idee bis zu etwas, das man wirklich benutzen kann: erst klären, für wen es ist und wie es aussehen soll, dann selbst umsetzen und so lange abstimmen, bis es zuverlässig läuft. Gestaltung und Technik sind für mich zwei Seiten derselben Sache — es soll gut aussehen, klar aufgebaut sein und im Dauereinsatz bestehen. Ich arbeite auf Chinesisch, Deutsch, Englisch und Japanisch und bin es gewohnt, mit Menschen ganz unterschiedlicher Hintergründe etwas auf die Beine zu stellen.",
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

  /* 信息层级：简介（我是谁）→ 服务范围（我提供什么）→ 项目案例（凭什么信）→
     作品示例（可点的链接）→ 教育。「服务范围」排在案例之前：来的人先要知道能找我做什么。

     工具集不显示（本人 2026-08-24 定）：它是一整块长清单，把页面拉得很长，
     而这份的读者是客户与采购 —— 他们看的是项目能不能交付，不是我会多少软件。
     下面的 highlightTools 因此目前不生效，留着：哪天又想显示，把 "toolset"
     从 hide 里拿走、加回 order 即可。工作经历（work）同样一直是隐藏的。 */
  sections: {
    order: ["intro", "collab", "projects", "portfolio", "education"],
    hide: ["work", "moreWorks", "toolset"],
    emphasize: ["collab", "projects", "portfolio", "contact"],
  },

  /* 板块标题按客户语境改写：「项目经历」听起来像履历，「项目案例」才是客户在找的东西。
     collab 是通用的「能力板块」机制（china-biz 用它讲中德协作），这里用来并列四个服务大类。 */
  sectionTitles: {
    collab: { zh: "服务范围", ja: "サービス", en: "Services", de: "Leistungen" },
    projects: { zh: "项目案例", ja: "実績", en: "Reference Projects", de: "Referenzprojekte" },
    portfolio: { zh: "作品示例", ja: "作例", en: "Work Samples", de: "Arbeitsproben" },
  },

  /* —— 服务范围：四个大类，每类一句简介（本人 2026-10-04 定）————————————————
     顺序 = 本人给的顺序；桌面、平板与 PDF 里排成 2 × 2（screen.css 的 body.v-art-vr 规则），手机上单列。
     每块 = 类名 ＋ 一句 note，不写 items（本人：不列具体内容，但要有简短介绍）。
     ⚠️ 四块都要有 note：subgrid 让「标题 / 说明」两行横向对齐，缺一块就会错位。
        render.js 遇到空 items 不输出列表，所以没有空的 <ul>。
     ⚠️ 每句都得对得上 base.js 的经历：实时 3D＝千声之室（离线、10 天无人值守）等；
        网页＝Verse Wiki 等；美术资产＝3D / 扫描 / 数字人（我的灰发）与工具集里的 2D 软件；
        影视后期＝KHM 方向、剪辑合成软件，以及 FilmGen —— 「本地」只挂在这条 AI 流程上。 */
  collab: [
    { id: "sv-rt",
      title: { zh: "实时 3D 交互", ja: "リアルタイム 3D・インタラクション", en: "Real-time 3D & Interaction", de: "Echtzeit-3D & Interaktion" },
      note: { zh: "用 Unreal Engine 5 开发能上手操作的实时 3D 应用，离线运行，长时间无人值守也稳定。",
              ja: "Unreal Engine 5 で、実際に操作できるリアルタイム 3D アプリケーションを開発。オフラインで動作し、長時間の無人稼働にも耐えます。",
              en: "Real-time 3D applications people can actually operate, built in Unreal Engine 5 — running offline and stable through long unattended use.",
              de: "Bedienbare Echtzeit-3D-Anwendungen mit Unreal Engine 5 — offline lauffähig und stabil auch im langen unbetreuten Betrieb." } },
    { id: "sv-web",
      title: { zh: "网页设计与搭建", ja: "Web デザイン・サイト構築", en: "Web Design & Development", de: "Webdesign & -entwicklung" },
      note: { zh: "从视觉与信息结构设计到上线，做适配手机、平板和桌面的网站。",
              ja: "ビジュアルと情報設計から公開まで、スマートフォン・タブレット・PC に対応したサイトをつくります。",
              en: "Websites from visual design and structure through to launch — for phone, tablet and desktop.",
              de: "Websites von Gestaltung und Struktur bis zum Launch — für Smartphone, Tablet und Desktop." } },
    { id: "sv-art",
      title: { zh: "美术资产制作", ja: "アートアセット制作", en: "Art Asset Production", de: "Art-Asset-Produktion" },
      note: { zh: "3D 建模、贴图、扫描与数字人资产，以及 2D 插画，可直接用于引擎与渲染。",
              ja: "3D モデリング・テクスチャ・スキャン、デジタルヒューマンのアセット、2D イラストまで。エンジンやレンダリングでそのまま使えます。",
              en: "3D modelling, texturing, scanning and digital-human assets, plus 2D illustration — ready for engines and rendering.",
              de: "3D-Modellierung, Texturing, Scans und Digital-Human-Assets, dazu 2D-Illustration — direkt einsetzbar in Engine und Rendering." } },
    { id: "sv-post",
      title: { zh: "影视后期", ja: "映像ポストプロダクション", en: "Film & Video Post-production", de: "Film- & Video-Postproduktion" },
      note: { zh: "剪辑与合成，以及把 3D 预演直接转成影片镜头的本地 AI 流程。",
              ja: "編集とコンポジット。3D プリビズから映像ショットを直接生成する、ローカルの AI ワークフローも。",
              en: "Editing and compositing, plus a local AI workflow that turns a 3D previs straight into film shots.",
              de: "Schnitt und Compositing, dazu ein lokaler KI-Workflow, der aus einer 3D-Previs direkt Filmshots macht." } },
  ],

  /* 顺序：网页设计领头（与头衔、服务范围的顺序一致），其后沿用企业客户版原来的排法 ——
     先是他们要买的（引擎与 3D），再是差异化能力，最后是年限最长的背书。
     cap-webdes 的起始月与「9 年」是本人 2026-08-18 在求职版里确认过的同一个口径。
     cap-techart 不列 —— 它显示「1 年」，对客户是减分项；名片式的短列表少一条
     不构成履历矛盾（求职版仍然列，年限口径没有分叉）。 */
  skillDisplay: "since",
  sidebar: ["cap-webdes", "cap-unreal", "cap-3d", "cap-vr", "cap-sensor", "cap-artdes", "cap-genai"],

  /* 工具集突出企业客户认得出的名字：引擎与渲染管线、硬件对接、建模。 */
  highlightTools: [
    "t-ue5", "t-bp", "t-shader", "t-light", "t-niagara", "t-env", "t-opt", "t-levelseq",
    "t-vp", "t-metahuman", "t-metaxr", "t-blender", "t-osc", "t-arduino", "t-esp32",
  ],

  /* 五条项目全部按「任务 / 实现 / 结果 / 技术 / 角色」五段重写。
     「结果」那一段是**可核验的数字**，2026-08-24 由本人逐条给出并填入四语。
     ⚠️ 规矩不变：这些数字会被采购当场追问，改动前先确认对得上。宁可删掉一句，
        也不要写一个圆不回来的数字 —— 下面两处就是这么删的：
          · 我的灰发：访谈素材时长不是他处理的，整句去掉；
          · Verse Wiki：注册用户数与支付成功率按本人要求移除。
     FilmGen（2026-09-28 加入）的结果数字同样由本人给出：单镜头耗时、三种出片模式；
     「全部本地运行、素材不上传云端」经本人确认属实。 */
  itemOverrides: {
    /* 教育「方向」只留与四个服务大类对得上的几项（2026-10-04）。PDF 里教育与作品示例
       并排走全宽流，这一块的高度由较高的教育栏决定 —— 原文德语 6 + 4 行，把整块挤到第 4 页。
       base.js 的完整写法不动（其余变体照旧）。 */
    "edu-khm": { detail: {
      zh: "方向：实时 3D、VR、游戏引擎、动画、3D 扫描、影视后期、建筑投影。",
      ja: "専門：リアルタイム 3D、VR、ゲームエンジン、アニメーション、3D スキャン、映像ポストプロダクション、建築プロジェクションマッピング。",
      en: "Focus: real-time 3D, VR, game engines, animation, 3D scanning, film/video post-production, projection mapping.",
      de: "Schwerpunkte: Echtzeit-3D, VR, Game Engines, Animation, 3D-Scanning, Film-/Video-Postproduktion, Architekturprojektion." } },
    "edu-hbut": { detail: {
      zh: "方向：工业设计、产品设计、3D 造型、视觉设计。",
      ja: "専門：工業デザイン、プロダクトデザイン、3D モデリング、ビジュアルデザイン。",
      en: "Focus: industrial design, product design, 3D modelling, visual design.",
      de: "Schwerpunkte: Industriedesign, Produktdesign, 3D-Modellierung, Visuelles Design." } },
    "prj-filmgen": {
      role: { zh: "AI 视频管线搭建", ja: "AI 動画パイプライン構築", en: "AI Video Pipeline Development", de: "KI-Video-Pipeline-Entwicklung" },
      type: { zh: "3D 预演 → AI 影片镜头 · 本地运行", ja: "3D プリビズ → AI 映像ショット · ローカル稼働", en: "3D Previs → AI Film Shots · Runs Locally", de: "3D-Previs → KI-Filmshots · lokal betrieben" },
      summary: {
        zh: "任务：把 3D 白盒预演直接转成可用的影片镜头 —— 场景布局、机位运动和动作节奏按预演走，人物与画面按参考图走，全部在本地硬件上运行、素材不上传云端。实现：在 UE5 中用简单几何体搭场景与人物占位、用 Sequencer 设计镜头并导出白盒 / 深度视频；在 ComfyUI 中搭建模块化生产工作流，结合首帧、角色设定板与分时提示词生成镜头，含姿态动作控制与多镜头长片串联。结果：一条 5 秒镜头（480P）本地生成约 160–225 秒；按「布局最严 / 速度优先 / 动作最自然」三种需求定出固定的出片模式。技术：Unreal Engine 5、Sequencer、Movie Render Queue、ComfyUI、视频生成模型、深度 / 姿态控制。角色：独立负责技术方案、工作流架构、预演制作与画面质量把控。",
        ja: "課題：3D ブロックアウトのプリビズを、そのまま使える映像ショットへ変換すること —— レイアウト・カメラワーク・動作のタイミングはプリビズに、人物と画づくりは参照画像に従い、すべてをローカルのハードウェア上で処理して素材をクラウドへ上げない。実装：UE5 で単純なジオメトリによりセットと人物の仮置きを組み、Sequencer でショットを設計してブロックアウト / 深度動画を書き出し、ComfyUI 上にモジュール式の制作ワークフローを構築。先頭フレーム・キャラクターシート・時間区切りのプロンプトからショットを生成し、ポーズによる動作制御と複数ショットの長尺連結まで対応。結果：5 秒のショット（480P）1 本あたりローカル生成で約 160〜225 秒、「レイアウト最優先 / 速度優先 / 動作の自然さ優先」の 3 要件に対応する固定の出力モードを確立。技術：Unreal Engine 5、Sequencer、Movie Render Queue、ComfyUI、動画生成モデル、深度 / ポーズ制御。担当：技術設計・ワークフロー設計・プリビズ制作・画質管理を単独で担当。",
        en: "Task: turn a 3D blockout previs directly into usable film shots — layout, camera moves and action timing follow the previs, characters and look follow the reference images; everything runs on local hardware and no material is uploaded to the cloud. Implementation: blocked out sets and character stand-ins in UE5 with simple geometry, designed the shots in Sequencer and exported blockout / depth videos; built a modular production workflow in ComfyUI that generates shots from a first frame, character sheets and timed prompts, including pose-driven motion control and multi-shot long-form sequencing. Result: one 5-second shot (480p) generated locally in about 160–225 seconds; three fixed output modes for three typical requirements — strictest layout, fastest turnaround, most natural motion. Stack: Unreal Engine 5, Sequencer, Movie Render Queue, ComfyUI, video generation models, depth / pose control. Role: sole responsibility for technical concept, workflow architecture, previs and image-quality control.",
        de: "Aufgabe: eine 3D-Blockout-Previs direkt in verwendbare Filmshots überführen — Layout, Kamerabewegung und Bewegungs-Timing folgen der Previs, Figuren und Bildlook den Referenzbildern; alles läuft auf lokaler Hardware, kein Material wird in eine Cloud hochgeladen. Umsetzung: Sets und Figuren-Platzhalter in UE5 aus einfacher Geometrie aufgebaut, Shots im Sequencer gestaltet und als Blockout- bzw. Tiefenvideo exportiert; in ComfyUI einen modularen Produktions-Workflow aufgebaut, der Shots aus Startframe, Character Sheets und zeitlich gegliederten Prompts erzeugt, inklusive posenbasierter Bewegungssteuerung und Verkettung mehrerer Shots zu Langformen. Ergebnis: ein 5-Sekunden-Shot (480p) in etwa 160–225 Sekunden lokal erzeugt; drei feste Ausgabemodi für drei typische Anforderungen — exaktes Layout, kürzeste Laufzeit, natürlichste Bewegung. Technik: Unreal Engine 5, Sequencer, Movie Render Queue, ComfyUI, Videogenerierungsmodelle, Tiefen- / Posensteuerung. Rolle: technisches Konzept, Workflow-Architektur, Previs und Bildqualitätskontrolle allein verantwortet.",
      },
    },
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
        de: "Aufgabe: reale Porträts und Interviewmaterial in ein digitales Archiv überführen, das sich in VR frei durchsehen und auch ohne Technikkenntnisse bedienen lässt. Umsetzung: durchgehende Pipeline vom Gesichtsscan bis zum einsatzfähigen Digital-Human-Asset (Bereinigung, Retopologie, Rigging), dazu Navigation und Suche in VR. Ergebnis: 4 Personen gescannt und rekonstruiert, 2 gepackte Windows-x86-Builds geliefert. Technik: Unreal Engine 5, 3D-Scanning, Digital-Human-Pipeline, VR. Rolle: Scanverarbeitung, Asset-Pipeline und VR-Umsetzung allein verantwortet, Aufwand rund 6 Monate.",
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
        de: "Aufgabe: technisches Schulungsmaterial als zweisprachige Website, auf der Nutzer ohne manuellen Zwischenschritt selbst kaufen und lernen. Umsetzung: Frontend, Inhaltsstruktur, Konten- und Zahlungsanbindung eigenständig umgesetzt, auf Cloudflare mit fortlaufender Veröffentlichung bereitgestellt. Ergebnis: 9 Kapitel mit 30 Lektionen veröffentlicht. Technik: Cloudflare, Supabase, Stripe, UE Verse. Rolle: Anforderungen, Entwurf, Entwicklung, Launch und Wartung allein verantwortet.",
      },
    },
  },

  // 门面：一个现场长稳运行、一个本地 AI 影片管线（2026-09-28 起替下虚拟制片，本人定）
  emphasizeItems: ["prj-room", "prj-filmgen"],

  // 挡掉两个不适合对外的邮箱（求职邮箱、私人域名接单邮箱），本变体用 email-biz
  hideItems: ["email-pro", "email-freelance"],
  order: {
    // order 只排序、不隐藏：没列到的 Portfolio / GitHub / Instagram 仍然会显示在后面。
    // 真要挡掉 Instagram，把 "instagram" 加进上面的 hideItems。
    contact: ["email-biz", "phone", "linkedin"],
    // 折叠状态下先看到前两条；虚拟制片显式排第三，否则会按 base.js 的顺序落到「我的灰发」后面
    projects: ["prj-room", "prj-filmgen", "prj-vp"],
  },

  /* PDF 里给一个能扫的作品入口，指向 works.html（那一页按本变体的可见条目列出可点链接）。 */
  worksPage: true,

  /* —— PDF 版式：作品示例 ＋ 教育经历改走「全宽流」（屏幕上不变，仍在右栏）——————
     2026-10-02 加了「服务范围」之后，正文多出约 110 mm：中文 / 日文从 3 页涨到 4 页、
     德语从 4 页涨到 5 页，而多出来的那一页只挂着半段教育经历。
     侧栏在第 2 页就结束了，之后每页左边那条 34% 的轨道是空的（机制见 render.js 的
     printFullWidth 段）—— 把最后这两块挪到栅格外，按整页宽度排，正好把那一页收回来。
     项目案例不挪：它挪出去以后，第 2 页「联系方式」右边会空出一整块。
     2026-10-04 起四语都是 3 页，而且英 / 德第 3 页基本写满（页脚落在 y≈804pt）：
     教育「方向」用 itemOverrides 压短、我的灰发 / Verse Wiki 的德语措辞收紧，才装进来。
     往第 2–3 页加任何内容之前，先跑 tools/snapshot.py 看页数。 */
  printFullWidth: ["portfolio", "education"],

  /* ⧉ 复制按钮只给「姓名 + 联系方式」，不附 HR 评分模板 —— 对面是客户，不是 HR。 */
  copyLinksOnly: true,

  /* —— 名片（▭ Card：预览、下载、分享）——————————————————————————————
     这张名片是**画好的图**，不是现排的：姓名是本人手绘的字，没有字库，任何字体都排不出来。
     所以预览显示的、下载到的、分享出去的，都是下面这四张图本身（四语各一张，跟着当前语言走）。
     写了 card 的变体才这样；没写的变体仍是 card.js 里那张现排的横版 —— 其余四份简历不受影响。
       images  四语的名片图。成品由 tools/card-images.py 从画稿做出来：裁出卡片、
               把稿子上写着「QR」的占位方块换成真二维码，其余像素不动。
               ⚠️ 别直接把画稿丢进 assets/card/ —— 稿子上的二维码是占位块，扫不出东西。
       alt     图片的替代文字（读屏用）。只写姓名与身份，不写邮箱：
               那是 protected 字段，明文不进 DOM（图片里的像素不算）。
       size    成品的像素尺寸 [宽, 高]，四语一致。预览靠它提前占位，图片到之前之后不会跳一下；
               换了新尺寸的画稿要一起改（node tools/check.js 第 13 项会核对）。
       qrUrl   图里那个二维码的内容。写死成线上的正式地址：名片是要印出来、发出去的，
               不能跟着当前页面走。改了它要重跑 tools/card-images.py —— 二维码是烙在图里的。
     名片上的身份行（设计师与媒体艺术家）与页面头衔是同一个说法，见文件头。 */
  card: {
    images: {
      zh: "assets/card/shipeng-card-zh.png",
      ja: "assets/card/shipeng-card-ja.png",
      en: "assets/card/shipeng-card-en.png",
      de: "assets/card/shipeng-card-de.png",
    },
    alt: {
      zh: "欧阳世鹏的名片 — 设计师与媒体艺术家",
      ja: "Shipeng Ouyang の名刺 — デザイナー＆メディアアーティスト",
      en: "Business card of Shipeng Ouyang — Designer & Media Artist",
      de: "Visitenkarte von Shipeng Ouyang — Designer & Medienkünstler",
    },
    size: [768, 1200],
    qrUrl: "https://gaojikuaileren.github.io/Shipeng_CV/?v=fl",
  },

  /* 照片：不设 photo，沿用 base.js 的申请照（深色外套、中性背景），**不是**自由职业版的兔子图。
     那张照片对企业客户够用；若日后拍了更正式的商务肖像，在这里加一行 photo 覆盖即可。 */
};
