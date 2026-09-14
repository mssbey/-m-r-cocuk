/**
 * Ömür Çocuk - Yerel Ürün Yönetim Paneli
 *
 * Bu sunucu yalnızca YEREL bilgisayarınızda çalışacak şekilde
 * tasarlanmıştır. İnternete açmayın (kimlik doğrulama içermez).
 *
 * Ne yapar:
 * - lib/data/products.json ve lib/data/categories.json dosyalarını okur/yazar
 * - Yüklenen görselleri işleyip (EXIF düzeltme, yeniden boyutlandırma,
 *   WebP'ye dönüştürme) public/images/products/<kategori>/ altına kaydeder
 * - "Yayınla" butonuyla `npm run build` çalıştırıp çıktıyı httpdocs'a kopyalar
 *
 * Çalıştırma:
 *   cd admin-server
 *   npm install   (yalnızca ilk seferde)
 *   npm start
 * Sonra tarayıcıda http://localhost:4000 açın.
 */

const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { execFile } = require("child_process");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const PRODUCTS_JSON = path.join(PROJECT_ROOT, "lib/data/products.json");
const CATEGORIES_JSON = path.join(PROJECT_ROOT, "lib/data/categories.json");
const IMAGES_ROOT = path.join(PROJECT_ROOT, "public/images/products");
const OUT_DIR = path.join(PROJECT_ROOT, "out");

const CONFIG_PATH = path.join(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
const PORT = config.port || 4000;

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));
// Ürün görsellerini önizleyebilmek için ana projenin public/images klasörünü de sun.
app.use("/images", express.static(path.join(PROJECT_ROOT, "public/images")));

// ---------- yardımcı fonksiyonlar ----------

const TR_MAP = {
  ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i",
  ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
};
function slugify(input) {
  return input
    .split("")
    .map((ch) => TR_MAP[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJsonAtomic(filePath, data) {
  const tmpPath = `${filePath}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2) + "\n", "utf8");
  fs.renameSync(tmpPath, filePath);
}

function readProducts() {
  return readJson(PRODUCTS_JSON);
}
function writeProducts(products) {
  writeJsonAtomic(PRODUCTS_JSON, products);
}
function readCategories() {
  return readJson(CATEGORIES_JSON);
}

const CATEGORY_CODE_PREFIX = {
  "bebek-odalari": "BO",
  "genc-odalari": "GO",
  "montessori-odalari": "MT",
  "dolap-gardrop": "DG",
  "sifonyer-komodin": "SK",
  "bebek-arabalari": "BA",
  "kampanyali-urunler": "KA",
};

function nextProductCode(products, category) {
  const prefix = CATEGORY_CODE_PREFIX[category] || "OC";
  let max = 0;
  for (const p of products) {
    if (typeof p.productCode === "string" && p.productCode.startsWith(prefix + "-")) {
      const n = parseInt(p.productCode.slice(prefix.length + 1), 10);
      if (!Number.isNaN(n) && n > max) max = n;
    }
  }
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

function uniqueSlug(products, baseSlug, ignoreSlug) {
  let candidate = baseSlug;
  let i = 1;
  const taken = new Set(products.filter((p) => p.slug !== ignoreSlug).map((p) => p.slug));
  while (taken.has(candidate)) {
    i += 1;
    candidate = `${baseSlug}-${i}`;
  }
  return candidate;
}

function findProductIndex(products, slug) {
  return products.findIndex((p) => p.slug === slug);
}

function nowIso() {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY_PRODUCT_DEFAULTS = {
  collection: null,
  shortDescription: "",
  description: "",
  images: [],
  coverImage: null,
  price: null,
  oldPrice: null,
  campaignLabel: null,
  colors: [],
  dimensions: null,
  materials: [],
  setContents: [],
  optionalParts: [],
  features: [],
  careNotes: [],
  deliveryInfo: null,
  featured: false,
  campaign: false,
  status: "active",
  seoTitle: "",
  seoDescription: "",
};

// ---------- kategori uçları ----------

app.get("/api/categories", (req, res) => {
  res.json(readCategories());
});

// ---------- ürün uçları ----------

app.get("/api/products", (req, res) => {
  res.json(readProducts());
});

app.get("/api/products/:slug", (req, res) => {
  const products = readProducts();
  const product = products.find((p) => p.slug === req.params.slug);
  if (!product) return res.status(404).json({ error: "Ürün bulunamadı." });
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const body = req.body || {};
  if (!body.name || !body.category) {
    return res.status(400).json({ error: "Ürün adı ve kategori zorunludur." });
  }

  const products = readProducts();
  const categories = readCategories();
  const category = categories.find((c) => c.slug === body.category);
  if (!category) return res.status(400).json({ error: "Geçersiz kategori." });

  const baseSlug = slugify(body.slug && body.slug.trim() ? body.slug : body.name);
  const slug = uniqueSlug(products, baseSlug);

  const product = {
    id: slug,
    slug,
    name: body.name,
    category: body.category,
    subcategory: body.subcategory || null,
    productCode: nextProductCode(products, body.category),
    seoTitle: body.name,
    ...EMPTY_PRODUCT_DEFAULTS,
    shortDescription: body.shortDescription || "",
    description: body.description || "",
    seoDescription: body.shortDescription || "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  products.push(product);
  writeProducts(products);
  res.status(201).json(product);
});

const EDITABLE_FIELDS = [
  "name",
  "category",
  "subcategory",
  "collection",
  "shortDescription",
  "description",
  "productCode",
  "price",
  "oldPrice",
  "campaignLabel",
  "colors",
  "dimensions",
  "materials",
  "setContents",
  "optionalParts",
  "features",
  "careNotes",
  "deliveryInfo",
  "featured",
  "campaign",
  "status",
  "seoTitle",
  "seoDescription",
];

app.put("/api/products/:slug", (req, res) => {
  const products = readProducts();
  const idx = findProductIndex(products, req.params.slug);
  if (idx === -1) return res.status(404).json({ error: "Ürün bulunamadı." });

  const body = req.body || {};
  const product = products[idx];
  for (const field of EDITABLE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      product[field] = body[field];
    }
  }
  product.updatedAt = nowIso();

  products[idx] = product;
  writeProducts(products);
  res.json(product);
});

app.delete("/api/products/:slug", (req, res) => {
  const products = readProducts();
  const idx = findProductIndex(products, req.params.slug);
  if (idx === -1) return res.status(404).json({ error: "Ürün bulunamadı." });

  const [removed] = products.splice(idx, 1);
  writeProducts(products);

  if (req.query.deleteImages === "true") {
    for (const img of removed.images || []) {
      const abs = path.join(PROJECT_ROOT, "public", img.src.replace(/^\//, ""));
      if (fs.existsSync(abs)) {
        try {
          fs.unlinkSync(abs);
        } catch {
          // dosya silinemezse sessizce devam et
        }
      }
    }
  }

  res.json({ ok: true });
});

// ---------- görsel yükleme ----------

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

app.post("/api/products/:slug/images", upload.array("images", 20), async (req, res) => {
  const products = readProducts();
  const idx = findProductIndex(products, req.params.slug);
  if (idx === -1) return res.status(404).json({ error: "Ürün bulunamadı." });
  const product = products[idx];

  const files = req.files || [];
  if (files.length === 0) return res.status(400).json({ error: "Görsel gönderilmedi." });

  const outDir = path.join(IMAGES_ROOT, product.category);
  fs.mkdirSync(outDir, { recursive: true });

  let maxIndex = 0;
  const existingPattern = new RegExp(`^${product.slug}-(\\d+)\\.webp$`);
  for (const img of product.images) {
    const base = path.basename(img.src);
    const match = base.match(existingPattern);
    if (match) maxIndex = Math.max(maxIndex, parseInt(match[1], 10));
  }

  const newImages = [];
  for (const file of files) {
    maxIndex += 1;
    const fileName = `${product.slug}-${String(maxIndex).padStart(2, "0")}.webp`;
    const outPath = path.join(outDir, fileName);
    try {
      const info = await sharp(file.buffer)
        .rotate()
        .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);
      newImages.push({
        src: `/images/products/${product.category}/${fileName}`,
        alt: `${product.name} - ${maxIndex}. görsel`,
        width: info.width,
        height: info.height,
      });
    } catch (e) {
      return res.status(500).json({ error: `Görsel işlenemedi: ${e.message}` });
    }
  }

  product.images = [...product.images, ...newImages];
  if (!product.coverImage && product.images.length > 0) {
    product.coverImage = product.images[0];
  }
  product.updatedAt = nowIso();
  products[idx] = product;
  writeProducts(products);

  res.json(product);
});

app.delete("/api/products/:slug/images", (req, res) => {
  const { index } = req.body || {};
  const products = readProducts();
  const idx = findProductIndex(products, req.params.slug);
  if (idx === -1) return res.status(404).json({ error: "Ürün bulunamadı." });
  const product = products[idx];

  if (typeof index !== "number" || index < 0 || index >= product.images.length) {
    return res.status(400).json({ error: "Geçersiz görsel indeksi." });
  }

  const [removed] = product.images.splice(index, 1);
  const abs = path.join(PROJECT_ROOT, "public", removed.src.replace(/^\//, ""));
  if (fs.existsSync(abs)) {
    try {
      fs.unlinkSync(abs);
    } catch {
      // yoksay
    }
  }

  product.coverImage = product.images[0] || null;
  product.updatedAt = nowIso();
  products[idx] = product;
  writeProducts(products);
  res.json(product);
});

app.post("/api/products/:slug/images/reorder", (req, res) => {
  const { order } = req.body || {};
  const products = readProducts();
  const idx = findProductIndex(products, req.params.slug);
  if (idx === -1) return res.status(404).json({ error: "Ürün bulunamadı." });
  const product = products[idx];

  if (!Array.isArray(order) || order.length !== product.images.length) {
    return res.status(400).json({ error: "Geçersiz sıralama." });
  }

  const reordered = order.map((i) => product.images[i]);
  if (reordered.some((img) => !img)) {
    return res.status(400).json({ error: "Geçersiz sıralama indeksi." });
  }

  product.images = reordered;
  product.coverImage = product.images[0] || null;
  product.updatedAt = nowIso();
  products[idx] = product;
  writeProducts(products);
  res.json(product);
});

// ---------- build & yayınla ----------

app.get("/api/config", (req, res) => {
  res.json({ httpdocsPath: config.httpdocsPath, projectRoot: PROJECT_ROOT });
});

app.post("/api/build", (req, res) => {
  // `npm run build` (npm.cmd) yerine Next.js'in kendi Node giriş noktasını
  // doğrudan çalıştırıyoruz. Windows'ta proje yolu boşluk/Unicode karakter
  // içerdiğinde (ör. "ömür çoçuk") `npm.cmd`'yi shell üzerinden çağırmak
  // EINVAL/tutarsız çıkış koduna yol açıyordu; doğrudan `node .../next build`
  // çağrısı hem daha güvenilir hem de shell gerektirmiyor.
  const nextBin = path.join(PROJECT_ROOT, "node_modules/next/dist/bin/next");
  execFile(process.execPath, [nextBin, "build"], { cwd: PROJECT_ROOT, maxBuffer: 1024 * 1024 * 50 }, async (err, stdout, stderr) => {
    const buildLog = `${stdout}\n${stderr}`;
    if (err) {
      return res.status(500).json({ ok: false, stage: "build", log: buildLog, error: err.message });
    }

    // Senkron fs.*Sync yerine fs/promises kullanıyoruz: 115MB'lık görsel
    // klasörünü senkron (bloklayan) kopyalamak Node'un olay döngüsünü
    // uzun süre kilitleyip sürecin "yanıt vermiyor" sayılmasına ve
    // sonlandırılmasına yol açıyordu. Asenkron sürüm ana thread'i
    // bloklamadığı için bu sorunu ortadan kaldırır.
    try {
      const outExists = await fsp
        .access(OUT_DIR)
        .then(() => true)
        .catch(() => false);
      if (!outExists) {
        return res.status(500).json({ ok: false, stage: "build", log: buildLog, error: "out/ klasörü oluşmadı." });
      }
      const httpdocsPath = config.httpdocsPath;
      await fsp.rm(httpdocsPath, { recursive: true, force: true });
      await fsp.mkdir(httpdocsPath, { recursive: true });
      await fsp.cp(OUT_DIR, httpdocsPath, { recursive: true });
      res.json({ ok: true, log: buildLog, httpdocsPath });
    } catch (copyErr) {
      res.status(500).json({ ok: false, stage: "copy", log: buildLog, error: copyErr.message });
    }
  });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`\nÖmür Çocuk yönetim paneli çalışıyor: http://localhost:${PORT}\n`);
  console.log(`Proje klasörü: ${PROJECT_ROOT}`);
  console.log(`httpdocs hedefi: ${config.httpdocsPath}\n`);
});
