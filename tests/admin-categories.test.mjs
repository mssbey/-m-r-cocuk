import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

function loadModule(path, imports = {}) {
  const context = {
    exports: {}, Buffer, Request, Response,
    require(name) {
      if (!(name in imports)) throw new Error(`Unexpected import: ${name}`);
      return imports[name];
    },
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText, context);
  return context.exports;
}

const productHelpers = loadModule("lib/admin/products.ts");
const categoryHelpers = loadModule("lib/admin/categories.ts", { "./products": productHelpers });
const { prepareCategory, RESERVED_CATEGORY_SLUGS, CATEGORIES_JSON_PATH } = categoryHelpers;
const existing = JSON.parse(fs.readFileSync(CATEGORIES_JSON_PATH, "utf8"));
const input = { name: "Çalışma Masaları", shortDescription: "Çalışma alanları", subcategories: ["Çekmeceli Masalar", "Kitaplıklı Masalar"] };

test("creates a category with Turkish URL normalization, subcategories and safe defaults", () => {
  const { category } = prepareCategory(input, existing);
  assert.equal(category.slug, "calisma-masalari");
  assert.equal(category.imageFolder, "calisma-masalari");
  assert.equal(category.coverImage, null);
  assert.equal(category.description, input.shortDescription);
  assert.equal(category.subcategories[0].slug, "cekmeceli-masalar");
  assert.ok(category.seoTitle.includes(input.name));
  assert.equal(prepareCategory({ name: "Aksesuarlar" }, []).category.subcategories.length, 0);
});

test("rejects invalid input, duplicate category URLs and duplicate subcategories", () => {
  for (const body of [null, [], {}, { name: 123 }, { name: " " }, { name: "🎈" }, { name: "x".repeat(101) }, { ...input, description: {} }, { ...input, subcategories: "x" }, { ...input, subcategories: [false] }, { ...input, subcategories: ["Masa", "masa"] }, { ...input, subcategories: Array(31).fill("Masa") }]) {
    assert.equal(prepareCategory(body, existing).status, 400);
  }
  assert.equal(prepareCategory({ name: "Bebek Odaları" }, existing).status, 409);
  assert.equal(prepareCategory({ name: "Bebek Odalari" }, existing).status, 409);
});

test("category URLs cannot shadow app pages, public directories or filter sentinels", () => {
  const directories = fs.readdirSync("app", { withFileTypes: true }).filter((entry) => entry.isDirectory() && !entry.name.startsWith("["));
  for (const entry of directories) {
    assert.ok(RESERVED_CATEGORY_SLUGS.has(entry.name), `Reserve /${entry.name}`);
    assert.equal(prepareCategory({ name: entry.name }, []).status, 400);
  }
  for (const name of ["images", "logo", "all"]) assert.equal(prepareCategory({ name }, []).status, 400);
});

test("new categories enter the main menu and footer when the site is rebuilt", () => {
  const { category } = prepareCategory(input, existing);
  const nav = loadModule("lib/nav.ts", {
    "@/lib/data/categories": { categories: [...existing, category] },
    "@/lib/data/collection-groups": { collectionGroups: [] },
  });
  const productLinks = nav.primaryNav.find((item) => item.href === "/urunler").megaMenu.sections.flatMap((section) => section.links);
  assert.ok(productLinks.some((link) => link.href === "/calisma-masalari" && link.label === input.name));
  assert.ok(nav.footerCategoryLinks.some((link) => link.href === "/calisma-masalari"));
});

function harness() {
  const files = { [CATEGORIES_JSON_PATH]: structuredClone(existing), "lib/data/products.json": [] };
  const writes = [];
  class GitHubApiError extends Error { constructor(status) { super("test"); this.status = status; } }
  const github = {
    GitHubApiError,
    async readJsonFile(path) { return { data: structuredClone(files[path]), sha: "current-sha" }; },
    async writeJsonFile(path, data, message, sha) {
      assert.equal(sha, "current-sha");
      files[path] = JSON.parse(JSON.stringify(data));
      writes.push({ path, message });
    },
  };
  const imports = {
    "next/server": { NextResponse: { json: (data, init) => Response.json(data, init) } },
    "@/lib/admin/github": github,
    "@/lib/admin/categories": categoryHelpers,
    "@/lib/admin/products": productHelpers,
  };
  return {
    files, writes, github,
    categories: loadModule("app/api/admin/categories/route.ts", imports),
    products: loadModule("app/api/admin/products/route.ts", imports),
    editProduct: loadModule("app/api/admin/products/[slug]/route.ts", imports),
  };
}
const request = (body) => new Request("http://localhost/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

test("category API persists additions and reads latest categories without redeploy", async () => {
  const h = harness();
  const response = await h.categories.POST(request(input));
  assert.equal(response.status, 201);
  const created = await response.json();
  assert.equal(h.writes.length, 1);
  assert.deepEqual(h.files[CATEGORIES_JSON_PATH].slice(0, -1), existing);
  const listing = await h.categories.GET();
  assert.equal(listing.headers.get("Cache-Control"), "no-store");
  assert.equal((await listing.json()).at(-1).slug, created.slug);
  assert.equal((await h.categories.POST(request(input))).status, 409);
  assert.equal(h.writes.length, 1);
});

test("new categories can immediately receive products and validate subcategory membership", async () => {
  const h = harness();
  await h.categories.POST(request(input));
  const response = await h.products.POST(request({ name: "Deneme Masası", category: "calisma-masalari", subcategory: "cekmeceli-masalar" }));
  assert.equal(response.status, 201);
  const product = await response.json();
  assert.equal(product.category, "calisma-masalari");
  assert.equal(product.productCode, "OC-001");
  const params = { params: Promise.resolve({ slug: product.slug }) };
  assert.equal((await h.editProduct.PUT(request({ category: "does-not-exist" }), params)).status, 400);
  assert.equal((await h.editProduct.PUT(request({ category: "bebek-odalari", subcategory: null }), params)).status, 200);
  assert.equal((await h.products.POST(request({ name: "Geçersiz", category: "calisma-masalari", subcategory: "besikler" }))).status, 400);
  assert.equal(h.files["lib/data/products.json"].length, 1);
});

test("malformed requests and storage failures return useful errors without writes", async () => {
  const h = harness();
  const malformed = new Request("http://localhost/api/admin/categories", { method: "POST", body: "{" });
  assert.equal((await h.categories.POST(malformed)).status, 400);
  assert.equal(h.writes.length, 0);
  h.github.readJsonFile = async () => { throw new Error("private configuration details"); };
  const response = await h.categories.GET();
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes("private configuration"));
  assert.equal((await h.categories.POST(request(input))).status, 502);
  assert.equal(h.writes.length, 0);
});

test("concurrent GitHub updates surface as conflicts rather than overwriting data", async () => {
  const h = harness();
  h.github.writeJsonFile = async () => { throw new h.github.GitHubApiError(409); };
  assert.equal((await h.categories.POST(request(input))).status, 409);
  assert.deepEqual(h.files[CATEGORIES_JSON_PATH], existing);
});
