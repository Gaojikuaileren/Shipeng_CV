/* ============================================================
   i18n-ui.js — 所有 UI 文案（四语）集中一处，方便统一维护
   被 render.js / export/text.js 引用（window.UI_TEXT）。
   注意：必须在 render.js / text.js 之前加载。
   ============================================================ */
window.UI_TEXT = {
  /* 板块标题 */
  section: {
    skills:    { zh: "核心技能",   ja: "コアスキル",    en: "Core Skills",     de: "Kernkompetenzen" },
    toolset:   { zh: "完整工具集", ja: "ツールセット",  en: "Full Toolset",    de: "Vollständiges Toolset" },
    languages: { zh: "语言",      ja: "言語",          en: "Languages",       de: "Sprachen" },
    contact:   { zh: "联系方式",   ja: "連絡先",        en: "Contact",         de: "Kontakt" },
    projects:  { zh: "项目经历",   ja: "プロジェクト",   en: "Projects",        de: "Projekte" },
    work:      { zh: "工作经历",   ja: "職務経歴",      en: "Experience",      de: "Berufserfahrung" },
    moreWorks: { zh: "更多作品",   ja: "その他の作品",  en: "More Works",      de: "Weitere Arbeiten" },
    portfolio: { zh: "作品集",    ja: "作品集",        en: "Selected Work",   de: "Ausgewählte Arbeiten" },
    education: { zh: "教育经历",   ja: "学歴",          en: "Education",       de: "Ausbildung" },
    oddjobs:   { zh: "工作经历",   ja: "アルバイト経験", en: "Work Experience", de: "Arbeitserfahrung" },
    /* collab = 通用「能力板块」标题；变体可用 sectionTitles.collab 换成更具体的说法 */
    collab:    { zh: "我能带来什么", ja: "提供できること", en: "What I Bring",   de: "Was ich einbringe" },
  },

  /* 行内小文案
     video / store / web = 作品集条目的链接类型徽标（project.linkKind 决定用哪个）：
     指向视频＝「视频」，指向应用商店＝「商店」，指向网站＝「网站」。
     前面的箭头符号在 render.js 里按类型给（▶ / ↗），不属于文案。 */
  txt: {
    reveal:    { zh: "点击显示", ja: "クリックで表示", en: "Click to reveal", de: "Anzeigen" },
    showEmail: { zh: "显示",    ja: "表示",          en: "Show",            de: "Zeigen" },
    video:     { zh: "视频",    ja: "動画",          en: "Video",           de: "Video" },
    store:     { zh: "商店",    ja: "ストア",        en: "Store",           de: "Store" },
    web:       { zh: "网站",    ja: "サイト",        en: "Site",            de: "Website" },
  },

  /* 经验时长（duration.js 按 capability.since 实时算出；{n} = 数字，{v} = 已成形的时长串）
     zh/ja 无复数，de/en 只有单 / 复两形 → 各语言各写各的，不引入 Intl 复数规则。
     英语写全词（year/month），不用 yr/mo：全站英文 UI 无缩写，德语那边也是全拼
     （Jahre / Monate），宽度实测两者相同，缩写换不到任何排版余地。 */
  duration: {
    year:   { zh: "{n} 年",   ja: "{n}年",     en: "{n} year",   de: "{n} Jahr" },
    years:  { zh: "{n} 年",   ja: "{n}年",     en: "{n} years",  de: "{n} Jahre" },
    month:  { zh: "{n} 个月", ja: "{n}か月",   en: "{n} month",  de: "{n} Monat" },
    months: { zh: "{n} 个月", ja: "{n}か月",   en: "{n} months", de: "{n} Monate" },
    /* 屏幕阅读器用的完整说法：免得只念出一个孤零零的数字 */
    aria:   { zh: "{v}经验",  ja: "{v}の経験", en: "{v} of experience", de: "{v} Erfahrung" },
  },

  /* 「更多作品」折叠 / 展开按钮（屏幕端；PDF 里按钮隐藏、条目全显，见 print.css）
     {n} = 条目总数。条目本来就少的变体 render.js 根本不建这个按钮（见 MW_COLLAPSED），
     所以 {n} 永远 ≥ 7 → 德语 / 英语只会用到复数形态，不需要写单数。 */
  mwToggle: {
    expand:   { zh: "展开全部 {n} 项", ja: "すべて表示（{n} 件）", en: "Show all {n} works", de: "Alle {n} Arbeiten anzeigen" },
    collapse: { zh: "收起",           ja: "折りたたむ",           en: "Show fewer",       de: "Weniger anzeigen" },
  },

  /* 项目经历折叠。与 mwToggle 同一套语气，只是量词从「项/件/works」换成「项目/件/projects」。 */
  prjToggle: {
    expand:   { zh: "展开全部 {n} 个项目", ja: "すべての案件を表示（{n} 件）", en: "Show all {n} projects", de: "Alle {n} Projekte anzeigen" },
    collapse: { zh: "收起",               ja: "折りたたむ",                   en: "Show fewer",           de: "Weniger anzeigen" },
  },

  /* 作品链接页 works.html —— PDF 作品集里那个共用 QR 扫进来的落地页。
     纸上印不了超链接，扫码的人又几乎都在手机上 → 那一页把每件作品做成可点的大块链接。
     页面标题直接用 profile.name，这里只放页面自己的文案。 */
  works: {
    lead: {
      zh: "以下是简历中各件作品的直达链接，在手机上可以直接点开。",
      ja: "履歴書に載せた各作品への直接リンクです。スマートフォンからそのままタップできます。",
      en: "Direct links to the works listed in my CV — tap any of them on your phone.",
      de: "Direkte Links zu den Arbeiten aus meinem Lebenslauf — am Handy einfach antippen.",
    },
    /* 印在 PDF 里 QR 下方的一行说明（窄栏，约 34mm）→ 四语都要短 */
    qrNote: {
      zh: "扫码打开全部作品链接（手机可直接点）",
      ja: "QR で全作品のリンクへ（スマホでタップ可）",
      en: "Scan for all project links — tappable on mobile",
      de: "QR scannen: alle Projektlinks, direkt antippbar",
    },
    backCV: { zh: "查看完整简历", ja: "履歴書を見る", en: "View the full CV", de: "Zum vollständigen Lebenslauf" },
    /* 该变体一条带链接的作品都没有时的兜底（不留空白页）*/
    empty:  { zh: "暂时没有可直接打开的作品链接。", ja: "公開中のリンクはまだありません。",
              en: "No public work links yet.",     de: "Noch keine öffentlichen Links vorhanden." },
  },

  /* 工具集分组名
     ⚠️ 这里的键顺序只是可读性，真正的渲染顺序写在 render.js 的 groupOrder 数组里。
     新增一组必须两处都加，否则该组的工具会被静默丢弃（render.js 只遍历 groupOrder）。 */
  group: {
    engine:      { zh: "引擎 & 实时",  ja: "エンジン",                 en: "Engine & Real-time",    de: "Engine" },
    ai:          { zh: "AI & 生成式",  ja: "AI & 生成",                en: "AI & Generative",       de: "KI & Generativ" },
    interactive: { zh: "交互 & 传感",  ja: "インタラクション & センサー", en: "Interactive & Sensors", de: "Interaktion & Sensoren" },
    techArt:     { zh: "技术美术",     ja: "テクニカルアート",          en: "Technical Art",         de: "Technical Art" },
    "3d":        { zh: "3D & 资产",   ja: "3D & アセット",            en: "3D & Assets",           de: "3D & Assets" },
    code:        { zh: "代码",        ja: "コード",                   en: "Code",                  de: "Code" },
    design:      { zh: "设计",        ja: "デザイン",                 en: "Design",                de: "Design" },
    video:       { zh: "影像 & 插画", ja: "映像 & イラスト",           en: "Video & Illustration",  de: "Video & Illustration" },
  },

  /* 复制反馈提示 */
  copyMsg: {
    ok:   { zh: "已复制",   ja: "コピー完了", en: "Copied",      de: "Kopiert" },
    fail: { zh: "复制失败", ja: "コピー失敗", en: "Copy failed", de: "Fehlgeschlagen" },
  },

  /* Copy 按钮附带的 HR 评分模板 */
  hrTemplate: {
    zh: [
      "─── HR 评分 ─────────────────────",
      "应聘岗位：",
      "面试日期：",
      "综合评价：□ 优先  □ 合适  □ 一般  □ 不符合",
      "备注：",
      "",
    ].join("\n"),
    en: [
      "─── HR Review ───────────────────",
      "Position: ",
      "Interview date: ",
      "Overall: □ Priority  □ Suitable  □ Average  □ No fit",
      "Notes: ",
      "",
    ].join("\n"),
    de: [
      "─── Bewerbungsnotiz ─────────────",
      "Stelle: ",
      "Gesprächsdatum: ",
      "Eindruck: □ Bevorzugt  □ Geeignet  □ Befriedigend  □ Ungeeignet",
      "Notizen: ",
      "",
    ].join("\n"),
    ja: [
      "─── 採用メモ ─────────────────────",
      "応募職種：",
      "面接日：",
      "評価：□ 優先  □ 適格  □ 普通  □ 不適格",
      "備考：",
      "",
    ].join("\n"),
  },
};
