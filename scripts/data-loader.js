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
      // 工具集（全部 tools；highlightTools 命中的标 _hl）
      tools: this._flagTools(base.tools || [], v.highlightTools || []),
      projects: this._order(this._flag(base.projects, v), order.projects),
      work: this._order(this._flag(base.work, v), order.work),
      moreWorks: base.moreWorks ? this._flag(base.moreWorks, v) : [],
      oddjobs: base.oddjobs ? this._flag(base.oddjobs, v) : [],
      languages: base.languages.slice(),
      education: base.education.slice(),
      contact: this._order(this._flag(base.contact, v), (v.order || {}).contact), // hideItems 隐藏 + order.contact 排序
      // 板块级控制（显示/顺序/重点）→ render
      sections: v.sections || { order: [], hide: [], emphasize: [] },
    };
    // 变体可覆盖头衔
    data.profile.title = v.headline || base.profile.title;
    return data;
  },

  // 过滤 hideItems；emphasizeItems → _emph（条目级：项目/工作/作品/联系方式）
  _flag(items, v) {
    const hide = new Set(v.hideItems || []);
    const emph = new Set(v.emphasizeItems || []);
    return items
      .filter((it) => !hide.has(it.id))
      .map((it) => Object.assign({}, it, { _emph: emph.has(it.id) }));
  },

  // 侧边栏：按变体 sidebar 的 id 顺序，从 capabilities 取出对应能力
  _pickCaps(caps, ids) {
    const map = new Map(caps.map((c) => [c.id, c]));
    return ids.map((id) => map.get(id)).filter(Boolean);
  },

  // 工具集：全部 tools，highlightTools 命中的标 _hl
  _flagTools(tools, hlIds) {
    const hl = new Set(hlIds);
    return tools.map((tt) => Object.assign({}, tt, { _hl: hl.has(tt.id) }));
  },

  // 按 order 指定的 id 顺序排，未列出的接在后面
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
    const SECTIONS = ["profile", "skills", "toolset", "languages", "contact", "intro", "projects", "work", "oddjobs", "moreWorks", "portfolio", "education"];
    const bad = [];
    (v.sidebar || []).forEach((id) => { if (!has(base.capabilities, id)) bad.push("sidebar → " + id); });
    (v.highlightTools || []).forEach((id) => { if (!has(base.tools, id)) bad.push("highlightTools → " + id); });
    (v.emphasizeItems || []).forEach((id) => { if (!has(itemPool, id)) bad.push("emphasizeItems → " + id); });
    (v.hideItems || []).forEach((id) => { if (!has(itemPool, id)) bad.push("hideItems → " + id); });
    const s = v.sections || {};
    [].concat(s.order || [], s.hide || [], s.emphasize || []).forEach((k) => { if (SECTIONS.indexOf(k) === -1) bad.push("sections → " + k); });
    if (bad.length) console.warn('[cv] 变体 "' + (v.id || "?") + '" 引用了无效 id：\n  ' + bad.join("\n  "));
  },
};
