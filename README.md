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

- `data/base.js` — 核心内容（个人情报 / 教育 / 经历 / 作品 / 技能 / 语言 / 联系）
- 每个多语字段是 `{ zh, ja, en, de }`，只改引号里的值。
- 某语言暂时留空 `""` 会自动 fallback 到默认语言，不报错。
- 技术栈 / 专名（UE5、Blueprint、OSC…）一般不翻译。
- `visibility: "private"` 的字段默认隐藏；`protected: true` 的邮箱会防采集。

---

## 多职位定制（分发式简历）

想给不同职位 / 公司发不同侧重的简历：

1. 复制 `data/variants/default.js` → `data/variants/你起的名字.js`
2. 改里面：
   - `headline` 针对岗位的头衔
   - `intro` 针对岗位的自我介绍
   - `emphasize` 要高亮 / 置顶的条目 id（`exp-` / `sk-` / `pf-`）
   - `greeting` 给特定公司的一句话（会显示在顶部，很加分）
   - `hide` / `order` 隐藏或重排条目
3. 把链接 `你的域名/?v=你起的名字` 发给对应招聘方。

无参数 `/` = 默认通用版。变体写错 / 不存在时自动回退默认。

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

- **↓ PDF** — 打印对话框选「另存为 PDF」= A4 简历（文字矢量、可选中、ATS 友好）。导出前会自动展开联系方式。
- **▭ Card** — 名片打印（PDF，85×55mm）。PNG 分享版接口已留，待实现。
- **⧉ Copy** — 复制纯文本简历摘要（随当前语言）。

> 打印 / PDF 的真实效果需在本地浏览器的打印对话框里看（预览环境看不到）。

---

## 语言

首次按浏览器语言自动选，之后记住你的选择。切换器在工具栏左上：中文 / 日本語 / EN / DE。
也可用 `?lang=de` 直接指定。

---

## 部署 GitHub Pages

1. 把本目录推到 GitHub 仓库；
2. 仓库 Settings → Pages → Source 选 `main` 分支、根目录；
3. 访问 `https://用户名.github.io/仓库名/`。

`robots.txt` + `noindex` 已默认禁止搜索引擎收录 —— 简历靠你主动发链接传播。

---

## 目录结构

```
Shipeng_CV/
├── index.html            入口
├── robots.txt            禁止索引
├── data/
│   ├── base.js           核心内容（四语）
│   └── variants/         职位变体（default / ue5-tech / art-vr …）
├── styles/
│   ├── fonts.css         自托管 Hanken Grotesk @font-face
│   ├── tokens.css        设计变量（颜色/字体/间距）← 想换风格先改这里
│   ├── base.css          reset + 工具栏/按钮/toast + 名片弹窗
│   ├── screen.css        屏幕布局（移动优先响应式）
│   └── print.css         A4 简历 + 名片打印
├── scripts/
│   ├── i18n.js           四语
│   ├── identity.js       变体 / 本人模式解析
│   ├── data-loader.js    base + variant 合并
│   ├── render.js         渲染各板块
│   ├── main.js           入口串联
│   ├── interactions/     交互层（预留，可按端开关）
│   └── export/           pdf / card / text 导出
├── assets/photo/         照片（现为占位 SVG）
└── tools/serve.js        本地预览服务器
```
