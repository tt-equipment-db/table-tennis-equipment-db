import fs from "node:fs";

const dataPath = new URL("../data/equipment.json", import.meta.url);
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const brandRegistry = new Map(
  [
    ["andro", "岸度"],
    ["Banda", "颁达"],
    ["Butterfly", "蝴蝶"],
    ["Dawei", "大维"],
    ["DHS", "红双喜"],
    ["Dianchi", "典驰"],
    ["DONIC", "多尼克"],
    ["Double Fish", "双鱼"],
    ["Dr. Neubauer", "牛博士"],
    ["Falco", "法尔克"],
    ["Flame", "弗雷姆"],
    ["Friendship 729", "友谊729"],
    ["GEWO", "捷沃"],
    ["Giant Dragon", "巨龙"],
    ["Haifu", "海夫"],
    ["JOOLA", "优拉"],
    ["JUIC", "巨力克"],
    ["Kailin", "开林"],
    ["Kokutaku", "科库塔库"],
    ["Lidu", "力度"],
    ["LOKI", "雷神"],
    ["Meteor", "流星"],
    ["Nexy", "尼西"],
    ["Nittaku", "尼塔库"],
    ["Palio", "拍里奥"],
    ["Reactor", "锐科特"],
    ["Revolution No.3", "Revolution No.3"],
    ["Sanwei", "三维"],
    ["STIGA", "斯帝卡"],
    ["SUNFLEX", "阳光"],
    ["Sword", "世奥得"],
    ["Taiji", "太极"],
    ["TIBHAR", "挺拔"],
    ["Tuttle", "塔特尔"],
    ["VICTAS", "维克塔斯"],
    ["XIOM", "骄猛"],
    ["YASAKA", "亚萨卡"],
    ["Yinhe", "银河"],
    ["Zhuolong", "卓隆"],
  ].map(([brandEn, brand]) => [brandEn, brand]),
);

const knownSeriesBrands = [
  [/\b(?:Tenergy|Dignics|Glayzer|Sriver|Feint|Viscaria|Innerforce|Outerforce)\b/i, "Butterfly"],
  [/(?:狂飙|Hurricane|天极|Skyline|金弓|Goldarc|天弓|Tin Arc)/i, "DHS"],
  [/\b(?:BlueGrip|Bluefire|Bluestorm|Bluestar|Baracuda)\b/i, "DONIC"],
  [/\b(?:Rakza|Mark V|Rising Dragon)\b/i, "YASAKA"],
  [/\b(?:CJ8000|AK47|Hadou)\b/i, "Palio"],
  [/\bHadraw\b/i, "Butterfly"],
  [/\b(?:DNA|Mantra|Helix|Carbonado|Cybershape|Clipper|Wavy|Offensive Classic|Intense CCF)\b/i, "STIGA"],
  [/\b(?:Evolution|Hybrid K|Quantum|Infinity MX|Stratus Power Wood)\b/i, "TIBHAR"],
  [/\b(?:Dynaryz|Rhyzen|Trinity|Vyzaryz|Rosskopf)\b/i, "JOOLA"],
  [/\b(?:Proton Neo|Nexxus|Codexx|Hype)\b/i, "GEWO"],
  [/\b(?:Ventus|XEGNA|ZX-GEAR|SWAT|Koki Niwa)\b|V>\d+/i, "VICTAS"],
  [/\b(?:Vega|Omega|Jekyll|Artemis|Tetra|Stradivarius)\b|\bHugo (?:ALX|ALXi|HAL)\b/i, "XIOM"],
  [/^(?:麒麟|梁靖崑|毒刺)|\b(?:Rxton|Arthur|W81)\b/i, "LOKI"],
  [/\b(?:Fastarc|Hammond|Acoustic|Ludeack)\b/i, "Nittaku"],
  [/(?:标靶|Fextra|北欧 7)/i, "Sanwei"],
  [/(?:锐感|黑羽|蓝羽|蝉翼|威炫|威胜)/i, "Sword"],
];

const forbiddenBoosterNames = /\b(?:Rxton|Arthur|Target|VIP)\b/i;
const tagTaxonomies = {
  rubbers: {
    position: new Set(["正手", "反手"]),
    rubberType: new Set(["反胶", "正胶", "生胶", "长胶"]),
    surface: new Set([
      "粘性胶面",
      "微粘胶面",
      "半粘半涩胶面",
      "涩性胶面",
      "胶面属性未明确",
    ]),
    sponge: new Set([
      "高密海绵",
      "蛋糕海绵",
      "传统海绵",
      "薄海绵",
      "单胶皮（OX）",
      "海绵类型未明确",
    ]),
    thickness: new Set([
      "OX",
      "0.5",
      "0.6",
      "1.0",
      "1.1",
      "1.3",
      "1.5",
      "1.7",
      "1.8",
      "1.9",
      "2.0",
      "2.1",
      "2.15",
      "2.2",
      "2.3",
      "2.5",
      "2.7",
      "Max",
    ]),
    style: new Set([
      "弧圈",
      "快攻",
      "快攻弧圈",
      "控制",
      "相持",
      "连续进攻",
      "主动进攻",
      "发抢",
      "反拉",
      "近台",
      "防守",
      "削球",
      "颗粒变化",
      "训练",
      "免灌",
      "弹击",
      "拧拉",
      "轻量",
      "水怪套餐",
    ]),
  },
  blades: {
    structure: new Set([
      "五夹纯木",
      "七夹纯木",
      "多层纯木",
      "纯木（层数未明）",
      "外置纤维",
      "内置纤维",
      "异质纤维",
      "纤维位置未标明",
    ]),
    material: new Set([
      "纯木",
      "芳碳（ALC）",
      "超级芳碳（Super ALC）",
      "ZLC",
      "超级 ZLC",
      "碳纤维",
      "混编碳纤维",
      "非碳复合纤维",
      "其他复合纤维",
    ]),
    position: new Set([
      "快攻弧圈",
      "弧圈",
      "快攻",
      "控制",
      "相持",
      "主动进攻",
      "近台",
      "中远台",
      "训练",
      "防守",
      "削球",
      "颗粒打法",
      "直板横打",
    ]),
    bladeFormat: new Set(["横板", "直板"]),
    handle: new Set(["FL", "ST", "AN", "CS"]),
    speed: new Set(["ALL+", "OFF-", "OFF", "OFF+"]),
    bladeHardness: new Set(["柔和", "中软", "中等", "中硬", "硬挺"]),
    feel: new Set([
      "持球",
      "清晰",
      "稳定",
      "直接",
      "支撑",
      "弹性",
      "形变",
      "减震",
      "扎实",
      "轻灵",
      "力量感",
      "纯木手感",
      "可调重心",
      "水怪套餐",
    ]),
    weight: new Set(["偏轻", "常规", "偏重"]),
  },
  boosters: {
    boosterType: new Set(["膨胀油", "打底油", "保养油"]),
    effect: new Set(["增弹", "软化", "持久", "温和", "强力"]),
    drying: new Set(["快干", "中速", "慢干"]),
    duration: new Set(["中效", "长效"]),
  },
};
const optionalTaxonomyFields = new Set([
  "rubbers.thickness",
  "rubbers.surface",
  "blades.bladeFormat",
  "blades.handle",
  "blades.bladeHardness",
  "blades.feel",
  "blades.weight",
]);
const errors = [];
const warnings = [];
const seenIds = new Set();
const seenRouteIds = new Map();
let total = 0;

for (const [category, items] of Object.entries(data)) {
  if (!Array.isArray(items)) {
    errors.push(`${category}: category must be an array`);
    continue;
  }

  for (const item of items) {
    total += 1;
    const label = `${category}/${item.id ?? "<missing-id>"}`;

    if (!item.id || !item.name || !item.brand || !item.brandEn) {
      errors.push(`${label}: missing id, name, brand, or brandEn`);
      continue;
    }

    if (seenIds.has(item.id)) errors.push(`${label}: duplicate id`);
    seenIds.add(item.id);
    for (const routeId of [item.id, ...(item.legacyIds ?? [])]) {
      const owner = seenRouteIds.get(routeId);
      if (owner && owner !== item.id) {
        errors.push(`${label}: route id "${routeId}" already belongs to ${owner}`);
      } else {
        seenRouteIds.set(routeId, item.id);
      }
    }

    const expectedBrand = brandRegistry.get(item.brandEn);
    if (!expectedBrand) {
      errors.push(`${label}: unregistered brand ${item.brandEn}（${item.brand}）`);
    } else if (expectedBrand !== item.brand) {
      errors.push(
        `${label}: brand pair should be ${item.brandEn}（${expectedBrand}）, got ${item.brandEn}（${item.brand}）`,
      );
    }

    const expectedTag =
      item.brandEn === item.brand ? item.brand : `${item.brandEn}（${item.brand}）`;
    if (
      !Array.isArray(item.tags?.brand) ||
      item.tags.brand.length !== 1 ||
      item.tags.brand[0] !== expectedTag
    ) {
      errors.push(`${label}: brand tag should be "${expectedTag}"`);
    }

    for (const [pattern, expectedBrandEn] of knownSeriesBrands) {
      const identity = `${item.name} ${item.series ?? ""}`;
      if (pattern.test(identity) && item.brandEn !== expectedBrandEn) {
        errors.push(
          `${label}: "${item.name}" normally belongs to ${expectedBrandEn}, not ${item.brandEn}`,
        );
      }
    }

    if (category === "boosters" && forbiddenBoosterNames.test(item.name)) {
      errors.push(`${label}: rubber-series name is not accepted as a booster product`);
    }

    for (const [tagKey, allowedValues] of Object.entries(tagTaxonomies[category] ?? {})) {
      const values = item.tags?.[tagKey];
      if (!Array.isArray(values) || values.length === 0) {
        if (!optionalTaxonomyFields.has(`${category}.${tagKey}`)) {
          errors.push(`${label}: missing normalized tags.${tagKey}`);
        }
        continue;
      }
      for (const value of values) {
        if (!allowedValues.has(value)) {
          errors.push(`${label}: unsupported tags.${tagKey} value "${value}"`);
        }
      }
    }

    const images = [item.image, ...(item.images ?? [])].filter(Boolean);
    if ((item.images ?? []).length > 5) {
      errors.push(`${label}: at most 5 carousel images are allowed`);
    }
    if (images.some((url) => url.includes("placehold.co"))) {
      warnings.push(`${label}: placeholder image`);
    }

    const webSources = (item.sources ?? []).filter(
      (source) => typeof source === "string" && /^https?:\/\//.test(source),
    );
    if (webSources.length === 0) warnings.push(`${label}: no web source`);
  }
}

console.log(
  `Audited ${total} products: ${data.rubbers.length} rubbers, ${data.blades.length} blades, ${data.boosters.length} boosters.`,
);
console.log(`${errors.length} errors, ${warnings.length} warnings.`);

if (warnings.length) {
  console.log("\nWarnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error("\nErrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
}
