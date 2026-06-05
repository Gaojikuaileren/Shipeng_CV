/* ============================================================
   pdf-hint.js — 开头引导气泡：指向 PDF 按钮，提示「可打印 / 保存 PDF」
   所有职业页 + 打工页共用。文案随当前语言。5s 后自动淡出(2s)，或点击关闭。
   不进 PDF 打印（print.css 隐藏）。
   ============================================================ */
window.PdfHint = {
  _shown: false,
  show: function () {
    if (this._shown) return;
    const btn = document.getElementById("btn-pdf");
    if (!btn) return;
    this._shown = true;

    const TXT = {
      zh: "点这里可以打印 / 保存成 PDF",
      ja: "ここから印刷・PDF 保存ができます",
      en: "Print or save as PDF here",
      de: "Hier drucken oder als PDF speichern",
    };
    const lang = (window.I18n && window.I18n.current) || "en";

    const bubble = document.createElement("div");
    bubble.className = "pdf-hint";
    bubble.setAttribute("role", "status");
    const txt = document.createElement("span");
    txt.className = "pdf-hint-txt";
    txt.textContent = TXT[lang] || TXT.en;
    const x = document.createElement("span");
    x.className = "pdf-hint-x"; x.textContent = "✕";
    bubble.appendChild(txt); bubble.appendChild(x);
    document.body.appendChild(bubble);

    function place() {
      const r = btn.getBoundingClientRect();
      bubble.style.top = (r.bottom + 10) + "px";
      bubble.style.right = Math.max(8, window.innerWidth - r.right) + "px";
    }
    place();
    requestAnimationFrame(function () { bubble.classList.add("show"); });

    let fade = null, gone = null;
    function dismiss(fast) {
      clearTimeout(fade); clearTimeout(gone);
      if (fast) bubble.style.transition = "opacity .3s ease";
      bubble.classList.add("out");
      gone = setTimeout(function () { bubble.remove(); window.removeEventListener("resize", place); }, fast ? 320 : 2000);
    }
    fade = setTimeout(function () { dismiss(false); }, 5000);   // 显示 5s → 淡出 2s
    bubble.addEventListener("click", function () { dismiss(true); }); // 手动点击关闭
    window.addEventListener("resize", place, { passive: true });
  },
};
