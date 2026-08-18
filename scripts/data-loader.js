/* ============================================================
   data-loader.js — 加载 base + 动态注入选中的 variant，合并出渲染数据
   只下发被选中的那一个变体（其余不进源码）→ 隐私更干净。
   ============================================================ */
window.DataLoader = {
  load(variantId) {
    return new Promise((resolve) => {
      const base = window.RESUME_BASE;
      const safeId = this._sanitize(variantId) || "default";

      this._inject(safeId, (variant) => {
        variant = variant || {};
        this._validate(base, variant);
        resolve(this._merge(base, variant));
      });
    });
  },

  _sanitize(id) {
    if (!id) return "";
    return String(id).replace(/[^a-z0-9-]/gi, "").slice(0, 40);
  },

  _inject(id, cb) {
    const script = document.createElement("script");
    script.src = `data/variants/${id}.js`;
    script.onload = () => cb(window.RESUME_VARIANT || {});
    script.onerror = () => {
      // 变体不存在 → 回退 ue5-tech（主推默认）；它也失败就用空变体（纯 base）
      if (id !== "ue5-tech") {
        console.warn(`[cv] variant "${id}" not found → fallback ue5-tech`);
        this._inject("ue5-tech", cb);
      } else {
        console.warn("[cv] fallback variant missing → using base only");
        cb({});
      }
    };
    document.head.appendChild(script);
  },

  _merge(base, v) {
    const order = v.order || {};
    const data = {
      meta: base.meta,
      profile: Object.assign({}, base.profile),
      greeting: v.greeting || null,
      intro: v.intro || base.intro,
      // 侧边栏核心能力（变体 sidebar 选择+排序，缺省用 defaultSidebar）
      sidebar: this._pickCaps(base.capabilities || [], v.sidebar || base.defaultSidebar || []),
      // hideSkillLevels: true → 侧边栏只列能力名，不显示 5 点熟练度（适合没有年限背书的商务类能力）
      hideSkillLevels: !!v.hideSkillLevels,
      // 侧边栏能力右侧显示什么 → render（缺省 "level"，即改造前的行为）
      skillDisplay: this._skillDisplay(v),
      // 工具集（onlyTools 白名单 → hideTools 黑名单 → highlightTools 命中的标 _hl）
      tools: this._flagTools(base.tools || [], v.highlightTools || [], v.onlyTools, v.hideTools),
      projects: this._order(this._flag(base.projects, v), order.projects),
      work: this._order(this._flag(base.work, v), order.work),
      moreWorks: base.moreWorks ? this._flag(base.moreWorks, v) : [],
      oddjobs: base.oddjobs ? this._flag(base.oddjobs, v) : [],
      languages: base.languages.slice(),
      education: this._flag(base.education, v),
      contact: this._order(this._flag(base.contact, v), (v.order || {}).contact), // hideItems 隐藏 + order.contact 排序
      // 能力板块（可复用 section）：变体给数据才渲染，没给则该板块不存在
      collab: v.collab || base.collab || null,
      // 联系板块下方的一句话 CTA（如「求职 ＋ 项目合作」双身份）
      contactNote: v.contactNote || null,
      // 板块标题覆盖（{ 板块名: {zh,ja,en,de} }）；未覆盖的仍用 i18n-ui 里的通用标题
      sectionTitles: v.sectionTitles || null,
      // worksPage: true → PDF 作品集里那个共用 QR 改指向同目录的 works.html（可点的作品链接页），
      //   并在 QR 下方印一行说明。不写＝老行为（QR 指 Vimeo 主页、无说明）。
      //   做成开关是为了让老变体的 PDF 保持原样，不是所有变体都想多一次跳转。
      worksPage: !!v.worksPage,
      // 变体声明哪些主区板块在 PDF 里改走「全宽流」（脱离双栏）→ render
      // 没声明的变体行为一字不变；机制说明见 render.js 的 printFullWidth 段
      printFullWidth: v.printFullWidth || null,
      // ⧉ 复制按钮只给「姓名 + 个人链接」，不附 HR 评分模板（面向客户的变体用）
      copyLinksOnly: !!v.copyLinksOnly,
      // 跨简历入口：{ to: "<短链>", label: {四语} } → 页面最底部居中一个按钮，通向另一份简历。
      // 只在屏幕上出现（print.css 里整块隐藏）。没声明的变体没有这个节点。
      crossLink: v.crossLink || null,
      // 板块级控制（显示/顺序/重点）→ render
      sections: v.sections || { order: [], hide: [], emphasize: [] },
    };
    // 变体可覆盖头衔、照片（如 art-vr 用艺术化图替代证件照）、以及照片下方的情报行
    data.profile.title = v.headline || base.profile.title;
    data.profile.photo = v.photo || base.profile.photo;
    if (v.profileFields) data.profile.fields = v.profileFields;
    return data;
  },

  // 过滤 hideItems；emphasizeItems → _emph（条目级：项目/工作/作品/教育/联系方式）
  // itemOverrides[id] → 就地覆盖该条目的字段（role/summary/tags/detail…）：
  //   同一段真实经历，不同变体换侧重叙述。日期/公司/学历这些事实仍来自 base，不会分叉。
  _flag(items, v) {
    const hide = new Set(v.hideItems || []);
    const emph = new Set(v.emphasizeItems || []);
    const ov = v.itemOverrides || {};
    return items
      .filter((it) => !hide.has(it.id))
      .map((it) => Object.assign({}, it, ov[it.id] || null, { _emph: emph.has(it.id) }));
  },

  // 侧边栏能力的显示方式："level"(默认，5 点熟练度) / "since"(经验年限) / "both" / "none"
  // 年限由 capability.since 起始月实时算出（见 duration.js），不需要手工维护数字。
  // 向后兼容：没写 skillDisplay 时，旧的 hideSkillLevels:true 仍等价于 "none"。
  _skillDisplay(v) {
    const MODES = ["level", "since", "both", "none"];
    if (v.skillDisplay && MODES.indexOf(v.skillDisplay) !== -1) return v.skillDisplay;
    return v.hideSkillLevels ? "none" : "level";
  },

  // 侧边栏：按变体 sidebar 的 id 顺序，从 capabilities 取出对应能力
  // （返回 base.capabilities 的原始对象引用，since 等可选字段天然带过去）
  _pickCaps(caps, ids) {
    const map = new Map(caps.map((c) => [c.id, c]));
    return ids.map((id) => map.get(id)).filter(Boolean);
  },

  // 工具集：默认全部 tools。
  //   onlyTools 白名单（不写＝全部）→ hideTools 黑名单 → highlightTools 标 _hl。
  // 两个名单都写时先过白名单再过黑名单（黑名单赢）。顺序始终是 base.js 的原顺序。
  // 黑名单的用处：往 base.tools 加一组新工具时，它会自动漏进所有没写 onlyTools 的变体
  //   —— 不想让某个变体看见，就在那个变体里 hideTools 掉。
  _flagTools(tools, hlIds, onlyIds, hideIds) {
    const hl = new Set(hlIds);
    const only = onlyIds && onlyIds.length ? new Set(onlyIds) : null;
    const hide = new Set(hideIds || []);
    return tools
      .filter((tt) => (!only || only.has(tt.id)) && !hide.has(tt.id))
      .map((tt) => Object.assign({}, tt, { _hl: hl.has(tt.id) }));
  },

  // 按 order 指定的 id 顺序排，未列出的接在后面
  /* ⚠️ 项目里有两个 order，别混：
       · sections.order —— 排**板块**（哪些板块出现、按什么顺序），在 render.js 里用；
       · 顶层 order       —— 排**条目**（{ projects: [...], contact: [...] }），就是这个函数。
     语义：列出的按给定顺序排在前面，没列出的保持原顺序跟在后面（不是白名单，不会删条目）。 */
  _order(items, orderIds) {
    if (!orderIds || !orderIds.length) return items;
    const map = new Map(items.map((it) => [it.id, it]));
    const out = [];
    orderIds.forEach((id) => {
      if (map.has(id)) { out.push(map.get(id)); map.delete(id); }
    });
    items.forEach((it) => { if (map.has(it.id)) out.push(it); });
    return out;
  },

  // 开发校验：变体引用了不存在的 id 时 console.warn（手动编辑时及早发现笔误）
  _validate(base, v) {
    const has = (arr, id) => (arr || []).some((x) => x.id === id);
    const itemPool = [].concat(base.projects || [], base.work || [], base.moreWorks || [], base.education || [], base.contact || []);
    // 板块白名单来自 render.js 的注册表（唯一真源）。_validate 是运行时调用的，
    // 此时 render.js 早已执行完 —— index.html 与 works.html 里它都排在 data-loader 之后，
    // 而两处 DataLoader.load 的调用点都在 DOMContentLoaded 之后。兜底是给将来抽掉 render 的场景。
    const SECTIONS = (window.Render && window.Render.SECTION_KEYS) ||
      ["profile", "skills", "toolset", "languages", "contact", "intro", "collab", "projects", "work", "oddjobs", "moreWorks", "portfolio", "education"];
    const bad = [];
    (v.sidebar || []).forEach((id) => { if (!has(base.capabilities, id)) bad.push("sidebar → " + id); });
    (v.highlightTools || []).forEach((id) => { if (!has(base.tools, id)) bad.push("highlightTools → " + id); });
    (v.onlyTools || []).forEach((id) => { if (!has(base.tools, id)) bad.push("onlyTools → " + id); });
    (v.hideTools || []).forEach((id) => { if (!has(base.tools, id)) bad.push("hideTools → " + id); });
    (v.emphasizeItems || []).forEach((id) => { if (!has(itemPool, id)) bad.push("emphasizeItems → " + id); });
    (v.hideItems || []).forEach((id) => { if (!has(itemPool, id)) bad.push("hideItems → " + id); });
    Object.keys(v.itemOverrides || {}).forEach((id) => { if (!has(itemPool, id)) bad.push("itemOverrides → " + id); });
    const s = v.sections || {};
    [].concat(s.order || [], s.hide || [], s.emphasize || []).forEach((k) => { if (SECTIONS.indexOf(k) === -1) bad.push("sections → " + k); });
    if (v.skillDisplay && ["level", "since", "both", "none"].indexOf(v.skillDisplay) === -1) bad.push("skillDisplay → " + v.skillDisplay);
    if (bad.length) console.warn('[cv] 变体 "' + (v.id || "?") + '" 引用了无效 id：\n  ' + bad.join("\n  "));

    // since 写在 base.capabilities 上（不属于「变体引用了无效 id」）→ 单独一条警告。
    // 判定直接复用 Duration.valid：警告口径与真实渲染口径永远是同一套
    //（含 trim、含「2 月 31 日」这类日历上不存在的日期）。
    // duration.js 没加载时（odd 页等）跳过，不做半套校验去发假警报。
    if (window.Duration && window.Duration.valid) {
      const badSince = [];
      (base.capabilities || []).forEach((c) => {
        if (c.since && !window.Duration.valid(c.since)) badSince.push(c.id + " → " + c.since);
      });
      if (badSince.length) console.warn("[cv] capabilities 的 since 格式非法（应为 YYYY-MM 或 YYYY-MM-DD，且须是真实存在的日期）：\n  " + badSince.join("\n  "));
    }
  },
};
