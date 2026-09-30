import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { chromium } from "@playwright/test";
import sharp from "sharp";

// This server cannot reach live storage: all mutations use a temporary catalog.
const temp = await fs.mkdtemp(path.join(os.tmpdir(), "omur-admin-test-"));
const artifacts = path.resolve("artifacts/admin");
await fs.mkdir(artifacts, { recursive: true });
const read = async (p) => JSON.parse(await fs.readFile(p, "utf8"));
const initial = {
  products: await read("lib/data/products.json"),
  categories: await read("lib/data/categories.json"),
  collections: await read("lib/data/collection-groups.json"),
  gallery: [],
  slides: await read("lib/data/hero-slides.json"),
  revision: randomUUID(),
};
await fs.writeFile(path.join(temp, "catalog.json"), JSON.stringify(initial));
const port = 3127,
  base = `http://localhost:${port}`,
  password = randomUUID();
const server = spawn(
  process.execPath,
  ["node_modules/next/dist/bin/next", "dev", "--port", String(port)],
  {
    env: {
      ...process.env,
      ADMIN_DATA_DIR: temp,
      ADMIN_PASSWORD: password,
      GITHUB_TOKEN: "",
      NEXT_TELEMETRY_DISABLED: "1",
    },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  },
);
let serverLog = "";
server.stdout.on("data", (x) => {
  serverLog += x;
});
server.stderr.on("data", (x) => {
  serverLog += x;
});
let browser;
const results = [];
const check = (name) => {
  results.push(name);
  console.log(`PASS ${name}`);
};
try {
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(`${base}/admin/login/`);
      if (r.ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  browser = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  assert.equal(
    (await context.request.get(`${base}/api/admin/manage/`)).status(),
    401,
  );
  await page.goto(`${base}/admin/`);
  await page.waitForURL("**/admin/login/**");
  await page.getByLabel("Şifre", { exact: true }).fill("incorrect");
  await page.getByRole("button", { name: "Giriş Yap", exact: true }).click();
  await page.getByRole("alert").filter({ hasText: "Şifre hatalı." }).waitFor();
  await page.screenshot({ path: path.join(artifacts, "login-desktop.png") });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Login overflow at ${width}`,
    );
    if (width === 390)
      await page.screenshot({ path: path.join(artifacts, "login-mobile.png") });
  }
  await page.getByLabel("Şifre", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Giriş Yap", exact: true }).click();
  await page.waitForURL(`${base}/admin/`);
  await page.getByRole("heading", { name: "Ürünler", exact: true }).waitFor();
  check("session protection, wrong password, successful login");
  const get = async () => {
    const r = await context.request.get(`${base}/api/admin/manage/`);
    assert.equal(r.status(), 200);
    return r.json();
  };
  const mutation = async (data, expected = 200) => {
    const current = await get();
    const r = await context.request.post(`${base}/api/admin/manage/`, {
      data: { revision: current.revision, ...data },
    });
    const body = await r.json();
    assert.equal(r.status(), expected, JSON.stringify(body));
    return body;
  };
  for (const [route, label] of [
    ["/admin/", "products"],
    ["/admin/products/new/", "product-form"],
    ["/admin/taxonomy/", "taxonomy"],
    ["/admin/gallery/", "gallery"],
  ]) {
    await page.goto(base + route);
    await page
      .getByText("Yükleniyor…", { exact: true })
      .waitFor({ state: "hidden" });
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const size = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        width: innerWidth,
      }));
      assert.ok(
        size.scroll <= size.width,
        `${route} overflows at ${width}: ${JSON.stringify(size)}`,
      );
      if (width === 390 || width === 1440)
        await page.screenshot({
          path: path.join(artifacts, `${label}-${width}.png`),
          fullPage: false,
        });
    }
  }
  check("four panels: no body overflow at 320, 390, 768, 1024, 1440 pixels");
  await page.goto(`${base}/admin/taxonomy/`);
  await page.getByRole("heading", { name: "Yeni kategori ekle" }).waitFor();
  const categoryForm = page.locator(".admin-card").first();
  await categoryForm
    .getByLabel("Ad", { exact: true })
    .fill(initial.categories[0].name);
  await categoryForm.getByRole("button", { name: "Ekle", exact: true }).click();
  await categoryForm.getByRole("alert").waitFor();
  assert.equal(
    await categoryForm.getByLabel("Ad", { exact: true }).inputValue(),
    initial.categories[0].name,
  );
  await categoryForm.getByLabel("Ad", { exact: true }).fill("Form Denemesi");
  await categoryForm.getByRole("button", { name: "Ekle", exact: true }).click();
  await categoryForm.getByRole("status").waitFor();
  assert.equal(
    await categoryForm.getByLabel("Ad", { exact: true }).inputValue(),
    "",
  );
  await mutation({
    action: "deleteTaxonomy",
    kind: "categories",
    originalSlug: "form-denemesi",
  });
  check(
    "taxonomy errors retain inputs and successful creation resets the new-card form",
  );
  await page.goto(`${base}/admin/`);
  await page.getByRole("heading", { name: "Ürünler", exact: true }).waitFor();
  await page.getByLabel("Ürün ara", { exact: true }).fill("sonuc-yok-987");
  await page.getByText("Filtrelere uyan ürün yok.").waitFor();
  await page.getByLabel("Ürün ara", { exact: true }).fill("");
  const subset = initial.products.filter(
    (p) => p.category === initial.products[0].category,
  );
  await page.getByLabel("Kategori filtresi").selectOption(subset[0].category);
  const expected = [...initial.products];
  const ai = expected.findIndex((p) => p.slug === subset[0].slug),
    bi = expected.findIndex((p) => p.slug === subset[1].slug);
  [expected[ai], expected[bi]] = [expected[bi], expected[ai]];
  await page
    .getByRole("button", { name: `${subset[0].name} aşağı taşı`, exact: true })
    .click();
  await page
    .getByText("Kaydediliyor…", { exact: false })
    .waitFor({ state: "hidden" });
  assert.deepEqual(
    (await get()).products.map((x) => x.slug),
    expected.map((x) => x.slug),
  );
  await page.reload();
  await page.getByRole("heading", { name: "Ürünler", exact: true }).waitFor();
  assert.equal((await get()).products[ai].slug, subset[1].slug);
  await mutation(
    { action: "reorderProducts", slugs: [initial.products[0].slug] },
    400,
  );
  await mutation(
    {
      action: "reorderProducts",
      slugs: Array(initial.products.length).fill(initial.products[0].slug),
    },
    400,
  );
  await mutation(
    {
      action: "reorderProducts",
      slugs: initial.products.map((p) => p.slug),
      revision: "stale",
    },
    409,
  );
  check(
    "empty search, filtered reorder preserves hidden products, persistence, invalid and stale reorder rejection",
  );
  await mutation({
    action: "saveTaxonomy",
    kind: "categories",
    data: { name: "Deneme Kategori", description: "Test" },
  });
  await mutation({
    action: "saveTaxonomy",
    kind: "collections",
    data: {
      name: "Deneme Koleksiyon",
      description: "Test",
      subtitle: "Alt başlık",
    },
  });
  const png = await sharp({
    create: { width: 12, height: 12, channels: 3, background: "#b8a58d" },
  })
    .png()
    .toBuffer();
  let current = await get();
  const invalid = await context.request.post(`${base}/api/admin/upload/`, {
    multipart: {
      revision: current.revision,
      kind: "gallery",
      file: {
        name: "bad.png",
        mimeType: "image/png",
        buffer: Buffer.from("not an image"),
      },
    },
  });
  assert.equal(invalid.status(), 400);
  const tooLarge = await context.request.post(`${base}/api/admin/upload/`, {
    multipart: {
      revision: current.revision,
      kind: "gallery",
      file: {
        name: "large.png",
        mimeType: "image/png",
        buffer: Buffer.alloc(3 * 1024 * 1024 + 1),
      },
    },
  });
  assert.equal(tooLarge.status(), 400);
  const gif = await context.request.post(`${base}/api/admin/upload/`, {
    multipart: {
      revision: current.revision,
      kind: "gallery",
      file: { name: "bad.gif", mimeType: "image/gif", buffer: png },
    },
  });
  assert.equal(gif.status(), 400);
  const upload = await context.request.post(`${base}/api/admin/upload/`, {
    multipart: {
      revision: current.revision,
      kind: "product",
      file: { name: "test.png", mimeType: "image/png", buffer: png },
    },
  });
  assert.equal(upload.status(), 200, await upload.text());
  const uploaded = (await upload.json()).image;
  assert.equal((await context.request.get(base + uploaded.src)).status(), 200);
  const product = {
    name: "Özel Başlık 160",
    slug: "",
    category: "deneme-kategori",
    collectionGroup: "deneme-koleksiyon",
    description: "Test ürünü",
    dimensions: "140 × 200 cm",
    colors: ["Krem"],
    fabrics: ["Kadife"],
    isNew: true,
    campaign: true,
    coverImage: uploaded,
    images: [uploaded],
  };
  current = await mutation({ action: "saveProduct", data: product });
  assert.equal(current.products[0].slug, "ozel-baslik-160");
  assert.equal(current.products[0].images.length, 1);
  await mutation({ action: "saveProduct", data: product }, 400);
  await mutation(
    {
      action: "deleteTaxonomy",
      kind: "categories",
      originalSlug: "deneme-kategori",
    },
    400,
  );
  await mutation(
    {
      action: "deleteTaxonomy",
      kind: "collections",
      originalSlug: "deneme-koleksiyon",
    },
    400,
  );
  current = await mutation({
    action: "saveTaxonomy",
    kind: "categories",
    originalSlug: "deneme-kategori",
    data: {
      name: "Deneme Kategori",
      slug: "tasinan-kategori",
      description: "Test",
    },
  });
  assert.equal(current.products[0].category, "tasinan-kategori");
  current = await mutation({
    action: "saveTaxonomy",
    kind: "collections",
    originalSlug: "deneme-koleksiyon",
    data: {
      name: "Deneme Koleksiyon",
      slug: "tasinan-koleksiyon",
      description: "Test",
    },
  });
  assert.equal(current.products[0].collectionGroup, "tasinan-koleksiyon");
  current = await mutation({
    action: "saveProduct",
    originalSlug: "ozel-baslik-160",
    data: {
      ...product,
      slug: "yeni-adres",
      category: "tasinan-kategori",
      collectionGroup: "tasinan-koleksiyon",
    },
  });
  assert.equal(current.products[0].slug, "yeni-adres");
  check(
    "product creation, duplicate slugs, image deduplication, category/collection usage guards and atomic reference migration",
  );
  await page.goto(`${base}/admin/products/${initial.products[0].slug}/edit/`);
  await page.getByText("Mevcut ek görseller", { exact: true }).waitFor();
  const before = (await get()).revision;
  if (
    await page.getByRole("button", { name: "Kapak yap", exact: true }).count()
  ) {
    await page
      .getByRole("button", { name: "Kapak yap", exact: true })
      .first()
      .click();
    assert.equal((await get()).revision, before);
    await page
      .getByLabel("Açıklama", { exact: true })
      .fill("Kalıcı düzenleme testi");
    await page
      .getByRole("button", { name: "Değişiklikleri Kaydet", exact: true })
      .click();
    await page.waitForURL(`${base}/admin/`);
    assert.equal(
      (await get()).products.find((p) => p.slug === initial.products[0].slug)
        .description,
      "Kalıcı düzenleme testi",
    );
  }
  check("image cover selection stays local until product form save");
  await mutation(
    {
      action: "saveGallery",
      data: {
        category: "factory",
        caption: "Wrong upload kind",
        position: 0,
        src: uploaded.src,
        uploadToken: uploaded.uploadToken,
      },
    },
    400,
  );
  const galleryUploadResponse = await context.request.post(
    `${base}/api/admin/upload/`,
    {
      multipart: {
        revision: (await get()).revision,
        kind: "gallery",
        file: { name: "test.png", mimeType: "image/png", buffer: png },
      },
    },
  );
  assert.equal(galleryUploadResponse.status(), 200);
  const galleryImage = (await galleryUploadResponse.json()).image;
  await mutation(
    {
      action: "saveGallery",
      data: {
        category: "factory",
        caption: "Atölye",
        position: 10000,
        src: galleryImage.src,
        uploadToken: galleryImage.uploadToken,
      },
    },
    400,
  );
  await mutation(
    {
      action: "saveGallery",
      data: {
        category: "factory",
        caption: "x".repeat(181),
        position: 0,
        src: galleryImage.src,
        uploadToken: galleryImage.uploadToken,
      },
    },
    400,
  );
  current = await mutation({
    action: "saveGallery",
    data: {
      category: "factory",
      caption: "Atölye",
      position: 1,
      src: galleryImage.src,
      uploadToken: galleryImage.uploadToken,
    },
  });
  const id = current.gallery[0].id;
  await mutation({
    action: "saveGallery",
    id,
    data: {
      category: "delivery",
      caption: "Teslimat",
      position: 0,
      src: galleryImage.src,
    },
  });
  await page.goto(`${base}/admin/gallery/`);
  await page.getByRole("heading", { name: "Görseli düzenle" }).waitFor();
  page.once("dialog", (d) => d.dismiss());
  await page.getByRole("button", { name: "Galeriden kaldır" }).click();
  assert.equal((await get()).gallery.length, 1);
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Galeriden kaldır" }).click();
  await page
    .getByRole("heading", { name: "Görseli düzenle" })
    .waitFor({ state: "hidden" });
  assert.equal((await get()).gallery.length, 0);
  await mutation({ action: "deleteProduct", slug: "yeni-adres" });
  await mutation({
    action: "deleteTaxonomy",
    kind: "categories",
    originalSlug: "tasinan-kategori",
  });
  await mutation({
    action: "deleteTaxonomy",
    kind: "collections",
    originalSlug: "tasinan-koleksiyon",
  });
  check(
    "gallery limits, signature and format checks, edit, cancel/confirm delete, product and taxonomy deletion",
  );
  const missing = await page.goto(
    `${base}/admin/products/not-a-real-product/edit/`,
  );
  assert.equal(missing.status(), 404);
  await page.goto(`${base}/admin/`);
  await page.getByRole("button", { name: "Çıkış Yap", exact: true }).click();
  await page.waitForURL("**/admin/login/**");
  assert.equal(
    (await context.request.get(`${base}/api/admin/manage/`)).status(),
    401,
  );
  assert.deepEqual(errors, []);
  check(
    "404 for missing product, logout revokes access, no browser runtime errors",
  );
  await fs.writeFile(
    path.join(artifacts, "report.json"),
    JSON.stringify({ passed: results }, null, 2),
  );
} catch (e) {
  await fs.writeFile(path.join(artifacts, "failure-server.log"), serverLog);
  throw e;
} finally {
  if (browser) await browser.close();
  server.kill(); /* Keep fixture outside the repo for diagnosing failures; no real data was edited. */
}
