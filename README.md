# Shipeng_CV

世鹏的简历 / 名片网站。数据驱动的纯静态站，零构建，部署到 GitHub Pages。
**一份内容 → 四语切换、按职位定制、导出 PDF / 名片 / 文本。**

---

## 本地预览

**方式一（推荐）** 起本地服务器：
```
node tools/serve.js
```
浏览器打开 http://localhost:5180

**方式二** 直接双击 `index.html`（`file://` 打开）。多数浏览器可用；个别浏览器限制本地脚本加载时改用方式一。

---

## 改内容（最常做的事）

所有简历内容都在 `data/` 里，**改内容不用碰布局代码**：

- `data/base.js` — 核心内容：个人情报 / 自我介绍 / 教育 / 项目经历(projects) / 工作经历(work) / 更多作品(moreWorks) / 语言 / 联系。
- **技能分两块**：`capabilities`（核心能力，侧边栏，四语带熟练度）＋ `tools`（具体软件，工具集，按 group 分组）。
- 兼职简历是完全独立的 `odd/data.js`（不与主简历共享数据）。
- 每个多语字段是 `{ zh, ja, en, de }`，只改引号里的值；某语言留空 `""` 自动 fallback。
- 技术栈 / 专名（UE5、Blueprint、OSC…）一般不翻译。
- `visibility: "private"` 默认隐藏；`protected: true` 的邮箱/电话防采集。

---

## 多职位定制（分发式简历）

想给不同职位 / 公司发不同侧重的简历：

1. 复制一个 `data/variants/*.js` → `data/variants/你起的名字.js`
2. 改里面（字段都可选）：
   - `headline` 岗位头衔、`intro` 岗位自我介绍、`greeting` 给特定公司的一句话（顶部显示，加分）
   - `sidebar` 侧边栏显示哪些核心能力（`cap-` id，按数组顺序排）
   - `hideSkillLevels: true` 侧边栏只列能力名、不打 5 点熟练度（没有年限背书的能力别自称专家）
   - `highlightTools` 工具集里高亮＋排前的软件（`t-` id）
   - `onlyTools` 只显示这些软件（白名单；不写＝显示全部）
   - `sections` 板块级控制 `{ order, hide, emphasize }`（板块名 projects/work/toolset/collab/portfolio…）
     · `order` 里也可以放侧边栏板块名（skills / languages / contact）来调侧边栏顺序
   - `emphasizeItems` / `hideItems` 条目级（id 如 `prj-` / `work-` / `edu-` / `email-`）
   - `itemOverrides` **同一段真实经历换叙述侧重**：`{ "work-freelance": { role, summary, tags } }`
     日期 / 公司 / 学校 / 学历名仍来自 `base.js` → 各变体事实不会分叉
   - `profileFields` 覆盖照片下方的情报行（如把「状态」换成「可接受：正式雇佣 · 项目合作」）
   - `sectionTitles` 覆盖板块标题（如 toolset → "Technical & Creative Background"）
   - `collab` 能力板块数据 `[{ id, title, note, items:[…] }]`（给了才渲染；用于「我能带来什么」这类板块）
   - `contactNote` 联系方式下方一句话 CTA（如求职 ＋ 合作双身份）
3. 把链接 `你的域名/?v=你起的名字` 发给对应招聘方。
4. 新变体还要在两处登记，否则不生效：
   - `index.html` 顶部 `VALID = { … }`（裸入口拦截白名单，漏了会显示占位点）
   - `hub.html` 的 `ROUTES` / `NAMES` / `ORDER` / `CLEAN`，以及 `worker/cv-stats-worker.js` 的 `VARIANTS`
     （Worker 改完要 `wrangler deploy` 才会统计新变体）

无参数 `/` = 占位点（不暴露内容）；变体不存在自动回退 `ue5-tech`。
**写错 id 会在浏览器控制台 `console.warn` 提示**，方便排查笔误。

---

## 三种访客（身份靠"分发"，不靠"检测"）

| 访客 | 怎么进 | 看到 |
|---|---|---|
| 你本人 | `?mode=full`（本地记住，工具栏点 Exit 退出） | 完整版 + private 字段自动展开 |
| HR / 客户 | 你发的 `?v=xxx` 专属链接 | 为该岗位定制的版本 |
| 路人 / 爬虫 | 直接访问 `/` | 默认版，private 点击才显示，全站 noindex |

⚠️ 前端无真安全（详见 [SPEC.md](SPEC.md)）。private 只是"防君子"，**绝密信息不要放进来**。

---

## 导出（工具栏右上）

- **↓ PDF** — 打印对话框选「另存为 PDF」= A4 简历（文字矢量、ATS 友好）。工具集/更多作品在 PDF 里横跨整页排最后；作品集变「二维码＋目录」；页尾带联系方式。
- **▭ Card** — 弹出名片卡片窗口：分享（iOS/Mac 系统分享 / 其他端复制链接）＋ 下载 PNG（canvas 离线绘制）。
- **⧉ Copy** — 复制「姓名 ＋ 当前可见联系方式 ＋ HR 评分模板」（随当前语言）。

> 打印 / PDF 的真实效果需在本地浏览器的打印对话框里看（预览环境看不到）。

---

## 语言

首次按浏览器语言自动选，之后记住你的选择。切换器在工具栏左上：中文 / 日本語 / EN / DE。
也可用 `?lang=de` 直接指定。

---

## 部署（已上线）

- 站点：`https://gaojikuaileren.github.io/Shipeng_CV/`
- 仓库：`github.com/Gaojikuaileren/Shipeng_CV`（main 分支根目录，GitHub Pages）
- **私人控制台**：`/hub.html` —— 指令式（未被任何公开页链接，只给你自己用）
  · `/s01` 游戏开发　`/s02` 媒体艺术　`/s03` 设计师　`/s04` 兼职　`/s05` 中德商务
  · `/sdata` 看分职业访问统计；`/clean01`–`/clean05`、`/cleanall` 清零

**改完内容重新部署**：`git add -A && git commit -m "..." && git push`，1–2 分钟自动重建。

`robots.txt` + `noindex` 已禁止搜索引擎收录 —— 简历靠你主动发链接传播。

---

## 目录结构

```
Shipeng_CV/
├── index.html            主简历入口
├── hub.html              私人控制台（四选一 + 复制链接）
├── robots.txt            禁止索引
├── odd/
│   ├── index.html        兼职简历（完全独立页）
│   └── data.js           兼职数据（独立，不引用主 base）
├── data/
│   ├── base.js           核心内容（capabilities/tools/projects/work/…，四语）
│   └── variants/         职位变体（ue5-tech / art-vr / designer / china-biz）
├── styles/
│   ├── fonts.css         自托管 Hanken Grotesk @font-face
│   ├── tokens.css        设计变量（颜色/字体/间距）← 想换风格先改这里
│   ├── base.css          reset + 工具栏/按钮/toast + 名片弹窗
│   ├── screen.css        屏幕布局（移动优先响应式）
│   └── print.css         A4 简历 + 名片 + 打印专项
├── scripts/
│   ├── i18n-ui.js        所有 UI 文案（四语集中）
│   ├── i18n.js           语言检测/切换
│   ├── identity.js       变体 / 本人模式解析
│   ├── data-loader.js    base + variant 合并 + 无效 id 校验
│   ├── render.js         按板块渲染
│   ├── main.js           入口串联
│   ├── lib/qrcode.js     自托管 QR 库
│   ├── interactions/     交互层（预留，可按端开关）
│   └── export/           pdf / card / text / qr 导出
├── assets/
│   ├── fonts/            Hanken Grotesk woff2（自托管）
│   └── photo/            照片（现为占位 SVG）
└── tools/serve.js        本地预览服务器
```
