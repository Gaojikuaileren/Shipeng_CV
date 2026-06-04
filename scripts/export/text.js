/* ============================================================
   export/text.js — ⧉ 复制按钮
   内容：姓名 + 当前可见联系方式 + HR 评分模板（随当前语言）
   HR 在拿到简历链接后点 Copy，直接得到可填写的联系模板。
   ============================================================ */
window.Exporter = window.Exporter || {};

// UI 文案集中在 scripts/i18n-ui.js（window.UI_TEXT）
const COPY_MSG = window.UI_TEXT.copyMsg;
const HR_TMPL = window.UI_TEXT.hrTemplate;

window.Exporter.copySummary = function (data) {
  const lang = window.I18n ? window.I18n.current : "en";
  const t    = window.I18n ? (f => window.I18n.t(f)) : (f => (typeof f === "string" ? f : (f && (f.en || "")) || ""));

  // 1) 姓名
  const name = t(data.profile.name);

  // 2) 当前 DOM 里可见的联系方式（reveal 按钮还未点击的跳过）
  const contactLines = [];
  document.querySelectorAll(".cv-contact-row").forEach((row) => {
    if (row.querySelector(".cv-reveal")) return; // 未解锁，跳过
    const label = (row.querySelector(".cv-contact-label") || {}).textContent || "";
    const link  = row.querySelector("a.cv-link");
    const val   = link ? link.textContent.trim() : "";
    if (label.trim() && val) contactLines.push(label.trim() + ":  " + val);
  });

  // 3) 拼接 + HR 模板
  const text = [
    name,
    contactLines.join("\n"),
    "",
    HR_TMPL[lang] || HR_TMPL.en,
  ].join("\n");

  const ok   = COPY_MSG.ok[lang]   || "Copied";
  const fail = COPY_MSG.fail[lang] || "Copy failed";

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      ()  => notify(ok),
      ()  => fallbackCopy(text, ok, fail)
    );
  } else {
    fallbackCopy(text, ok, fail);
  }
};

function notify(msg) {
  if (window.toast) window.toast(msg);
}
function fallbackCopy(text, okMsg, failMsg) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); notify(okMsg); }
  catch (e) { notify(failMsg); }
  document.body.removeChild(ta);
}
