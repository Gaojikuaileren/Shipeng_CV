/* art-vr.js — ② 媒体艺术自由职业者（寻找客户和合作，名片身份）
   此变体使用 freeketchup@icloud.com（接单邮箱），隐藏职业求职邮箱。 */
window.RESUME_VARIANT = {
  id: "art-vr",
  headline: {
    zh: "自由职业媒体艺术开发者 · 沉浸式装置 / VR / 实时交互",
    ja: "フリーランス・メディアアーツ・デベロッパー · 没入型インスタレーション / VR / リアルタイムインタラクション",
    en: "Freelance Media Arts Developer · Immersive Installation / VR / Real-time Interaction",
    de: "Freiberuflicher Medienkunst-Entwickler · Immersive Installation / VR / Echtzeit-Interaktion",
  },
  intro: {
    zh: "KHM 媒体艺术 Diplom，自由职业媒体艺术开发者。把空间、身体与实时影像编织成沉浸式现场体验。以虚幻引擎为主工具，涵盖 VR/MR、互动装置与传感器系统。开放新的委托、驻留与合作项目。",
    ja: "KHM メディアアーツ Diplom、フリーランス・メディアアーツ・デベロッパー。空間・身体・リアルタイム映像を没入型ライブ体験へと織り上げる。UE5 を主軸に VR/MR、インタラクティブインスタレーション、センサーシステムに対応。新たな委託・レジデンス・コラボを歓迎。",
    en: "KHM Media Arts Diploma, freelance media arts developer. I weave space, body and real-time imagery into immersive live experiences. Primary tool: Unreal Engine — spanning VR/MR, interactive installation and sensor systems. Open to commissions, residencies and collaborations.",
    de: "KHM Diplom in Media Arts, freiberuflicher Medienkunst-Entwickler. Ich verwebe Raum, Körper und Echtzeit-Bilder zu immersiven Live-Erlebnissen. Hauptwerkzeug: Unreal Engine — für VR/MR, interaktive Installation und Sensorsysteme. Offen für Aufträge, Residenzen und Kollaborationen.",
  },
  greeting: null, // 发给特定客户时可以改这里，加定制问候
  sections: {
    order: ["intro", "projects", "portfolio", "education"],
    hide: ["work", "toolset", "moreWorks"],
    emphasize: ["projects", "portfolio", "contact"],
  },
  /* 侧边栏与 01 号 UE 版同一套（含年限）：同一个人对外只该有一套能力口径，
     两份简历的侧栏写法不一样，客户与 HR 交叉看到时会觉得其中一份在注水。
     顺序仍按本变体的说服力排：先艺术现场用得上的，再是背书最长的。 */
  skillDisplay: "since",
  sidebar: [
    "cap-unreal",  // 虚幻 / 蓝图 / 着色器（原 cap-ue5 + cap-bp + cap-shader 合并条）
    "cap-vr",
    "cap-sensor",
    "cap-techart",
    "cap-genai",
    "cap-3d",
    "cap-artdes",
  ],
  highlightTools: [
    "t-ue5", "t-bp", "t-metaxr", "t-osc", "t-arduino", "t-esp32",
    "t-shader", "t-niagara", "t-light",
    "t-blender", "t-zbrush", "t-md", "t-rokoko",
  ],
  // 两条艺术装置仍是本变体的门面（排在前、标绿竖线）；虚拟制片与 Verse Wiki 跟着一起显示，
  // 但不抢重点 —— 前者是 KHM 的教学工作坊，后者是自己做的产品，都能证明「接得住委托」。
  emphasizeItems: ["prj-room", "prj-grau"],
  // 只挡求职邮箱：本变体用接单邮箱。项目与作品集与 01 号 UE 版保持一致，不再逐条挡。
  hideItems: ["email-pro"],
  order: {},
  /* 作品集里现在有了非视频链接（Verse Wiki 是网站）→ 一个指向 Vimeo 的共用 QR 覆盖不到它，
     跟 01 号一样改指 works.html，那一页按本变体的可见条目列出全部可点链接。 */
  worksPage: true,
  /* ⧉ 复制按钮：只给「姓名 + 个人链接」。本变体面对的是客户与策展人，
     粘一份 HR 评分模板过去很奇怪。 */
  copyLinksOnly: true,
  photo: "assets/photo/usagi.jpg", // 自由职业用艺术化兔子图，非本人证件照
};
