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
  - `capabilities` 每项可选 `since: "2024-03"`（也接受 `"2024-03-15"`）＝ 这项能力**从哪个月开始**。
    页面每次渲染按当前日期实时算年限，**不用每月手工更新数字**。不足 12 个月按月显示，
    满 12 个月起向下取整到整年（14 个月 → 1 年），起始当月不足 1 个月则不显示。
    要真的显示出来还得在变体里设 `skillDisplay: "since"` 或 `"both"`。
- 兼职简历是完全独立的 `odd/data.js`（不与主简历共享数据）。
- 每个多语字段是 `{ zh, ja, en, de }`，只改引号里的值；某语言留空 `""` 自动 fallback。
- 技术栈 / 专名（UE5、Blueprint、OSC…）一般不翻译。
- `visibility: "private"` 默认隐藏；`protected: true` 的邮箱/电话防采集。
- 项目想同时进「作品集」板块，就给它一个 `link`（外链），并用 `linkKind` 决定徽标：
  `"video"` ▶视频 / `"store"` ↗商店 / `"web"` ↗网站（不写＝web）。老字段 `video` 继续管用，等于 `linkKind:"video"`。
- ⚠️ `base.js` 是所有变体共享的：往 `projects` / `moreWorks` / `tools` 加条目，
  **所有没挡住它的变体都会跟着多出来**。只想给某一个变体用的内容，记得在其余变体里
  用 `hideItems`（项目 / 作品）或 `hideTools`（软件）挡掉。

---

## 多职位定制（分发式简历）

想给不同职位 / 公司发不同侧重的简历：

1. 复制一个 `data/variants/*.js` → `data/variants/你起的名字.js`
2. 改里面（字段都可选）：
   - `headline` 岗位头衔、`intro` 岗位自我介绍、`greeting` 给特定公司的一句话（顶部显示，加分）
   - `sidebar` 侧边栏显示哪些核心能力（`cap-` id，按数组顺序排）
   - `skillDisplay` 侧边栏能力名右边显示什么：`"level"`（默认，5 点熟练度）/ `"since"`（经验年限）/
     `"both"` / `"none"`（什么都不显示）。年限来自 `capabilities` 的 `since`，自动算，见上方「改内容 → 技能分两块」
   - `hideSkillLevels: true` 旧写法，等同 `skillDisplay: "none"`（两个都写时以 `skillDisplay` 为准）
   - `highlightTools` 工具集里高亮＋排前的软件（`t-` id）
   - `onlyTools` 只显示这些软件（白名单；不写＝显示全部）
   - `hideTools` 不显示这些软件（黑名单；两个都写时先过白名单再过黑名单）。
     用途：往 `base.js` 加一组新软件时它会自动出现在所有变体里，不想露给谁就在那个变体里挡掉
   - `sections` 板块级控制 `{ order, hide, emphasize }`（板块名 projects/work/toolset/collab/portfolio…）
     · `order` 里也可以放侧边栏板块名（skills / languages / contact）来调侧边栏顺序
   - `emphasizeItems` / `hideItems` 条目级（id 如 `prj-` / `work-` / `edu-` / `email-`）
   - `itemOverrides` **同一段真实经历换叙述侧重**：`{ "work-freelance": { role, summary, tags } }`
     日期 / 公司 / 学校 / 学历名仍来自 `base.js` → 各变体事实不会分叉
   - `profileFields` 覆盖照片下方的情报行（如把「状态」换成「可接受：正式雇佣 · 项目合作」）
   - `sectionTitles` 覆盖板块标题（如 toolset → "Technical & Creative Background"）
   - `collab` 能力板块数据 `[{ id, title, note, items:[…] }]`（给了才渲染；用于「我能带来什么」这类板块）
   - `contactNote` 联系方式下方一句话 CTA（如求职 ＋ 合作双身份）
   - `worksPage: true` 把 PDF 作品集里那个共用二维码改指向 `works.html`（见下方「作品链接页」）。
     不写＝二维码仍指向 Vimeo 主页（老变体保持原样，不多一次跳转）
3. 把短链 `你的域名/?v=<短码>` 发给对应招聘方。
4. 新变体还要在**三处**登记，否则不生效（漏了大多不报错，只是悄悄不对）：
   - `scripts/variants.js` 的 `ALIAS`（**短链 ↔ 内部 ID 的唯一真相**；
     `index.html` 的裸入口拦截、`works.html` 的作品清单、`identity.js` 都从这里读）
   - `data/base.js` 的 `meta.variants`
   - `worker/cv-stats-worker.js` 的 `VARIANTS`（漏了 `/hit` 与 `/pdf` 返回 400，访问量一次都记不上；
     改完要在 `worker/` 目录跑 `wrangler deploy` 才生效）
   另外 `hub.html` 的 `ROUTES` / `NAMES` / `ORDER` / `CLEAN` 是控制台自己的清单，按需加。

### 短链与旧链

对外一律用短码，对内一律用长 ID：

| 短链 | 内部 ID | 是谁 |
|---|---|---|
| `?v=ue` | `ue5-tech` | 游戏 / UE5 + 视觉生成式 AI |
| `?v=fl` | `art-vr` | 自由职业媒体艺术 |
| `?v=ds` | `designer` | 设计 |
| `?v=mn` | `odd`（跳到 `odd/`） | 兼职 Mini-Job |
| `?v=cd` | `china-biz` | 外贸 / 中德商务 |

**已经发出去的旧链（`?v=ue5-tech`）与 PDF 二维码里的长地址永久有效**：
`index.html` 头部脚本认出长 ID 后照常渲染，只用 `history.replaceState` 把地址栏静默换成短链
—— 不跳转、不重载，因此**不会多记一次访问**。
统计打点、`body.v-*` 排版类名、数据文件名一律仍用长 ID → 换短链不断历史计数、
不用重调按变体标定的 PDF 版式。

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
  · 「更多作品」在**网页上**超过 6 条会默认折叠（下方有展开/收起按钮）；**PDF 里永远全量展开、按钮不出现**。
- **▭ Card** — 弹出名片卡片窗口：分享（iOS/Mac 系统分享 / 其他端复制链接）＋ 下载 PNG（canvas 离线绘制）。
- **⧉ Copy** — 复制「姓名 ＋ 当前可见联系方式 ＋ HR 评分模板」（随当前语言）。

> 打印 / PDF 的真实效果需在本地浏览器的打印对话框里看（预览环境看不到）。

---

## 作品链接页 `works.html`

纸上点不了超链接。所以 PDF 的作品集里放**一个共用二维码**，扫进去就是 `works.html` ——
把该变体每件作品的链接排成手机上点得中的大块链接（单列、可点区域 ≥ 44px）。

- 数据来源就是 `data/base.js` ＋ 变体，**没有第二份链接清单**；条目没有 `link` / `video` 的不列出。
  变体 `sections.hide` 藏掉的板块，这一页也不会列。
- 地址运行时从当前页推出来（`location` 的所在目录），本地 5180 与线上 `/Shipeng_CV/` 子路径都对，
  **没有写死域名**。二维码带 `?v=` 与 `?lang=` —— PDF 是「某种语言的一张纸」，
  扫码的人应当落在同一种语言上；页面上仍可切语言。
- 想让某个变体的 PDF 用这个二维码：在该变体加一行 `worksPage: true`。目前只有 `ue5-tech` 开着。
- 直接打开 `works.html`（不带 `?v=`）默认按 `ue5-tech` 显示；同样 noindex。
  `<title>` 是中性占位「·」，真实标题由 JS 写入 —— JS 不执行时不吐姓名。
- 带了 `?v=` 却不在 `meta.variants` 里 → 控制台 `console.warn` 一条并回落缺省变体（不会静默）。
- 外链是 `rel="noopener noreferrer"` ＋ 整页 `meta referrer=no-referrer`：
  这一页的 URL 本身带 `?v=`（专属链接），不该随点击进第三方日志。
- `file://` 直接双击打开时，PDF 里那个二维码会自动退回 Vimeo 主页 —— 本机磁盘路径既扫不出
  东西，也不该被印在发给雇主的纸上。要真正用上这一页，请用 `node tools/serve.js` 或线上地址。

---

## 语言

首次按浏览器语言自动选，之后记住你的选择。切换器在工具栏左上：中文 / 日本語 / EN / DE。
也可用 `?lang=de` 直接指定。

---


## 改动之后怎么证明「显示没变」

排版是这个仓库唯一的产品，而它没有构建、没有测试 —— 改一个类名或动一条打印规则，
可能悄悄挪掉某份 PDF 的分页点，肉眼要逐份翻才看得出来。`tools/snapshot.py` 把这件事
变成一条命令：

```bash
node tools/serve.js            # 另开一个终端
python tools/snapshot.py baseline   # 改之前，存基线
# …改代码…
python tools/snapshot.py check      # 改之后，核对
```

抓两层，5 变体 × 4 语共 20 组：

- **DOM** —— Chrome 渲染完之后 dump `#cv-root` 的 outerHTML，归一化后取哈希。
  类名、元素顺序、属性，任何一处不同都会被抓到。经验年限那类随时间自己变的内容会被
  替换成占位符，不然放一个月再跑就全是假差异。
- **PDF** —— headless 导出 A4，比较页数与每页每个文本块的坐标。
  **不比字节**：PDF 里带生成时间与随机 ID，同样的输入两次导出字节流并不相同；
  坐标指纹实测两次跑完全一致。

常用参数：`--only ue,cd` 只跑某几个变体；`--dom-only` 跳过 PDF（快 10 倍，
改 JS/HTML 时够用）。全量 DOM 约 40 秒，DOM+PDF 约 3–4 分钟。

需要 Chrome 与 Python（PDF 那层要 `pymupdf`，没装就自动只跑 DOM 并告诉你）。
这些只是开发期工具，站点本身仍然零依赖。

## 部署（已上线）

- 站点：`https://gaojikuaileren.github.io/Shipeng_CV/`
- 仓库：`github.com/Gaojikuaileren/Shipeng_CV`（main 分支根目录，GitHub Pages）
- **私人控制台**：`/hub.html` —— 指令式（未被任何公开页链接，只给你自己用）
  · `/s01` 游戏开发（`?v=ue`）　`/s02` 媒体艺术（`?v=fl`）　`/s03` 设计师（`?v=ds`）
    `/s04` 兼职（`odd/`）　`/s05` 中德商务（`?v=cd`）
  · `/sdata` 看分职业访问统计（访问 / PDF / **扫码**＝纸质二维码进作品页的次数 / 本周）
  · `/clean01`–`/clean05` 按变体清零；**`/cleanall` 清空全部访问记录**（含时间戳，
    不可撤销 → 会弹一次确认；单个变体不弹）

**改完内容重新部署**：`git add -A && git commit -m "..." && git push`，1–2 分钟自动重建。

`robots.txt` + `noindex` 已禁止搜索引擎收录 —— 简历靠你主动发链接传播。

---

## 目录结构

```
Shipeng_CV/
├── index.html            主简历入口
├── works.html            作品链接页（PDF 作品集里那个二维码扫进来的落地页；移动优先）
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
│   ├── print.css         A4 简历 + 名片 + 打印专项
│   └── works.css         works.html 专用（只被它引用，不影响简历本体）
├── scripts/
│   ├── variants.js       变体注册表：短链 ↔ 内部 ID（全站唯一一份）
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
└── tools/
    ├── serve.js          本地预览服务器
    └── snapshot.py       输出回归护栏（改动前后比 DOM 与 PDF，见上文）
```
