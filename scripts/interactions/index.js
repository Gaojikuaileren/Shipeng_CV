/* ============================================================
   interactions/index.js — 交互层注册中心 + 内置交互
   渐进增强：够格（支持 IO 且非 reduced-motion）才点亮 html.motion-on，否则纯静态。
   只用 transform → GPU 合成；打工页 odd 不引本文件 → 永远无动效。
   ============================================================ */
window.Interactions = (function () {
  "use strict";
  const registry = [];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = matchMedia("(max-width: 700px)").matches;
  const supportsIO = "IntersectionObserver" in window;
  if (!reduceMotion && supportsIO) document.documentElement.classList.add("motion-on");
  function register(def) { registry.push(def); }
  function init(ctx) {
    if (!document.documentElement.classList.contains("motion-on")) return;
    registry.forEach((def) => {
      if (reduceMotion && !def.reducedMotion) return;
      if (isMobile && def.mobile === false) return;
      if (!isMobile && def.desktop === false) return;
      try { def.init && def.init(ctx); } catch (e) { console.warn("[interaction]", def.id, e); }
    });
  }
  return { register, init, env: { reduceMotion, isMobile, supportsIO }, _registry: registry };
})();

/* —— 工具集浮动：缓入(≈4s) + 极慢 + 触边反弹 + 移开收回；语言切换后自动重绑 —— */
window.Interactions.register({
  id: "toolset-float",
  desktop: true, mobile: false,
  init: function () {
    function setup() {
      const box = document.querySelector(".cv-toolset");
      if (!box || box._floatBound) return;          // 防重复绑（同一 DOM）
      box._floatBound = true;
      let items = [], raf = null, floating = false, timer = null, bw = 0, bh = 0, ramp = 0;
      function measure() {
        const br = box.getBoundingClientRect();
        bw = box.clientWidth; bh = box.clientHeight;
        items = [].slice.call(box.querySelectorAll(".cv-tset-tag")).map(function (el) {
          const r = el.getBoundingClientRect();
          return { el: el, bl: r.left - br.left, bt: r.top - br.top, w: r.width, h: r.height, x: 0, y: 0, vx: 0, vy: 0 };
        });
      }
      function start() {
        if (floating) return;
        measure(); floating = true; ramp = 0;
        items.forEach(function (it) {
          it.el.style.transition = "none";
          it.vx = (Math.random() - 0.5) * 0.4;
          it.vy = (Math.random() - 0.5) * 0.4;
        });
        loop();
      }
      function loop() {
        if (!floating) return;
        ramp = Math.min(1, ramp + 1 / 240);          // ≈4s 缓入
        const MAX = 0.16;                             // 极慢
        for (let i = 0; i < items.length; i++) {
          const it = items[i];
          it.vx += (Math.random() - 0.5) * 0.012;     // 布朗扰动 → 无序
          it.vy += (Math.random() - 0.5) * 0.012;
          const sp = Math.hypot(it.vx, it.vy);
          if (sp > MAX) { it.vx *= MAX / sp; it.vy *= MAX / sp; }
          it.x += it.vx * ramp; it.y += it.vy * ramp; // 缓入：ramp 由 0 渐到 1
          if (it.bl + it.x < 0) { it.x = -it.bl; it.vx = Math.abs(it.vx); }
          else if (it.bl + it.w + it.x > bw) { it.x = bw - it.w - it.bl; it.vx = -Math.abs(it.vx); }
          if (it.bt + it.y < 0) { it.y = -it.bt; it.vy = Math.abs(it.vy); }
          else if (it.bt + it.h + it.y > bh) { it.y = bh - it.h - it.bt; it.vy = -Math.abs(it.vy); }
          it.el.style.transform = "translate(" + it.x.toFixed(2) + "px," + it.y.toFixed(2) + "px)";
        }
        raf = requestAnimationFrame(loop);
      }
      function stop() {
        floating = false;
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        items.forEach(function (it) { it.el.style.transition = ""; it.el.style.transform = ""; });
      }
      box.addEventListener("mouseenter", function () { timer = setTimeout(start, 450); });
      box.addEventListener("mouseleave", function () { clearTimeout(timer); stop(); });
    }
    setup();
    if (window.I18n && window.I18n.onChange) window.I18n.onChange(setup); // 切换语言重渲后重绑
  },
});

/* —— 自由职业兔子：随时间渐放大、越来越快，1 小时后占满屏幕停止 —— */
window.Interactions.register({
  id: "rabbit-grow",
  desktop: true, mobile: true,
  init: function () {
    if (!document.body.classList.contains("v-art-vr")) return;
    const photo = document.querySelector(".cv-photo");
    if (!photo) return;
    const p = new URLSearchParams(location.search);
    const secs = parseInt(p.get("grow"), 10);        // 测试用：?grow=60 → 1 分钟看完整过程
    const DURATION = (secs > 0 ? secs : 1200) * 1000; // 默认 1200s = 20 分钟
    const base = photo.getBoundingClientRect().width || 320;
    const maxS = Math.max(window.innerWidth, window.innerHeight) / base * 1.25; // 占满屏幕
    photo.style.transformOrigin = "center center";
    photo.style.position = "relative";
    photo.style.zIndex = "600";
    const t0 = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - t0) / DURATION);
      const s = 1 + (maxS - 1) * Math.pow(t, 2.4);   // 开始慢、越来越快
      photo.style.transform = "scale(" + s.toFixed(3) + ")";
      if (t < 1) requestAnimationFrame(tick);
    })(t0);
  },
});

/* —— 游戏开发专属彩蛋：联系方式停留 5s → 左下掀黑角 → 点击撕开 Steam 链接 —— */
window.Interactions.register({
  id: "contact-peel",
  desktop: true, mobile: true,
  init: function () {
    if (!document.body.classList.contains("v-ue5-tech")) return;
    function setup() {
      const contact = document.querySelector('.cv-block[data-sec="contact"]');
      if (!contact || contact._peelBound) return;
      contact._peelBound = true;
      contact.style.position = "relative";
      let timer = null;
      const arm = function () { timer = setTimeout(function () { peel(contact); }, 5000); };
      const disarm = function () { clearTimeout(timer); };
      contact.addEventListener("mouseenter", arm);
      contact.addEventListener("mouseleave", disarm);
      contact.addEventListener("touchstart", arm, { passive: true });
      contact.addEventListener("touchend", disarm);
    }
    function peel(contact) {
      if (contact.querySelector(".peel-corner")) return;
      const corner = document.createElement("button");
      corner.className = "peel-corner"; corner.type = "button";
      corner.setAttribute("aria-label", "解锁隐藏联系方式");
      contact.appendChild(corner);
      requestAnimationFrame(function () { corner.classList.add("up"); });
      corner.addEventListener("click", function () {
        if (contact.querySelector(".steam-reveal")) return;
        corner.classList.add("torn");
        const a = document.createElement("a");
        a.className = "steam-reveal";
        a.href = "https://steamcommunity.com/id/gjklr/";
        a.target = "_blank"; a.rel = "noopener";
        a.innerHTML = '<span class="steam-label">Steam</span><span class="steam-val">steamcommunity.com/id/gjklr</span>';
        contact.appendChild(a);
        requestAnimationFrame(function () { a.classList.add("show"); });
      });
    }
    setup();
    if (window.I18n && window.I18n.onChange) window.I18n.onChange(setup);
  },
});
