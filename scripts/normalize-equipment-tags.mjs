import fs from "node:fs";

const dataPath = new URL("../data/equipment.json", import.meta.url);
const checkOnly = process.argv.includes("--check");

export const TAG_TAXONOMIES = {
  sponge: [
    "高密海绵",
    "蛋糕海绵",
    "传统海绵",
    "薄海绵",
    "单胶皮（OX）",
    "海绵类型未明确",
  ],
  structure: [
    "五夹纯木",
    "七夹纯木",
    "多层纯木",
    "纯木（层数未明）",
    "外置纤维",
    "内置纤维",
    "异质纤维",
    "纤维位置未标明",
  ],
  material: [
    "纯木",
    "芳碳（ALC）",
    "超级芳碳（Super ALC）",
    "ZLC",
    "超级 ZLC",
    "碳纤维",
    "混编碳纤维",
    "非碳复合纤维",
    "其他复合纤维",
  ],
};

const genericSpongeDetails = new Set([
  "高密海绵",
  "蛋糕海绵",
  "传统海绵",
  "薄海绵",
  "单胶皮",
  "单胶皮（OX）",
  "海绵类型未明确",
  "高弹海绵",
  "弹性海绵",
  "内能海绵",
  "国产海绵",
]);

const genericStructureDetails = new Set([
  ...TAG_TAXONOMIES.structure,
  "纯木",
  "纤维",
  "碳素",
  "芳碳",
  "芳碳结构",
  "复合结构",
  "外置纤维",
  "内置纤维",
  "异质内外置",
  "轻量",
  "黑檀",
  "ALC",
]);

const genericMaterialDetails = new Set([
  ...TAG_TAXONOMIES.material,
  "木材",
  "纤维",
  "碳素",
  "芳碳",
  "芳纶碳",
  "超级芳碳",
  "复合纤维",
  "混编纤维",
  "混编碳纤维",
  "无碳纤维",
  "外置纤维",
]);

function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeSpongeDetail(value) {
  const aliases = {
    "Tensor海绵": "Tensor 海绵",
    "OCS氧气胶囊海绵": "OCS 氧气胶囊海绵",
    "大孔径海绵": "大孔海绵",
    "大气孔海绵": "大孔海绵",
    "硬海绵": "硬质海绵",
    "软海绵": "软弹海绵",
    "NIF海绵": "NIF 海绵",
    "RED ENERGY海绵": "RED ENERGY 海绵",
  };
  return aliases[value] ?? value;
}

function normalizeRubber(item) {
  const original = asArray(item.tags?.sponge);
  const detailCandidates = unique([
    ...asArray(item.tags?.spongeDetail),
    ...original,
  ]).map(normalizeSpongeDetail);
  const text = original.join(" ");
  const normalized = [];

  if (/单胶皮/.test(text)) {
    normalized.push("单胶皮（OX）");
    if (/薄海绵/.test(text)) normalized.push("薄海绵");
  } else if (/薄海绵/.test(text)) {
    normalized.push("薄海绵");
  } else if (
    /蛋糕海绵|Spring Sponge|Tensor\s*海绵|大孔|大气孔|双孔径|Power Sponge Cells|OCS|高张力海绵/.test(
      text,
    )
  ) {
    normalized.push("蛋糕海绵");
  } else if (/高密海绵|黄金高密海绵|昆仑海绵|硬质海绵|硬海绵/.test(text)) {
    normalized.push("高密海绵");
  } else if (/传统海绵/.test(text)) {
    normalized.push("传统海绵");
  } else if (/高弹海绵|弹性海绵/.test(text)) {
    normalized.push("蛋糕海绵");
  } else if (/国产海绵|黄海绵/.test(text)) {
    normalized.push("传统海绵");
  } else {
    normalized.push("海绵类型未明确");
  }

  const details = unique(
    detailCandidates.filter((value) => !genericSpongeDetails.has(value)),
  );
  item.tags.sponge = normalized;
  if (details.length) item.tags.spongeDetail = details;
  else delete item.tags.spongeDetail;
}

function normalizeBladeStructure(item) {
  const original = asArray(item.tags?.structure);
  const text = original.join(" ");
  const materialText = asArray(item.tags?.material).join(" ");
  const routeIdentity = `${item.id ?? ""} ${item.name ?? ""}`;
  const description = item.description ?? "";
  const identity = `${routeIdentity} ${description} ${text} ${materialText}`;
  const explicitInner = /内置|\binner\b|\balxi\b/i.test(`${routeIdentity} ${text}`);
  const explicitOuter = /外置|\bouter\b/i.test(`${routeIdentity} ${text}`);
  const hasInner = /内置/.test(description);
  const hasOuter = /外置/.test(description);
  const hasFiber =
    /纤维|碳素|芳碳|ALC|复合结构|3\+2|5\+2|五木二(?:纤|碳|芳碳)|7木6碳|钛/.test(
      identity,
    );
  let normalized;

  if (explicitInner && explicitOuter) normalized = "异质纤维";
  else if (explicitInner) normalized = "内置纤维";
  else if (explicitOuter) normalized = "外置纤维";
  else if (/异质/.test(identity) || (hasInner && hasOuter)) normalized = "异质纤维";
  else if (hasInner) normalized = "内置纤维";
  else if (hasOuter) normalized = "外置纤维";
  else if (hasFiber) normalized = "纤维位置未标明";
  else if (/七夹|七层|7层/.test(text)) normalized = "七夹纯木";
  else if (/五夹|五层|5层/.test(text)) normalized = "五夹纯木";
  else if (/多层|九层|9层/.test(text)) normalized = "多层纯木";
  else normalized = "纯木（层数未明）";

  const details = unique([
    ...asArray(item.tags?.structureDetail),
    ...original.filter((value) => !genericStructureDetails.has(value)),
  ]);
  item.tags.structure = [normalized];
  if (details.length) item.tags.structureDetail = details;
  else delete item.tags.structureDetail;
}

function normalizeBladeMaterial(item) {
  const original = asArray(item.tags?.material);
  const structure = asArray(item.tags?.structure);
  const structureDetails = asArray(item.tags?.structureDetail);
  const text = `${original.join(" ")} ${structureDetails.join(" ")} ${item.name ?? ""}`;
  const pureWood = structure.some((value) => value.includes("纯木"));
  let normalized;

  if (pureWood) {
    normalized = "纯木";
  } else if (/Super ZL|Super ZLC|超级\s*ZLC/i.test(text)) {
    normalized = "超级 ZLC";
  } else if (/\bZLC\b|ZL[- ]?Carbon|ZL碳素/i.test(text)) {
    normalized = "ZLC";
  } else if (/SARC|Super ALC|Super Arylate[- ]Carbon|超级芳碳/i.test(text)) {
    normalized = "超级芳碳（Super ALC）";
  } else if (
    /TRIMETRIX|Axylium Carbon|Zephylium Carbon|Voltema[- ]Carbon|芳碳混编|混编碳纤维/i.test(
      text,
    )
  ) {
    normalized = "混编碳纤维";
  } else if (
    /\bALC\b|Arylate[- ]Carbon|Aramid Carbon|AR Carbon|\bARC\b|ARY[- ]?C|Hyper ARY[- ]?c|KL[- ]?c|KLC|Hexamid Carbon|芳碳|芳纶碳/i.test(
      text,
    )
  ) {
    normalized = "芳碳（ALC）";
  } else if (
    /非碳复合纤维|ARY[- ]?X|\bZLF\b|ZL Fiber|Ultra Fibre|CNF|Hyper Axylium|无碳纤维|VR\+/i.test(
      text,
    )
  ) {
    normalized = "非碳复合纤维";
  } else if (
    /碳纤维|碳素|Carbon|CCF|TeXtreme|Spread Tow|TAMCA|JLC/i.test(text)
  ) {
    normalized = "碳纤维";
  } else {
    normalized = "其他复合纤维";
  }

  const details = unique([
    ...asArray(item.tags?.materialDetail),
    ...original.filter((value) => !genericMaterialDetails.has(value)),
  ]);
  item.tags.material = [normalized];
  if (details.length) item.tags.materialDetail = details;
  else delete item.tags.materialDetail;
}

function countValues(items, key) {
  const counts = new Map();
  for (const item of items) {
    for (const value of asArray(item.tags?.[key])) {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function assertCanonical(items, category, key) {
  const allowed = new Set(TAG_TAXONOMIES[key]);
  for (const item of items) {
    const values = asArray(item.tags?.[key]);
    if (!values.length) throw new Error(`${category}/${item.id}: missing tags.${key}`);
    for (const value of values) {
      if (!allowed.has(value)) {
        throw new Error(`${category}/${item.id}: unsupported tags.${key} value "${value}"`);
      }
    }
  }
}

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const before = {
  sponge: countValues(data.rubbers, "sponge"),
  structure: countValues(data.blades, "structure"),
  material: countValues(data.blades, "material"),
};

if (checkOnly) {
  assertCanonical(data.rubbers, "rubbers", "sponge");
  assertCanonical(data.blades, "blades", "structure");
  assertCanonical(data.blades, "blades", "material");
  console.log("Taxonomy check completed.");
  for (const key of ["sponge", "structure", "material"]) {
    console.log(`\n${key}: ${before[key].length} canonical values`);
    console.log(before[key].map(([value, count]) => `${value}: ${count}`).join(" | "));
  }
  process.exit(0);
}

for (const item of data.rubbers) normalizeRubber(item);
for (const item of data.blades) {
  normalizeBladeStructure(item);
  normalizeBladeMaterial(item);
}

assertCanonical(data.rubbers, "rubbers", "sponge");
assertCanonical(data.blades, "blades", "structure");
assertCanonical(data.blades, "blades", "material");

const after = {
  sponge: countValues(data.rubbers, "sponge"),
  structure: countValues(data.blades, "structure"),
  material: countValues(data.blades, "material"),
};

fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");

console.log("Equipment tags normalized.");
for (const key of ["sponge", "structure", "material"]) {
  console.log(`\n${key}: ${before[key].length} values -> ${after[key].length} values`);
  console.log(after[key].map(([value, count]) => `${value}: ${count}`).join(" | "));
}
