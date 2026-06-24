const filterConfig = {
  rubbers: [
    { key: "brand", label: "品牌", color: "blue" },
    { key: "position", label: "位置", color: "green" },
    { key: "rubberType", label: "胶面", color: "rose" },
    { key: "sponge", label: "海绵", color: "amber" },
    { key: "thickness", label: "厚度", color: "teal" },
    { key: "style", label: "打法", color: "blue" },
    { key: "origin", label: "产地", color: "green" },
    { key: "price", label: "价格带", color: "rose", values: ["50内", "80内", "百元左右", "150左右", "200左右", "300左右", "300以上"] }
  ],
  blades: [
    { key: "brand", label: "品牌", color: "blue" },
    { key: "structure", label: "结构", color: "green" },
    { key: "material", label: "材料", color: "rose" },
    { key: "position", label: "打法", color: "amber" },
    { key: "handle", label: "手柄", color: "teal", values: ["横板", "直板", "FL", "ST", "CS"] },
    { key: "speed", label: "速度", color: "slate" },
    { key: "feel", label: "手感", color: "blue" },
    { key: "weight", label: "重量感", color: "green", values: ["偏轻", "常规", "偏重"] },
    { key: "origin", label: "产地", color: "rose" },
    { key: "price", label: "价格带", color: "amber", values: ["100内", "200内", "300左右", "500左右", "800左右", "千元左右", "千元以上"] }
  ],
  boosters: [
    { key: "brand", label: "品牌", color: "blue" },
    { key: "boosterType", label: "类型", color: "green" },
    { key: "effect", label: "主要效果", color: "rose" },
    { key: "drying", label: "晾干速度", color: "amber" },
    { key: "duration", label: "持久时间", color: "teal" },
    { key: "volume", label: "规格", color: "slate" },
    { key: "origin", label: "产地", color: "green" },
    { key: "price", label: "价格带", color: "rose", values: ["50内", "80内", "百元左右", "150左右", "200左右", "300左右"] }
  ]
};

const fuzzyRangeConfig = {
  rubbers: {
    price: {
      "50内": { max: 60 },
      "80内": { min: 45, max: 95 },
      "百元左右": { min: 70, max: 130 },
      "150左右": { min: 120, max: 190 },
      "200左右": { min: 170, max: 250 },
      "300左右": { min: 240, max: 340 },
      "300以上": { min: 280 }
    }
  },
  blades: {
    price: {
      "100内": { max: 120 },
      "200内": { max: 230 },
      "300左右": { min: 220, max: 420 },
      "500左右": { min: 380, max: 650 },
      "800左右": { min: 650, max: 950 },
      "千元左右": { min: 900, max: 1250 },
      "千元以上": { min: 900 }
    },
    weight: {
      "偏轻": { max: 84 },
      "常规": { min: 82, max: 90 },
      "偏重": { min: 88 }
    }
  },
  boosters: {
    price: {
      "50内": { max: 60 },
      "80内": { min: 45, max: 95 },
      "百元左右": { min: 70, max: 130 },
      "150左右": { min: 120, max: 190 },
      "200左右": { min: 170, max: 250 },
      "300左右": { min: 240, max: 360 }
    }
  }
};

const fieldLabels = {
  brand: "品牌",
  position: "位置/打法",
  rubberType: "胶面",
  sponge: "海绵",
  thickness: "厚度",
  hardness: "硬度",
  style: "打法",
  origin: "产地",
  bladeType: "类型",
  structure: "结构",
  material: "材料",
  handle: "手柄",
  speed: "速度",
  feel: "手感",
  weight: "重量",
  boosterType: "类型",
  effect: "主要效果",
  drying: "晾干速度",
  duration: "持久时间",
  volume: "规格"
};

const supabaseConfig = window.SUPABASE_CONFIG || {};
const priceRatingDimension = {
  key: "user_price",
  label: "社区价格",
  low: "0元",
  high: "600元",
  centerLabel: "300元",
  min: 0,
  max: 600,
  step: 10,
  defaultValue: 0,
  format: "price",
  wide: true,
  optionalDb: true
};

const rubberRatingDimensions = [
  { key: "weight", label: "重量", low: "偏轻", high: "偏重" },
  { key: "hardness", label: "硬度", low: "柔软", high: "偏硬" },
  { key: "release", label: "出球", low: "持球", high: "喷弹" },
  { key: "spin", label: "旋转", low: "撞击", high: "旋转" },
  { key: "speed", label: "速度", low: "缓和", high: "快速" },
  { key: "arc", label: "弧线", low: "低平", high: "弧圈" },
  { key: "power", label: "底劲", low: "普通", high: "强劲" },
  { key: "power_threshold", label: "力量门槛", low: "易透", high: "需发力" },
  { key: "control_feel", label: "控制感", low: "敏感", high: "跟手" },
  { key: "defense_borrow", label: "防守借力", low: "普通", high: "容易" },
  { key: "second_bounce", label: "二跳变速", low: "普通", high: "明显", highNote: "前冲、下扎" },
  { key: "topsheet_life", label: "胶面寿命", low: "短", high: "长", lowNote: "易起鳞、氧化" },
  { key: "sponge_life", label: "海绵寿命", low: "短", high: "长", lowNote: "易衰减" },
  priceRatingDimension
];

const bladeRatingDimensions = [
  { key: "weight", label: "重量", low: "轻巧", high: "厚重" },
  { key: "hardness", label: "板身硬度", low: "偏软", high: "偏硬" },
  { key: "deformation", label: "形变感", low: "固定", high: "形变" },
  { key: "speed", label: "出球速度", low: "稳定", high: "快速" },
  { key: "power", label: "底劲", low: "上限一般", high: "后劲充足" },
  { key: "feedback", label: "手感反馈", low: "模糊", high: "清晰" },
  { key: "quick_block", label: "近台快带", low: "平庸", high: "舒适" },
  { key: "power_threshold", label: "发力门槛", low: "容易打透", high: "需要发力" },
  { key: "control_feel", label: "控制感", low: "活跃敏感", high: "稳定跟手" },
  { key: "short_game", label: "台内小球", low: "容易冒高/出台", high: "舒适" },
  { key: "defense", label: "防守", low: "稳定卸力", high: "反弹借力" },
  { key: "balance", label: "重心", low: "靠柄", high: "拍头" },
  priceRatingDimension
];

const boosterRatingDimensions = [
  { key: "softening", label: "软化", low: "弱", high: "强", centerLabel: "2.5", min: 0, max: 5, step: 1, defaultValue: 0, format: "level", optionalDb: true },
  { key: "elasticity_boost", label: "增弹", low: "弱", high: "强", centerLabel: "2.5", min: 0, max: 5, step: 1, defaultValue: 0, format: "level", optionalDb: true },
  { key: "drying_speed", label: "晾干速度", low: "慢", high: "快", centerLabel: "2.5", min: 0, max: 5, step: 1, defaultValue: 0, format: "level", optionalDb: true },
  { key: "duration_score", label: "持久时间", low: "短", high: "长", centerLabel: "2.5", min: 0, max: 5, step: 1, defaultValue: 0, format: "level", optionalDb: true },
  priceRatingDimension
];

const ratingStorageKey = "tt-equipment-ratings";
const clientStorageKey = "tt-equipment-client-id";
const commentIpCacheStorageKey = "tt-equipment-comment-ip-prefix";
const commentEditTokenStorageKey = "tt-equipment-comment-edit-token";
const commentCooldownStorageKey = "tt-equipment-comment-cooldown";
const commentMaxLength = 60;
const commentEditCooldownMs = 60 * 60 * 1000;
const commentPostCooldownMs = 60 * 1000;
const commentsPerPage = 10;
const hotCommentsCount = 3;
const assetVersion = "ratings-26";
const languageStorageKey = "tt-equipment-language";

const englishText = {
  "乒乓器材数据库": "Table Tennis Gear Database",
  "搜索品牌、型号、系列...": "Search brand, model, series...",
  "器材类型": "Equipment type",
  "胶皮": "Rubbers",
  "套胶": "Rubbers",
  "底板": "Blades",
  "膨胀油": "Boosters",
  "筛选条件": "Filters",
  "胶皮筛选": "Rubber Filters",
  "套胶筛选": "Rubber Filters",
  "底板筛选": "Blade Filters",
  "膨胀油筛选": "Booster Filters",
  "同一项目可多选，不同项目会叠加筛选。": "Select multiple tags in one group; different groups narrow results together.",
  "清空筛选": "Clear",
  "排序": "Sort",
  "默认": "Default",
  "价格从低到高": "Price: low to high",
  "价格从高到低": "Price: high to low",
  "名称": "Name",
  "品牌": "Brand",
  "位置": "Position",
  "位置/打法": "Position / style",
  "胶面": "Rubber type",
  "海绵": "Sponge",
  "厚度": "Thickness",
  "硬度": "Hardness",
  "打法": "Style",
  "产地": "Origin",
  "价格带": "Price",
  "结构": "Structure",
  "材料": "Material",
  "手柄": "Handle",
  "横板": "Shakehand",
  "直板": "Penhold",
  "主要效果": "Main effect",
  "晾干速度": "Drying speed",
  "持久时间": "Duration",
  "规格": "Size",
  "速度": "Speed",
  "手感": "Feel",
  "重量感": "Weight feel",
  "类型": "Type",
  "重量": "Weight",
  "板身硬度": "Blade hardness",
  "形变感": "Flex",
  "出球": "Release",
  "出球速度": "Release speed",
  "旋转": "Spin",
  "弧线": "Arc",
  "底劲": "Power reserve",
  "力量门槛": "Power threshold",
  "发力门槛": "Power threshold",
  "控制感": "Control feel",
  "防守借力": "Defensive rebound",
  "二跳变速": "Second-bounce change",
  "胶面寿命": "Top-sheet life",
  "海绵寿命": "Sponge life",
  "社区价格": "Community price",
  "软化": "Softening",
  "增弹": "Elasticity boost",
  "手感反馈": "Feedback",
  "近台快带": "Close-table block",
  "台内小球": "Short game",
  "防守": "Defense",
  "重心": "Balance",
  "偏轻": "Light",
  "偏重": "Heavy",
  "柔软": "Soft",
  "偏硬": "Hard",
  "持球": "Dwell",
  "喷弹": "Bouncy",
  "撞击": "Hit",
  "缓和": "Controlled",
  "快速": "Fast",
  "低平": "Low",
  "弧圈": "Loop arc",
  "普通": "Normal",
  "强劲": "Strong",
  "易透": "Easy to activate",
  "需发力": "Needs power",
  "敏感": "Sensitive",
  "跟手": "Connected",
  "容易": "Easy",
  "明显": "Obvious",
  "短": "Short",
  "长": "Long",
  "弱": "Weak",
  "强": "Strong",
  "慢": "Slow",
  "快": "Fast",
  "轻巧": "Light",
  "厚重": "Heavy",
  "偏软": "Soft",
  "固定": "Stable",
  "形变": "Flexy",
  "稳定": "Stable",
  "上限一般": "Limited ceiling",
  "后劲充足": "Strong reserve",
  "模糊": "Muted",
  "清晰": "Clear",
  "平庸": "Average",
  "舒适": "Comfortable",
  "容易打透": "Easy to activate",
  "需要发力": "Needs power",
  "活跃敏感": "Active / sensitive",
  "稳定跟手": "Stable / connected",
  "容易冒高/出台": "Pops up / long",
  "稳定卸力": "Absorbs pace",
  "反弹借力": "Borrows pace",
  "靠柄": "Handle-heavy",
  "拍头": "Head-heavy",
  "前冲、下扎": "forward kick / dip",
  "易起鳞、氧化": "flakes / oxidizes",
  "易衰减": "decays easily",
  "返回列表": "Back to list",
  "标签信息": "Tags",
  "社区主观体感": "Community Feel",
  "社区评分与体感": "Community Ratings",
  "这些不是好坏分数，而是体感倾向。只选择你有把握的项目，未选择的项目不会进入统计。": "These are community tendencies and ratings. Only rate items you know; skipped items are not counted.",
  "正在读取评分...": "Loading ratings...",
  "暂无": "None",
  "暂无样本": "No samples",
  "添加我的体感评价": "Add My Feel Rating",
  "只勾选你有把握的项目，弃评项不会进入统计。": "Only include items you know; skipped items are not counted.",
  "关闭": "Close",
  "提交 / 更新评分": "Submit / Update Rating",
  "计入": "Include",
  "弃评": "Skip",
  "请至少选择一个体感项目": "Please include at least one feel item",
  "正在提交...": "Submitting...",
  "已保存到在线统计": "Saved to online stats",
  "已保存为本机预览": "Saved as local preview",
  "提交失败，请检查 Supabase 配置": "Submit failed; please check Supabase configuration",
  "已保存，部分新评分需更新数据库后启用": "Saved; some new rating fields need a database upgrade",
  "在线统计读取失败，暂用本机预览": "Online stats failed; using local preview",
  "暂无评分，等第一个人来投": "No ratings yet",
  "在线统计已同步": "Online stats synced",
  "短评": "Short Comments",
  "60 字以内。每个 IP 每个器材保留 1 条，可编辑原评论。": "Up to 60 characters. One comment per IP per item; edit your original comment.",
  "正在读取短评...": "Loading comments...",
  "写一句使用感受": "Write a short impression",
  "发布": "Post",
  "保存": "Save",
  "资料来源": "Sources",
  "资料贡献": "Contributors",
  "暂无短评。": "No comments yet.",
  "热评": "Hot comments",
  "全部短评": "All comments",
  "上一页": "Previous",
  "下一页": "Next",
  "编辑": "Edit",
  "删除": "Delete",
  "访客": "Guest",
  "已顶": " liked",
  "已踩": " disliked",
  "这条短评已超过可编辑时间": "This comment can no longer be edited",
  "正在删除...": "Deleting...",
  "短评已删除": "Comment deleted",
  "删除失败": "Delete failed",
  "投票失败，请稍后再试": "Vote failed; try again later",
  "请先写一句短评": "Please write a short comment first",
  "正在保存...": "Saving...",
  "正在发布...": "Posting...",
  "只能编辑本机原评论": "You can only edit the original comment from this browser",
  "每 1 小时只能编辑 1 次": "You can edit once per hour",
  "短评已更新": "Comment updated",
  "发布太频繁，请稍后再试": "Posting too often; try again later",
  "你已评论过，如有增加信息请编辑原评论": "You already commented; edit your original comment if needed",
  "该 IP 已评论过，请在原浏览器编辑原评论": "This IP has already commented; edit from the original browser",
  "短评已发布": "Comment posted",
  "操作失败，请检查评论表是否已创建": "Action failed; please check whether the comment table exists",
  "暂无短评": "No comments yet",
  "短评表尚未连接": "Comment table not connected",
  "Supabase 未配置": "Supabase not configured",
  "Supabase 未配置，当前为本机预览": "Supabase not configured; local preview only",
  "没有匹配器材，试着减少一两个标签。": "No matching equipment. Try removing one or two tags.",
  "展开更多": "More",
  "收起": "Collapse",
  "待补充": "To be added",
  "参考价格": "Reference price",
  "个结果": "results",
  "条短评": "comments",
  "位用户提交过体感": "users rated feel",
  "编辑于": "edited",
  "搜索：": "Search: ",
  "查看": "View",
  "图片": "image",
  "图片序号": "Image index",
  "50内": "Under 50",
  "80内": "Under 80",
  "100内": "Under 100",
  "200内": "Under 200",
  "百元左右": "Around 100",
  "150左右": "Around 150",
  "200左右": "Around 200",
  "300左右": "Around 300",
  "500左右": "Around 500",
  "800左右": "Around 800",
  "千元左右": "Around 1000",
  "300以上": "300+",
  "千元以上": "1000+",
  "常规": "Regular",
  "打底油": "Priming oil",
  "软化": "Softening",
  "增弹": "Elasticity",
  "持久": "Long-lasting",
  "温和": "Mild",
  "强力": "Strong",
  "训练": "Training",
  "比赛": "Match",
  "慢干": "Slow-drying",
  "中速": "Medium",
  "快干": "Fast-drying",
  "短效": "Short",
  "中效": "Medium",
  "长效": "Long",
  "50ml": "50 ml",
  "60ml": "60 ml",
  "80ml": "80 ml",
  "100ml": "100 ml",
  "150ml": "150 ml",
  "200ml": "200 ml",
  "250ml": "250 ml",
  "中国": "China",
  "日本": "Japan",
  "德国": "Germany",
  "瑞典": "Sweden",
  "韩国": "Korea",
  "法国": "France",
  "美国": "USA",
  "意大利": "Italy"
};

const chineseText = Object.fromEntries(Object.entries(englishText).map(([zh, en]) => [en, zh]));

const state = {
  type: "rubbers",
  data: { rubbers: [], blades: [], boosters: [] },
  selected: {},
  expandedFilters: {},
  search: "",
  sort: "default",
  lang: localStorage.getItem(languageStorageKey) || "zh"
};

const nodes = {
  tabs: document.querySelectorAll(".tab"),
  filterTitle: document.querySelector("#filterTitle"),
  filterGroups: document.querySelector("#filterGroups"),
  productGrid: document.querySelector("#productGrid"),
  resultCount: document.querySelector("#resultCount"),
  resultSuffix: document.querySelector("#resultSuffix"),
  activeFilters: document.querySelector("#activeFilters"),
  clearFilters: document.querySelector("#clearFilters"),
  searchInput: document.querySelector("#searchInput"),
  sortSelect: document.querySelector("#sortSelect"),
  filterHint: document.querySelector("#filterHint"),
  langToggle: document.querySelector("#langToggle"),
  listView: document.querySelector("#listView"),
  detailView: document.querySelector("#detailView")
};

init();

async function init() {
  const response = await fetch(`./data/equipment.json?v=${assetVersion}`);
  state.data = await response.json();
  bindEvents();
  render();
  renderRoute();
}

function bindEvents() {
  nodes.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      state.type = tab.dataset.type;
      state.selected = {};
      history.replaceState(null, "", "#");
      nodes.tabs.forEach((item) => item.classList.toggle("is-active", item === tab));
      render();
      renderRoute();
    });
  });

  nodes.clearFilters.addEventListener("click", () => {
    state.selected = {};
    state.search = "";
    nodes.searchInput.value = "";
    render();
  });

  nodes.searchInput.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    renderProducts();
  });

  nodes.sortSelect.addEventListener("change", (event) => {
    state.sort = event.target.value;
    renderProducts();
  });

  nodes.langToggle?.addEventListener("click", () => {
    state.lang = state.lang === "en" ? "zh" : "en";
    localStorage.setItem(languageStorageKey, state.lang);
    render();
    renderRoute();
  });

  window.addEventListener("hashchange", renderRoute);
}

function render() {
  applyLanguageChrome();
  nodes.filterTitle.textContent = t(getTypeLabel(state.type, "filter"));
  renderFilters();
  renderProducts();
}

function t(text) {
  if (text === null || text === undefined) {
    return "";
  }

  if (state.lang === "en") {
    return englishText[String(text)] || String(text);
  }

  return String(text);
}

function th(text) {
  return escapeHtml(t(text));
}

function applyLanguageChrome() {
  document.documentElement.lang = state.lang === "en" ? "en" : "zh-CN";
  document.title = "Table Tennis Gear Database";
  const title = document.querySelector(".hero h1");
  if (title) {
    title.textContent = t("乒乓器材数据库");
  }

  if (nodes.langToggle) {
    nodes.langToggle.textContent = state.lang === "en" ? "中" : "EN";
    nodes.langToggle.setAttribute("aria-label", state.lang === "en" ? "切换到中文" : "Switch to English");
  }

  nodes.searchInput.placeholder = t("搜索品牌、型号、系列...");
  nodes.filterHint.textContent = t("同一项目可多选，不同项目会叠加筛选。");
  nodes.clearFilters.textContent = t("清空筛选");
  if (nodes.resultSuffix) {
    nodes.resultSuffix.textContent = state.lang === "en" ? ` ${t("个结果")}` : " 个结果";
  }

  nodes.tabs.forEach((tab) => {
    tab.textContent = t(getTypeLabel(tab.dataset.type));
  });

  const sortLabel = document.querySelector(".sort-box span");
  if (sortLabel) {
    sortLabel.textContent = t("排序");
  }

  const sortLabels = {
    default: "默认",
    "price-asc": "价格从低到高",
    "price-desc": "价格从高到低",
    name: "名称"
  };
  [...nodes.sortSelect.options].forEach((option) => {
    option.textContent = t(sortLabels[option.value] || option.textContent);
  });
}

function getTypeLabel(type, variant = "tab") {
  const labels = {
    rubbers: { tab: "套胶", filter: "套胶筛选" },
    blades: { tab: "底板", filter: "底板筛选" },
    boosters: { tab: "膨胀油", filter: "膨胀油筛选" }
  };
  return labels[type]?.[variant] || labels.rubbers[variant];
}

function renderFilters() {
  const groups = filterConfig[state.type];
  nodes.filterGroups.innerHTML = groups.map((group) => {
    const values = group.values || collectValues(group.key);
    const filterId = `${state.type}:${group.key}`;
    const expanded = Boolean(state.expandedFilters[filterId]);
    const expandable = values.length > 8;
    const tags = values.map((value) => {
      const active = state.selected[group.key]?.has(value) ? " is-active" : "";
      return `<button class="tag${active}" data-key="${group.key}" data-value="${escapeHtml(value)}" data-color="${group.color}" type="button">${th(value)}</button>`;
    }).join("");

    return `
      <div class="filter-row${expanded ? " is-expanded" : ""}">
        <div class="filter-label">${th(group.label)}</div>
        <div class="tag-stack">
          <div class="tag-list">${tags}</div>
          ${expandable ? `<button class="filter-more" data-filter-more="${escapeHtml(filterId)}" type="button">${th(expanded ? "收起" : "展开更多")}</button>` : ""}
        </div>
      </div>
    `;
  }).join("");

  nodes.filterGroups.querySelectorAll(".tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      toggleFilter(tag.dataset.key, tag.dataset.value);
      render();
    });
  });

  nodes.filterGroups.querySelectorAll("[data-filter-more]").forEach((button) => {
    button.addEventListener("click", () => {
      const filterId = button.dataset.filterMore;
      state.expandedFilters[filterId] = !state.expandedFilters[filterId];
      renderFilters();
    });
  });

  requestAnimationFrame(updateFilterMoreButtons);
}

function updateFilterMoreButtons() {
  nodes.filterGroups.querySelectorAll(".filter-row").forEach((row) => {
    const tagList = row.querySelector(".tag-list");
    const moreButton = row.querySelector(".filter-more");
    if (!tagList || !moreButton) {
      return;
    }

    const isExpanded = row.classList.contains("is-expanded");
    const hasHiddenTags = tagList.scrollHeight > tagList.clientHeight + 2;
    moreButton.hidden = !isExpanded && !hasHiddenTags;
  });
}

function collectValues(key) {
  const values = new Set();
  state.data[state.type].forEach((item) => {
    (item.tags[key] || []).forEach((value) => values.add(value));
  });
  return [...values].sort((a, b) => a.localeCompare(b, "zh-Hans-CN", { numeric: true }));
}

function toggleFilter(key, value) {
  if (!state.selected[key]) {
    state.selected[key] = new Set();
  }

  if (state.selected[key].has(value)) {
    state.selected[key].delete(value);
  } else {
    state.selected[key].add(value);
  }

  if (state.selected[key].size === 0) {
    delete state.selected[key];
  }
}

function renderProducts() {
  const products = getFilteredProducts();
  nodes.resultCount.textContent = products.length;
  renderActiveFilters();

  if (products.length === 0) {
    nodes.productGrid.innerHTML = `<div class="empty-state">${th("没有匹配器材，试着减少一两个标签。")}</div>`;
    return;
  }

  nodes.productGrid.innerHTML = products.map((product) => {
    const tags = flattenProductTags(product).slice(0, 7).map((tag) => `<span>${th(tag)}</span>`).join("");
    return `
      <a class="product-card" href="#/equipment/${product.id}" aria-label="${th("查看")} ${escapeHtml(product.brand)} ${escapeHtml(product.name)}">
        <div class="product-media">
          <img src="${product.image}" alt="${escapeHtml(product.brand)} ${escapeHtml(product.name)}" loading="lazy">
        </div>
        <div class="product-body">
          <div class="brand-line">${escapeHtml(product.brand)} / ${escapeHtml(product.brandEn || "")} / ${escapeHtml(product.series)}</div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(product.description)}</p>
          <div class="mini-tags">${tags}</div>
        </div>
      </a>
    `;
  }).join("");
}

function renderRoute() {
  const match = location.hash.match(/^#\/equipment\/(.+)$/);
  if (!match) {
    nodes.listView.classList.remove("is-hidden");
    nodes.detailView.classList.add("is-hidden");
    return;
  }

  const product = findProduct(match[1]);
  if (!product) {
    nodes.listView.classList.remove("is-hidden");
    nodes.detailView.classList.add("is-hidden");
    return;
  }

  const nextType = getProductType(product) || "rubbers";
  if (state.type !== nextType) {
    state.type = nextType;
    state.selected = {};
    render();
  }

  nodes.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.type === state.type));
  nodes.listView.classList.add("is-hidden");
  nodes.detailView.classList.remove("is-hidden");
  nodes.detailView.innerHTML = renderDetail(product);
  initRatingPanel(product);
  initCommentsPanel(product);
  requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
}

function renderDetail(product) {
  const ratingDimensions = getRatingDimensions(product);
  const images = getProductImages(product);
  const imageSlides = images.map((image, index) => `
    <figure class="detail-image-slide">
      <img src="${escapeHtml(image)}" alt="${escapeHtml(product.brand)} ${escapeHtml(product.name)} ${th("图片")} ${index + 1}">
    </figure>
  `).join("");
  const imageDots = images.length > 1 ? `
    <div class="detail-image-dots" aria-label="${th("图片序号")}">
      ${images.map((_, index) => `<span>${index + 1}</span>`).join("")}
    </div>
  ` : "";
  const tagRows = Object.entries(product.tags).map(([key, values]) => `
    <div class="detail-tag-row">
      <div class="detail-tag-label">${th(fieldLabels[key] || key)}</div>
      <div class="detail-tag-list">${values.map((value) => `<span>${th(value)}</span>`).join("")}</div>
    </div>
  `).join("");

  const sources = (product.sources || []).map((source) => `<li>${escapeHtml(source)}</li>`).join("");
  const contributors = renderContributors(product.contributors);

  return `
    <a class="back-link" href="#">${th("返回列表")}</a>
    <article class="detail-panel">
      <div class="detail-media">
        <div class="detail-image-strip">
          ${imageSlides}
        </div>
        ${imageDots}
      </div>
      <div class="detail-copy">
        <div class="detail-summary">
          <div class="brand-line">${escapeHtml(product.brand)} / ${escapeHtml(product.brandEn || "")} / ${escapeHtml(product.series)}</div>
          <h2>${escapeHtml(product.name)}</h2>
          <p>${escapeHtml(product.description)}</p>
          <div class="detail-meta-row">
            <span>${th("参考价格")}：${escapeHtml(formatPriceRange(product))}</span>
          </div>
        </div>
        <div class="detail-tags-panel" aria-label="${th("标签信息")}">
          <h3>${th("标签信息")}</h3>
          <div class="detail-tags">${tagRows}</div>
        </div>
      </div>
    </article>

    ${ratingDimensions.length ? `
    <section class="detail-section rating-panel" id="ratingPanel" data-equipment-id="${escapeHtml(product.id)}">
      <div class="section-title-row">
        <div>
          <h3>${th("社区评分与体感")}</h3>
          <p>${th("这些不是好坏分数，而是体感倾向。只选择你有把握的项目，未选择的项目不会进入统计。")}</p>
        </div>
        <span class="rating-status" id="ratingStatus">${th("正在读取评分...")}</span>
      </div>

      <div class="rating-layout">
        <div class="rating-stats" id="ratingStats">
          ${ratingDimensions.map((item) => renderRatingStatRow(item)).join("")}
          <div class="rating-sample-count" id="ratingSampleCount">${th("暂无样本")}</div>
        </div>
      </div>

      <button class="rating-open-button" id="ratingOpenButton" type="button">${th("添加我的体感评价")}</button>
      <div class="rating-editor is-hidden" id="ratingEditor" aria-hidden="true">
        <div class="rating-editor-backdrop" data-rating-close></div>
        <div class="rating-editor-dialog" role="dialog" aria-modal="true" aria-labelledby="ratingEditorTitle">
          <div class="rating-editor-head">
            <div>
              <h4 id="ratingEditorTitle">${th("添加我的体感评价")}</h4>
              <p>${th("只勾选你有把握的项目，弃评项不会进入统计。")}</p>
            </div>
            <button class="rating-close-button" type="button" data-rating-close aria-label="${th("关闭")}">×</button>
          </div>
          <form class="rating-form" id="ratingForm">
            ${ratingDimensions.map((item) => renderRatingInput(item)).join("")}
            <button class="rating-submit" type="submit">${th("提交 / 更新评分")}</button>
          </form>
        </div>
      </div>
    </section>
    ` : ""}

    <section class="detail-section comments-panel" id="commentsPanel" data-equipment-id="${escapeHtml(product.id)}">
      <div class="section-title-row">
        <div>
          <h3>${th("短评")}</h3>
          <p>${th("60 字以内。每个 IP 每个器材保留 1 条，可编辑原评论。")}</p>
        </div>
        <span class="comment-status" id="commentStatus">${th("正在读取短评...")}</span>
      </div>

      <form class="comment-form" id="commentForm">
        <input type="hidden" id="editingCommentId" name="editingCommentId">
        <input type="hidden" id="editingCommentToken" name="editingCommentToken">
        <div class="comment-input-wrap">
          <textarea id="commentContent" name="content" maxlength="${commentMaxLength}" rows="2" placeholder="${th("写一句使用感受")}"></textarea>
          <span id="commentCounter">0/${commentMaxLength}</span>
        </div>
        <button type="submit" id="commentSubmit">${th("发布")}</button>
      </form>

      <div class="hot-comment-list" id="hotCommentList"></div>
      <div class="comment-list" id="commentList"></div>
      <div class="comment-pagination" id="commentPagination"></div>
    </section>

    <section class="detail-section">
      <h3>${th("资料来源")}</h3>
      <ul class="source-list">${sources}</ul>
      ${contributors}
    </section>
  `;
}

function renderContributors(contributors) {
  if (!Array.isArray(contributors) || contributors.length === 0) {
    return "";
  }

  const chips = contributors
    .map((name) => `<span>${escapeHtml(name)}</span>`)
    .join("");
  return `
    <div class="contributor-row">
      <strong>${th("资料贡献")}</strong>
      <div>${chips}</div>
    </div>
  `;
}

function getProductImages(product) {
  const images = Array.isArray(product.images) ? product.images : [];
  const allImages = [product.image, ...images].filter(Boolean);
  return [...new Set(allImages)].slice(0, 5);
}

function renderRatingStatRow(item) {
  return `
    <div class="rating-stat-row${item.wide ? " is-wide" : ""}" data-rating-key="${item.key}">
      <div class="rating-stat-head">
        <strong>${th(item.label)}</strong>
        <span class="rating-stat-score">
          <b data-rating-value>--</b>
          <small data-rating-count>${th("暂无")}</small>
        </span>
      </div>
      <div class="rating-bar" aria-label="${th(item.label)}">
        <span class="rating-bar-fill"></span>
        <span class="rating-bar-marker"></span>
      </div>
      <div class="rating-scale">
        <span>${renderRatingEndpoint(item.low, item.lowNote)}</span>
        <span>${renderRatingEndpoint(item.high, item.highNote, "right")}</span>
      </div>
    </div>
  `;
}

function renderRatingInput(item) {
  const centerValue = item.defaultValue ?? 0;
  const min = item.min ?? -5;
  const max = item.max ?? 5;
  const step = item.step ?? 1;
  const centerLabel = item.centerLabel ?? "0";
  return `
    <div class="rating-input-row${item.wide ? " is-wide" : ""} is-unrated" data-rating-input-row="${item.key}">
      <div class="rating-input-top">
        <span class="rating-input-label">${th(item.label)}</span>
        <button class="rating-toggle" type="button" data-rating-toggle="${item.key}" aria-pressed="false">${th("弃评")}</button>
      </div>
      <div class="rating-input-axis">
        <span class="rating-input-side is-low">${renderRatingEndpoint(item.low, item.lowNote)}</span>
        <span class="rating-input-zero">${escapeHtml(centerLabel)}</span>
        <span class="rating-input-side is-high">${renderRatingEndpoint(item.high, item.highNote, "right")}</span>
      </div>
      <div class="rating-input-control">
        <div class="rating-input-range">
          <input name="${item.key}" type="range" min="${min}" max="${max}" step="${step}" value="${centerValue}">
        </div>
        <strong data-input-value="${item.key}">${formatRatingValue(centerValue, item)}</strong>
      </div>
    </div>
  `;
}

function renderRatingEndpoint(label, note, side = "left") {
  if (!note) {
    return th(label);
  }
  const noteText = `（${note}）`;
  return `${th(label)}<small>${th(noteText)}</small>`;
}

function initRatingPanel(product) {
  const ratingDimensions = getRatingDimensions(product);
  const panel = nodes.detailView.querySelector("#ratingPanel");
  const form = nodes.detailView.querySelector("#ratingForm");
  if (!panel || !form) {
    return;
  }

  const status = panel.querySelector("#ratingStatus");
  const editor = panel.querySelector("#ratingEditor");
  const openButton = panel.querySelector("#ratingOpenButton");
  const savedRating = getSavedLocalRating(product.id);
  const inputs = [...form.querySelectorAll("input[type='range']")];

  const openEditor = () => {
    editor.classList.remove("is-hidden");
    editor.setAttribute("aria-hidden", "false");
  };

  const closeEditor = () => {
    editor.classList.add("is-hidden");
    editor.setAttribute("aria-hidden", "true");
  };

  openButton?.addEventListener("click", openEditor);
  panel.querySelectorAll("[data-rating-close]").forEach((closeTarget) => {
    closeTarget.addEventListener("click", closeEditor);
  });

  inputs.forEach((input) => {
    const hasSavedValue = isScoredValue(savedRating?.[input.name]);
    if (hasSavedValue) {
      input.value = savedRating[input.name];
    }
    updateRatingInputValue(input);
    setRatingInputActive(input.name, hasSavedValue);
    input.addEventListener("input", () => {
      updateRatingInputValue(input);
      setRatingInputActive(input.name, true);
    });
  });

  form.querySelectorAll(".rating-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.ratingToggle;
      const row = form.querySelector(`[data-rating-input-row="${key}"]`);
      setRatingInputActive(key, row?.dataset.rated !== "true");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector(".rating-submit");
    const values = collectRatingFormValues(form, ratingDimensions);
    if (!hasAnyScoredValue(values, ratingDimensions)) {
      status.textContent = t("请至少选择一个体感项目");
      return;
    }
    submit.disabled = true;
    status.textContent = t("正在提交...");

    try {
      const saveResult = await saveRating(product.id, values, ratingDimensions);
      saveLocalRating(product.id, values);
      status.textContent = saveResult?.partial
        ? t("已保存，部分新评分需更新数据库后启用")
        : t(isSupabaseReady() ? "已保存到在线统计" : "已保存为本机预览");
      await refreshRatingStats(product.id);
      closeEditor();
    } catch (error) {
      console.error(error);
      status.textContent = t("提交失败，请检查 Supabase 配置");
    } finally {
      submit.disabled = false;
    }
  });

  refreshRatingStats(product.id);
}

function updateRatingInputValue(input) {
  const output = nodes.detailView.querySelector(`[data-input-value="${input.name}"]`);
  if (output) {
    const product = findProduct(nodes.detailView.querySelector("#ratingPanel")?.dataset.equipmentId);
    const item = getRatingDimensions(product).find((dimension) => dimension.key === input.name);
    output.textContent = formatRatingValue(input.value, item);
  }
}

function setRatingInputActive(key, active) {
  const row = nodes.detailView.querySelector(`[data-rating-input-row="${key}"]`);
  const button = nodes.detailView.querySelector(`[data-rating-toggle="${key}"]`);
  if (!row || !button) {
    return;
  }

  row.dataset.rated = active ? "true" : "false";
  row.classList.toggle("is-unrated", !active);
  button.textContent = t(active ? "计入" : "弃评");
  button.setAttribute("aria-pressed", active ? "true" : "false");
}

function collectRatingFormValues(form, ratingDimensions) {
  return Object.fromEntries(ratingDimensions.map((item) => {
    const input = form.elements[item.key];
    const row = form.querySelector(`[data-rating-input-row="${item.key}"]`);
    return [item.key, row?.dataset.rated === "true" ? Number(input.value) : null];
  }));
}

async function refreshRatingStats(productId) {
  const panel = nodes.detailView.querySelector("#ratingPanel");
  if (!panel) {
    return;
  }

  const status = panel.querySelector("#ratingStatus");
  let rows = [];

  try {
    rows = await fetchRatings(productId);
    renderRatingStats(rows, getRatingDimensions(findProduct(productId)));
  } catch (error) {
    console.error(error);
    const local = getSavedLocalRating(productId);
    rows = local ? [local] : [];
    renderRatingStats(rows, getRatingDimensions(findProduct(productId)));
    status.textContent = t("在线统计读取失败，暂用本机预览");
    return;
  }

  if (rows.length === 0) {
    status.textContent = t(isSupabaseReady() ? "暂无评分，等第一个人来投" : "Supabase 未配置，当前为本机预览");
  } else {
    status.textContent = t(isSupabaseReady() ? "在线统计已同步" : "Supabase 未配置，当前为本机预览");
  }
}

function renderRatingStats(rows, ratingDimensions) {
  const sampleCount = nodes.detailView.querySelector("#ratingSampleCount");
  const activeRows = rows.filter((record) => hasAnyScoredValue(record, ratingDimensions));
  if (sampleCount) {
    sampleCount.textContent = activeRows.length
      ? (state.lang === "en" ? `${activeRows.length} ${t("位用户提交过体感")}` : `${activeRows.length} 位用户提交过体感`)
      : t("暂无样本");
  }

  ratingDimensions.forEach((item) => {
    const row = nodes.detailView.querySelector(`[data-rating-key="${item.key}"]`);
    if (!row) {
      return;
    }

    const value = row.querySelector("[data-rating-value]");
    const count = row.querySelector("[data-rating-count]");
    const fill = row.querySelector(".rating-bar-fill");
    const marker = row.querySelector(".rating-bar-marker");

    const scoredRows = rows.filter((record) => isScoredValue(record[item.key]));

    if (scoredRows.length === 0) {
      value.textContent = "--";
      if (count) {
        count.textContent = t("暂无");
      }
      fill.style.width = "0%";
      marker.style.left = "50%";
      marker.classList.add("is-muted");
      return;
    }

    const average = scoredRows.reduce((sum, record) => sum + Number(record[item.key]), 0) / scoredRows.length;
    const { min, max } = getRatingRange(item);
    const cappedAverage = Math.max(min, Math.min(max, average));
    const percent = getRatingPercent(item, cappedAverage);
    value.textContent = formatRatingValue(cappedAverage, item);
    if (count) {
      count.textContent = state.lang === "en" ? `${scoredRows.length}` : `${scoredRows.length}人`;
    }
    fill.style.width = `${percent}%`;
    marker.style.left = `${percent}%`;
    marker.classList.remove("is-muted");
  });
}

async function fetchRatings(productId) {
  const product = findProduct(productId);
  const ratingDimensions = getRatingDimensions(product);
  if (!isSupabaseReady()) {
    const local = getSavedLocalRating(productId);
    return local ? [local] : [];
  }

  const endpoint = `${getSupabaseBaseUrl()}/${encodeURIComponent(getRatingsTable())}?${buildEquipmentIdFilter(product)}&select=${ratingDimensions.map((item) => item.key).join(",")}`;
  const response = await fetch(endpoint, {
    headers: getSupabaseHeaders()
  });

  if (!response.ok) {
    if (response.status === 400 && ratingDimensions.some((item) => item.optionalDb)) {
      return fetchRatingsWithDimensions(product, ratingDimensions.filter((item) => !item.optionalDb));
    }
    throw new Error(`Supabase select failed: ${response.status}`);
  }

  return response.json();
}

async function fetchRatingsWithDimensions(product, ratingDimensions) {
  if (!ratingDimensions.length) {
    return [];
  }
  const endpoint = `${getSupabaseBaseUrl()}/${encodeURIComponent(getRatingsTable())}?${buildEquipmentIdFilter(product)}&select=${ratingDimensions.map((item) => item.key).join(",")}`;
  const response = await fetch(endpoint, {
    headers: getSupabaseHeaders()
  });
  if (!response.ok) {
    throw new Error(`Supabase fallback select failed: ${response.status}`);
  }
  return response.json();
}

async function saveRating(productId, values, ratingDimensions = []) {
  if (!isSupabaseReady()) {
    saveLocalRating(productId, values);
    return { partial: false };
  }

  const payload = {
    equipment_id: productId,
    client_id: getClientId(),
    ...values,
    updated_at: new Date().toISOString()
  };

  const endpoint = `${getSupabaseBaseUrl()}/${encodeURIComponent(getRatingsTable())}?on_conflict=equipment_id,client_id`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(),
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    if (response.status === 400 && ratingDimensions.some((item) => item.optionalDb)) {
      const fallbackKeys = new Set(ratingDimensions.filter((item) => !item.optionalDb).map((item) => item.key));
      const fallbackValues = Object.fromEntries(Object.entries(values).filter(([key]) => fallbackKeys.has(key)));
      if (Object.keys(fallbackValues).length) {
        await saveRating(productId, fallbackValues, ratingDimensions.filter((item) => !item.optionalDb));
      }
      return { partial: true };
    }
    throw new Error(`Supabase upsert failed: ${response.status}`);
  }
  return { partial: false };
}

function getRatingDimensions(product) {
  if (!product) {
    return [];
  }
  const type = getProductType(product);
  if (type === "rubbers") {
    return rubberRatingDimensions;
  }
  if (type === "blades") {
    return bladeRatingDimensions;
  }
  return type === "boosters" ? boosterRatingDimensions : [];
}

function isScoredValue(value) {
  return value !== null && value !== undefined && value !== "" && Number.isFinite(Number(value));
}

function getRatingRange(item = {}) {
  return {
    min: item.min ?? -5,
    max: item.max ?? 5
  };
}

function getRatingPercent(item, value) {
  const { min, max } = getRatingRange(item);
  if (max === min) {
    return 50;
  }
  return Math.max(0, Math.min(100, ((Number(value) - min) / (max - min)) * 100));
}

function formatRatingValue(value, item = {}) {
  const number = Number(value);
  if (item.format === "price") {
    return `¥${Math.round(number)}`;
  }
  if (item.format === "level") {
    return Number.isInteger(number) ? String(number) : number.toFixed(1);
  }
  if (number > 0) {
    return `+${Number.isInteger(number) ? number : number.toFixed(1)}`;
  }
  if (number < 0) {
    return Number.isInteger(number) ? String(number) : number.toFixed(1);
  }
  return "0";
}

function hasAnyScoredValue(record, ratingDimensions) {
  return ratingDimensions.some((item) => isScoredValue(record?.[item.key]));
}

function isSupabaseReady() {
  return Boolean(supabaseConfig.url && supabaseConfig.anonKey);
}

function getSupabaseBaseUrl() {
  return `${supabaseConfig.url.replace(/\/$/, "")}/rest/v1`;
}

function getRatingsTable() {
  return supabaseConfig.ratingsTable || supabaseConfig.table || "equipment_ratings";
}

function getCommentsTable() {
  return supabaseConfig.commentsTable || "equipment_comments";
}

function getCommentVotesTable() {
  return supabaseConfig.commentVotesTable || "equipment_comment_votes";
}

function getSupabaseHeaders() {
  return {
    apikey: supabaseConfig.anonKey,
    Authorization: `Bearer ${supabaseConfig.anonKey}`
  };
}

function getCommentEditHeaders(editToken = getCommentEditToken()) {
  return {
    ...getSupabaseHeaders(),
    "X-Edit-Token": editToken
  };
}

function getClientId() {
  let clientId = localStorage.getItem(clientStorageKey);
  if (!clientId) {
    clientId = window.crypto?.randomUUID ? window.crypto.randomUUID() : `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(clientStorageKey, clientId);
  }
  return clientId;
}

function getSavedLocalRating(productId) {
  const ratings = readLocalRatings();
  return ratings[productId] || null;
}

function saveLocalRating(productId, values) {
  const ratings = readLocalRatings();
  ratings[productId] = values;
  localStorage.setItem(ratingStorageKey, JSON.stringify(ratings));
}

function readLocalRatings() {
  try {
    return JSON.parse(localStorage.getItem(ratingStorageKey) || "{}");
  } catch {
    return {};
  }
}

function initCommentsPanel(product) {
  const panel = nodes.detailView.querySelector("#commentsPanel");
  const form = nodes.detailView.querySelector("#commentForm");
  if (!panel || !form) {
    return;
  }

  const content = form.elements.content;
  const editingCommentId = form.elements.editingCommentId;
  const editingCommentToken = form.elements.editingCommentToken;
  const counter = panel.querySelector("#commentCounter");
  const submit = panel.querySelector("#commentSubmit");
  const status = panel.querySelector("#commentStatus");

  content.addEventListener("input", () => {
    counter.textContent = `${content.value.length}/${commentMaxLength}`;
  });

  panel.addEventListener("click", async (event) => {
    const action = event.target?.dataset?.commentAction;
    const id = event.target?.dataset?.commentId;
    const page = event.target?.dataset?.commentPage;
    if (page) {
      panel.dataset.page = page;
      refreshComments(product.id);
      return;
    }
    if (!action || !id) {
      return;
    }

    if (action === "edit") {
      const comment = await fetchCommentById(id);
      if (!comment || !canEditComment(comment)) {
        status.textContent = t("这条短评已超过可编辑时间");
        return;
      }
      editingCommentId.value = comment.id;
      editingCommentToken.value = getCommentEditToken();
      content.value = comment.content;
      counter.textContent = `${content.value.length}/${commentMaxLength}`;
      submit.textContent = t("保存");
      content.focus();
      return;
    }

    if (action === "delete") {
      status.textContent = t("正在删除...");
      try {
        await deleteComment(id, getCommentEditToken());
        resetCommentForm(form);
        await refreshComments(product.id);
        status.textContent = t("短评已删除");
      } catch (error) {
        console.error(error);
        status.textContent = t("删除失败");
      }
      return;
    }

    if (action === "vote-up" || action === "vote-down") {
      try {
        const currentVote = Number(event.target.dataset.userVote || "0");
        const nextVote = action === "vote-up" ? 1 : -1;
        if (currentVote === nextVote) {
          await deleteCommentVote(id);
        } else {
          await saveCommentVote(id, nextVote);
        }
        await refreshComments(product.id);
      } catch (error) {
        console.error(error);
        status.textContent = t("投票失败，请稍后再试");
      }
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const cleanContent = content.value.trim();

    if (!cleanContent) {
      status.textContent = t("请先写一句短评");
      return;
    }

    submit.disabled = true;
    status.textContent = t(editingCommentId.value ? "正在保存..." : "正在发布...");

    try {
      if (editingCommentId.value) {
        const target = await fetchCommentById(editingCommentId.value);
        if (!target || !canEditComment(target)) {
          status.textContent = t("只能编辑本机原评论");
          return;
        }
        if (!canEditByCooldown(target)) {
          status.textContent = t("每 1 小时只能编辑 1 次");
          return;
        }
        await updateComment(editingCommentId.value, cleanContent, editingCommentToken.value);
        status.textContent = t("短评已更新");
      } else {
        if (!canPostByCooldown(product.id)) {
          status.textContent = t("发布太频繁，请稍后再试");
          return;
        }
        const ipMeta = await getIpMeta();
        const existingComment = await fetchCommentByIpHash(product.id, ipMeta.hash);
        if (existingComment) {
          if (canEditComment(existingComment)) {
            editingCommentId.value = existingComment.id;
            editingCommentToken.value = getCommentEditToken();
            content.value = existingComment.content;
            counter.textContent = `${content.value.length}/${commentMaxLength}`;
            submit.textContent = t("保存");
            status.textContent = t("你已评论过，如有增加信息请编辑原评论");
          } else {
            status.textContent = t("该 IP 已评论过，请在原浏览器编辑原评论");
          }
          return;
        }
        await saveComment(product.id, ipMeta, cleanContent);
        saveCommentCooldown(product.id);
        status.textContent = t("短评已发布");
      }
      resetCommentForm(form);
      await refreshComments(product.id);
    } catch (error) {
      console.error(error);
      status.textContent = t("操作失败，请检查评论表是否已创建");
    } finally {
      submit.disabled = false;
    }
  });

  refreshComments(product.id);
}

async function refreshComments(productId) {
  const panel = nodes.detailView.querySelector("#commentsPanel");
  if (!panel) {
    return;
  }

  const status = panel.querySelector("#commentStatus");

  try {
    const comments = await fetchComments(productId);
    const commentIds = comments.map((comment) => comment.id);
    const votes = await fetchCommentVotes(commentIds);
    const enrichedComments = enrichCommentsWithVotes(comments, votes);
    renderComments(enrichedComments);
    status.textContent = comments.length
      ? (state.lang === "en" ? `${comments.length} ${t("条短评")}` : `${comments.length} 条短评`)
      : t("暂无短评");
  } catch (error) {
    console.error(error);
    renderComments([]);
    status.textContent = t(isSupabaseReady() ? "短评表尚未连接" : "Supabase 未配置");
  }
}

async function fetchComments(productId) {
  if (!isSupabaseReady()) {
    return [];
  }
  const product = findProduct(productId);

  const query = [
    buildEquipmentIdFilter(product),
    "select=id,client_id,ip_prefix,content,created_at,updated_at,last_edited_at",
    "order=updated_at.desc",
    "limit=200"
  ].join("&");
  const response = await fetch(`${getSupabaseBaseUrl()}/${encodeURIComponent(getCommentsTable())}?${query}`, {
    headers: getSupabaseHeaders()
  });

  if (!response.ok) {
    throw new Error(`Supabase comments select failed: ${response.status}`);
  }

  return response.json();
}

async function fetchCommentById(id) {
  if (!isSupabaseReady()) {
    return null;
  }

  const response = await fetch(`${getSupabaseBaseUrl()}/${encodeURIComponent(getCommentsTable())}?id=eq.${encodeURIComponent(id)}&select=id,client_id,ip_prefix,content,created_at,updated_at,last_edited_at&limit=1`, {
    headers: getSupabaseHeaders()
  });

  if (!response.ok) {
    throw new Error(`Supabase comment select failed: ${response.status}`);
  }

  const comments = await response.json();
  return comments[0] || null;
}

async function fetchCommentByIpHash(productId, ipHash) {
  if (!isSupabaseReady()) {
    return null;
  }
  const product = findProduct(productId);

  const response = await fetch(`${getSupabaseBaseUrl()}/${encodeURIComponent(getCommentsTable())}?${buildEquipmentIdFilter(product)}&ip_hash=eq.${encodeURIComponent(ipHash)}&select=id,client_id,ip_prefix,content,created_at,updated_at,last_edited_at&limit=1`, {
    headers: getSupabaseHeaders()
  });

  if (!response.ok) {
    throw new Error(`Supabase comment by IP select failed: ${response.status}`);
  }

  const comments = await response.json();
  return comments[0] || null;
}

async function saveComment(productId, ipMeta, content) {
  if (!isSupabaseReady()) {
    return;
  }

  const payload = {
    equipment_id: productId,
    client_id: getClientId(),
    edit_token: getCommentEditToken(),
    ip_prefix: ipMeta.prefix,
    ip_hash: ipMeta.hash,
    content: content.slice(0, commentMaxLength)
  };

  const response = await fetch(`${getSupabaseBaseUrl()}/${encodeURIComponent(getCommentsTable())}`, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(),
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("COMMENT_EXISTS");
    }
    throw new Error(`Supabase comments insert failed: ${response.status}`);
  }
}

async function updateComment(id, content, editToken) {
  const now = new Date().toISOString();
  const response = await fetch(`${getSupabaseBaseUrl()}/${encodeURIComponent(getCommentsTable())}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      ...getCommentEditHeaders(editToken),
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      content: content.slice(0, commentMaxLength),
      last_edited_at: now,
      updated_at: now
    })
  });

  if (!response.ok) {
    throw new Error(`Supabase comments update failed: ${response.status}`);
  }
}

async function deleteComment(id, editToken) {
  const response = await fetch(`${getSupabaseBaseUrl()}/${encodeURIComponent(getCommentsTable())}?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: getCommentEditHeaders(editToken)
  });

  if (!response.ok) {
    throw new Error(`Supabase comments delete failed: ${response.status}`);
  }
}

async function saveCommentVote(commentId, vote) {
  const payload = {
    comment_id: commentId,
    client_id: getClientId(),
    vote
  };

  const response = await fetch(`${getSupabaseBaseUrl()}/${encodeURIComponent(getCommentVotesTable())}?on_conflict=comment_id,client_id`, {
    method: "POST",
    headers: {
      ...getSupabaseHeaders(),
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Supabase comment vote failed: ${response.status}`);
  }
}

async function deleteCommentVote(commentId) {
  const response = await fetch(`${getSupabaseBaseUrl()}/${encodeURIComponent(getCommentVotesTable())}?comment_id=eq.${encodeURIComponent(commentId)}&client_id=eq.${encodeURIComponent(getClientId())}`, {
    method: "DELETE",
    headers: getSupabaseHeaders()
  });

  if (!response.ok) {
    throw new Error(`Supabase comment vote delete failed: ${response.status}`);
  }
}

function renderComments(comments) {
  const list = nodes.detailView.querySelector("#commentList");
  const hotList = nodes.detailView.querySelector("#hotCommentList");
  const pagination = nodes.detailView.querySelector("#commentPagination");
  if (!list) {
    return;
  }

  if (comments.length === 0) {
    if (hotList) {
      hotList.innerHTML = "";
    }
    if (pagination) {
      pagination.innerHTML = "";
    }
    list.innerHTML = `<div class="comment-empty">${th("暂无短评。")}</div>`;
    return;
  }

  const panel = nodes.detailView.querySelector("#commentsPanel");
  const currentPage = Number(panel?.dataset.page || "1");
  const hotComments = comments
    .filter((comment) => comment.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, hotCommentsCount);
  const totalPages = Math.max(1, Math.ceil(comments.length / commentsPerPage));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const pagedComments = comments.slice((safePage - 1) * commentsPerPage, safePage * commentsPerPage);

  if (hotList) {
    hotList.innerHTML = hotComments.length ? `
      <div class="hot-comment-title">${th("热评")}</div>
      ${hotComments.map(renderCommentItem).join("")}
    ` : "";
  }

  list.innerHTML = `
    <div class="comment-list-title">${th("全部短评")}</div>
    ${pagedComments.map(renderCommentItem).join("")}
  `;

  if (pagination) {
    pagination.innerHTML = totalPages > 1 ? `
      <button type="button" data-comment-page="${safePage - 1}" ${safePage === 1 ? "disabled" : ""}>${th("上一页")}</button>
      <span>${safePage} / ${totalPages}</span>
      <button type="button" data-comment-page="${safePage + 1}" ${safePage === totalPages ? "disabled" : ""}>${th("下一页")}</button>
    ` : "";
  }
}

function renderCommentItem(comment) {
  const editedText = comment.last_edited_at ? `${t("编辑于")} ${formatCommentDate(comment.last_edited_at)}` : "";
  return `
    <article class="comment-item">
      <div class="comment-meta">
        <strong>${escapeHtml(comment.ip_prefix || t("访客"))}</strong>
        <span>${escapeHtml(formatCommentDate(comment.created_at))}</span>
        ${editedText ? `<span>${escapeHtml(editedText)}</span>` : ""}
        ${canEditComment(comment) ? `
          <button type="button" data-comment-action="edit" data-comment-id="${escapeHtml(comment.id)}">${th("编辑")}</button>
          <button type="button" data-comment-action="delete" data-comment-id="${escapeHtml(comment.id)}">${th("删除")}</button>
        ` : ""}
      </div>
      <p>${escapeHtml(comment.content)}</p>
      <div class="comment-votes">
        <button type="button" data-comment-action="vote-up" data-comment-id="${escapeHtml(comment.id)}" data-user-vote="${comment.userVote}" class="${comment.userVote === 1 ? "is-voted" : ""}">👍 ${comment.upCount}${comment.userVote === 1 ? th("已顶") : ""}</button>
        <button type="button" data-comment-action="vote-down" data-comment-id="${escapeHtml(comment.id)}" data-user-vote="${comment.userVote}" class="${comment.userVote === -1 ? "is-voted" : ""}">👎 ${comment.downCount}${comment.userVote === -1 ? th("已踩") : ""}</button>
      </div>
    </article>
  `;
}

function canEditComment(comment) {
  return comment.client_id && comment.client_id === getClientId();
}

function canEditByCooldown(comment) {
  if (!comment.last_edited_at) {
    return true;
  }
  return Date.now() - new Date(comment.last_edited_at).getTime() >= commentEditCooldownMs;
}

function formatCommentDate(value) {
  if (!value) {
    return "";
  }
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function resetCommentForm(form) {
  form.elements.editingCommentId.value = "";
  form.elements.editingCommentToken.value = "";
  form.elements.content.value = "";
  form.querySelector("#commentCounter").textContent = `0/${commentMaxLength}`;
  form.querySelector("#commentSubmit").textContent = t("发布");
}

async function getIpMeta() {
  const cached = readIpPrefixCache();
  if (cached?.prefix && cached?.hash && Date.now() - cached.createdAt < 24 * 60 * 60 * 1000) {
    return cached;
  }

  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    const prefix = formatIpPrefix(data.ip);
    const hash = await sha256Hex(data.ip || getClientId());
    const value = { prefix, hash, createdAt: Date.now() };
    localStorage.setItem(commentIpCacheStorageKey, JSON.stringify(value));
    return value;
  } catch {
    return { prefix: t("访客"), hash: await sha256Hex(getClientId()), createdAt: Date.now() };
  }
}

function readIpPrefixCache() {
  try {
    return JSON.parse(localStorage.getItem(commentIpCacheStorageKey) || "{}");
  } catch {
    return {};
  }
}

function formatIpPrefix(ip) {
  if (!ip) {
    return t("访客");
  }
  if (ip.includes(":")) {
    return `${ip.split(":").slice(0, 2).join(":")}:*`;
  }
  const parts = ip.split(".");
  if (parts.length >= 2) {
    return `${parts[0]}.${parts[1]}.*`;
  }
  return t("访客");
}

function getCommentEditToken() {
  let token = localStorage.getItem(commentEditTokenStorageKey);
  if (!token) {
    token = window.crypto?.randomUUID ? window.crypto.randomUUID() : `edit-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(commentEditTokenStorageKey, token);
  }
  return token;
}

function getCommentCooldowns() {
  try {
    return JSON.parse(localStorage.getItem(commentCooldownStorageKey) || "{}");
  } catch {
    return {};
  }
}

function canPostByCooldown(productId) {
  const cooldowns = getCommentCooldowns();
  return !cooldowns[productId] || Date.now() - cooldowns[productId] >= commentPostCooldownMs;
}

function saveCommentCooldown(productId) {
  const cooldowns = getCommentCooldowns();
  cooldowns[productId] = Date.now();
  localStorage.setItem(commentCooldownStorageKey, JSON.stringify(cooldowns));
}

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function fetchCommentVotes(commentIds) {
  if (!isSupabaseReady() || commentIds.length === 0) {
    return [];
  }
  const ids = commentIds.join(",");
  const response = await fetch(`${getSupabaseBaseUrl()}/${encodeURIComponent(getCommentVotesTable())}?comment_id=in.(${ids})&select=comment_id,client_id,vote`, {
    headers: getSupabaseHeaders()
  });
  if (!response.ok) {
    return [];
  }
  return response.json();
}

function enrichCommentsWithVotes(comments, votes) {
  return comments.map((comment) => {
    const commentVotes = votes.filter((vote) => vote.comment_id === comment.id);
    const upCount = commentVotes.filter((vote) => vote.vote === 1).length;
    const downCount = commentVotes.filter((vote) => vote.vote === -1).length;
    const userVote = commentVotes.find((vote) => vote.client_id === getClientId())?.vote || 0;
    return {
      ...comment,
      upCount,
      downCount,
      userVote,
      score: upCount - downCount
    };
  });
}

function findProduct(id) {
  return getAllProducts().find((item) => item.id === id || (item.legacyIds || []).includes(id));
}

function getAllProducts() {
  return [...state.data.rubbers, ...state.data.blades, ...(state.data.boosters || [])];
}

function getProductType(product) {
  if (!product) {
    return "";
  }
  return ["rubbers", "blades", "boosters"].find((type) =>
    (state.data[type] || []).some((item) => item.id === product.id)
  ) || "";
}

function getProductIds(product) {
  if (!product) {
    return [];
  }
  return [product.id, ...(product.legacyIds || [])].filter(Boolean);
}

function buildEquipmentIdFilter(product) {
  const ids = getProductIds(product);
  if (ids.length <= 1) {
    return `equipment_id=eq.${encodeURIComponent(ids[0] || "")}`;
  }
  return `equipment_id=in.(${ids.map((id) => encodeURIComponent(id)).join(",")})`;
}

function getFilteredProducts() {
  const filtered = state.data[state.type].filter((product) => {
    const searchable = [
      product.brand,
      product.brandEn,
      product.name,
      product.series,
      product.description,
      flattenProductTags(product).join(" ")
    ].join(" ").toLowerCase();

    if (state.search && !searchable.includes(state.search)) {
      return false;
    }

    return Object.entries(state.selected).every(([key, selectedValues]) => {
      if (key === "price") {
        return [...selectedValues].some((range) => productPriceMatches(product, range));
      }

      if (key === "weight" && state.type === "blades") {
        return [...selectedValues].some((range) => weightMatches(product.tags.weight || [], range));
      }

      const productValues = product.tags[key] || [];
      return [...selectedValues].some((value) => productValues.includes(value));
    });
  });

  return sortProducts(filtered);
}

function sortProducts(products) {
  const copy = [...products];
  if (state.sort === "price-asc") {
    return copy.sort((a, b) => getPriceMidpoint(a) - getPriceMidpoint(b));
  }
  if (state.sort === "price-desc") {
    return copy.sort((a, b) => getPriceMidpoint(b) - getPriceMidpoint(a));
  }
  if (state.sort === "name") {
    return copy.sort((a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"));
  }
  return copy;
}

function priceMatches(price, range) {
  return rangesOverlap(getPriceRange({ price }), fuzzyRangeConfig[state.type]?.price?.[range]);
}

function productPriceMatches(product, range) {
  return rangesOverlap(getPriceRange(product), fuzzyRangeConfig[state.type]?.price?.[range]);
}

function getPriceRange(product) {
  const min = Number(product.priceMin ?? product.price_min);
  const max = Number(product.priceMax ?? product.price_max);
  if (Number.isFinite(min) && Number.isFinite(max)) {
    return { min: Math.min(min, max), max: Math.max(min, max) };
  }
  if (Number.isFinite(min)) {
    return { min, max: min };
  }
  if (Number.isFinite(max)) {
    return { min: max, max };
  }

  const price = Number(product.price);
  if (!Number.isFinite(price)) {
    return null;
  }

  const margin = getEstimatedPriceMargin(price);
  return {
    min: Math.max(0, Math.round((price - margin) / 5) * 5),
    max: Math.round((price + margin) / 5) * 5
  };
}

function getEstimatedPriceMargin(price) {
  if (price <= 60) {
    return 10;
  }
  if (price <= 120) {
    return 15;
  }
  if (price <= 250) {
    return 25;
  }
  if (price <= 600) {
    return 45;
  }
  if (price <= 1200) {
    return 90;
  }
  return 160;
}

function getPriceMidpoint(product) {
  const range = getPriceRange(product);
  if (!range) {
    return Number.POSITIVE_INFINITY;
  }
  return ((range.min ?? 0) + (range.max ?? range.min ?? 0)) / 2;
}

function formatPriceRange(product) {
  const range = getPriceRange(product);
  const currency = product.currency || "CNY";
  if (!range) {
    return t("待补充");
  }
  if (range.min === range.max) {
    return `¥${range.min} ${currency}`;
  }
  return `¥${range.min}-${range.max} ${currency}`;
}

function weightMatches(weightTags, range) {
  const selectedRange = fuzzyRangeConfig.blades.weight[range];
  return weightTags.some((tag) => rangesOverlap(parseWeightTag(tag), selectedRange));
}

function valueInRange(value, range) {
  if (!range || !Number.isFinite(Number(value))) {
    return false;
  }
  const number = Number(value);
  const min = range.min ?? -Infinity;
  const max = range.max ?? Infinity;
  return number >= min && number <= max;
}

function rangesOverlap(left, right) {
  if (!left || !right) {
    return false;
  }
  const leftMin = left.min ?? -Infinity;
  const leftMax = left.max ?? Infinity;
  const rightMin = right.min ?? -Infinity;
  const rightMax = right.max ?? Infinity;
  return leftMin <= rightMax && rightMin <= leftMax;
}

function parseWeightTag(tag) {
  const numbers = String(tag).match(/\d+/g)?.map(Number) || [];
  if (String(tag).includes("以下") && numbers.length) {
    return { max: numbers[0] };
  }
  if (String(tag).includes("以上") && numbers.length) {
    return { min: numbers[0] };
  }
  if (numbers.length >= 2) {
    return { min: numbers[0], max: numbers[1] };
  }
  if (numbers.length === 1) {
    return { min: numbers[0] - 2, max: numbers[0] + 2 };
  }
  return null;
}

function renderActiveFilters() {
  const chips = [];
  const labels = new Map(filterConfig[state.type].map((group) => [group.key, group.label]));

  Object.entries(state.selected).forEach(([key, values]) => {
    values.forEach((value) => chips.push(`${t(labels.get(key))}：${t(value)}`));
  });

  if (state.search) {
    chips.push(`${t("搜索：")}${state.search}`);
  }

  nodes.activeFilters.innerHTML = chips.map((chip) => `<span class="active-chip">${escapeHtml(chip)}</span>`).join("");
}

function flattenProductTags(product) {
  return Object.values(product.tags).flat();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
