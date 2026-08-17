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

  /* 行内小文案 */
  txt: {
    reveal:    { zh: "点击显示", ja: "クリックで表示", en: "Click to reveal", de: "Anzeigen" },
    showEmail: { zh: "显示",    ja: "表示",          en: "Show",            de: "Zeigen" },
    video:     { zh: "视频",    ja: "動画",          en: "Video",           de: "Video" },
  },

  /* 工具集分组名 */
  group: {
    engine:      { zh: "引擎 & 实时",  ja: "エンジン",                 en: "Engine & Real-time",    de: "Engine" },
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
