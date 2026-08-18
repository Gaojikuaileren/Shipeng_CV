/* ============================================================
   duration.js — 由起始月份实时算出「经验时长」
   写一次 since，之后数字自己长大：不用每月上来手工改年限。
   注意：必须在 render.js 之前加载（文案取自 i18n-ui.js 的 window.UI_TEXT）。
   ============================================================ */
window.Duration = {
  // "YYYY-MM" / "YYYY-MM-DD" → 距 nowDate（缺省=此刻）的整月数
  // 用真实年月差做整月运算：(Δ年)*12 + Δ月，绝不用「天数 ÷ 30」这类近似。
  // 非法格式 / 未来日期 → null（调用方据此不渲染，也不报错）
  months(sinceStr, nowDate) {
    const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(String(sinceStr == null ? "" : sinceStr).trim());
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const day = m[3] ? Number(m[3]) : 0;
    if (y < 1900) return null; // 简历不可能早于此；也避开 Date 把两位年份当 19xx 的旧行为
    if (mo < 1 || mo > 12) return null;
    // 按真实日历校验「这个月到底有没有这一天」：2 月 31 日 / 平年 2 月 29 日一律算写错
    if (m[3] && (day < 1 || day > this._dim(y, mo))) return null;

    // 鸭子类型而非 instanceof：跨 realm（iframe / 测试沙箱）传进来的 Date 也认。
    // 下面四个方法本函数都要用 → 缺一个就当没传，退回真实时钟，绝不半路抛异常。
    const usable = nowDate && ["getFullYear", "getMonth", "getDate", "getTime"]
      .every((k) => typeof nowDate[k] === "function");
    const now = usable ? nowDate : new Date();
    if (isNaN(now.getTime())) return null;

    let n = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - mo);
    // since 精确到「日」时：本月还没走到那一天 → 这个月不算满，减 1。
    // 那一天要先按当月天数钳位（日历钳位语义，同 Excel EDATE / java.time.Period）：
    // 否则 since=1 月 31 日在只有 30 天的月份里永远等不到「31 号」，进位被推到下月 1 号。
    if (day) {
      const target = Math.min(day, this._dim(now.getFullYear(), now.getMonth() + 1));
      if (now.getDate() < target) n -= 1;
    }

    return n < 0 ? null : n; // 未来日期 → null
  },

  // 整月数 → 显示串；算不出 / 不足一个月 → null（「0 个月」读不通，不如不显示）
  // < 12 个月按月显示；≥ 12 个月向下取整到整年，不显示零头月份
  //   → 数字一年只变一次（省得频繁变动），floor 也保证永不夸大。
  format(months, lang) {
    const T = window.UI_TEXT && window.UI_TEXT.duration;
    if (!T) return null;
    const n = Math.floor(Number(months));
    if (!isFinite(n) || n < 1) return null;

    const years = Math.floor(n / 12);
    // 四语各自写死单复数形态（zh/ja 无复数，de/en 只有 one/other）→ 不引入 Intl，也就没有兼容负担
    const key = years >= 1 ? (years === 1 ? "year" : "years") : (n === 1 ? "month" : "months");
    const tpl = T[key] && (T[key][lang] || T[key].en);
    if (!tpl) return null; // 缺整块或缺单个 key 都只是「不显示」，绝不抛异常拖垮 renderSkills
    return tpl.replace("{n}", String(years >= 1 ? years : n));
  },

  // 显示串 → 屏幕阅读器用的完整说法（「2 Jahre Erfahrung」），免得只念出孤零零一个数字
  aria(text, lang) {
    const T = window.UI_TEXT && window.UI_TEXT.duration;
    if (!T || !text) return null;
    const tpl = T.aria && (T.aria[lang] || T.aria.en);
    if (!tpl) return null;
    return tpl.replace("{v}", text);
  },

  // since 字面量是否合法（data-loader 的 _validate 复用此处 → 「警告」与「渲染」同一套规则，
  // 包括同样先 trim，免得带空格的 since 被警告成非法却照常渲染）
  // 用一个足够远的将来当「现在」：否则「格式没错、只是还没到」的未来日期会被误判成格式错误。
  valid(sinceStr) {
    return this.months(sinceStr, new Date(9999, 11, 31)) !== null;
  },

  // 某年某月（月份 1-12）有多少天：下月 0 号 = 本月最后一天
  _dim(y, mo) {
    return new Date(y, mo, 0).getDate();
  },
};
