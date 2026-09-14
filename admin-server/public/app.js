const state = {
  products: [],
  categories: [],
  currentSlug: null, // null = yeni ürün formu değil; "" özel değer new için kullanılmaz
  isNew: false,
  images: [], // düzenlenen ürünün güncel görsel dizisi
};

const el = (id) => document.getElementById(id);

async function api(path, options) {
  const res = await fetch(`/api${path}`, {
    headers: options && options.body && !(options.body instanceof FormData)
      ? { "Content-Type": "application/json" }
      : undefined,
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `İstek başarısız (${res.status})`);
  return data;
}

function toast(message, ms = 3000) {
  const t = el("toast");
  t.textContent = message;
  t.hidden = false;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { t.hidden = true; }, ms);
}

function showView(name) {
  el("listView").hidden = name !== "list";
  el("editView").hidden = name !== "edit";
}

// ---------- Liste görünümü ----------

function categoryName(slug) {
  const c = state.categories.find((c) => c.slug === slug);
  return c ? c.name : slug;
}

function renderCategoryFilter() {
  const sel = el("categoryFilter");
  sel.innerHTML = '<option value="">Tüm Kategoriler</option>' +
    state.categories.map((c) => `<option value="${c.slug}">${c.name}</option>`).join("");
}

function filteredProducts() {
  const q = el("searchInput").value.trim().toLocaleLowerCase("tr-TR");
  const cat = el("categoryFilter").value;
  const status = el("statusFilter").value;
  return state.products.filter((p) => {
    if (cat && p.category !== cat) return false;
    if (status && p.status !== status) return false;
    if (q && !p.name.toLocaleLowerCase("tr-TR").includes(q)) return false;
    return true;
  });
}

function renderList() {
  const items = filteredProducts();
  el("resultCount").textContent = `${items.length} ürün`;
  const grid = el("productGrid");
  grid.innerHTML = items.map((p) => {
    const img = p.coverImage
      ? `<img src="${p.coverImage.src}" alt="" loading="lazy" />`
      : `<span class="no-image">Görsel yok</span>`;
    return `
      <div class="product-card" data-slug="${p.slug}">
        <div class="product-thumb">${img}</div>
        <div class="product-body">
          <div class="product-cat">${categoryName(p.category)}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-meta">
            <span>${p.productCode || ""}</span>
            <span class="status-badge status-${p.status}">${statusLabel(p.status)}</span>
          </div>
        </div>
      </div>`;
  }).join("");

  grid.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("click", () => openEdit(card.dataset.slug));
  });
}

function statusLabel(s) {
  return { active: "Yayında", draft: "Taslak", archived: "Arşivlendi" }[s] || s;
}

// ---------- Düzenleme görünümü ----------

function populateCategorySelect(value) {
  const sel = el("f_category");
  sel.innerHTML = state.categories.map((c) => `<option value="${c.slug}">${c.name}</option>`).join("");
  sel.value = value || state.categories[0]?.slug || "";
}

function populateSubcategorySelect(categorySlug, value) {
  const sel = el("f_subcategory");
  const cat = state.categories.find((c) => c.slug === categorySlug);
  const subs = cat ? cat.subcategories : [];
  sel.innerHTML = '<option value="">— Yok —</option>' +
    subs.map((s) => `<option value="${s.slug}">${s.name}</option>`).join("");
  sel.value = value || "";
}

function toCsv(arr) {
  return (arr || []).join(", ");
}
function fromCsv(str) {
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

function fillForm(product) {
  el("editTitle").textContent = state.isNew ? "Yeni Ürün" : `Düzenle: ${product.name}`;
  el("f_name").value = product.name || "";
  el("f_slug").value = product.slug || "";
  el("f_slug").disabled = !state.isNew;
  populateCategorySelect(product.category);
  populateSubcategorySelect(product.category, product.subcategory);
  el("f_collection").value = product.collection || "";
  el("f_productCode").value = product.productCode || "";
  el("f_shortDescription").value = product.shortDescription || "";
  el("f_description").value = product.description || "";
  el("f_price").value = product.price ?? "";
  el("f_oldPrice").value = product.oldPrice ?? "";
  el("f_campaignLabel").value = product.campaignLabel || "";
  el("f_colors").value = toCsv(product.colors);
  el("f_dimensions").value = product.dimensions || "";
  el("f_materials").value = toCsv(product.materials);
  el("f_setContents").value = toCsv(product.setContents);
  el("f_optionalParts").value = toCsv(product.optionalParts);
  el("f_features").value = toCsv(product.features);
  el("f_careNotes").value = toCsv(product.careNotes);
  el("f_deliveryInfo").value = product.deliveryInfo || "";
  el("f_featured").checked = Boolean(product.featured);
  el("f_campaign").checked = Boolean(product.campaign);
  el("f_status").value = product.status || "active";
  el("f_seoTitle").value = product.seoTitle || "";
  el("f_seoDescription").value = product.seoDescription || "";

  state.images = product.images || [];
  renderImageGrid();

  el("deleteProductBtn").hidden = state.isNew;
  el("formStatus").hidden = true;
}

function renderImageGrid() {
  const grid = el("imageGrid");
  if (state.isNew) {
    grid.innerHTML = `<p class="hint">Görsel eklemek için önce ürünü kaydedin.</p>`;
    return;
  }
  grid.innerHTML = state.images.map((img, i) => `
    <div class="image-tile ${i === 0 ? "is-cover" : ""}">
      <img src="${img.src}" alt="${img.alt || ""}" />
      <div class="tile-actions">
        <div>
          ${i > 0 ? `<button class="tile-btn" data-action="left" data-index="${i}" title="Sola taşı">←</button>` : ""}
          ${i < state.images.length - 1 ? `<button class="tile-btn" data-action="right" data-index="${i}" title="Sağa taşı">→</button>` : ""}
        </div>
        <button class="tile-btn" data-action="delete" data-index="${i}" title="Sil">✕</button>
      </div>
      ${i === 0 ? '<span class="tile-cover-badge">Kapak</span>' : ""}
    </div>
  `).join("");

  grid.querySelectorAll(".tile-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index, 10);
      const action = btn.dataset.action;
      if (action === "delete") deleteImage(index);
      if (action === "left") reorderImage(index, index - 1);
      if (action === "right") reorderImage(index, index + 1);
    });
  });
}

async function reorderImage(from, to) {
  const order = state.images.map((_, i) => i);
  const [moved] = order.splice(from, 1);
  order.splice(to, 0, moved);
  try {
    const updated = await api(`/products/${state.currentSlug}/images/reorder`, {
      method: "POST",
      body: JSON.stringify({ order }),
    });
    state.images = updated.images;
    renderImageGrid();
  } catch (e) {
    toast(e.message);
  }
}

async function deleteImage(index) {
  if (!confirm("Bu görseli silmek istediğinize emin misiniz?")) return;
  try {
    const updated = await api(`/products/${state.currentSlug}/images`, {
      method: "DELETE",
      body: JSON.stringify({ index }),
    });
    state.images = updated.images;
    renderImageGrid();
    toast("Görsel silindi.");
  } catch (e) {
    toast(e.message);
  }
}

async function uploadImages(fileList) {
  if (!fileList || fileList.length === 0) return;
  const formData = new FormData();
  for (const file of fileList) formData.append("images", file);
  el("uploadStatus").textContent = "Yükleniyor ve optimize ediliyor...";
  try {
    const updated = await api(`/products/${state.currentSlug}/images`, {
      method: "POST",
      body: formData,
    });
    state.images = updated.images;
    renderImageGrid();
    el("uploadStatus").textContent = `${fileList.length} görsel eklendi.`;
    toast("Görseller eklendi.");
  } catch (e) {
    el("uploadStatus").textContent = "";
    toast(e.message);
  }
}

function collectFormData() {
  return {
    name: el("f_name").value.trim(),
    slug: el("f_slug").value.trim(),
    category: el("f_category").value,
    subcategory: el("f_subcategory").value || null,
    collection: el("f_collection").value.trim() || null,
    productCode: el("f_productCode").value.trim(),
    shortDescription: el("f_shortDescription").value.trim(),
    description: el("f_description").value.trim(),
    price: el("f_price").value === "" ? null : Number(el("f_price").value),
    oldPrice: el("f_oldPrice").value === "" ? null : Number(el("f_oldPrice").value),
    campaignLabel: el("f_campaignLabel").value.trim() || null,
    colors: fromCsv(el("f_colors").value),
    dimensions: el("f_dimensions").value.trim() || null,
    materials: fromCsv(el("f_materials").value),
    setContents: fromCsv(el("f_setContents").value),
    optionalParts: fromCsv(el("f_optionalParts").value),
    features: fromCsv(el("f_features").value),
    careNotes: fromCsv(el("f_careNotes").value),
    deliveryInfo: el("f_deliveryInfo").value.trim() || null,
    featured: el("f_featured").checked,
    campaign: el("f_campaign").checked,
    status: el("f_status").value,
    seoTitle: el("f_seoTitle").value.trim(),
    seoDescription: el("f_seoDescription").value.trim(),
  };
}

function showFormStatus(message, isError) {
  const box = el("formStatus");
  box.hidden = false;
  box.textContent = message;
  box.className = `form-status ${isError ? "error" : "success"}`;
}

async function openEdit(slug) {
  state.isNew = !slug;
  state.currentSlug = slug || null;

  if (state.isNew) {
    fillForm({ status: "active", category: state.categories[0]?.slug });
  } else {
    const product = await api(`/products/${slug}`);
    fillForm(product);
  }
  showView("edit");
}

async function saveProduct() {
  const data = collectFormData();
  if (!data.name || !data.category) {
    showFormStatus("Ürün adı ve kategori zorunludur.", true);
    return;
  }

  try {
    if (state.isNew) {
      const created = await api("/products", { method: "POST", body: JSON.stringify(data) });
      await refreshProducts();
      state.isNew = false;
      state.currentSlug = created.slug;
      fillForm(created);
      showFormStatus("Ürün oluşturuldu. Şimdi görsel ekleyebilirsiniz.");
    } else {
      const { slug, ...editable } = data;
      const updated = await api(`/products/${state.currentSlug}`, {
        method: "PUT",
        body: JSON.stringify(editable),
      });
      await refreshProducts();
      fillForm(updated);
      showFormStatus("Değişiklikler kaydedildi.");
    }
  } catch (e) {
    showFormStatus(e.message, true);
  }
}

async function deleteProduct() {
  const withImages = confirm(
    "Bu ürünü silmek istediğinize emin misiniz?\n\nGörsel dosyalarını da silmek için Tamam'a, yalnızca ürün kaydını silmek için ise önce İptal'e basıp tekrar deneyin."
  );
  if (!withImages) return;
  try {
    await api(`/products/${state.currentSlug}?deleteImages=true`, { method: "DELETE" });
    await refreshProducts();
    toast("Ürün silindi.");
    showView("list");
    renderList();
  } catch (e) {
    toast(e.message);
  }
}

async function refreshProducts() {
  state.products = await api("/products");
}

// ---------- Yayınlama ----------

async function publish() {
  const btn = el("publishBtn");
  btn.disabled = true;
  btn.textContent = "Build alınıyor... (bu biraz sürebilir)";

  let logPanel = document.getElementById("buildLogPanel");
  if (!logPanel) {
    logPanel = document.createElement("div");
    logPanel.id = "buildLogPanel";
    logPanel.className = "build-log";
    document.querySelector("main").prepend(logPanel);
  }
  logPanel.hidden = false;
  logPanel.textContent = "Build başlatıldı...\n";

  try {
    const result = await api("/build", { method: "POST" });
    logPanel.textContent = result.log || "";
    toast(`Yayınlandı → ${result.httpdocsPath}`, 5000);
  } catch (e) {
    logPanel.textContent += `\nHATA: ${e.message}`;
    toast("Yayınlama başarısız oldu, günlüğe bakın.", 5000);
  } finally {
    btn.disabled = false;
    btn.textContent = "Yayınla (Build + httpdocs)";
  }
}

// ---------- Başlangıç ----------

async function init() {
  const [categories, products, config] = await Promise.all([
    api("/categories"),
    api("/products"),
    api("/config"),
  ]);
  state.categories = categories;
  state.products = products;
  el("configInfo").textContent = `httpdocs: ${config.httpdocsPath}`;

  renderCategoryFilter();
  renderList();

  el("searchInput").addEventListener("input", renderList);
  el("categoryFilter").addEventListener("change", renderList);
  el("statusFilter").addEventListener("change", renderList);
  el("newProductBtn").addEventListener("click", () => openEdit(null));
  el("backBtn").addEventListener("click", () => { showView("list"); renderList(); });
  el("saveProductBtn").addEventListener("click", saveProduct);
  el("deleteProductBtn").addEventListener("click", deleteProduct);
  el("publishBtn").addEventListener("click", () => {
    if (confirm("Site yeniden derlenip httpdocs klasörünün mevcut içeriği değiştirilecek. Devam edilsin mi?")) {
      publish();
    }
  });
  el("f_category").addEventListener("change", () => populateSubcategorySelect(el("f_category").value));
  el("imageUploadInput").addEventListener("change", (e) => uploadImages(e.target.files));

  showView("list");
}

init().catch((e) => toast(`Başlatma hatası: ${e.message}`, 8000));
