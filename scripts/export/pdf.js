/* ============================================================
   export/pdf.js — A4 简历导出
   原生打印：文字矢量、可选中、ATS 友好、零依赖。
   用户在打印对话框选「另存为 PDF」即得 A4 简历。
   排版由 styles/print.css 负责（屏幕版与打印版是两套排版）。
   ============================================================ */
window.Exporter = window.Exporter || {};

window.Exporter.resumePDF = function () {
  // 导出前展开 private/防采集字段 → 简历联系方式完整、ATS 可读（本人主动导出）
  document.querySelectorAll(".cv-reveal").forEach((b) => b.click());
  document.body.classList.add("printing-resume");
  document.body.classList.remove("printing-card");
  cleanupAfterPrint("printing-resume");
  window.print();
};

function cleanupAfterPrint(cls) {
  function clean() {
    document.body.classList.remove(cls);
    window.removeEventListener("afterprint", clean);
  }
  window.addEventListener("afterprint", clean);
}
// 暴露给 card.js 复用
window.Exporter._cleanupAfterPrint = cleanupAfterPrint;
