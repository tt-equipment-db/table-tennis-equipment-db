const filterConfig = {
  rubbers: [
    { key: "brand", label: "品牌", color: "blue" },
    { key: "position", label: "位置", color: "green" },
    { key: "rubberType", label: "胶面", color: "rose" },
    { key: "sponge", label: "海绵", color: "amber" },
    { key: "thickness", label: "厚度", color: "teal" },
    { key: "hardness", label: "硬度", color: "slate" },
    { key: "style", label: "打法", color: "blue" },
    { key: "origin", label: "产地", color: "green" },
    { key: "price", label: "价格", color: "rose", values: ["80以下", "80-100", "100-200", "200-300", "300以上"] }
  ],
  blades: [
    { key: "brand", label: "品牌", color: "blue" },
    { key: "structure", label: "结构", color: "green" },
    { key: "material", label: "材料", color: "rose" },
    { key: "position", label: "打法", color: "amber" },
    { key: "handle", label: "手柄", color: "teal" },
    { key: "speed", label: "速度", color: "slate" },
    { key: "feel", label: "手感", color: "blue" },
    { key: "weight", label: "重量", color: "green" },
    { key: "origin", label: "产地", color: "rose" },
    { key: "price", label: "价格", color: "amber", values: ["300以下", "300-600", "600-900", "900以上"] }
  ]
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
  structure: "结构",
  material: "材料",
  handle: "手柄",
  speed: "速度",
  feel: "手感",
  weight: "重量"
};

const state = {
  type: "rubbers",
  data: { rubbers: [], blades: [] },
  selected: {},
  search: "",
  sort: "default"
};

const nodes = {
  tabs: document.querySelectorAll(".tab"),
  filterTitle: document.querySelector("#filterTitle"),
  filterGroups: document.querySelector("#filterGroups"),
  productGrid: document.querySelector("#productGrid"),
  resultCount: document.querySelector("#resultCount"),
  activeFilters: document.querySelector("#activeFilters"),
  clearFilters: document.querySelector("#clearFilters"),
  searchInput: document.querySelector("#searchInput"),
  sortSelect: document.querySelector("#sortSelect"),
  listView: document.querySelector("#listView"),
  detailView: document.querySelector("#detailView")
};

init();

async function init() {
  const response = await fetch("./data/equipment.json");
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

  window.addEventListener("hashchange", renderRoute);
}

function render() {
  nodes.filterTitle.textContent = state.type === "rubbers" ? "胶皮筛选" : "底板筛选";
  renderFilters();
  renderProducts();
}

function renderFilters() {
  const groups = filterConfig[state.type];
  nodes.filterGroups.innerHTML = groups.map((group) => {
    const values = group.values || collectValues(group.key);
    const tags = values.map((value) => {
      const active = state.selected[group.key]?.has(value) ? " is-active" : "";
      return `<button class="tag${active}" data-key="${group.key}" data-value="${escapeHtml(value)}" data-color="${group.color}" type="button">${escapeHtml(value)}</button>`;
    }).join("");

    return `
      <div class="filter-row">
        <div class="filter-label">${group.label}</div>
        <div class="tag-list">${tags}</div>
      </div>
    `;
  }).join("");

  nodes.filterGroups.querySelectorAll(".tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      toggleFilter(tag.dataset.key, tag.dataset.value);
      render();
    });
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
    nodes.productGrid.innerHTML = `<div class="empty-state">没有匹配器材，试着减少一两个标签。</div>`;
    return;
  }

  nodes.productGrid.innerHTML = products.map((product) => {
    const tags = flattenProductTags(product).slice(0, 7).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
    return `
      <a class="product-card" href="#/equipment/${product.id}" aria-label="查看 ${escapeHtml(product.brand)} ${escapeHtml(product.name)}">
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

  const nextType = state.data.rubbers.some((item) => item.id === product.id) ? "rubbers" : "blades";
  if (state.type !== nextType) {
    state.type = nextType;
    state.selected = {};
    render();
  }
  nodes.tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.type === state.type));
  nodes.listView.classList.add("is-hidden");
  nodes.detailView.classList.remove("is-hidden");
  nodes.detailView.innerHTML = renderDetail(product);

  const textarea = nodes.detailView.querySelector("#commentText");
  const counter = nodes.detailView.querySelector("#commentCounter");
  if (textarea && counter) {
    textarea.addEventListener("input", () => {
      counter.textContent = `${textarea.value.length}/60`;
    });
  }
}

function renderDetail(product) {
  const tagRows = Object.entries(product.tags).map(([key, values]) => `
    <div class="detail-tag-row">
      <div class="detail-tag-label">${escapeHtml(fieldLabels[key] || key)}</div>
      <div class="detail-tag-list">${values.map((value) => `<span>${escapeHtml(value)}</span>`).join("")}</div>
    </div>
  `).join("");

  const sources = (product.sources || []).map((source) => `<li>${escapeHtml(source)}</li>`).join("");

  return `
    <a class="back-link" href="#">返回列表</a>
    <article class="detail-panel">
      <div class="detail-media">
        <img src="${product.image}" alt="${escapeHtml(product.brand)} ${escapeHtml(product.name)}">
      </div>
      <div class="detail-copy">
        <div class="brand-line">${escapeHtml(product.brand)} / ${escapeHtml(product.brandEn || "")} / ${escapeHtml(product.series)}</div>
        <h2>${escapeHtml(product.name)}</h2>
        <p>${escapeHtml(product.description)}</p>
        <div class="detail-price">参考价格：¥${escapeHtml(product.price)} ${escapeHtml(product.currency || "CNY")}</div>
      </div>
    </article>

    <section class="detail-section">
      <h3>标签信息</h3>
      <div class="detail-tags">${tagRows}</div>
    </section>

    <section class="detail-section">
      <h3>资料来源</h3>
      <ul class="source-list">${sources}</ul>
    </section>

    <section class="detail-section comments-panel">
      <h3>评论区</h3>
      <p>静态 GitHub Pages 不能直接判断 GitHub 登录并保存评论。后续可以接入 Giscus 或 Utterances，让 GitHub 登录用户用 Issues/Discussions 评论；如果必须限制 60 字，需要再加一个小后端或 GitHub App。</p>
      <label class="comment-box">
        <span>60 字短评草稿</span>
        <textarea id="commentText" maxlength="60" placeholder="这里先做交互占位，暂不会提交到 GitHub。"></textarea>
      </label>
      <div class="comment-actions">
        <span id="commentCounter">0/60</span>
        <button class="ghost-button" type="button" disabled>待接入 GitHub 登录</button>
      </div>
    </section>
  `;
}

function findProduct(id) {
  return [...state.data.rubbers, ...state.data.blades].find((item) => item.id === id);
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
        return [...selectedValues].some((range) => priceMatches(product.price, range));
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
    return copy.sort((a, b) => a.price - b.price);
  }
  if (state.sort === "price-desc") {
    return copy.sort((a, b) => b.price - a.price);
  }
  if (state.sort === "name") {
    return copy.sort((a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"));
  }
  return copy;
}

function priceMatches(price, range) {
  const rules = {
    "80以下": price < 80,
    "80-100": price >= 80 && price <= 100,
    "100-200": price >= 100 && price <= 200,
    "200-300": price >= 200 && price <= 300,
    "300以上": price >= 300,
    "300以下": price < 300,
    "300-600": price >= 300 && price <= 600,
    "600-900": price >= 600 && price <= 900,
    "900以上": price >= 900
  };
  return Boolean(rules[range]);
}

function renderActiveFilters() {
  const chips = [];
  const labels = new Map(filterConfig[state.type].map((group) => [group.key, group.label]));

  Object.entries(state.selected).forEach(([key, values]) => {
    values.forEach((value) => chips.push(`${labels.get(key)}：${value}`));
  });

  if (state.search) {
    chips.push(`搜索：${state.search}`);
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
