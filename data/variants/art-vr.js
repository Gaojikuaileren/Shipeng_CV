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
  sidebar: ["cap-ue5", "cap-vr", "cap-isys", "cap-shader", "cap-3d", "cap-coding"],
  highlightTools: [
    "t-ue5", "t-bp", "t-metaxr", "t-osc", "t-arduino", "t-esp32",
    "t-shader", "t-niagara", "t-light",
    "t-blender", "t-zbrush", "t-md", "t-rokoko",
  ],
  emphasizeItems: ["prj-room", "prj-grau"],
  // 本变体是艺术作品集身份 → 挡掉两个个人产品项目（moreWorks 整块已 hide，不必逐条挡；
  // 工具集整块也已 hide，所以 AI 组不必写 hideTools）
  hideItems: ["email-pro", "prj-versewiki", "prj-vp"],
  order: {},
  photo: "assets/photo/usagi.jpg", // 自由职业用艺术化兔子图，非本人证件照
};
