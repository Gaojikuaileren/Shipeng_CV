/* ============================================================
   interactions/index.js — 交互层注册中心（预留接口）
   设计目标：未来加"艺术性小交互"时，只在这里 register，无需动其它代码。
   - 每个交互声明 desktop / mobile 开关 → 可双端、可单端、可禁用
   - 自动尊重 prefers-reduced-motion（无障碍 / 省电）
   - 用 transform / opacity 做动画 → GPU 合成，手机也顺，无需"专门硬件加速"
   ============================================================ */
window.Interactions = (function () {
  "use strict";

  const registry = [];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = matchMedia("(max-width: 700px)").matches;

  // 注册一个交互
  // def = { id, desktop=true, mobile=false, reducedMotion=false, init(ctx), destroy() }
  function register(def) {
    registry.push(def);
  }

  function init(ctx) {
    registry.forEach((def) => {
      if (reduceMotion && !def.reducedMotion) return;       // 用户要求减弱动效
      if (isMobile && def.mobile === false) return;          // 手机端禁用
      if (!isMobile && def.desktop === false) return;        // 桌面端禁用
      try {
        def.init && def.init(ctx);
      } catch (e) {
        console.warn("[interaction]", def.id, e);
      }
    });
  }

  return { register, init, env: { reduceMotion, isMobile }, _registry: registry };
})();

/* —— 未来加交互的范式（取消注释即可启用一个示例）——————————
// window.Interactions.register({
//   id: "tilt-photo",
//   desktop: true,      // 桌面启用
//   mobile: false,      // 手机禁用（你说的"手机端或许禁用"接口）
//   reducedMotion: false,
//   init(ctx) {
//     const ph = document.querySelector(".cv-photo");
//     if (!ph) return;
//     // 只动 transform → GPU 合成，轻量
//     window.addEventListener("mousemove", (e) => {
//       const x = (e.clientX / innerWidth - 0.5) * 6;
//       const y = (e.clientY / innerHeight - 0.5) * 6;
//       ph.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
//     });
//   },
// });
———————————————————————————————————————————————————————————— */
