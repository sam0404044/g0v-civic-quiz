const canvas = document.querySelector("#gameCanvas");
const ctx = canvas.getContext("2d");
const leftButton = document.querySelector("#leftButton");
const rightButton = document.querySelector("#rightButton");

const AXIS_LIMIT = 100;
const MAX_TURNS = 15;

const stats = {
  x: 0,
  y: 0,
  z: 0,
};

const axisMeta = {
  x: {
    label: "資訊流向",
    minus: "自主隱私",
    plus: "開放透明",
    colorMinus: "#5f6fb0",
    colorPlus: "#2f9c78",
  },
  y: {
    label: "互動模式",
    minus: "韌性連結",
    plus: "思辨監督",
    colorMinus: "#d08b2c",
    colorPlus: "#be4f65",
  },
  z: {
    label: "行動場域",
    minus: "民間草根",
    plus: "政府體制",
    colorMinus: "#6f8f3e",
    colorPlus: "#387fa8",
  },
};

const cards = [
  {
    speaker: "第 1 題",
    title: "你覺得政府做公共決策時，應該優先公開透明，還是保障個人隱私？",
    body: "資訊越公開，越容易監督；資料越節制，越能避免傷害。",
    art: "shield",
    left: {
      label: "保障隱私",
      hint: "先守住個人邊界",
      effects: { x: -20, y: 0, z: 0 },
    },
    right: {
      label: "公開透明",
      hint: "讓決策攤在陽光下",
      effects: { x: 20, y: 0, z: 0 },
    },
  },
  {
    speaker: "第 2 題",
    title: "遇到有爭議的政策，你比較想先檢查問題，還是先促成對話？",
    body: "一邊是追問責任，一邊是把不同的人帶回同一張桌子。",
    art: "bridge",
    left: {
      label: "促成對話",
      hint: "先把關係接起來",
      effects: { x: 0, y: -20, z: 0 },
    },
    right: {
      label: "檢查問題",
      hint: "先把漏洞找出來",
      effects: { x: 0, y: 20, z: 0 },
    },
  },
  {
    speaker: "第 3 題",
    title: "你相信改變更應該從體制內推動，還是從民間草根開始？",
    body: "一邊是制度資源，一邊是生活現場。",
    art: "scale",
    left: {
      label: "民間草根",
      hint: "先從身邊開始",
      effects: { x: 0, y: 0, z: -20 },
    },
    right: {
      label: "體制內推動",
      hint: "進入規則裡改變",
      effects: { x: 0, y: 0, z: 20 },
    },
  },
  {
    speaker: "第 4 題",
    title: "社區想建立互助名冊，你會鼓勵公開共享，還是限制只有可信任的人可看？",
    body: "共享能加速互助，但名單也可能帶來風險。",
    art: "basket",
    left: {
      label: "限制可見",
      hint: "信任比速度重要",
      effects: { x: -20, y: 0, z: 0 },
    },
    right: {
      label: "公開共享",
      hint: "讓資源更快流動",
      effects: { x: 20, y: 0, z: 0 },
    },
  },
  {
    speaker: "第 5 題",
    title: "看到不合理的制度，你會先寫出批判文章，還是先找承辦人一起修？",
    body: "一邊把問題說清楚，一邊直接伸手補洞。",
    art: "thread",
    left: {
      label: "一起修補",
      hint: "先讓事情動起來",
      effects: { x: 0, y: -20, z: 0 },
    },
    right: {
      label: "公開批判",
      hint: "先把問題講清楚",
      effects: { x: 0, y: 20, z: 0 },
    },
  },
  {
    speaker: "第 6 題",
    title: "推動一個新議題時，你比較想進入正式程序，還是先在民間累積力量？",
    body: "一邊把議題送進制度，一邊讓生活現場先長出支持。",
    art: "megaphone",
    left: {
      label: "民間累積",
      hint: "先讓草根力量長出來",
      effects: { x: 0, y: 0, z: -20 },
    },
    right: {
      label: "正式程序",
      hint: "讓議題進入制度流程",
      effects: { x: 0, y: 0, z: 20 },
    },
  },
  {
    speaker: "第 7 題",
    title: "政府開放資料時，你最在意資料完整，還是去識別與安全？",
    body: "資料越完整越能分析，但保護不足也會傷到人。",
    art: "shield",
    left: {
      label: "去識別安全",
      hint: "先避免二次傷害",
      effects: { x: -20, y: 0, z: 0 },
    },
    right: {
      label: "資料完整",
      hint: "讓公共檢驗更有力",
      effects: { x: 20, y: 0, z: 0 },
    },
  },
  {
    speaker: "第 8 題",
    title: "在一場公共討論裡，你比較常扮演提問者，還是串場者？",
    body: "有人負責追問盲點，也有人負責讓大家願意繼續談。",
    art: "watch",
    left: {
      label: "串場者",
      hint: "照顧現場的連結",
      effects: { x: 0, y: -20, z: 0 },
    },
    right: {
      label: "提問者",
      hint: "把盲點問出來",
      effects: { x: 0, y: 20, z: 0 },
    },
  },
  {
    speaker: "第 9 題",
    title: "如果資源有限，你會優先投入制度倡議，還是鄰里互助？",
    body: "一邊改變規則，一邊先照顧眼前的人。",
    art: "camp",
    left: {
      label: "鄰里互助",
      hint: "先把人接住",
      effects: { x: 0, y: 0, z: -20 },
    },
    right: {
      label: "制度倡議",
      hint: "讓規則變得更好",
      effects: { x: 0, y: 0, z: 20 },
    },
  },
  {
    speaker: "第 10 題",
    title: "你覺得一個好的社會運動，應該更強調曝光，還是保護參與者？",
    body: "曝光能帶來壓力，保護能讓更多人安全參與。",
    art: "megaphone",
    left: {
      label: "保護參與者",
      hint: "安全感是動員基礎",
      effects: { x: -20, y: 0, z: 0 },
    },
    right: {
      label: "提高曝光",
      hint: "讓議題被看見",
      effects: { x: 20, y: 0, z: 0 },
    },
  },
  {
    speaker: "第 11 題",
    title: "面對錯誤資訊，你會優先闢謠拆解，還是建立可信任社群？",
    body: "一邊處理內容，一邊處理人與人之間的信任。",
    art: "watch",
    left: {
      label: "可信任社群",
      hint: "讓人願意慢下來確認",
      effects: { x: 0, y: -20, z: 0 },
    },
    right: {
      label: "闢謠拆解",
      hint: "把錯誤說法拆開",
      effects: { x: 0, y: 20, z: 0 },
    },
  },
  {
    speaker: "第 12 題",
    title: "你比較認同把公共服務數位化，還是保留人工與非正式支援？",
    body: "數位化能提升效率，但人工支援更能接住例外。",
    art: "thread",
    left: {
      label: "人工支援",
      hint: "保留人情和彈性",
      effects: { x: 0, y: 0, z: -20 },
    },
    right: {
      label: "數位化",
      hint: "讓制度更有效率",
      effects: { x: 0, y: 0, z: 20 },
    },
  },
  {
    speaker: "第 13 題",
    title: "一份重要資料只能用一種方式處理，你會放上公開平台，還是交給小組保管？",
    body: "公開平台利於參與，小組保管利於風險控制。",
    art: "scale",
    left: {
      label: "小組保管",
      hint: "降低濫用風險",
      effects: { x: -20, y: 0, z: 0 },
    },
    right: {
      label: "公開平台",
      hint: "讓更多人能檢視",
      effects: { x: 20, y: 0, z: 0 },
    },
  },
  {
    speaker: "第 14 題",
    title: "你比較想參加公聽會發言，還是辦一場社區小聚？",
    body: "一邊進入正式程序，一邊創造日常連結。",
    art: "bridge",
    left: {
      label: "社區小聚",
      hint: "先把附近的人聚起來",
      effects: { x: 0, y: 0, z: -20 },
    },
    right: {
      label: "公聽會發言",
      hint: "進入正式決策流程",
      effects: { x: 0, y: 0, z: 20 },
    },
  },
  {
    speaker: "第 15 題",
    title: "最後一題：你希望自己的公共參與像一盞聚光燈，還是一張安全網？",
    body: "聚光燈讓問題被看見，安全網讓人不會掉下去。",
    art: "basket",
    left: {
      label: "安全網",
      hint: "默默接住需要的人",
      effects: { x: 0, y: -20, z: 0 },
    },
    right: {
      label: "聚光燈",
      hint: "讓問題站上公共舞台",
      effects: { x: 0, y: 20, z: 0 },
    },
  },
];

const endings = {
  "+++": {
    role: "政策除塵師",
    rope: "筆直、堅硬的金色尺繩",
    ropeIcon: "ruler",
    summary: "你相信制度能改進，但需要被盯著。你擅長研讀規則、追問預算，讓公共資源站在陽光下。",
    traits: ["開放透明：你願意讓資料被更多人看見。", "思辨監督：你會追問權力如何被使用。", "政府體制：你傾向進入制度內推動改變。"],
    mission: "年會任務：找找看【社群點火員】，他們能把你的專業資料帶進生活現場。",
  },
  "-++": {
    role: "數位人權盾",
    rope: "黑色與銀色交織的鎖鏈",
    ropeIcon: "chain",
    summary: "你重視效率，也更在意權利邊界。當科技和治理靠近個人生活，你會先確認防線在哪裡。",
    traits: ["自主隱私：你會守住個資和個人空間。", "思辨監督：你對權力保持清醒質疑。", "政府體制：你願意用制度語言爭取保障。"],
    mission: "年會任務：找找看【公私協力員】，他們能幫你把防線翻成可執行的政策流程。",
  },
  "+-+": {
    role: "公私協力員",
    rope: "柔軟且帶吸附力的魔鬼氈繩",
    ropeIcon: "velcro",
    summary: "你是不同世界之間的譯者。你相信合作大於對抗，會把政策變成大家聽得懂、接得住的內容。",
    traits: ["開放透明：你願意共享資訊和工具。", "韌性連結：你擅長把人黏在一起。", "政府體制：你能在制度內找到合作入口。"],
    mission: "年會任務：找找看【邊緣守望犬】，他們能提醒你合作時別忽略權力差距。",
  },
  "--+": {
    role: "體制修補手",
    rope: "細緻而堅韌的絲線",
    ropeIcon: "silk",
    summary: "你不一定站在聚光燈下，但你會在科層縫隙裡補上保護網，照顧那些規則沒有看見的人。",
    traits: ["自主隱私：你重視人的尊嚴和安全感。", "韌性連結：你會先把人接住。", "政府體制：你熟悉制度，也知道它哪裡需要修補。"],
    mission: "年會任務：找找看【議題擴音器】，他們能讓你看見的漏洞被更多人聽見。",
  },
  "++-": {
    role: "議題擴音器",
    rope: "鮮紅色的警示帶",
    ropeIcon: "warning",
    summary: "你擅長讓被忽略的問題出圈。當不公義被壓低音量，你會把它變成公共討論。",
    traits: ["開放透明：你相信資訊公開能創造壓力。", "思辨監督：你會指出問題和責任。", "民間草根：你習慣從街頭、網路和社群發動。"],
    mission: "年會任務：找找看【體制修補手】，他們知道議題進入制度後會卡在哪裡。",
  },
  "-+-": {
    role: "邊緣守望犬",
    rope: "帶刺的刺網繩",
    ropeIcon: "barbed",
    summary: "你對任何形式的權力都保持警覺。即使主流民意很大聲，你仍會守住少數者的位置。",
    traits: ["自主隱私：你在意邊界和安全。", "思辨監督：你不輕易被集體情緒帶走。", "民間草根：你相信體制外也有重要真相。"],
    mission: "年會任務：找找看【公私協力員】，他們可以幫你把尖銳提醒帶進協作桌上。",
  },
  "+--": {
    role: "社群點火員",
    rope: "彩色、多股編織的露營繩",
    ropeIcon: "camp",
    summary: "你相信改變要從生活周遭做起。比起只指出錯誤，你更喜歡動手把人聚在一起。",
    traits: ["開放透明：你願意分享資源，讓大家都能參與。", "韌性連結：你擅長創造互助的溫度。", "民間草根：你把改變放在日常現場。"],
    mission: "年會任務：找找看【政策除塵師】，他們有你需要的專業資料，而你有他們缺少的民間能量。",
  },
  "---": {
    role: "地火互助靈",
    rope: "溫暖、耐操、充滿泥土氣息的麻繩",
    ropeIcon: "hemp",
    summary: "你相信真正能撐過危機的是彼此。你不急著曝光，而是建立可靠的互助網，在需要時快速接應。",
    traits: ["自主隱私：你重視信任和安全邊界。", "韌性連結：你先照顧人，再討論制度。", "民間草根：你相信底層互助能長出力量。"],
    mission: "年會任務：找找看【數位人權盾】，他們能幫你的互助網避開資料風險。",
  },
};

const artSvgs = {
  scale: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="28" fill="#e4f2ea"/><path d="M80 32v94M50 52h60M58 52l-22 40h44L58 52Zm44 0L80 92h44l-22-40Z" fill="none" stroke="#2f9c78" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><path d="M58 126h44" stroke="#18202b" stroke-width="10" stroke-linecap="round"/></svg>`),
  shield: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="28" fill="#e7eafd"/><path d="M80 27 122 43v34c0 28-18 50-42 62-24-12-42-34-42-62V43l42-16Z" fill="#5f6fb0"/><path d="M64 80h32M80 64v32" stroke="#fff" stroke-width="10" stroke-linecap="round"/></svg>`),
  bridge: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="28" fill="#e8f4f0"/><path d="M28 105c18-38 86-38 104 0" fill="none" stroke="#2f9c78" stroke-width="11" stroke-linecap="round"/><path d="M44 105V76M68 105V62M92 105V62M116 105V76" stroke="#387fa8" stroke-width="8" stroke-linecap="round"/><path d="M30 113h100" stroke="#18202b" stroke-width="9" stroke-linecap="round"/></svg>`),
  thread: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="28" fill="#f7efe7"/><path d="M45 45c35-24 72 2 58 30-13 26-64 8-69 34-5 24 42 28 82 5" fill="none" stroke="#d08b2c" stroke-width="10" stroke-linecap="round"/><circle cx="113" cy="112" r="10" fill="#be4f65"/></svg>`),
  megaphone: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="28" fill="#fde8ec"/><path d="M42 89h22l52 25V45L64 70H42v19Z" fill="#be4f65"/><path d="m64 91 12 30" stroke="#18202b" stroke-width="9" stroke-linecap="round"/><path d="M124 62c7 8 7 28 0 36" fill="none" stroke="#be4f65" stroke-width="8" stroke-linecap="round"/></svg>`),
  watch: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="28" fill="#eef0f3"/><path d="M31 83s19-34 49-34 49 34 49 34-19 34-49 34-49-34-49-34Z" fill="#fff" stroke="#18202b" stroke-width="9" stroke-linejoin="round"/><circle cx="80" cy="83" r="19" fill="#5f6fb0"/><circle cx="86" cy="76" r="6" fill="#fff"/></svg>`),
  camp: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="28" fill="#edf5df"/><path d="M80 34 36 122h88L80 34Z" fill="#6f8f3e"/><path d="M80 34v88M54 122 80 70l26 52" fill="none" stroke="#fff7d8" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M38 126h84" stroke="#18202b" stroke-width="9" stroke-linecap="round"/></svg>`),
  basket: encodeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><rect width="160" height="160" rx="28" fill="#f4eadc"/><path d="M45 70h70l-9 52H54L45 70Z" fill="#c7904c"/><path d="M61 70c0-23 38-23 38 0" fill="none" stroke="#6f4d24" stroke-width="9" stroke-linecap="round"/><path d="M59 88h42M56 106h48" stroke="#fff1d7" stroke-width="7" stroke-linecap="round"/></svg>`),
};

const artImages = Object.fromEntries(
  Object.entries(artSvgs).map(([key, src]) => {
    const image = new Image();
    image.src = src;
    return [key, image];
  }),
);

const state = {
  width: 0,
  height: 0,
  dpr: 1,
  index: 0,
  deck: [...cards],
  drag: { active: false, startX: 0, startY: 0, x: 0, y: 0 },
  cardX: 0,
  cardY: 0,
  rotation: 0,
  exiting: null,
  flash: null,
  result: null,
};

function encodeSvg(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function shuffle(list) {
  return list
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function isDesktopLayout() {
  return state.width >= 900 && state.height >= 600;
}

function getCurrentCard() {
  if (state.index >= state.deck.length) {
    state.deck = [...cards];
    state.index = 0;
  }
  return state.deck[state.index];
}

function getCardMetrics() {
  if (isDesktopLayout()) {
    const cardWidth = Math.min(430, Math.max(360, state.width * 0.34));
    const cardHeight = Math.min(620, Math.max(520, state.height - 210));
    return {
      width: cardWidth,
      height: cardHeight,
      x: state.width * 0.5 + state.cardX,
      y: state.height * 0.54 + state.cardY,
      compact: false,
    };
  }

  const cardHeight = Math.min(Math.max(state.height - 220, 420), 520);
  return {
    width: Math.min(state.width - 34, 370),
    height: cardHeight,
    x: state.width / 2 + state.cardX,
    y: state.height * 0.5 + 32 + state.cardY,
    compact: cardHeight < 470,
  };
}

function getChoiceHitBoxes() {
  if (!isDesktopLayout()) return null;
  const panelWidth = Math.min(260, Math.max(210, state.width * 0.21));
  const panelHeight = Math.min(330, Math.max(220, state.height - 360));
  const top = clamp(state.height * 0.55 - panelHeight / 2, 304, state.height - panelHeight - 56);
  return {
    left: { x: 32, y: top, width: panelWidth, height: panelHeight },
    right: { x: state.width - panelWidth - 32, y: top, width: panelWidth, height: panelHeight },
  };
}

function getCardChoiceHitBoxes() {
  const metrics = getCardMetrics();
  const cardWidth = metrics.width;
  const cardHeight = metrics.height;
  const top = -cardHeight / 2;
  const left = -cardWidth / 2;
  const compact = metrics.compact;
  const choiceY = top + cardHeight - (compact ? 96 : 112);
  const pillMargin = 22;
  const pillGap = 14;
  const pillWidth = (cardWidth - pillMargin * 2 - pillGap) / 2;
  const pillHeight = compact ? 48 : 54;

  return {
    left: {
      x: metrics.x + left + pillMargin,
      y: metrics.y + choiceY,
      width: pillWidth,
      height: pillHeight,
    },
    right: {
      x: metrics.x + left + pillMargin + pillWidth + pillGap,
      y: metrics.y + choiceY,
      width: pillWidth,
      height: pillHeight,
    },
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function resize() {
  state.dpr = Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  canvas.width = Math.floor(state.width * state.dpr);
  canvas.height = Math.floor(state.height * state.dpr);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
}

function wrapText(text, maxWidth, font) {
  ctx.font = font;
  const words = Array.from(text);
  const lines = [];
  let line = "";

  for (const word of words) {
    const testLine = line + word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function roundedRect(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawText(text, x, y, maxWidth, lineHeight, font, color, align = "left", maxLines = 8) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "top";
  const lines = wrapText(text, maxWidth, font).slice(0, maxLines);
  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });
  return lines.length * lineHeight;
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, state.height);
  if (isDesktopLayout()) {
    gradient.addColorStop(0, "#eef6f8");
    gradient.addColorStop(0.55, "#f8f4e8");
    gradient.addColorStop(1, "#eef1f6");
  } else {
    gradient.addColorStop(0, "#f5f7fb");
    gradient.addColorStop(0.52, "#e8f4f0");
    gradient.addColorStop(1, "#f3f1e9");
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.strokeStyle = "rgba(24, 32, 43, 0.08)";
  ctx.lineWidth = 1;
  const step = 34;
  for (let y = 0; y < state.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(y * 0.03) * 4);
    ctx.lineTo(state.width, y + Math.cos(y * 0.02) * 4);
    ctx.stroke();
  }

  if (!isDesktopLayout()) return;

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  roundedRect(state.width * 0.5 - 300, 24, 600, 68, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(24, 32, 43, 0.1)";
  ctx.stroke();

  ctx.fillStyle = "#18202b";
  ctx.font = "900 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("公民座標卡牌", state.width * 0.5, 36);
  ctx.font = "700 13px sans-serif";
  ctx.fillStyle = "rgba(24, 32, 43, 0.62)";
  ctx.fillText("拖曳卡牌、點選面板，或按鍵盤方向鍵", state.width * 0.5, 64);
}

function drawAxes() {
  if (isDesktopLayout()) {
    drawDesktopAxes();
    return;
  }

  const top = 14 + safeTop();
  const padding = 14;
  const panelWidth = state.width - padding * 2;
  const rowHeight = 21;
  const keys = ["x", "y", "z"];

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  roundedRect(padding, top, panelWidth, 98, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(24, 32, 43, 0.12)";
  ctx.stroke();

  keys.forEach((key, index) => {
    const meta = axisMeta[key];
    const y = top + 12 + index * rowHeight;
    drawAxisIcon(key, padding + 18, y + 6);
    drawAxisBar(padding + 40, y, panelWidth - 56, meta, stats[key], false, true);
  });

  drawProgressDots(state.width / 2, top + 84, Math.min(panelWidth - 44, 180), state.index, MAX_TURNS);
}

function drawDesktopAxes() {
  const panelWidth = Math.min(330, Math.max(280, state.width * 0.24));
  const x = 32;
  const y = 24;
  const keys = ["x", "y", "z"];

  ctx.fillStyle = "rgba(255, 255, 255, 0.72)";
  roundedRect(x, y, panelWidth, 258, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(24, 32, 43, 0.12)";
  ctx.stroke();

  ctx.fillStyle = "#18202b";
  ctx.font = "900 17px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("目前座標", x + 18, y + 16);

  keys.forEach((key, index) => {
    const meta = axisMeta[key];
    drawAxisBar(x + 22, y + 56 + index * 56, panelWidth - 44, meta, stats[key], true);
  });

  drawProgressDots(x + panelWidth / 2, y + 232, panelWidth - 78, state.index, MAX_TURNS);
}

function drawAxisBar(x, y, width, meta, value, showPoles, iconOnly = false) {
  const center = x + width / 2;
  const barY = iconOnly ? y + 6 : y + 18;
  const normalized = clamp(value / AXIS_LIMIT, -1, 1);
  const fillWidth = Math.abs(normalized) * (width / 2);
  const fillX = normalized >= 0 ? center : center - fillWidth;
  const color = normalized >= 0 ? meta.colorPlus : meta.colorMinus;

  if (!iconOnly) {
    ctx.fillStyle = "#18202b";
    ctx.font = "900 13px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(meta.label, x, y);
  }

  ctx.fillStyle = "#edf0f1";
  roundedRect(x, barY, width, 10, 5);
  ctx.fill();

  ctx.fillStyle = color;
  roundedRect(fillX, barY, fillWidth, 10, 5);
  ctx.fill();

  ctx.fillStyle = "rgba(24, 32, 43, 0.42)";
  ctx.fillRect(center - 1, barY - 2, 2, 14);

  if (!iconOnly) {
    ctx.fillStyle = "#18202b";
    ctx.font = "900 13px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(value > 0 ? `+${value}` : `${value}`, x + width, y);
  }

  if (!showPoles) return;

  ctx.font = "700 11px sans-serif";
  ctx.fillStyle = "rgba(24, 32, 43, 0.58)";
  ctx.textAlign = "left";
  ctx.fillText(meta.minus, x, barY + 14);
  ctx.textAlign = "right";
  ctx.fillText(meta.plus, x + width, barY + 14);
}

function drawAxisIcon(key, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (key === "x") {
    ctx.strokeStyle = axisMeta.x.colorPlus;
    roundedRect(-7, -6, 14, 12, 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-5, -3);
    ctx.lineTo(0, 1);
    ctx.lineTo(5, -3);
    ctx.stroke();
  }

  if (key === "y") {
    ctx.strokeStyle = axisMeta.y.colorPlus;
    ctx.beginPath();
    ctx.arc(-4, -1, 4, 0, Math.PI * 2);
    ctx.arc(5, -1, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-1, 5);
    ctx.lineTo(2, 5);
    ctx.stroke();
  }

  if (key === "z") {
    ctx.strokeStyle = axisMeta.z.colorPlus;
    ctx.beginPath();
    ctx.moveTo(-7, 5);
    ctx.lineTo(-7, -5);
    ctx.lineTo(0, -9);
    ctx.lineTo(7, -5);
    ctx.lineTo(7, 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-10, 5);
    ctx.lineTo(10, 5);
    ctx.stroke();
  }

  ctx.restore();
}

function drawProgressDots(centerX, y, width, current, total) {
  const gap = width / (total - 1);
  const startX = centerX - width / 2;
  for (let index = 0; index < total; index += 1) {
    ctx.beginPath();
    ctx.fillStyle = index < current ? "#2f9c78" : "rgba(24, 32, 43, 0.16)";
    ctx.arc(startX + index * gap, y, index < current ? 3.2 : 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawChoiceLabels(card) {
  if (isDesktopLayout()) {
    drawDesktopChoicePanels(card);
    return;
  }

  const threshold = Math.min(116, state.width * 0.28);
  const strength = clamp(Math.abs(state.cardX) / threshold, 0, 1);
  const direction = state.cardX >= 0 ? "right" : "left";
  const choice = card[direction];

  if (strength < 0.08) return;

  ctx.save();
  ctx.globalAlpha = strength;
  ctx.fillStyle = direction === "right" ? "#2f9c78" : "#be4f65";
  ctx.textAlign = direction === "right" ? "right" : "left";
  ctx.textBaseline = "middle";
  ctx.font = "900 22px sans-serif";
  const x = direction === "right" ? state.width - 24 : 24;
  ctx.fillText(choice.label, x, state.height * 0.5 - 44);

  ctx.font = "700 13px sans-serif";
  ctx.fillStyle = "rgba(24, 32, 43, 0.7)";
  ctx.fillText(choice.hint, x, state.height * 0.5 - 14);
  ctx.restore();
}

function drawDesktopChoicePanels(card) {
  const boxes = getChoiceHitBoxes();
  if (!boxes) return;
  const threshold = Math.min(150, state.width * 0.18);
  const strength = clamp(Math.abs(state.cardX) / threshold, 0, 1);
  const activeDirection = state.cardX >= 0 ? "right" : "left";

  drawDesktopChoicePanel(boxes.left, card.left, "left", activeDirection === "left" ? strength : 0);
  drawDesktopChoicePanel(boxes.right, card.right, "right", activeDirection === "right" ? strength : 0);
}

function drawDesktopChoicePanel(box, choice, direction, active) {
  const color = direction === "right" ? "#2f9c78" : "#be4f65";
  const compact = box.height < 280;
  ctx.save();
  ctx.fillStyle = `rgba(255, 255, 255, ${0.62 + active * 0.28})`;
  roundedRect(box.x, box.y, box.width, box.height, 8);
  ctx.fill();
  ctx.lineWidth = 1 + active * 3;
  ctx.strokeStyle = active > 0.08 ? color : "rgba(24, 32, 43, 0.12)";
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.font = "900 34px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText(direction === "right" ? "→" : "←", box.x + box.width / 2, box.y + (compact ? 22 : 34));

  drawText(choice.label, box.x + box.width / 2, box.y + (compact ? 76 : 104), box.width - 42, compact ? 27 : 31, compact ? "900 20px sans-serif" : "900 23px sans-serif", "#18202b", "center", 2);
  drawText(choice.hint, box.x + box.width / 2, box.y + (compact ? 126 : 180), box.width - 44, 22, "700 15px sans-serif", "#4d5965", "center", compact ? 1 : 3);

  const keys = ["x", "y", "z"];
  keys.forEach((key, index) => {
    const effect = choice.effects[key] || 0;
    const rowY = box.y + box.height - 86 + index * 24;
    ctx.fillStyle = axisMeta[key].colorPlus;
    ctx.font = "800 13px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(axisMeta[key].label, box.x + 28, rowY);
    ctx.fillStyle = effect >= 0 ? "#2f9c78" : "#be4f65";
    ctx.font = "900 15px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${effect >= 0 ? "+" : ""}${effect}`, box.x + box.width - 28, rowY - 1);
  });
  ctx.restore();
}

function drawCard(card) {
  const metrics = getCardMetrics();
  const cardWidth = metrics.width;
  const cardHeight = metrics.height;
  const x = metrics.x;
  const y = metrics.y;
  const top = -cardHeight / 2;
  const left = -cardWidth / 2;
  const compact = metrics.compact;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(state.rotation);

  ctx.shadowColor = "rgba(24, 32, 43, 0.18)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 18;
  ctx.fillStyle = "#ffffff";
  roundedRect(left, top, cardWidth, cardHeight, 8);
  ctx.fill();
  ctx.shadowColor = "transparent";

  const cardGradient = ctx.createLinearGradient(0, top, 0, top + cardHeight);
  cardGradient.addColorStop(0, "#ffffff");
  cardGradient.addColorStop(1, "#f7faf7");
  ctx.fillStyle = cardGradient;
  roundedRect(left, top, cardWidth, cardHeight, 8);
  ctx.fill();

  ctx.strokeStyle = "rgba(24, 32, 43, 0.14)";
  ctx.lineWidth = 1;
  ctx.stroke();

  const image = artImages[card.art];
  const artSize = Math.min(compact ? 82 : 104, cardWidth * 0.28);
  if (image.complete) {
    ctx.drawImage(image, -artSize / 2, top + (compact ? 22 : 28), artSize, artSize);
  }

  ctx.fillStyle = "#18202b";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "800 14px sans-serif";
  ctx.fillText(card.speaker, 0, top + (compact ? 118 : 146));

  const textWidth = cardWidth - 56;
  const titleY = top + (compact ? 150 : 184);
  const titleHeight = drawText(
    card.title,
    0,
    titleY,
    textWidth,
    compact ? 27 : 31,
    compact ? "900 21px sans-serif" : "900 24px sans-serif",
    "#18202b",
    "center",
    compact ? 3 : 4,
  );
  const choiceY = top + cardHeight - (compact ? 96 : 112);
  const bodyTop = Math.min(titleY + titleHeight + 14, choiceY - 56);
  drawText(card.body, 0, bodyTop, textWidth, 22, "700 15px sans-serif", "#4d5965", "center", compact ? 2 : 3);

  const pillMargin = 22;
  const pillGap = 14;
  const pillWidth = (cardWidth - pillMargin * 2 - pillGap) / 2;
  const pillHeight = compact ? 48 : 54;
  drawChoicePill(left + pillMargin, choiceY, pillWidth, pillHeight, card.left.label, "←", "#be4f65");
  drawChoicePill(left + pillMargin + pillWidth + pillGap, choiceY, pillWidth, pillHeight, card.right.label, "→", "#2f9c78");

  ctx.restore();
}

function drawChoicePill(x, y, width, height, label, arrow, color) {
  ctx.fillStyle = "rgba(24, 32, 43, 0.05)";
  roundedRect(x, y, width, height, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(24, 32, 43, 0.1)";
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (arrow === "→") {
    ctx.fillStyle = "#18202b";
    ctx.font = "800 14px sans-serif";
    ctx.fillText(label, x + width / 2 - 8, y + height / 2);
    ctx.fillStyle = color;
    ctx.font = "900 18px sans-serif";
    ctx.fillText(arrow, x + width - 24, y + height / 2);
  } else {
    ctx.fillStyle = color;
    ctx.font = "900 18px sans-serif";
    ctx.fillText(arrow, x + 24, y + height / 2);
    ctx.fillStyle = "#18202b";
    ctx.font = "800 14px sans-serif";
    ctx.fillText(label, x + width / 2 + 8, y + height / 2);
  }
}

function drawEffectPreview(card) {
  if (isDesktopLayout()) return;

  const threshold = Math.min(116, state.width * 0.28);
  const strength = clamp(Math.abs(state.cardX) / threshold, 0, 1);
  if (strength < 0.18) return;

  const direction = state.cardX >= 0 ? "right" : "left";
  const effects = card[direction].effects;
  const y = state.height - 118 - safeBottom();
  const keys = ["x", "y", "z"];

  ctx.save();
  ctx.globalAlpha = strength;
  ctx.fillStyle = "rgba(255, 255, 255, 0.84)";
  roundedRect(18, y, state.width - 36, 52, 8);
  ctx.fill();

  keys.forEach((key, index) => {
    const value = effects[key] || 0;
    const x = 36 + index * ((state.width - 72) / 3);
    ctx.fillStyle = axisMeta[key].colorPlus;
    ctx.font = "900 12px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(axisMeta[key].label, x, y + 10);
    ctx.fillStyle = value >= 0 ? "#2f9c78" : "#be4f65";
    ctx.font = "900 17px sans-serif";
    ctx.fillText(`${value >= 0 ? "+" : ""}${value}`, x, y + 28);
  });
  ctx.restore();
}

function drawHint() {
  ctx.fillStyle = "rgba(24, 32, 43, 0.6)";
  ctx.font = "700 13px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const text = isDesktopLayout()
    ? "拖曳卡牌、按 ← →，或點左右面板做選擇"
    : "拖曳卡牌：左滑或右滑做選擇";
  ctx.fillText(text, state.width / 2, state.height - 34 - safeBottom());
}

function drawFlash() {
  if (!state.flash) return;
  const age = performance.now() - state.flash.startedAt;
  const alpha = clamp(1 - age / 900, 0, 1);
  if (alpha <= 0) {
    state.flash = null;
    return;
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = state.flash.direction === "right" ? "rgba(47, 156, 120, 0.16)" : "rgba(190, 79, 101, 0.16)";
  ctx.fillRect(0, 0, state.width, state.height);

  ctx.fillStyle = "#18202b";
  ctx.font = "900 18px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(state.flash.label, state.width / 2, 146 + safeTop());
  ctx.restore();
}

function drawRopeIconCard(type, centerX, top, size) {
  const x = centerX - size / 2;
  const y = top;
  ctx.save();
  ctx.fillStyle = "#f5f7f4";
  roundedRect(x, y, size, size * 0.62, 8);
  ctx.fill();
  ctx.strokeStyle = "rgba(24, 32, 43, 0.1)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.translate(centerX, y + size * 0.31);
  drawRopeIcon(type, size);
  ctx.restore();
}

function drawRopeIcon(type, size) {
  const w = size * 0.68;
  if (type === "ruler") drawRulerRope(w);
  if (type === "chain") drawChainRope(w);
  if (type === "velcro") drawVelcroRope(w);
  if (type === "silk") drawSilkRope(w);
  if (type === "warning") drawWarningRope(w);
  if (type === "barbed") drawBarbedRope(w);
  if (type === "camp") drawCampRope(w);
  if (type === "hemp") drawHempRope(w);
}

function drawRulerRope(width) {
  ctx.save();
  ctx.rotate(-0.08);
  ctx.strokeStyle = "#c99a22";
  ctx.lineWidth = 15;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-width / 2, 0);
  ctx.lineTo(width / 2, 0);
  ctx.stroke();
  ctx.strokeStyle = "#fff1ba";
  ctx.lineWidth = 3;
  for (let x = -width / 2 + 12; x < width / 2; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, -7);
    ctx.lineTo(x, x % 28 === 0 ? 7 : 3);
    ctx.stroke();
  }
  ctx.restore();
}

function drawChainRope(width) {
  ctx.save();
  ctx.lineWidth = 7;
  ctx.strokeStyle = "#30343a";
  for (let i = 0; i < 5; i += 1) {
    const x = -width / 2 + i * (width / 4);
    ctx.save();
    ctx.translate(x, 0);
    ctx.rotate(i % 2 === 0 ? 0.75 : -0.75);
    roundedRect(-16, -10, 32, 20, 8);
    ctx.stroke();
    ctx.restore();
  }
  ctx.strokeStyle = "#cfd4da";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-width / 2 + 10, -10);
  ctx.lineTo(width / 2 - 10, 10);
  ctx.stroke();
  ctx.restore();
}

function drawVelcroRope(width) {
  ctx.save();
  ctx.strokeStyle = "#2f9c78";
  ctx.lineWidth = 13;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-width / 2, 0);
  ctx.bezierCurveTo(-width * 0.2, -18, width * 0.2, 18, width / 2, 0);
  ctx.stroke();
  ctx.strokeStyle = "#86cbb5";
  ctx.lineWidth = 3;
  for (let x = -width / 2 + 12; x < width / 2; x += 15) {
    ctx.beginPath();
    ctx.moveTo(x, -8);
    ctx.lineTo(x + 6, -16);
    ctx.moveTo(x, 8);
    ctx.lineTo(x + 6, 16);
    ctx.stroke();
  }
  ctx.restore();
}

function drawSilkRope(width) {
  ctx.save();
  ctx.strokeStyle = "#d08b2c";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-width / 2, -8 + i * 4);
    ctx.bezierCurveTo(-width * 0.18, -24 + i * 5, width * 0.18, 24 - i * 5, width / 2, -8 + i * 4);
    ctx.stroke();
  }
  ctx.fillStyle = "#be4f65";
  ctx.beginPath();
  ctx.arc(width / 2 - 4, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawWarningRope(width) {
  ctx.save();
  ctx.rotate(-0.06);
  ctx.fillStyle = "#be4f65";
  roundedRect(-width / 2, -12, width, 24, 4);
  ctx.fill();
  ctx.fillStyle = "#fff1ba";
  for (let x = -width / 2 - 8; x < width / 2; x += 26) {
    ctx.save();
    ctx.translate(x, 0);
    ctx.rotate(-0.55);
    ctx.fillRect(-5, -18, 10, 36);
    ctx.restore();
  }
  ctx.restore();
}

function drawBarbedRope(width) {
  ctx.save();
  ctx.strokeStyle = "#4b5560";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-width / 2, -4);
  ctx.lineTo(width / 2, 4);
  ctx.moveTo(-width / 2, 5);
  ctx.lineTo(width / 2, -5);
  ctx.stroke();
  ctx.strokeStyle = "#be4f65";
  ctx.lineWidth = 3;
  for (let x = -width / 2 + 14; x < width / 2; x += 22) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x - 7, -12);
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 8, 12);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCampRope(width) {
  ctx.save();
  const colors = ["#2f9c78", "#d08b2c", "#5f6fb0"];
  colors.forEach((color, index) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-width / 2, -8 + index * 8);
    ctx.bezierCurveTo(-width * 0.18, 8 - index * 6, width * 0.18, -22 + index * 11, width / 2, -8 + index * 8);
    ctx.stroke();
  });
  ctx.strokeStyle = "#18202b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(-width * 0.28, 0, 13, 0.3, Math.PI * 1.7);
  ctx.stroke();
  ctx.restore();
}

function drawHempRope(width) {
  ctx.save();
  ctx.strokeStyle = "#9b6a35";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-width / 2, -8 + i * 8);
    ctx.bezierCurveTo(-width * 0.22, 12 - i * 8, width * 0.22, -12 + i * 8, width / 2, -8 + i * 8);
    ctx.stroke();
  }
  ctx.strokeStyle = "#d8b27a";
  ctx.lineWidth = 2;
  for (let x = -width / 2 + 8; x < width / 2; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, -13);
    ctx.lineTo(x + 8, 13);
    ctx.stroke();
  }
  ctx.restore();
}

function drawResult() {
  if (!state.result) return;
  const result = state.result;

  ctx.save();
  ctx.fillStyle = "rgba(24, 32, 43, 0.72)";
  ctx.fillRect(0, 0, state.width, state.height);

  const modalWidth = Math.min(state.width - 40, isDesktopLayout() ? 620 : 430);
  const modalHeight = Math.min(state.height - 44, isDesktopLayout() ? 560 : 620);
  const modalX = state.width * 0.5 - modalWidth / 2;
  const modalY = state.height * 0.5 - modalHeight / 2;

  ctx.fillStyle = "#ffffff";
  roundedRect(modalX, modalY, modalWidth, modalHeight, 8);
  ctx.fill();

  ctx.fillStyle = "#18202b";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.font = "900 17px sans-serif";
  ctx.fillText("你的公民成色是", state.width / 2, modalY + 24);
  ctx.font = "900 30px sans-serif";
  ctx.fillText(`【${result.role}】`, state.width / 2, modalY + 54);

  drawRopeIconCard(result.ropeIcon, state.width / 2, modalY + 108, Math.min(132, modalWidth - 96));

  drawText(result.summary, state.width / 2, modalY + 198, modalWidth - 56, 25, "700 16px sans-serif", "#4d5965", "center", 4);

  ctx.textAlign = "left";
  ctx.fillStyle = "#18202b";
  ctx.font = "900 15px sans-serif";
  ctx.fillText("屬性解析", modalX + 28, modalY + 306);
  result.traits.forEach((trait, index) => {
    drawText(trait, modalX + 28, modalY + 332 + index * 39, modalWidth - 56, 21, "700 14px sans-serif", "#4d5965", "left", 2);
  });

  drawText(result.mission, modalX + 28, modalY + modalHeight - 92, modalWidth - 56, 23, "800 15px sans-serif", "#2f6f61", "left", 3);

  ctx.restore();
}

function draw() {
  drawBackground();
  drawAxes();
  const card = getCurrentCard();
  drawChoiceLabels(card);
  if (!state.result) {
    drawCard(card);
    drawEffectPreview(card);
  }
  drawHint();
  drawFlash();
  drawResult();
}

function animate() {
  if (state.exiting) {
    const direction = state.exiting.direction === "right" ? 1 : -1;
    const speed = state.exiting.speed ?? 1;
    state.cardX += direction * Math.max(18, state.width * 0.045) * speed;
    state.cardY -= 3 * speed;
    state.rotation += direction * 0.018 * speed;

    if (Math.abs(state.cardX) > state.width * 1.2) {
      finishChoice(state.exiting.direction);
      state.exiting = null;
      state.cardX = 0;
      state.cardY = 0;
      state.rotation = 0;
    }
  } else if (!state.drag.active) {
    state.cardX *= 0.82;
    state.cardY *= 0.82;
    state.rotation *= 0.82;
    if (Math.abs(state.cardX) < 0.1) state.cardX = 0;
    if (Math.abs(state.cardY) < 0.1) state.cardY = 0;
    if (Math.abs(state.rotation) < 0.001) state.rotation = 0;
  }

  draw();
  requestAnimationFrame(animate);
}

function startDrag(event) {
  if (state.result) return;
  if (state.exiting) return;
  const point = { x: event.clientX, y: event.clientY };
  const cardButtons = getCardChoiceHitBoxes();
  if (isPointInside(point, cardButtons.left)) {
    choose("left", 0.58);
    return;
  }
  if (isPointInside(point, cardButtons.right)) {
    choose("right", 0.58);
    return;
  }

  const boxes = getChoiceHitBoxes();
  if (boxes) {
    if (isPointInside(point, boxes.left)) {
      choose("left", 0.58);
      return;
    }
    if (isPointInside(point, boxes.right)) {
      choose("right", 0.58);
      return;
    }
  }
  state.drag.active = true;
  state.drag.startX = event.clientX;
  state.drag.startY = event.clientY;
  state.drag.x = event.clientX;
  state.drag.y = event.clientY;
  canvas.setPointerCapture(event.pointerId);
}

function moveDrag(event) {
  if (!state.drag.active || state.exiting || state.result) return;
  state.drag.x = event.clientX;
  state.drag.y = event.clientY;
  state.cardX = event.clientX - state.drag.startX;
  state.cardY = (event.clientY - state.drag.startY) * 0.25;
  state.rotation = clamp(state.cardX / state.width, -0.28, 0.28);
}

function isPointInside(point, box) {
  return point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height;
}

function endDrag(event) {
  if (!state.drag.active || state.exiting || state.result) return;
  state.drag.active = false;
  canvas.releasePointerCapture(event.pointerId);
  const threshold = isDesktopLayout() ? Math.min(150, state.width * 0.16) : Math.min(116, state.width * 0.28);
  if (Math.abs(state.cardX) > threshold) {
      choose(state.cardX > 0 ? "right" : "left", 1);
  }
}

function choose(direction, speed = 1) {
  if (state.exiting || state.result) return;
  state.exiting = { direction, speed };
  state.rotation = direction === "right" ? 0.24 : -0.24;
}

function finishChoice(direction) {
  const card = getCurrentCard();
  const choice = card[direction];
  Object.entries(choice.effects).forEach(([key, value]) => {
    stats[key] = clamp(stats[key] + value, -AXIS_LIMIT, AXIS_LIMIT);
  });
  state.flash = {
    direction,
    label: choice.label,
    startedAt: performance.now(),
  };
  state.index += 1;
  if (state.index >= MAX_TURNS) {
    state.result = getEnding();
  }
}

function getEnding() {
  const key = `${stats.x >= 0 ? "+" : "-"}${stats.y >= 0 ? "+" : "-"}${stats.z >= 0 ? "+" : "-"}`;
  return endings[key];
}

function restart() {
  stats.x = 0;
  stats.y = 0;
  stats.z = 0;
  state.deck = [...cards];
  state.index = 0;
  state.cardX = 0;
  state.cardY = 0;
  state.rotation = 0;
  state.exiting = null;
  state.flash = null;
  state.result = null;
}

function handleKeydown(event) {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    choose("left", 0.58);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    choose("right", 0.58);
  }
  if ((event.key === "Enter" || event.key === " ") && state.result) {
    event.preventDefault();
    restart();
  }
}

function safeTop() {
  return state.height > 760 ? 12 : 0;
}

function safeBottom() {
  return state.height > 760 ? 10 : 0;
}

window.addEventListener("resize", resize);
window.addEventListener("keydown", handleKeydown);
canvas.addEventListener("pointerdown", startDrag);
canvas.addEventListener("pointermove", moveDrag);
canvas.addEventListener("pointerup", endDrag);
canvas.addEventListener("pointercancel", endDrag);
leftButton.addEventListener("click", () => choose("left", 0.58));
rightButton.addEventListener("click", () => choose("right", 0.58));

resize();
animate();
