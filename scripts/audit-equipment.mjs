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
    ["Giant Dragon", "巨龙"],
    ["Haifu", "海夫"],
    ["JOOLA", "优拉"],
    ["JUIC", "巨力克"],
    ["Kailin", "开林"],
    ["Kokutaku", "科库塔库"],
    ["Lidu", "力度"],
    ["LOKI", "雷神"],
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
  [/\b(?:Ventus|XEGNA|ZX-GEAR|SWAT|Koki Niwa)\b|V>\d+/i, "VICTAS"],
  [/\b(?:Vega|Omega|Jekyll|Artemis|Tetra|Stradivarius)\b|\bHugo (?:ALX|ALXi|HAL)\b/i, "XIOM"],
  [/^(?:麒麟|梁靖崑|毒刺)|\b(?:Rxton|Arthur|W81)\b/i, "LOKI"],
  [/\b(?:Fastarc|Hammond|Acoustic|Ludeack)\b/i, "Nittaku"],
  [/(?:标靶|Fextra|北欧 7)/i, "Sanwei"],
  [/(?:锐感|黑羽|蓝羽|蝉翼|威炫|威胜)/i, "Sword"],
];

const forbiddenBoosterNames = /\b(?:Rxton|Arthur|Target|VIP)\b/i;
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
