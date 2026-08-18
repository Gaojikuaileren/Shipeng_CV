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
  const MW_TOGGLE = window.UI_TEXT.mwToggle;
  const PRJ_TOGGLE = window.UI_TEXT.prjToggle;
  const WORKS = window.UI_TEXT.works;

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

  /* 板块标题：变体可用 sectionTitles 覆盖（如 toolset → "Technical & Creative Background"）。
     TITLES 在 Render.all() 开头按当前数据设定，供本文件内所有 sectionBlock 复用。 */
  let TITLES = null;
  function secTitle(key) {
    return h("h2", { class: "cv-sec-title" }, t((TITLES && TITLES[key]) || SECTION[key]));
  }
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
      h("img", { src: p.photo || "assets/photo/placeholder.svg", alt: t(p.photoAlt), loading: "eager", decoding: "async" })));
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
  // 经验时长：算不出来就整个元素都不建 —— .cv-skill 是 space-between，
  // 多挂一个空节点（哪怕 display:none）都会改变剩余空间的分配，破坏现有排布。
  function renderSince(c, lang) {
    const D = window.Duration; // odd/index.html 不加载 duration.js → 必须守卫
    if (!D || !c.since) return null;
    const text = D.format(D.months(c.since), lang);
    if (!text) return null;
    return h("span", { class: "cv-skill-since", "aria-label": D.aria(text, lang) }, text);
  }
  // 侧边栏核心能力（d.sidebar = 已按变体顺序取好的 capability 对象列表）
  // d.skillDisplay → 能力名右侧显示什么："level"(5 点熟练度) / "since"(经验年限) / "both" / "none"
  //   旧字段 d.hideSkillLevels 已由 data-loader 折算成 "none"（商务类能力不宜自称「5 星专家」）
  // 年限来自 capability.since，没写 since 或算不出的那条只是不显示年限，其余照旧
  function renderSkills(d) {
    const caps = d.sidebar || [];
    if (!caps.length) return null;
    const mode = d.skillDisplay || (d.hideSkillLevels ? "none" : "level"); // odd 页没走 data-loader → 兜底
    const showLevel = mode === "level" || mode === "both";
    const showSince = mode === "since" || mode === "both";
    const plain = mode === "none"; // 右侧彻底不放东西时才用 --plain（名字左对齐，不留空档）
    const lang = (window.I18n && window.I18n.current) || "en";
    return sectionBlock("skills",
      h("ul", { class: "cv-skills" + (plain ? " cv-skills--plain" : "") },
        caps.map((c) => h("li", { class: "cv-skill is-emph" },
          h("span", { class: "cv-skill-name" }, t(c.name)),
          showSince ? renderSince(c, lang) : null,
          showLevel ? renderLevel(c.level) : null))));
  }

  /* —— 能力板块（可复用）——————————————————————
     d.collab = [{ id, title, note?, items:[…] }, …]（多语字段）
     变体给数据才渲染；不给 → 该板块不存在（其它变体零影响）。
     用途示例：china-biz 的「中德协作：德国端 / 中国端网络 / 技术与产品理解」。
  ———————————————————————————————————————————— */
  function renderCollab(d) {
    const blocks = d.collab || [];
    if (!blocks.length) return null;
    return sectionBlock("collab",
      h("div", { class: "cv-collab" },
        blocks.map((b) =>
          h("div", { class: "cv-cb" },
            h("h3", { class: "cv-cb-title" }, t(b.title)),
            b.note ? h("p", { class: "cv-cb-note" }, t(b.note)) : null,
            h("ul", { class: "cv-cb-list" }, (b.items || []).map((it) => h("li", null, t(it))))))));
  }

  /* —— 主区：工具集（d.tools 全部软件，按组；高亮项组内排前）*/
  function renderToolset(d) {
    const all = d.tools || [];
    if (!all.length) return null;
    // ⚠️ 这个数组就是分组的渲染顺序，也是白名单：group 不在其中的工具会被静默丢弃。
    //    加新组要同时在 i18n-ui.js 的 group 里加组名，否则只是少一行标签。
    const groupOrder = ["engine", "ai", "interactive", "techArt", "3d", "code", "design", "video"];
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
    // d.contactNote → 联系方式下方一句话（如「求职 ＋ 项目合作」双身份）；变体不给则不显示
    return sectionBlock("contact", ul,
      d.contactNote ? h("p", { class: "cv-contact-note" }, t(d.contactNote)) : null);
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
  /* —— 项目经历折叠（屏幕端）——————————————————————————
     一条项目 = 期间 + 标题 + 类型 + 正文 + tags，桌面下整块要 1.4–1.7 屏、手机 2.5 屏，
     一个板块就把页面拖长 → 超过 PRJ_COLLAPSED 条时默认只显示前几条，其余给按钮展开。
     做法与「更多作品」完全一致（真 <button> ＋ aria-expanded / aria-controls，键盘可用）。

     两条硬性约束，与 renderMoreWorks 同源：
       1) PDF 必须全量 —— print.css 有两条兜底：按钮 display:none、
          [data-sec="projects"] .cv-item[hidden] 强制现形。屏幕折没折不影响纸面。
       2) 不到阈值的变体一点不变 —— art-vr 只有 2 条（hideItems 挡掉两条），
          走上面那条 return，既不加 hidden、也不加 id、更不建按钮，DOM 逐字节同改造前。
     阈值取 2：ue5-tech 4 条 → 收起后仍能看到两条最重的（emphasizeItems 排在前）。 */
  const PRJ_COLLAPSED = 2;
  const PRJ_SEC_ID = "cv-projects-sec";
  function renderProjects(d, forPrint) {
    if (!d.projects || !d.projects.length) return null;
    const items = d.projects.map(expItem);
    // forPrint：printFullWidth 生成的打印副本。不折叠、不建按钮、不带 id ——
    // 否则会造出重复的 #cv-projects-sec 与指错的 aria-controls（与 moreWorks 同源的坑）
    if (forPrint || items.length <= PRJ_COLLAPSED) return sectionBlock("projects", items);
    for (let i = PRJ_COLLAPSED; i < items.length; i++) items[i].hidden = true;
    const sec = sectionBlock("projects", items,
      h("button", { class: "cv-mw-more cv-prj-more", type: "button", "aria-expanded": "false",
        "aria-controls": PRJ_SEC_ID, onclick: onPrjToggle },
        t(PRJ_TOGGLE.expand).replace("{n}", String(items.length))));
    sec.id = PRJ_SEC_ID; // 给 aria-controls 用；按钮控制的就是这个板块里的条目
    return sec;
  }
  function onPrjToggle(e) {
    const btn = e.currentTarget;
    const sec = document.getElementById(btn.getAttribute("aria-controls"));
    if (!sec) return;
    const open = btn.getAttribute("aria-expanded") !== "true";
    const rows = sec.querySelectorAll(".cv-item");
    for (let i = PRJ_COLLAPSED; i < rows.length; i++) rows[i].hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.textContent = open ? t(PRJ_TOGGLE.collapse)
      : t(PRJ_TOGGLE.expand).replace("{n}", String(rows.length));
    if (!open) btn.scrollIntoView({ block: "nearest" }); // 收起后按钮别被甩到视口上方
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
     进作品集的条件：条目有 link（通用外链）或旧字段 video。
     linkKind 决定徽标：video ▶「视频」/ store ↗「商店」/ web ↗「网站」
     （文案在 i18n-ui.js 的 txt；只写 video 的老条目等价于 link + linkKind:"video"）。
     屏幕：超链接（→ 各条目自己的地址）
     打印：一个共用 QR ＋ 有序作品目录（整块只有这一个 QR，不给每条各配一个）。
       非视频条目额外印出网址 —— 纸质版没有扫码设备时还能手抄。

     QR 指向哪里由变体的 worksPage 决定：
       · 不写（缺省）→ Vimeo 主页，与本机制加入前逐字节一致；
       · true → 同目录下的 works.html?v=<变体>&lang=<当前语言>，那一页把每件作品的
         链接排成手指点得中的大块超链接（扫码的人基本都在手机上）。
     做成开关而不是全站直接换：01 号 ue5-tech 等老变体的 PDF 必须保持原样
     想让某个变体也用，在该变体加一行 worksPage: true。
  ———————————————————————————————————————————— */
  const VIMEO_PROFILE = "https://vimeo.com/user169301773";
  const LINK_MARK = { video: "▶", store: "↗", web: "↗" };
  // 条目 → { url, kind, mark }；两个字段都没有 = 不进作品集。kind 写错则退回 "web"
  // mark 一并返回（而不是让调用方各自查 LINK_MARK）：works.html 也要用同一个徽标符号
  // 挂到 window.Render 上给 works.html 复用 → 「什么算作品链接、配哪个徽标」只有这一份定义
  function workLink(p) {
    const url = p.link || p.video;
    if (!url) return null;
    let kind = p.linkKind || (p.link ? "web" : "video");
    if (!LINK_MARK[kind]) kind = "web";
    return { url: url, kind: kind, mark: LINK_MARK[kind] };
  }
  // works.html 的绝对地址：运行时从 location 推，绝不写死域名 ——
  // 本地 http://localhost:5180/ 与线上 …github.io/Shipeng_CV/ 子路径都要对。
  // new URL(".", href) = 「本页所在目录」，同 hub.html:91 那行的意图，但 query 里带 / 也不会误伤。
  // 带 lang：PDF 是「某一种语言的一张纸」，扫码的人该落在同一种语言上，而不是他手机浏览器的语言
  //（德国 HR 拿着德语 PDF、手机却是英文界面，是最常见的情形）。works.html 上仍可切语言，并没锁死。
  // 只有 http(s) 撑得起一个「扫得开」的绝对地址。README 的「方式二 直接双击 index.html」
  // 是 file:// 场景：那时 location.href 是本机磁盘路径，编进二维码既扫不出东西，又把私人
  // 目录名（.meine/职业/.简历/…）印在发给雇主的纸上。→ 返回 null，调用方自动退回老行为。
  function worksUrl(lang) {
    if (location.protocol !== "http:" && location.protocol !== "https:") return null;
    const v = (window.Identity && window.Identity.variant) || "";
    return new URL(".", location.href).href +
      "works.html?v=" + encodeURIComponent(window.VARIANTS ? window.VARIANTS.toShort(v) : v) +
      "&lang=" + encodeURIComponent(lang);
  }
  // 在线简历自身的地址（给「更多作品」那个 QR 用）。与 worksUrl 同样的规矩：
  // 运行时从 location 推、绝不写死域名，file:// 下返回 null 由调用方退回老行为。
  // 用目录地址而不是 index.html?… —— 少 10 个字符，二维码模块数更少、更好扫。
  function cvUrl(lang) {
    if (location.protocol !== "http:" && location.protocol !== "https:") return null;
    const v = (window.Identity && window.Identity.variant) || "";
    return new URL(".", location.href).href +
      "?v=" + encodeURIComponent(window.VARIANTS ? window.VARIANTS.toShort(v) : v) +
      "&lang=" + encodeURIComponent(lang);
  }
  // 印在纸上的地址写法：砍掉协议头（谁都知道要加 https），其余一字不改 —— 手抄的人要照着敲
  function urlLabel(u) { return String(u).replace(/^https?:\/\//, ""); }
  // QR 下方那行可点地址：既是 PDF 里能点的超链接，也是纸上能照抄的地址
  function qrLink(url) { return h("a", { class: "cv-pprint-url-link", href: url }, urlLabel(url)); }

  // 打印块：QR ＋ 有序目录。note 为空（没开 worksPage）时结构与改造前一字不差
  function portfolioPrint(works, qrUrl, note) {
    const qr = h("div", { class: "cv-pprint-qr", "data-url": qrUrl });
    // 地址行放在 QR＋目录这一行**下面**、跨整块宽度：塞进 34mm 的 QR 盒里要折三行、
    // 把整块顶高近 10mm；放在下面只占一行。
    return h("div", { class: "cv-portfolio-print", "aria-hidden": "true" },
      h("div", { class: "cv-pprint-row" },
      note ? h("div", { class: "cv-pprint-qrbox" }, qr, h("p", { class: "cv-pprint-note" }, note)) : qr,
      h("ol", { class: "cv-pprint-list" },
        works.map((p) => {
          const l = workLink(p);
          return h("li", null,
            h("span", { class: "cv-pi-title" }, t(p.org)),
            h("span", { class: "cv-pi-type" }, " · " + t(p.type || p.role)),
            h("span", { class: "cv-pi-period" }, " (" + p.period + ")"),
            l.kind === "video" ? null
              : h("span", { class: "cv-pi-url" }, " " + urlLabel(l.url)));
        }))),
      qrLink(qrUrl));
  }
  // 作品集的条目池 = 项目经历 ＋「更多作品」里带链接的条目。
  // 后者字段名不同（title / year 对 org / period），在这里归一成项目的形状；
  // t() 对纯字符串原样返回，所以 title 直接当 org 用没问题。
  //
  // ★★★ 「更多作品」那一半必须先过板块可见性：变体把 moreWorks 整块 hide 掉，
  //   意思就是「这些次要作品不属于这一版简历」—— 那它们的链接也不该从作品集的后门钻进来。
  //   2026-08-18 实测教训：art-vr（艺术自由职业名片，hide 了 moreWorks 但显示作品集）
  //   的打印目录里漏进了 DeskDrawer 这个 Windows 工具。靠逐条 hideItems 去堵是治不完的，
  //   以后每加一条带链接的 moreWorks 都要记得去堵每个变体。改成整类判定，
  //   同时也与 works.html 的取数规则一致（那边本来就判 sectionVisible）。
  function portfolioItems(d) {
    const hide = new Set((d.sections && d.sections.hide) || []);
    const fromProjects = hide.has("projects") ? [] : (d.projects || []).filter(workLink);
    const fromMore = hide.has("moreWorks") ? [] : (d.moreWorks || []).filter(workLink).map((w) => ({
      id: w.id, org: w.title, period: w.year, type: w.type,
      link: w.link, video: w.video, linkKind: w.linkKind, _emph: w._emph,
    }));
    return fromProjects.concat(fromMore);
  }
  function renderPortfolio(d) {
    const works = portfolioItems(d);
    if (!works.length) return null;
    const lang = (window.I18n && window.I18n.current) || "en";
    // worksPage 开着、但当前协议撑不起可扫地址（file://）→ wu 为 null，整块自动回到
    // 「QR 指 Vimeo 主页、不印说明行」的老行为，与本机制加入前一致。
    const wu = d.worksPage ? worksUrl(lang) : null;
    return sectionBlock("portfolio",
      // 屏幕：超链接列表
      h("ul", { class: "cv-portfolio" },
        works.map((p) => {
          const l = workLink(p);
          return h("li", { class: "cv-work" + (p._emph ? " is-emph" : "") },
            h("a", { class: "cv-work-link", href: l.url, target: "_blank", rel: "noopener" },
              h("span", { class: "cv-work-title" },
                h("span", { class: "cv-badge" }, l.mark + " " + t(TXT[l.kind]) + " "),
                t(p.org)),
              h("span", { class: "cv-work-meta" },
                h("span", { class: "cv-work-type" }, t(p.type || p.role)),
                h("span", { class: "cv-work-period" }, p.period))));
        })),
      // 打印：单 QR + 有序目录（屏幕隐藏）
      portfolioPrint(works, wu || VIMEO_PROFILE, wu ? t(WORKS.qrNote) : null));
  }

  /* —— 次要作品列表（仅特定变体）—————————————
     条目一多，屏幕端这一块能拖出小半屏 → 超过 MW_COLLAPSED 条就默认只显示前几条，
     下面给一个真 <button> 切换展开 / 收起（aria-expanded ＋ aria-controls，键盘可用）。

     两条硬性约束：
       1) PDF 必须全量 —— Render.all 里那份横跨整页的副本传 forPrint=true，压根不折叠、
          不建按钮；print.css 另有两条兜底（按钮 display:none、[hidden] 条目强制现形）。
       2) 条目不多的老变体（ue5-tech 就 6 条）必须一点不变 —— 不到阈值时下面这段
          既不加 id、也不加 hidden 属性、更不建按钮，DOM 与改造前逐字节相同。
     阈值取 6：既是「收起后仍有实质内容可看」的下限，也正好是 01 号现有的条目数
     （它因此完全不受影响）。改大改小只需动这一个常量。
  ———————————————————————————————————————————— */
  const MW_COLLAPSED = 6;
  const MW_LIST_ID = "cv-moreworks-list";
  function renderMoreWorks(d, forPrint) {
    const items = d.moreWorks || [];
    if (!items.length) return null;
    const collapse = !forPrint && items.length > MW_COLLAPSED;
    const ul = h("ul", { class: "cv-moreworks", id: collapse ? MW_LIST_ID : null },
      items.map((w, i) =>
        // h() 会跳过 false → 不折叠时连 hidden 属性都不会写上去
        h("li", { class: "cv-mw-item", hidden: collapse && i >= MW_COLLAPSED },
          h("span", { class: "cv-mw-year" }, w.year),
          h("span", { class: "cv-mw-title" }, w.title),
          h("span", { class: "cv-mw-type" }, t(w.type)),
          w.tags && w.tags.length
            ? h("span", { class: "cv-mw-tags" }, w.tags.join(" · "))
            : null)));
    if (!collapse) return sectionBlock("moreWorks", ul);
    return sectionBlock("moreWorks", ul,
      h("button", { class: "cv-mw-more", type: "button", "aria-expanded": "false",
        "aria-controls": MW_LIST_ID, onclick: onMwToggle },
        t(MW_TOGGLE.expand).replace("{n}", String(items.length))));
  }
  function onMwToggle(e) {
    const btn = e.currentTarget;
    const list = document.getElementById(btn.getAttribute("aria-controls"));
    if (!list) return;
    const open = btn.getAttribute("aria-expanded") !== "true";
    const rows = list.querySelectorAll(".cv-mw-item");
    for (let i = MW_COLLAPSED; i < rows.length; i++) rows[i].hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.textContent = open ? t(MW_TOGGLE.collapse)
      : t(MW_TOGGLE.expand).replace("{n}", String(rows.length));
    // 收起时上方内容一下子缩短，按钮可能被甩到视口上方 → 拉回来。
    // block:"nearest" 已经在视野里就不动；不用 smooth，免得跟 reduced-motion 打架。
    if (!open) btn.scrollIntoView({ block: "nearest" });
  }

  /* —— 教育 ———————————————————————————————— */
  /* —— 「更多作品」的打印形态：QR ＋ 在线简历地址 ————————————————
     纸上印 15 条清单要吃掉约 75mm，而这些条目大多没有链接、看完也点不动。
     改成一个指向在线简历的 QR：扫码的人在手机上能展开全部条目、还能点进去。
     附页 works.html 里另有一份完整清单（那一页由作品集的 QR 进入）。
     file:// 打开时 cvUrl 返回 null → 调用方自动退回老行为，仍印完整清单。 */
  function moreWorksPrint(url, note) {
    return h("div", { class: "cv-mwprint", "aria-hidden": "true" },
      h("div", { class: "cv-pprint-qr", "data-url": url }),
      h("div", { class: "cv-mwprint-txt" },
        h("p", { class: "cv-pprint-note" }, note),
        qrLink(url)));
  }

  /* —— 跨简历入口（屏幕端）——————————————————————————
     变体声明 crossLink: { to: "<短链>", label: {四语} } 就在页面最底部居中出一个按钮，
     通向另一份简历。设计版用它指向 UE 开发版：来看设计的人里有一部分其实在找技术岗。
     纸上点不了按钮，印一个按钮样式的框只会让人困惑 → print.css 里整块隐藏。 */
  function renderCrossLink(d) {
    const c = d.crossLink;
    if (!c || !c.to) return null;
    return h("p", { class: "cv-crosslink" },
      h("a", { class: "cv-crosslink-btn",
        href: "index.html?v=" + encodeURIComponent(c.to) +
              "&lang=" + encodeURIComponent(window.I18n.current) },
        t(c.label), h("span", { class: "cv-crosslink-arrow" }, "→")));
  }

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
    intro: renderIntro, collab: renderCollab, projects: renderProjects,
    work: renderWork, oddjobs: renderOddjobs,
    moreWorks: renderMoreWorks, portfolio: renderPortfolio,
    education: renderEducation,
  };
  const ASIDE_DEFAULT = ["skills", "languages", "contact"];
  const MAIN_DEFAULT  = ["intro", "collab", "projects", "work", "oddjobs", "toolset", "moreWorks", "portfolio", "education"];

  /* —— 对外接口 ————————————————————————————— */
  window.Render = {
    // works.html 复用：判断一个条目算不算「有链接的作品」、该配哪个徽标。
    // 导出的是同一个函数，不是抄一份 → 规则永远只有这一处。
    workLink: workLink,
    all(d) {
      const root = document.getElementById("cv-root");
      if (!root) return;
      const sec = d.sections || {};
      TITLES = d.sectionTitles || null;
      const hide = new Set(sec.hide || []);
      const emph = new Set(sec.emphasize || []);
      const ord = (sec.order && sec.order.length) ? sec.order : [];
      const orderMain = (ord.length ? ord : MAIN_DEFAULT)
        .filter((k) => MAIN_DEFAULT.includes(k) && !hide.has(k));
      // 侧边栏顺序也可由 sections.order 指定（如把 languages 提到最前）；
      // 没在 order 里列出的侧边栏板块按默认顺序接在后面 → 老变体行为不变。
      const orderAside = ord
        .filter((k) => ASIDE_DEFAULT.includes(k))
        .concat(ASIDE_DEFAULT.filter((k) => ord.indexOf(k) === -1))
        .filter((k) => !hide.has(k));

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
      append(frag, renderCrossLink(d)); // 页面最底部居中；没声明 crossLink 的变体返回 null

      /* —— 打印专用：变体声明的「全宽板块」———————————————————————————
         d.printFullWidth = ["work", "education"] → 这些主区板块在 PDF 里脱离
         34% / 1fr 双栏，改走整页宽度的普通流。

         为什么需要它：CSS Grid 在分页时**不会**丢掉轨道 —— 侧栏内容在第 2 页就结束了，
         但第 3 页仍然保留那条 34%（约 70mm）的空轨道，于是整条左列通栏留白，
         而右列被压在 113mm 里被迫向下长。实测这样白扔掉约一整张 A4 的正文面积。
         挪到 grid 外之后宽度 113 → 184mm（+62%），内容自己就把页面填满了。

         机制与下面的「更多作品 / 工具集」完全同款（那两块本来就是这么做的），
         这里只是把它参数化：变体给了名字才生效 → 没声明的变体输出一字不变。
         原位那份打上 .print-moved，由 print.css 在打印态隐藏（屏幕端照旧双栏）。 */
      (d.printFullWidth || []).forEach((k) => {
        if (MAIN_DEFAULT.indexOf(k) === -1 || hide.has(k)) return;
        // 传 forPrint=true：会折叠的板块（moreWorks / projects）在打印副本里必须全量、
        // 且不能带按钮与 id —— 否则同一个 id 在文档里出现两次
        const copy = RENDER[k] && RENDER[k](d, true);
        if (!copy) return;
        const inGrid = main.querySelector('[data-sec="' + k + '"]');
        if (inGrid) inGrid.classList.add("print-moved");
        append(frag, h("div", { class: "cv-sec-print", "data-print-sec": k }, copy));
      });

      // 打印专用：横跨整页排最后 —— 放在 grid 外（普通全宽 block，避免 CSS Grid 打印跨页 bug）
      // 先「更多作品」后「工具集」（屏幕隐藏）
      if (orderMain.indexOf("moreWorks") !== -1 && !hide.has("moreWorks")) {
        const cu = cvUrl((window.I18n && window.I18n.current) || "en"); // all() 里没有 lang 局部变量
        if (cu && (d.moreWorks || []).length) {
          // 有在线地址 → 整块换成 QR ＋ 地址（省约 75mm，且线上那份永远是最新的）
          append(frag, h("div", { class: "cv-mwprint-wrap" },
            sectionBlock("moreWorks", moreWorksPrint(cu, t(window.UI_TEXT.mwPrint.note)))));
        } else {
          // file:// 或本变体没有条目 → 老行为：印完整清单
          const pm = renderMoreWorks(d, true); // forPrint：永不折叠、不带按钮
          if (pm) append(frag, h("div", { class: "cv-moreworks-print" }, pm));
        }
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
