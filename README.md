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
   - `highlightTools` 工具集里高亮＋排前的软件（`t-` id）
   - `sections` 板块级控制 `{ order, hide, emphasize }`（板块名 projects/work/toolset/portfolio…）
   - `emphasizeItems` / `hideItems` 条目级（id 如 `prj-` / `work-` / `email-`）
3. 把链接 `你的域名/?v=你起的名字` 发给对应招聘方。

无参数 `/` = 默认通用版；变体不存在自动回退默认。
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
- **私人控制台**：`/hub.html` —— 四选一打开各职业版 ＋ 一键复制对外链接（未被任何公开页链接，只给你自己用）

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
│   └── variants/         职位变体（default / ue5-tech / art-vr / designer）
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
