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
base.js（静态加载，提供 RESUME_BASE）
   ＋
variants/<v>.js（按 ?v= 动态注入，提供 RESUME_VARIANT）
   ↓ data-loader 合并（headline/intro 覆盖、emphasize 高亮、order 排序、hide 过滤、promote 置顶）
   ↓ render 用 I18n.t() 取当前语言渲染
   ↓ #cv-root（屏幕） / #cv-card（名片）
```
语言优先级：`?lang=` > localStorage > 浏览器语言 > `meta.defaultLang`。

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

## 待办 / 未来接口
- [ ] **灌真实内容**：替换 `data/base.js` 占位（你给一种语言母本，补齐四语）
- [ ] 名片 PNG 导出：`scripts/export/card.js` 的 TODO（方案A：SVG `<foreignObject>` → canvas，无依赖）
- [ ] 本人模式入口：`?mode=full` 现可用；若加 PIN 仅作"防手滑"，不作安全承诺
- [ ] 公开名片页：可被搜到的极简页（与 noindex 简历分开），用于自由职业获客
- [ ] 自定义域名（如 `shipeng.dev`），GitHub Pages 支持绑定
- [ ] PWA「添加到主屏幕」
- [ ] 艺术性小交互：`scripts/interactions/` 已留注册接口（可双端/单端开关、自动尊重 `prefers-reduced-motion`、用 transform/opacity 走 GPU 合成，无需专门硬件加速）
- [ ] 自托管字体（Inter + Noto Sans CJK），跨设备观感更统一
- [ ] 职位 → 链接 对照生成器（群发省事），`tools/` 下

## 关键约束（别踩）
- 勿引 Google Fonts CDN（德国 GDPR）。
- 屏幕版与打印版是**两套排版**（`print.css`），不必把屏幕内容压成一页 A4。
- 变体之间数据可被有心人翻出（低端防护级别）——别在不同变体写互相冲突、不想被对方看到的话。
