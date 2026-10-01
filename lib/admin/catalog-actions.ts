import { randomUUID } from "node:crypto";
import type { Category, Product, ProductImage } from "@/lib/types";
import {
  slugify,
  EMPTY_PRODUCT_DEFAULTS,
  nextProductCode,
  nowIso,
} from "./products";
import { RESERVED_CATEGORY_SLUGS } from "./categories";
import {
  collectionOf,
  type Catalog,
  type AdminCollection,
  type GalleryItem,
  type HeroSlide,
} from "./catalog-types";
import { CatalogError } from "./catalog-store";
import { isRoomSet } from "@/lib/room-sets";
import { validUploadReceipt } from "./upload-receipt";
type Input = Record<string, unknown>;
const fail = (message: string): never => {
  throw new CatalogError(message);
};
function text(value: unknown, max: number, required = false) {
  if (value != null && typeof value !== "string") fail("Geçersiz metin alanı.");
  const result = typeof value === "string" ? value.trim() : "";
  if (result.length > max || (required && !result))
    fail(`1–${max} karakter uzunluğunda bir değer yazın.`);
  return result;
}
function list(value: unknown): string[] {
  if (!Array.isArray(value) || value.some((x) => typeof x !== "string"))
    fail("Geçersiz liste alanı.");
  return (value as string[]).map((x) => text(x, 2000)).filter(Boolean);
}
function image(value: unknown, old: ProductImage[] = []): ProductImage | null {
  if (!value) return null;
  const item = value as ProductImage & { uploadToken?: string };
  const known = old.find((x) => x.src === item.src);
  if (known) return known;
  if (!validUploadReceipt(item.src, "product", item.uploadToken))
    fail("Yeni görseli dosya seçicisinden yükleyin.");
  if (
    typeof item.src !== "string" ||
    !/^\/images\/uploads\/[a-f0-9-]+\.webp$/.test(item.src) ||
    !Number.isInteger(item.width) ||
    !Number.isInteger(item.height) ||
    item.width < 1 ||
    item.height < 1
  )
    fail("Geçersiz görsel.");
  return {
    src: item.src,
    alt: text(item.alt, 300),
    width: item.width,
    height: item.height,
  };
}
export function applyCatalogAction(catalog: Catalog, input: Input) {
  const action = input.action;
  if (action === "reorderProducts") {
    const slugs = list(input.slugs);
    if (
      slugs.length !== catalog.products.length ||
      new Set(slugs).size !== slugs.length ||
      slugs.some((s) => !catalog.products.some((p) => p.slug === s))
    )
      fail("Ürün listesi değişmiş. Sayfayı yenileyip tekrar deneyin.");
    catalog.products = slugs.map(
      (s) => catalog.products.find((p) => p.slug === s)!,
    );
    return;
  }
  if (action === "deleteProduct") {
    if (!catalog.products.some((p) => p.slug === input.slug))
      fail("Ürün bulunamadı.");
    catalog.products = catalog.products.filter((p) => p.slug !== input.slug);
    for (const p of catalog.products)
      if (p.parentSet === input.slug) p.parentSet = null;
    return;
  }
  if (action === "saveProduct") {
    const data = input.data as Input;
    if (!data || typeof data !== "object") fail("Geçersiz ürün.");
    const previous = catalog.products.find(
      (p) => p.slug === input.originalSlug,
    );
    if (input.originalSlug && !previous) fail("Ürün bulunamadı.");
    const name = text(data.name, 200, true);
    const slug = slugify(text(data.slug, 200) || name);
    if (!slug) fail("Geçerli bir URL (slug) girin.");
    if (catalog.products.some((p) => p.slug === slug && p !== previous))
      fail("Bu URL (slug) zaten kullanılıyor. Başka bir tane deneyin.");
    const category = catalog.categories.find((c) => c.slug === data.category);
    if (!category) fail("Seçilen kategori artık yok. Sayfayı yenileyin.");
    const collectionGroup = text(data.collectionGroup, 100);
    if (
      collectionGroup &&
      !catalog.collections.some((c) => c.slug === collectionGroup)
    )
      fail("Seçilen koleksiyon artık yok. Sayfayı yenileyin.");
    if (!previous && !collectionGroup) fail("Koleksiyon seçin.");
    const oldImages = previous
      ? [
          ...previous.images,
          ...(previous.coverImage ? [previous.coverImage] : []),
        ]
      : [];
    if (!Array.isArray(data.images)) fail("Geçersiz ürün galerisi.");
    const images = (data.images as unknown[])
      .map((x) => image(x, oldImages))
      .filter((x): x is ProductImage => !!x);
    const cover = image(data.coverImage, oldImages);
    if (!cover) fail("Kapak görseli zorunludur.");
    const product: Product = {
      ...EMPTY_PRODUCT_DEFAULTS,
      ...previous,
      id: previous?.id || slug,
      slug,
      name,
      category: category!.slug,
      subcategory: previous?.subcategory || null,
      productCode:
        previous?.productCode ||
        nextProductCode(catalog.products, category!.slug),
      createdAt: previous?.createdAt || nowIso(),
      updatedAt: nowIso(),
      collectionGroup,
      description: text(data.description, 20000, true),
      dimensions: text(data.dimensions, 2000) || null,
      colors: list(data.colors),
      fabrics: list(data.fabrics),
      isNew: data.isNew === true,
      campaign: data.campaign === true,
      coverImage: cover,
      images: [...new Map([cover!, ...images].map((x) => [x.src, x])).values()],
    };
    for (const key of [
      "shortDescription",
      "productCode",
      "campaignLabel",
      "deliveryInfo",
      "seoTitle",
      "seoDescription",
    ] as const)
      if (key in data) product[key] = text(data[key], 6000);
    for (const key of [
      "materials",
      "setContents",
      "optionalParts",
      "features",
      "careNotes",
    ] as const)
      if (key in data) product[key] = list(data[key]);
    for (const key of ["price", "oldPrice"] as const)
      if (key in data) {
        const n = data[key];
        if (
          n !== null &&
          (typeof n !== "number" || !Number.isFinite(n) || n < 0)
        )
          fail("Fiyat geçerli bir pozitif sayı olmalıdır.");
        product[key] = n as number | null;
      }
    if ("status" in data) {
      if (!["active", "draft", "archived"].includes(String(data.status)))
        fail("Geçersiz durum.");
      product.status = data.status as Product["status"];
    }
    if ("featured" in data) product.featured = data.featured === true;
    if ("subcategory" in data)
      product.subcategory = text(data.subcategory, 100) || null;
    if (
      product.subcategory &&
      !category!.subcategories.some((s) => s.slug === product.subcategory)
    )
      product.subcategory = null;
    if ("parentSet" in data) {
      const parentSet = text(data.parentSet, 200) || null;
      if (
        parentSet &&
        (parentSet === product.slug ||
          !catalog.products.some(
            (p) => p.slug === parentSet && isRoomSet(p),
          ))
      )
        fail("Seçilen oda takımı bulunamadı. Sayfayı yenileyin.");
      product.parentSet = isRoomSet(product) ? null : parentSet;
    }
    // Takımın adresi değişirse veya takım olmaktan çıkarsa parçalar kopmasın.
    if (previous)
      for (const p of catalog.products)
        if (p.parentSet === previous.slug)
          p.parentSet = isRoomSet(product) ? product.slug : null;
    if (previous)
      catalog.products[catalog.products.indexOf(previous)] = product;
    else catalog.products.unshift(product);
    return;
  }
  if (
    ["saveTaxonomy", "deleteTaxonomy", "moveTaxonomy"].includes(String(action))
  ) {
    if (input.kind !== "categories" && input.kind !== "collections")
      fail("Geçersiz bölüm.");
    const kind = input.kind as "categories" | "collections";
    const items = catalog[kind] as (Category | AdminCollection)[];
    const original = items.find((x) => x.slug === input.originalSlug);
    if (input.originalSlug && !original)
      fail("Kayıt bulunamadı. Sayfayı yenileyin.");
    const count = catalog.products.filter((p) =>
      kind === "categories"
        ? p.category === original?.slug
        : collectionOf(p, catalog.collections) === original?.slug,
    ).length;
    if (action === "deleteTaxonomy") {
      if (!original) fail("Kayıt bulunamadı.");
      if (count)
        fail(
          `Bu ${kind === "categories" ? "kategori" : "koleksiyon"} ${count} üründe kullanılıyor. Önce bu ürünleri başka bir ${kind === "categories" ? "kategoriye" : "koleksiyona"} taşıyın.`,
        );
      items.splice(items.indexOf(original!), 1);
      return;
    }
    if (action === "moveTaxonomy") {
      if (!original || (input.direction !== -1 && input.direction !== 1))
        fail("Geçersiz sıralama.");
      const a = items.indexOf(original!),
        b = a + (input.direction as number);
      if (b >= 0 && b < items.length)
        [items[a], items[b]] = [items[b], items[a]];
      return;
    }
    const data = input.data as Input;
    if (!data) fail("Geçersiz form.");
    const name = text(data.name, 80, true),
      slug = slugify(text(data.slug, 100) || name);
    if (!slug || (kind === "categories" && RESERVED_CATEGORY_SLUGS.has(slug)))
      fail("Bu URL kullanılamıyor.");
    if (items.some((x) => x.slug === slug && x !== original))
      fail("Bu URL (slug) zaten kullanılıyor.");
    const description = text(data.description, 400);
    let subcategories =
      original && "subcategories" in original ? original.subcategories : [];
    if (kind === "categories" && "subcategories" in data) {
      const names = list(data.subcategories);
      if (names.length > 30) fail("En fazla 30 alt kategori ekleyebilirsiniz.");
      subcategories = names.map((name) => ({
        name: text(name, 100, true),
        slug: slugify(name),
      }));
      if (
        subcategories.some((s) => !s.slug || s.slug === "all") ||
        new Set(subcategories.map((s) => s.slug)).size !== subcategories.length
      )
        fail("Alt kategori adları geçerli ve birbirinden farklı olmalıdır.");
      if (
        original &&
        catalog.products.some(
          (p) =>
            p.category === original.slug &&
            p.subcategory &&
            !subcategories.some((s) => s.slug === p.subcategory),
        )
      )
        fail(
          "Kullanılan alt kategoriyi kaldırmadan önce ürünleri başka bir alt kategoriye taşıyın.",
        );
    }
    const src = text(data.image, 500);
    const oldSrc =
      original &&
      ("coverImage" in original ? original.coverImage : original.image);
    if (
      src &&
      src !== oldSrc &&
      (!/^\/images\/uploads\/[a-f0-9-]+\.webp$/.test(src) ||
        !validUploadReceipt(src, "taxonomy", data.uploadToken))
    )
      fail("Geçersiz görsel.");
    const value =
      kind === "categories"
        ? {
            ...original,
            name,
            slug,
            description,
            shortDescription: description,
            imageFolder:
              original && "imageFolder" in original
                ? original.imageFolder
                : slug,
            coverImage: src || oldSrc || null,
            subcategories,
            seoTitle: `${name} | Ömür Çocuk`,
            seoDescription: description,
          }
        : {
            ...original,
            name,
            slug,
            description,
            subtitle: text(data.subtitle, 120),
            image: src || oldSrc || "/logo/omur-cocuk-logo-navy.png",
            families:
              original && "families" in original ? original.families : [],
          };
    // Resolve legacy product-family membership before changing the group slug.
    if (original && slug !== original.slug)
      for (const p of catalog.products) {
        if (kind === "categories" && p.category === original.slug)
          p.category = slug;
        if (
          kind === "collections" &&
          collectionOf(p, catalog.collections) === original.slug
        )
          p.collectionGroup = slug;
      }
    if (original)
      items[items.indexOf(original)] = value as Category | AdminCollection;
    else items.push(value as Category | AdminCollection);
    return;
  }
  if (action === "deleteGallery") {
    if (!catalog.gallery.some((x) => x.id === input.id))
      fail("Görsel bulunamadı. Sayfayı yenileyin.");
    catalog.gallery = catalog.gallery.filter((x) => x.id !== input.id);
    return;
  }
  if (action === "saveGallery") {
    const data = input.data as Input;
    if (!data) fail("Geçersiz form.");
    const old = catalog.gallery.find((x) => x.id === input.id);
    if (input.id && !old) fail("Görsel bulunamadı. Sayfayı yenileyin.");
    if (data.category !== "factory" && data.category !== "delivery")
      fail("Bir galeri kategorisi seçin.");
    if (
      typeof data.position !== "number" ||
      !Number.isInteger(data.position) ||
      data.position < 0 ||
      data.position > 9999
    )
      fail("Sıra 0–9999 arasında bir tam sayı olmalıdır.");
    const src = text(data.src, 500, true);
    if (
      src !== old?.src &&
      (!/^\/images\/uploads\/[a-f0-9-]+\.webp$/.test(src) ||
        !validUploadReceipt(src, "gallery", data.uploadToken))
    )
      fail("Bir fotoğraf seçin.");
    const value: GalleryItem = {
      id: old?.id || randomUUID(),
      category: data.category as GalleryItem["category"],
      caption: text(data.caption, 180, true),
      position: data.position as number,
      src,
      createdAt: old?.createdAt || new Date().toISOString(),
    };
    if (old) catalog.gallery[catalog.gallery.indexOf(old)] = value;
    else catalog.gallery.push(value);
    return;
  }
  if (["saveSlide", "deleteSlide", "moveSlide"].includes(String(action))) {
    const slides = catalog.slides;
    const old = slides.find((x) => x.id === input.id);
    if (input.id && !old) fail("Slayt bulunamadı. Sayfayı yenileyin.");
    if (action === "deleteSlide") {
      if (!old) fail("Slayt bulunamadı.");
      if (slides.length <= 1) fail("Slider'da en az bir slayt kalmalıdır.");
      slides.splice(slides.indexOf(old!), 1);
      return;
    }
    if (action === "moveSlide") {
      if (!old || (input.direction !== -1 && input.direction !== 1))
        fail("Geçersiz sıralama.");
      const a = slides.indexOf(old!),
        b = a + (input.direction as number);
      if (b >= 0 && b < slides.length)
        [slides[a], slides[b]] = [slides[b], slides[a]];
      return;
    }
    const data = input.data as Input;
    if (!data) fail("Geçersiz form.");
    const src = text(data.image, 500, true);
    if (
      src !== old?.image &&
      (!/^\/images\/uploads\/[a-f0-9-]+\.webp$/.test(src) ||
        !validUploadReceipt(src, "slide", data.uploadToken))
    )
      fail("Bir görsel seçin.");
    const href = text(data.href, 300, true);
    if (!/^\/(?!\/)/.test(href))
      fail("Bağlantı site içi bir adres olmalı (örn. /bebek-odalari).");
    const value: HeroSlide = {
      id: old?.id || randomUUID(),
      eyebrow: text(data.eyebrow, 80),
      title: text(data.title, 120),
      text: text(data.text, 300),
      image: src,
      href,
      name: text(data.name, 80),
      tag: text(data.tag, 40),
    };
    if (old) slides[slides.indexOf(old)] = value;
    else slides.push(value);
    return;
  }
  fail("Geçersiz işlem.");
}
