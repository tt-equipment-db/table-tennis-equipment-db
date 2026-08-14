import fs from "node:fs";

const dataPath = new URL("../data/equipment.json", import.meta.url);
const checkOnly = process.argv.includes("--check");

export const TAG_TAXONOMIES = {
  rubberPosition: ["正手", "反手"],
  rubberType: ["反胶", "正胶", "生胶", "长胶"],
  rubberSurface: [
    "粘性胶面",
    "微粘胶面",
    "半粘半涩胶面",
    "涩性胶面",
    "胶面属性未明确",
  ],
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
  rubberStyle: [
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
  ],
  bladePlayStyle: [
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
  ],
  bladeFormat: ["横板", "直板"],
  bladeHandle: ["FL", "ST", "AN", "CS"],
  bladeSpeed: ["ALL+", "OFF-", "OFF", "OFF+"],
  bladeHardness: ["柔和", "中软", "中等", "中硬", "硬挺"],
  bladeFeel: [
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
  ],
  bladeWeight: ["偏轻", "常规", "偏重"],
  boosterType: ["膨胀油", "打底油", "保养油"],
  boosterEffect: ["增弹", "软化", "持久", "温和", "强力"],
  boosterDrying: ["快干", "中速", "慢干"],
  boosterDuration: ["中效", "长效"],
};

const RUBBER_THICKNESSES = new Set([
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
]);

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

function orderedUnique(values, order) {
  const selected = new Set(values.filter(Boolean));
  return order.filter((value) => selected.has(value));
}

function normalizeRubberType(item) {
  const original = [...asArray(item.tags?.rubberType), ...asArray(item.tags?.surface)];
  const text = original.join(" ");
  const types = [];
  const surfaces = [];

  if (/长胶|长颗粒/.test(text)) types.push("长胶");
  else if (/生胶/.test(text)) types.push("生胶");
  else if (/正胶|短颗粒/.test(text)) types.push("正胶");
  else types.push("反胶");

  if (types.includes("反胶")) {
    if (/半粘|涩粘|粘弹/.test(text)) surfaces.push("半粘半涩胶面");
    else if (/微粘/.test(text)) surfaces.push("微粘胶面");
    else if (/粘性胶面/.test(text)) surfaces.push("粘性胶面");
    else if (/涩性|微涩|高抓力|德套/.test(text)) surfaces.push("涩性胶面");
    else surfaces.push("胶面属性未明确");
  }

  item.tags.rubberType = orderedUnique(types, TAG_TAXONOMIES.rubberType);
  if (surfaces.length) item.tags.surface = orderedUnique(surfaces, TAG_TAXONOMIES.rubberSurface);
  else delete item.tags.surface;
}

function mapRubberStyle(value) {
  if (TAG_TAXONOMIES.rubberStyle.includes(value)) return [value];
  if (/近台/.test(value)) {
    const mapped = ["近台"];
    if (/快攻/.test(value)) mapped.push("快攻");
    if (/弹击/.test(value)) mapped.push("弹击");
    return mapped;
  }
  const aliases = {
    主动发力: ["主动进攻"],
    前冲: ["主动进攻"],
    强冲: ["主动进攻"],
    变化: ["颗粒变化"],
    怪异: ["颗粒变化"],
    干扰: ["颗粒变化"],
    入门: ["训练"],
    基础训练: ["训练"],
    台内控制: ["控制"],
    反击: ["相持"],
    快拨: ["相持"],
    快撕: ["相持"],
    速度: ["快攻"],
    直拍快攻: ["快攻"],
    强旋转: ["弧圈"],
    长胶进攻: ["主动进攻", "颗粒变化"],
    反手: [],
  };
  return aliases[value] ?? [];
}

function normalizeRubberClassification(item) {
  const originalPositions = asArray(item.tags?.position);
  const positions = originalPositions.filter((value) =>
    TAG_TAXONOMIES.rubberPosition.includes(value),
  );
  const priorStyleDetails = asArray(item.tags?.styleDetail);
  const styleInputs = [
    ...asArray(item.tags?.style),
    ...originalPositions.filter((value) => !TAG_TAXONOMIES.rubberPosition.includes(value)),
    ...asArray(item.tags?.feature),
    ...asArray(item.tags?.features),
  ];
  const styles = styleInputs.flatMap(mapRubberStyle);
  const unmapped = styleInputs.filter((value) => mapRubberStyle(value).length === 0 && !["反手", "白金DNA"].includes(value));

  if (styleInputs.includes("白金DNA") || priorStyleDetails.includes("白金DNA")) {
    item.tags.alias = unique([...asArray(item.tags?.alias), "白金DNA"]);
  }

  item.tags.position = orderedUnique(positions, TAG_TAXONOMIES.rubberPosition);
  item.tags.style = orderedUnique(styles, TAG_TAXONOMIES.rubberStyle);
  const retainedDetails = priorStyleDetails.filter((value) => value !== "白金DNA");
  if (unmapped.length || retainedDetails.length) item.tags.styleDetail = unique([...retainedDetails, ...unmapped]);
  else delete item.tags.styleDetail;
  delete item.tags.feature;
  delete item.tags.features;
}

function normalizeRubberThickness(item) {
  const original = asArray(item.tags?.thickness);
  const normalized = [];
  const details = asArray(item.tags?.thicknessDetail);
  for (const value of original) {
    const canonical = /^max\+?$/i.test(value) ? "Max" : value;
    if (RUBBER_THICKNESSES.has(canonical)) normalized.push(canonical);
    else details.push(value);
  }
  if (normalized.length) item.tags.thickness = unique(normalized);
  else delete item.tags.thickness;
  if (details.length) item.tags.thicknessDetail = unique(details);
  else delete item.tags.thicknessDetail;
}

function mapBladePlayStyle(value) {
  if (TAG_TAXONOMIES.bladePlayStyle.includes(value)) return [value];
  if (/近台/.test(value)) return ["近台"];
  if (/中台|中远台/.test(value)) return ["中远台"];
  const aliases = {
    双面弧圈: ["弧圈"],
    弧圈快攻: ["快攻弧圈"],
    连续相持: ["相持"],
    进攻: ["主动进攻"],
    双面进攻: ["主动进攻"],
    双面异质进攻: ["主动进攻"],
    相持进攻: ["相持", "主动进攻"],
    连续进攻: ["主动进攻"],
    基础训练: ["训练"],
    进攻横拍: ["主动进攻"],
    削中反攻: ["削球", "主动进攻"],
    前冲弧圈: ["弧圈"],
    高端配置: [],
    反手体系: [],
    日直: [],
    反转日直: [],
    发抢: ["主动进攻"],
  };
  return aliases[value] ?? [];
}

function normalizeBladeHandle(item) {
  const original = [...asArray(item.tags?.bladeFormat), ...asArray(item.tags?.handle)];
  const formats = [];
  const handles = [];
  const details = asArray(item.tags?.handleDetail);
  for (const value of original) {
    if (["FL", "ST", "AN"].includes(value)) {
      formats.push("横板");
      handles.push(value);
    } else if (value === "CS") {
      formats.push("直板");
      handles.push("CS");
    } else if (value === "横板" || value === "直板") formats.push(value);
    else if (value === "PEN") formats.push("直板");
    else if (["日式直板", "JS", "日直"].includes(value)) {
      formats.push("直板");
      details.push("日式直板（JS）");
    } else if (value === "WRB") {
      details.push("WRB 空心柄");
    } else {
      details.push(value);
    }
  }
  item.tags.bladeFormat = orderedUnique(formats, TAG_TAXONOMIES.bladeFormat);
  item.tags.handle = orderedUnique(handles, TAG_TAXONOMIES.bladeHandle);
  if (!item.tags.handle.length) delete item.tags.handle;
  if (details.length) item.tags.handleDetail = unique(details);
  else delete item.tags.handleDetail;
}

function normalizeBladeSpeed(item) {
  const text = asArray(item.tags?.speed).join(" ");
  let speed = "";
  if (/OFF\+\+|OFF\+|很快/.test(text)) speed = "OFF+";
  else if (/(^|\s)OFF($|\s)|快速|(^|\s)快($|\s)/.test(text)) speed = "OFF";
  else if (/OFF-|中快|中快速/.test(text)) speed = "OFF-";
  else if (/ALL\+|中等/.test(text)) speed = "ALL+";
  if (speed) item.tags.speed = [speed];
  else delete item.tags.speed;
}

function mapBladeFeel(value) {
  if (TAG_TAXONOMIES.bladeFeel.includes(value)) return value;
  const aliases = {
    均衡: "稳定",
    控制: "稳定",
    反馈清晰: "清晰",
    通透: "清晰",
    精确: "清晰",
    一面直接: "直接",
    一面持球: "持球",
    支撑强: "支撑",
    厚芯: "支撑",
    高弹: "弹性",
    超薄: "轻灵",
    轻量: "轻灵",
    低弧线: "直接",
  };
  return aliases[value] ?? "";
}

function mapBladeHardness(value) {
  if (TAG_TAXONOMIES.bladeHardness.includes(value)) return value;
  const aliases = {
    偏软: "中软",
    软: "柔和",
    偏硬: "硬挺",
    硬: "硬挺",
    硬弹: "硬挺",
  };
  return aliases[value] ?? "";
}

function normalizeBladeFeel(item, extraValues = []) {
  const priorDetails = asArray(item.tags?.feelDetail);
  const original = [
    ...asArray(item.tags?.bladeHardness),
    ...asArray(item.tags?.feel),
    ...extraValues,
    ...priorDetails.filter((value) => mapBladeFeel(value)),
  ];
  const hardness = original.map(mapBladeHardness).filter(Boolean);
  const normalized = original.map(mapBladeFeel).filter(Boolean);
  if (original.includes("桧木面材") || priorDetails.includes("桧木面材")) {
    item.tags.materialDetail = unique([...asArray(item.tags?.materialDetail), "桧木面材"]);
  }
  const details = [
    ...priorDetails.filter((value) => !mapBladeFeel(value) && !mapBladeHardness(value) && !["桧木面材", "性价比", "升级款"].includes(value)),
    ...original.filter((value) => !mapBladeFeel(value) && !mapBladeHardness(value) && !["桧木面材", "性价比", "升级款"].includes(value)),
  ];
  if (hardness.length) item.tags.bladeHardness = orderedUnique(hardness, TAG_TAXONOMIES.bladeHardness);
  else delete item.tags.bladeHardness;
  if (normalized.length) item.tags.feel = orderedUnique(normalized, TAG_TAXONOMIES.bladeFeel);
  else delete item.tags.feel;
  if (details.length) item.tags.feelDetail = unique(details);
  else delete item.tags.feelDetail;
}

function parseWeightRange(value) {
  const numbers = String(value).match(/\d+/g)?.map(Number) ?? [];
  if (/以上/.test(value) && numbers.length) return { min: numbers[0], max: Infinity };
  if (numbers.length >= 2) return { min: numbers[0], max: numbers[1] };
  if (numbers.length === 1 && /g|克/.test(value)) return { min: numbers[0] - 2, max: numbers[0] + 2 };
  return null;
}

function normalizeBladeWeight(item) {
  const original = asArray(item.tags?.weight);
  const normalized = [];
  const details = asArray(item.tags?.weightDetail);
  const numericDetails = details.filter((value) => parseWeightRange(value));
  const classificationSource = numericDetails.length ? numericDetails : original;
  for (const value of classificationSource) {
    if (TAG_TAXONOMIES.bladeWeight.includes(value)) normalized.push(value);
    else if (value === "超轻") normalized.push("偏轻");
    else {
      const range = parseWeightRange(value);
      if (range) {
        if (range.max <= 84) normalized.push("偏轻");
        else if (range.min >= 90) normalized.push("偏重");
        else {
          normalized.push("常规");
          if (range.min < 82) normalized.push("偏轻");
          if (range.max > 90) normalized.push("偏重");
        }
        details.push(value);
      } else {
        details.push(value);
      }
    }
  }
  if (normalized.length) item.tags.weight = orderedUnique(normalized, TAG_TAXONOMIES.bladeWeight);
  else delete item.tags.weight;
  if (details.length) item.tags.weightDetail = unique(details);
  else delete item.tags.weightDetail;
}

function normalizeBladeClassification(item) {
  const originalPlay = [...asArray(item.tags?.position), ...asArray(item.tags?.style)];
  const mappedPlay = originalPlay.flatMap(mapBladePlayStyle);
  const playDetails = originalPlay.filter((value) => !mapBladePlayStyle(value).length && !["高端配置", "反手体系", "日直", "反转日直", "水怪套餐"].includes(value));
  const extraFeel = [
    ...asArray(item.tags?.features),
    ...originalPlay.filter((value) => value === "水怪套餐"),
  ];

  if (originalPlay.includes("日直") || originalPlay.includes("反转日直")) {
    item.tags.handle = unique([...asArray(item.tags?.handle), "直板"]);
    const handleDetails = [...asArray(item.tags?.handleDetail)];
    if (originalPlay.includes("日直")) handleDetails.push("日式直板（JS）");
    if (originalPlay.includes("反转日直")) handleDetails.push("反转式日直");
    item.tags.handleDetail = unique(handleDetails);
  }

  item.tags.position = orderedUnique(mappedPlay, TAG_TAXONOMIES.bladePlayStyle);
  if (playDetails.length) item.tags.playStyleDetail = unique([...asArray(item.tags?.playStyleDetail), ...playDetails]);
  else if (!asArray(item.tags?.playStyleDetail).length) delete item.tags.playStyleDetail;
  normalizeBladeFeel(item, extraFeel);
  delete item.tags.style;
  delete item.tags.features;
  delete item.tags.bladeType;
}

function normalizeBooster(item) {
  const originalTypes = asArray(item.tags?.boosterType);
  const types = ["膨胀油"];
  if (originalTypes.includes("打底油")) types.push("打底油");
  if (originalTypes.includes("保养油")) types.push("保养油");
  item.tags.boosterType = orderedUnique(types, TAG_TAXONOMIES.boosterType);

  const priorEffectDetails = asArray(item.tags?.effectDetail);
  const originalEffects = unique([...asArray(item.tags?.effect), ...priorEffectDetails]);
  const effects = [];
  const effectDetails = [];
  const usage = asArray(item.tags?.usage);
  for (const value of originalEffects) {
    if (TAG_TAXONOMIES.boosterEffect.includes(value)) effects.push(value);
    else if (["底劲", "爆发"].includes(value)) effects.push("增弹");
    else if (value === "吃球") effects.push("软化");
    else if (value === "均衡") effects.push("温和");
    else if (["训练", "比赛"].includes(value)) usage.push(value);
    else effectDetails.push(value);
  }
  item.tags.effect = orderedUnique(effects, TAG_TAXONOMIES.boosterEffect);
  if (effectDetails.length) item.tags.effectDetail = unique(effectDetails);
  else delete item.tags.effectDetail;
  if (usage.length) item.tags.usage = unique(usage);
  else delete item.tags.usage;
  delete item.tags.price;
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

function assertCanonical(items, category, key, taxonomyKey = key, required = true) {
  const allowed = new Set(TAG_TAXONOMIES[taxonomyKey]);
  for (const item of items) {
    const values = asArray(item.tags?.[key]);
    if (!values.length) {
      if (required) throw new Error(`${category}/${item.id}: missing tags.${key}`);
      continue;
    }
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
  assertCanonical(data.rubbers, "rubbers", "position", "rubberPosition");
  assertCanonical(data.rubbers, "rubbers", "rubberType", "rubberType");
  assertCanonical(data.rubbers, "rubbers", "surface", "rubberSurface", false);
  assertCanonical(data.rubbers, "rubbers", "sponge");
  assertCanonical(data.rubbers, "rubbers", "style", "rubberStyle");
  assertCanonical(data.blades, "blades", "position", "bladePlayStyle");
  assertCanonical(data.blades, "blades", "structure");
  assertCanonical(data.blades, "blades", "material");
  assertCanonical(data.blades, "blades", "bladeFormat", "bladeFormat", false);
  assertCanonical(data.blades, "blades", "handle", "bladeHandle", false);
  assertCanonical(data.blades, "blades", "speed", "bladeSpeed");
  assertCanonical(data.blades, "blades", "bladeHardness", "bladeHardness", false);
  assertCanonical(data.blades, "blades", "feel", "bladeFeel", false);
  assertCanonical(data.blades, "blades", "weight", "bladeWeight", false);
  assertCanonical(data.boosters, "boosters", "boosterType", "boosterType");
  assertCanonical(data.boosters, "boosters", "effect", "boosterEffect");
  assertCanonical(data.boosters, "boosters", "drying", "boosterDrying");
  assertCanonical(data.boosters, "boosters", "duration", "boosterDuration");
  console.log("Taxonomy check completed.");
  for (const key of ["sponge", "structure", "material"]) {
    console.log(`\n${key}: ${before[key].length} canonical values`);
    console.log(before[key].map(([value, count]) => `${value}: ${count}`).join(" | "));
  }
  process.exit(0);
}

for (const item of data.rubbers) {
  normalizeRubber(item);
  normalizeRubberType(item);
  normalizeRubberClassification(item);
  normalizeRubberThickness(item);
  delete item.tags.price;
}
for (const item of data.blades) {
  normalizeBladeStructure(item);
  normalizeBladeMaterial(item);
  normalizeBladeClassification(item);
  normalizeBladeHandle(item);
  normalizeBladeSpeed(item);
  normalizeBladeWeight(item);
  delete item.tags.price;
}
for (const item of data.boosters) normalizeBooster(item);

assertCanonical(data.rubbers, "rubbers", "position", "rubberPosition");
assertCanonical(data.rubbers, "rubbers", "rubberType", "rubberType");
assertCanonical(data.rubbers, "rubbers", "surface", "rubberSurface", false);
assertCanonical(data.rubbers, "rubbers", "sponge");
assertCanonical(data.rubbers, "rubbers", "style", "rubberStyle");
assertCanonical(data.blades, "blades", "position", "bladePlayStyle");
assertCanonical(data.blades, "blades", "structure");
assertCanonical(data.blades, "blades", "material");
assertCanonical(data.blades, "blades", "bladeFormat", "bladeFormat", false);
assertCanonical(data.blades, "blades", "handle", "bladeHandle", false);
assertCanonical(data.blades, "blades", "speed", "bladeSpeed");
assertCanonical(data.blades, "blades", "bladeHardness", "bladeHardness", false);
assertCanonical(data.blades, "blades", "feel", "bladeFeel", false);
assertCanonical(data.blades, "blades", "weight", "bladeWeight", false);
assertCanonical(data.boosters, "boosters", "boosterType", "boosterType");
assertCanonical(data.boosters, "boosters", "effect", "boosterEffect");
assertCanonical(data.boosters, "boosters", "drying", "boosterDrying");
assertCanonical(data.boosters, "boosters", "duration", "boosterDuration");

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
