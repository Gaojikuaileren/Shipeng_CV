# Shipeng_CV — 项目蓝图 / 决策记录

长期项目。本文件记录"**为什么这样做**"，方便日后回看与维护。
（操作指南看 [README.md](README.md)。）

---

## 定位
求职简历 ＋ 自由职业名片，双身份。一份内容、四语、按职位定制、可导出。

## 已定决策

| 维度 | 决定 | 理由 |
|---|---|---|
| 技术栈 | 数据驱动纯静态站，原生 HTML/CSS/JS，零构建 | 非前端开发者最省心；改内容只动数据；推 GitHub Pages 即生效 |
| 部署 | GitHub Pages | 浏览量不大，免费够用 |
| 语言 | 中日英德四语，架构全支持，内容可分批灌 | 受众最广；专名不翻、描述性文字才翻 |
| 视觉 | 瑞士极简 / 网格系统 | 专业耐看、跨端稳、对简历/名片安全 |
| 字体 | **自托管 Hanken Grotesk**（woff2，~90KB）＋ CJK 系统字体栈 | 规避 Google Fonts 在德国的 GDPR 风险；零外部请求；Hanken 人文感适合艺术背景 |
| 响应式 | 移动优先，双端适配 | 手机端排版直接影响体验 |
| 导出 | PDF简历(原生打印·多模板) ＋ 名片(PNG＋打印) ＋ 文本摘要 | 文字矢量、ATS 友好、零依赖 |
| 隐私 | noindex ＋ 邮箱防采集 ＋ 敏感信息粗化/不放 | 见威胁模型 |
| 不做 | 后端鉴权、真访问控制 | 对简历/名片是 over-engineering，增加 HR 摩擦 |

## 数据流
```
base.js（RESUME_BASE：profile/intro/capabilities/tools/projects/work/moreWorks/languages/education/contact）
   ＋
variants/<v>.js（按 ?v= 动态注入，RESUME_VARIANT）
   ↓ data-loader 合并：
       · headline/intro/greeting/photo/profileFields 覆盖
       · sidebar → 从 capabilities 选侧边栏能力（按数组序）
       · skillDisplay "level"(默认)/"since"/"both"/"none" → 能力名右侧显示点数 / 经验年限 / 两者 / 无；
         旧字段 hideSkillLevels:true 折算为 "none"（向后兼容）。年限由 capability.since 实时算（duration.js）
       · highlightTools → 标记工具集高亮+排前；onlyTools → 工具集白名单；hideTools → 工具集黑名单
         （两个名单都写时先白后黑；黑名单是给「base 新增工具组不该漏进老变体」用的）
       · sections{order,hide,emphasize} → 板块级控制（order 也可排侧边栏板块）
       · sectionTitles → 板块标题按变体语境改写
       · emphasizeItems/hideItems → 条目级（项目/工作/教育/联系 id）
       · itemOverrides → 条目字段就地覆盖（同一段经历换叙述侧重，事实字段仍来自 base）
       · collab/contactNote → 可选板块数据（给了才渲染）
       · worksPage:true → PDF 作品集的共用二维码改指向 works.html（不写＝仍指 Vimeo 主页）
         协议守卫：只有 http(s) 才生成这个地址；file://（双击打开）返回 null → 整块退回
         「QR 指 Vimeo、不印说明行」。本机磁盘路径既扫不出东西，也不该印在给雇主的纸上。
       · 无效 id → console.warn 提示
   ↓ render 用 I18n.t() 取当前语言、DocumentFragment 一次性渲染
   ↓ #cv-root（屏幕） / #cv-card（名片）

works.html（作品链接页，同一份 base + 同一套变体机制，只是换个渲染）
   ↓ 读 ?v=（缺省 ue5-tech）＋ ?lang=，复用 Render.workLink 判定「哪些条目有链接、配哪个徽标」
   ↓ 变体解析走 scripts/variants.js（短链与长 ID 都认，本页不另抄白名单）；认不出 → console.warn
   ↓ #wk-root —— 单列大块超链接，给扫二维码的手机看
```
语言优先级：`?lang=` > localStorage > 浏览器语言 > `meta.defaultLang`。

**短链 ↔ 内部 ID（`scripts/variants.js`，全站唯一一份）**：对外发 `?v=ue|fl|ds|mn|cd`，
对内一律用长 ID（`ue5-tech|art-vr|designer|odd|china-biz`）—— 统计计数键、`body.v-*` 排版类名、
数据文件名都是长 ID，所以短链改名不断历史统计、不用重调按变体标定的 PDF 版式。
旧链（`?v=ue5-tech`，含已印在 PDF 二维码里的）与退役 ID（`ue5-ai` → `ue5-tech`）永久有效：
认出后照常渲染，只用 `history.replaceState` 把地址栏静默换成短链 —— 不跳转、不重载、不多记一次访问。
`?v=mn` 指向独立页面 `odd/`，是这套里唯一会整页跳转的一条（跳转发生在打点之前，不会重复计数）。

**技能两结构（解耦）**：`capabilities`（核心能力，侧边栏，四语带熟练度，变体 `sidebar` 选）＋ `tools`（具体软件，工具集，变体 `highlightTools` 高亮）。加能力/软件互不影响。

**变体只换叙述，不换事实**（`itemOverrides` 的设计意图）：同一段真实经历，不同职业变体可以换侧重讲法（如自由职业在 UE5 版讲实时系统、在中德商务版讲需求澄清与项目协调），但日期 / 公司 / 学校 / 学历名 / 语言等级一律只写在 `base.js`。这样多版本被同一个人对照看时不会出现互相矛盾的履历。**新变体一律用重新解释，不许新增不存在的经历。**

## 分发式身份（核心设计）
**身份不靠"检测"，靠"分发"**——你给谁什么链接/暗号，就决定了他是谁：
- 本人：`?mode=full`（暗号，本地记住）→ 完整版 + private
- HR/客户：`?v=xxx` 专属链接 → 定制版
- 路人/爬虫：无参数 → 最保守版 + noindex

这优雅绕开了"静态站无法可靠识别爬虫"的死结。

## 威胁模型（隐私的边界，务必清醒）
纯静态站 = **客户端无秘密**，凡浏览器能显示的，F12 都能拿到。所以：

| 威胁 | 能防吗 | 手段 |
|---|---|---|
| 搜索引擎收录 | ✅ | `noindex` meta + robots.txt |
| 低端邮箱/电话采集器 | ✅ 大部分 | 明文不进 DOM，base64 编码 + 点击解码 |
| 会执行 JS、模拟点击的针对爬虫 | ❌ | 静态站无解，除非上后端 |

原则：**公网仓库里不允许出现真正敏感信息**。`visibility:"private"` 只能用于"默认不展示但不敏感"的字段（如出生年份、备注）；绝不能放住址、证件、签证、真实报价策略等。
前端 PIN / ?mode=full 只是显示开关，不是安全机制。真正私密材料走单独 PDF 或邮件附件。

## 进展 / 待办

**已完成**（2026-06-04 已部署上线 `gaojikuaileren.github.io/Shipeng_CV/`）：
- [x] 真实内容灌入；4 职业变体（ue5-tech/art-vr/designer/china-biz）＋ 兼职独立页 `odd/`
- [x] 2026-08-17 第五变体 `china-biz`（中德商务开发 / 采购对接 / 项目协调，`?v=china-biz`，hub `/s05`）：
      CV ＋ Cooperation Profile 双用途（投职位 ＋ 直接发德国 Beschaffungs-/Einkaufsagentur 谈合作）。
      新增可复用机制：`collab` 板块、`itemOverrides`、`onlyTools`、`sectionTitles`、`profileFields`、
      `contactNote`、`hideSkillLevels`、`sections.order` 兼管侧边栏顺序。
- [x] 经验年限自动化：`capabilities[].since` ＋ 变体 `skillDisplay`（`scripts/duration.js`）。
      写一次起始月，年限每次渲染按当前日期算出来，不用手工维护数字；
      默认 `"level"`，不写 since / 不设 skillDisplay 的变体输出与加此机制前完全一致。
- [x] 作品链接页 `works.html` ＋ 变体开关 `worksPage`：PDF 里作品集仍只有**一个**共用二维码，
      但它改指向 `works.html?v=<变体>&lang=<语言>`（地址运行时由 `location` 推出，不写死域名），
      那一页把该变体每件作品的链接排成手机上点得中的大块链接。
      唯一真相仍在 `data/`：判定复用 `Render.workLink`，没链接的条目不列，变体藏掉的板块也不列。
      默认关闭 → 老变体的 PDF 与从前逐字节一致。
- [x] 「更多作品」屏幕端折叠：超过 6 条默认只显示前 6 条 ＋ 真 `<button>`（`aria-expanded`/`aria-controls`）。
      **PDF 永远全量、按钮不进纸** —— 横跨整页那份副本渲染时就不折叠，print.css 另有两条兜底规则。
      条目不到阈值的变体（ue5-tech 的 6 条）连按钮都不建，DOM 与加此机制前逐字节相同。
- [x] 2026-08-17 统计后端从 KV 换成 Durable Object（`worker/`，已部署）：
      老设计把五个职业的数字放在**一个 KV key** 里，每次 +1 都「读整个 JSON → 改 → 写回」。
      KV 读是最终一致的，密集访问时会读到旧快照再写回，把别人的 +1 覆盖掉 —— 实测线上
      ue5-tech 从 4 掉到 1。现在读写都进同名 DO 实例（全球唯一），写操作用
      `blockConcurrencyWhile` 串行化，读-改-写不再交错。
      对外端点与 JSON 结构完全不变 → `hub.html` / `scripts/stats.js` 无需改动。
      计数从 DO 重新开始（0 基线）；老 KV 数据未删除，需要时：
      `wrangler kv key get stats --namespace-id f9f3464f85d14b64abdb885d87254b91 --remote`
- [x] 名片 modal（分享 + canvas 离线绘 PNG）
- [x] 自托管 Hanken 字体；技能系统重构成 `capabilities` / `tools`
- [x] 私人控制台 `hub.html`（四选一 + 复制链接，替代"职位→链接生成器"）
- [x] 性能/健壮/a11y/分享元信息/文档 多轮优化

**未来接口（先不做）**：
- [ ] 公开名片页：可被搜到的极简页（与 noindex 简历分开），自由职业获客用
- [ ] 自定义域名（如 `shipeng.dev`），GitHub Pages 支持绑定
- [ ] PWA「添加到主屏幕」
- [ ] 艺术性小交互：`scripts/interactions/` 已留注册接口（可按端开关、尊重 reduced-motion）
- [ ] CJK 自托管字体（Noto Sans CJK），跨设备观感更统一

**内容尾巴**：
- [ ] 日语用词校对（如 art-vr「沉浸型」→「没入型」）
- [ ] 真实 Vimeo 各作品链接（现指向主页）、真实照片（现占位 SVG）。
      ⚠️ 有了 `works.html` 之后这条有了新的后果：`prj-room` 与 `prj-grau` 两条的 `video`
      都还是同一个 Vimeo 主页 → 扫码的人看到 4 张卡片，点进去只有 3 个不同目的地，
      其中两张完全一样。**补上真实链接之前，别把 ue5-tech 的 PDF 发出去。**
- [ ] `moreWorks` 15 条全都没有 `link` / `video` → `works.html` 的「更多作品」组恒为空
      （空组不渲染，代码是对的，缺的是数据）。`s-gjklr.work` / `Spoy Wiki` / `SP_lessons` /
      `Shipeng CV` 都是有公开网址的，补 `link` ＋ `linkKind:"web"` 就会自动出现在那一页。
- [ ] `cap-genai` 的 `since: "2024-08"` 是机主口述；本机只找得到 2026-08 起的生成式痕迹。
      侧边栏年限是 ue5-tech 最大的卖点，发出去前请自查能否拿出佐证。
- [ ] `tools` 的 AI 组：`Flux` 本机只有 VAE、没有主模型，待机主确认是否真出过图。
      同批的 Stable Diffusion / SDXL、ControlNet、InstantID、LivePortrait 已因零痕迹删除。

## 关键约束（别踩）
- 勿引 Google Fonts CDN（德国 GDPR）。
- 屏幕版与打印版是**两套排版**（`print.css`），不必把屏幕内容压成一页 A4。
- 变体之间数据可被有心人翻出（低端防护级别）——别在不同变体写互相冲突、不想被对方看到的话。
