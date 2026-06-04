/* ============================================================
   render.js — 按板块动态渲染
   - 侧边栏技能：core:true 或 _emph:true 的条目（带点数）
   - 主区工具集：全部技能按 group 分组显示为标签云
   - 作品集打印：屏幕=超链接，打印=单 QR + 作品目录
   ============================================================ */
(function () {
  "use strict";

  /* —— 元素构建器 ————————————————————————————— */
  function h(tag, attrs) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === "class") node.className = v;
        else if (k.slice(0, 2) === "on" && typeof v === "function")
          node.addEventListener(k.slice(2).toLowerCase(), v);
        else node.setAttribute(k, v);
      }
    }
    for (let i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }
  function append(node, child) {
    if (child == null || child === false) return;
    if (Array.isArray(child)) return child.forEach((c) => append(node, c));
    node.appendChild(child.nodeType ? child : document.createTextNode(String(child)));
  }

  function enc(s) { return btoa(String.fromCharCode.apply(null, new TextEncoder().encode(s))); }
  function dec(s) { return new TextDecoder().decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0))); }
  const t = (f) => window.I18n.t(f);

  /* —— 板块标题文案 ————————————————————————— */
  /* UI 文案集中在 scripts/i18n-ui.js（window.UI_TEXT）*/
  const SECTION = window.UI_TEXT.section;
  const TXT = window.UI_TEXT.txt;
  const SKILL_GROUPS = window.UI_TEXT.group;

  /* —— reveal ——————————————————————————————— */
  function revealNode(value, type) {
    return h("button", { class: "cv-reveal", type: "button",
      "data-val": enc(value), "data-type": type || "text", onclick: onReveal },
      t(type === "email" || type === "tel" ? TXT.showEmail : TXT.reveal));
  }
  function onReveal(e) {
    const btn = e.currentTarget;
    const val = dec(btn.dataset.val);
    const ty = btn.dataset.type;
    let out;
    if (ty === "email") out = h("a", { class: "cv-link", href: "mailto:" + val }, val);
    else if (ty === "tel") out = h("a", { class: "cv-link", href: "tel:" + val.replace(/\s/g, "") }, val);
    else out = document.createTextNode(val);
    btn.replaceWith(out);
  }

  function secTitle(key) { return h("h2", { class: "cv-sec-title" }, t(SECTION[key])); }
  function sectionBlock(key) {
    const sec = h("section", { class: "cv-block", "data-sec": key });
    append(sec, secTitle(key));
    for (let i = 1; i < arguments.length; i++) append(sec, arguments[i]);
    return sec;
  }

  /* —— Header ——————————————————————————————— */
  function renderHeader(d) {
    const p = d.profile || {};
    const head = h("header", { class: "cv-head" });
    if (d.greeting) append(head, h("p", { class: "cv-greeting" }, t(d.greeting)));
    append(head, h("h1", { class: "cv-name" }, t(p.name)));
    append(head, h("p", { class: "cv-title" }, t(p.title)));
    return head;
  }

  /* —— Profile（照片 + 情报）——————————————— */
  function renderProfile(d) {
    const p = d.profile || {};
    const box = h("div", { class: "cv-profile" });
    append(box, h("div", { class: "cv-photo" },
      h("img", { src: p.photo || "assets/photo/placeholder.svg", alt: t(p.photoAlt), loading: "lazy", decoding: "async" })));
    const info = h("dl", { class: "cv-info" });
    (p.fields || []).forEach((f) => {
      const hidden = f.visibility === "private" && !window.Identity.isFull();
      append(info, h("dt", null, t(f.label)));
      append(info, h("dd", null, hidden ? revealNode(t(f.value), "text") : t(f.value)));
    });
    append(box, info);
    return box;
  }

  /* —— 侧边栏：技能（仅 core 或 _emph）————— */
  function renderLevel(n) {
    const wrap = h("span", { class: "cv-level", "aria-hidden": "true" });
    for (let i = 1; i <= 5; i++) append(wrap, h("i", { class: "cv-dot" + (i <= n ? " on" : "") }));
    return wrap;
  }
  // 侧边栏核心能力（d.sidebar = 已按变体顺序取好的 capability 对象列表）
  function renderSkills(d) {
    const caps = d.sidebar || [];
    if (!caps.length) return null;
    return sectionBlock("skills",
      h("ul", { class: "cv-skills" },
        caps.map((c) => h("li", { class: "cv-skill is-emph" },
          h("span", { class: "cv-skill-name" }, t(c.name)),
          renderLevel(c.level)))));
  }

  /* —— 主区：工具集（d.tools 全部软件，按组；高亮项组内排前）*/
  function renderToolset(d) {
    const all = d.tools || [];
    if (!all.length) return null;
    const groupOrder = ["engine", "interactive", "techArt", "3d", "code", "design", "video"];
    const grouped = {};
    all.forEach((s) => {
      if (!grouped[s.group]) grouped[s.group] = [];
      grouped[s.group].push(s);
    });
    const rows = [];
    groupOrder.forEach((gk) => {
      let items = grouped[gk];
      if (!items || !items.length) return;
      // 高亮项排到组内最前
      items = items.filter((x) => x._hl).concat(items.filter((x) => !x._hl));
      const grp = h("div", { class: "cv-tset-row" });
      const label = SKILL_GROUPS[gk];
      if (label) append(grp, h("span", { class: "cv-tset-label" }, t(label)));
      const tags = h("div", { class: "cv-tset-tags" });
      items.forEach((s) =>
        append(tags, h("span", { class: "cv-tset-tag" + (s._hl ? " is-emph" : "") }, s.name)));
      append(grp, tags);
      rows.push(grp);
    });
    return sectionBlock("toolset", h("div", { class: "cv-toolset" }, rows));
  }

  /* —— 语言 ———————————————————————————————— */
  function renderLanguages(d) {
    if (!d.languages || !d.languages.length) return null;
    return sectionBlock("languages",
      h("ul", { class: "cv-langs" },
        d.languages.map((l) => h("li", { class: "cv-lang" },
          h("span", { class: "cv-lang-name" }, t(l.name)),
          h("span", { class: "cv-lang-level" }, t(l.level))))));
  }

  /* —— 联系方式 ———————————————————————————— */
  function renderContact(d) {
    if (!d.contact || !d.contact.length) return null;
    const ul = h("ul", { class: "cv-contact" });
    d.contact.forEach((c) => {
      const privateHidden = c.visibility === "private" && !window.Identity.isFull();
      let valNode;
      if (c.protected)
        valNode = revealNode(c.value, c.type === "email" ? "email" : c.type === "phone" ? "tel" : "text");
      else if (privateHidden)
        valNode = revealNode(c.value, "text");
      else if (c.type === "email")
        valNode = h("a", { class: "cv-link", href: "mailto:" + c.value }, c.value);
      else if (c.type === "phone")
        valNode = h("a", { class: "cv-link", href: "tel:" + c.value.replace(/\s+/g, "") }, c.value);
      else
        valNode = h("a", { class: "cv-link", href: c.value, target: "_blank", rel: "noopener" },
          c.value.replace(/^https?:\/\//, ""));
      append(ul, h("li", { class: "cv-contact-row" },
        h("span", { class: "cv-contact-label" }, c.label), valNode));
    });
    return sectionBlock("contact", ul);
  }

  /* —— 经历条目（projects / work / oddjobs 共用）*/
  function expItem(e) {
    const ctx = e.context ? t(e.context) : null;
    const typ = e.type ? t(e.type) : null;
    const orgNode = e.mapUrl
      ? h("span", null, t(e.org), " ", h("a", { class: "cv-map-link", href: e.mapUrl, target: "_blank", rel: "noopener" }, "↗ map"))
      : t(e.org);
    return h("article", { class: "cv-item" + (e._emph ? " is-emph" : "") },
      h("div", { class: "cv-item-head" },
        h("span", { class: "cv-period" }, e.period),
        h("h3", { class: "cv-item-title" },
          t(e.role), h("span", { class: "cv-at" }, " · "), orgNode,
          ctx ? h("span", { class: "cv-item-ctx" }, " — " + ctx) : null)),
      typ ? h("p", { class: "cv-item-type" }, typ) : null,
      h("p", { class: "cv-item-body" }, t(e.summary)),
      e.tags && e.tags.length ? h("ul", { class: "cv-tags" }, e.tags.map((tg) => h("li", null, tg))) : null);
  }
  function renderProjects(d) {
    if (!d.projects || !d.projects.length) return null;
    return sectionBlock("projects", d.projects.map(expItem));
  }
  function renderWork(d) {
    if (!d.work || !d.work.length) return null;
    return sectionBlock("work", d.work.map(expItem));
  }
  function renderOddjobs(d) {
    if (!d.oddjobs || !d.oddjobs.length) return null;
    return sectionBlock("oddjobs", d.oddjobs.map(expItem));
  }

  /* —— 作品集 ———————————————————————————————
     屏幕：超链接（→ Vimeo 各视频）
     打印：一个 QR（→ Vimeo 主页）＋ 有序作品目录
  ———————————————————————————————————————————— */
  const VIMEO_PROFILE = "https://vimeo.com/user169301773";
  function renderPortfolio(d) {
    const works = (d.projects || []).filter((p) => p.video);
    if (!works.length) return null;
    return sectionBlock("portfolio",
      // 屏幕：超链接列表
      h("ul", { class: "cv-portfolio" },
        works.map((p) =>
          h("li", { class: "cv-work" + (p._emph ? " is-emph" : "") },
            h("a", { class: "cv-work-link", href: p.video, target: "_blank", rel: "noopener" },
              h("span", { class: "cv-work-title" },
                h("span", { class: "cv-badge" }, "▶ " + t(TXT.video) + " "),
                t(p.org)),
              h("span", { class: "cv-work-meta" },
                h("span", { class: "cv-work-type" }, t(p.type || p.role)),
                h("span", { class: "cv-work-period" }, p.period)))))),
      // 打印：单 QR + 有序目录（屏幕隐藏）
      h("div", { class: "cv-portfolio-print", "aria-hidden": "true" },
        h("div", { class: "cv-pprint-qr", "data-url": VIMEO_PROFILE }),
        h("ol", { class: "cv-pprint-list" },
          works.map((p) =>
            h("li", null,
              h("span", { class: "cv-pi-title" }, t(p.org)),
              h("span", { class: "cv-pi-type" }, " · " + t(p.type || p.role)),
              h("span", { class: "cv-pi-period" }, " (" + p.period + ")"))))));
  }

  /* —— 次要作品列表（仅特定变体）————————————— */
  function renderMoreWorks(d) {
    if (!d.moreWorks || !d.moreWorks.length) return null;
    return sectionBlock("moreWorks",
      h("ul", { class: "cv-moreworks" },
        d.moreWorks.map((w) =>
          h("li", { class: "cv-mw-item" },
            h("span", { class: "cv-mw-year" }, w.year),
            h("span", { class: "cv-mw-title" }, w.title),
            h("span", { class: "cv-mw-type" }, t(w.type)),
            w.tags && w.tags.length
              ? h("span", { class: "cv-mw-tags" }, w.tags.join(" · "))
              : null))));
  }

  /* —— 教育 ———————————————————————————————— */
  function renderEducation(d) {
    if (!d.education || !d.education.length) return null;
    return sectionBlock("education",
      d.education.map((e) =>
        h("article", { class: "cv-item" },
          h("div", { class: "cv-item-head" },
            h("span", { class: "cv-period" }, e.period),
            h("h3", { class: "cv-item-title" }, t(e.degree), h("span", { class: "cv-at" }, " · "), t(e.school))),
          t(e.detail) ? h("p", { class: "cv-item-body" }, t(e.detail)) : null)));
  }

  /* —— 自我介绍（空则不渲染）——————————————— */
  function renderIntro(d) {
    const txt = t(d.intro);
    if (!txt) return null;
    return h("section", { class: "cv-block cv-intro", "data-sec": "intro" }, h("p", null, txt));
  }

  /* —— 名片（导出用，屏幕隐藏）———————————— */
  function renderCard(d) {
    const inner = h("div", { class: "cv-card-inner" });
    append(inner, h("div", { class: "cv-card-name" }, t(d.profile.name)));
    append(inner, h("div", { class: "cv-card-title" }, t(d.profile.title)));
    const lines = h("div", { class: "cv-card-lines" });
    d.contact.filter((c) => c.visibility === "public")
      .forEach((c) => append(lines,
        h("div", { class: "cv-card-line" }, c.label + " · " + c.value.replace(/^https?:\/\//, ""))));
    append(inner, lines);
    return inner;
  }

  /* —— 打印页尾：姓名 + 电话 + 邮箱 + Instagram（屏幕隐藏）—— */
  function renderPrintFooter(d) {
    const email = d.contact.find((c) => c.type === "email");
    const phone = d.contact.find((c) => c.type === "phone");
    const insta = d.contact.find((c) => /instagram/i.test(c.label));
    const parts = [];
    if (phone) parts.push(phone.value);
    if (email) parts.push(email.value);
    if (insta) parts.push(insta.value.replace(/^https?:\/\//, ""));
    return h("div", { class: "cv-print-footer", "aria-hidden": "true" },
      t(d.profile.name) + "　·　" + parts.join("　·　"));
  }

  /* —— 板块注册 ————————————————————————————— */
  const RENDER = {
    skills: renderSkills, toolset: renderToolset,
    languages: renderLanguages, contact: renderContact,
    intro: renderIntro, projects: renderProjects,
    work: renderWork, oddjobs: renderOddjobs,
    moreWorks: renderMoreWorks, portfolio: renderPortfolio,
    education: renderEducation,
  };
  const ASIDE_DEFAULT = ["skills", "languages", "contact"];
  const MAIN_DEFAULT  = ["intro", "projects", "work", "oddjobs", "toolset", "moreWorks", "portfolio", "education"];

  /* —— 对外接口 ————————————————————————————— */
  window.Render = {
    all(d) {
      const root = document.getElementById("cv-root");
      if (!root) return;
      const sec = d.sections || {};
      const hide = new Set(sec.hide || []);
      const emph = new Set(sec.emphasize || []);
      const orderMain = (sec.order && sec.order.length ? sec.order : MAIN_DEFAULT)
        .filter((k) => MAIN_DEFAULT.includes(k) && !hide.has(k));
      const orderAside = ASIDE_DEFAULT.filter((k) => !hide.has(k));

      // 全部构建在 fragment 上，最后一次性插入 → 单次 reflow
      const frag = document.createDocumentFragment();
      append(frag, renderHeader(d));
      const grid = h("div", { class: "cv-grid" });
      const aside = h("aside", { class: "cv-aside" });
      if (!hide.has("profile")) append(aside, renderProfile(d));
      orderAside.forEach((k) => {
        const node = RENDER[k] && RENDER[k](d);
        if (node && emph.has(k)) node.classList.add("is-emph-section");
        if (node) append(aside, node);
      });
      const main = h("div", { class: "cv-main" });
      orderMain.forEach((k) => {
        const node = RENDER[k] && RENDER[k](d);
        if (node && emph.has(k)) node.classList.add("is-emph-section");
        if (node) append(main, node);
      });
      append(grid, aside);
      append(grid, main);
      append(frag, grid);

      // 打印专用：横跨整页排最后 —— 放在 grid 外（普通全宽 block，避免 CSS Grid 打印跨页 bug）
      // 先「更多作品」后「工具集」（屏幕隐藏）
      if (orderMain.indexOf("moreWorks") !== -1 && !hide.has("moreWorks")) {
        const pm = renderMoreWorks(d);
        if (pm) append(frag, h("div", { class: "cv-moreworks-print" }, pm));
      }
      if (orderMain.indexOf("toolset") !== -1 && !hide.has("toolset")) {
        const pt = renderToolset(d);
        if (pt) append(frag, h("div", { class: "cv-toolset-print" }, pt));
      }

      // 打印专用：页尾联系方式（仅最后一页末尾）
      append(frag, renderPrintFooter(d));

      root.textContent = "";
      root.appendChild(frag);

      const cardBox = document.getElementById("cv-card");
      if (cardBox) { cardBox.textContent = ""; append(cardBox, renderCard(d)); }

      if (window.Identity.isFull())
        root.querySelectorAll(".cv-reveal").forEach((b) => b.click());

      if (window.QR && window.QR.renderAll) window.QR.renderAll();

      // 标签页 / 分享标题随变体·语言更新
      document.title = (t(d.profile.name) || "CV") + (t(d.profile.title) ? " — " + t(d.profile.title) : "");
    },
  };
})();
