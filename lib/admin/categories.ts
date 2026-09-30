import type { Category } from "../types";
import { slugify } from "./products";

export const CATEGORIES_JSON_PATH = "lib/data/categories.json";

// Root-level pages and public directories must not be shadowed by categories.
export const RESERVED_CATEGORY_SLUGS = new Set([
  "admin", "api", "biz-kimiz", "cerez-politikasi", "fabrikamiz",
  "favorilerim", "gizlilik-politikasi", "hakkimizda", "iletisim",
  "koleksiyonlar", "kumas-renk-kartelasi", "kvkk-aydinlatma-metni",
  "magazalarimiz", "mobilyalar", "ozel-uretim", "sss", "urun", "urunler",
  "images", "logo", "_next", "all",
]);

type CategoryResult =
  | { category: Category; error?: never; status?: never }
  | { category?: never; error: string; status: number };

export function prepareCategory(body: unknown, existing: Category[]): CategoryResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Geçersiz kategori bilgisi.", status: 400 };
  }
  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name || name.length > 100) {
    return { error: "Kategori adı 1–100 karakter olmalıdır.", status: 400 };
  }
  const slug = slugify(name);
  if (!slug || slug.length > 80) {
    return { error: "Kategori adından geçerli bir adres oluşturulamadı. Daha kısa, harf veya rakam içeren bir ad kullanın.", status: 400 };
  }
  if (RESERVED_CATEGORY_SLUGS.has(slug)) {
    return { error: "Bu ad mevcut bir site sayfasıyla çakışıyor. Farklı bir kategori adı kullanın.", status: 400 };
  }
  if (existing.some((category) => category.slug === slug || category.name.toLocaleLowerCase("tr-TR") === name.toLocaleLowerCase("tr-TR"))) {
    return { error: "Bu isim veya adresle bir kategori zaten var.", status: 409 };
  }
  for (const [field, limit] of [["shortDescription", 300], ["description", 6000]] as const) {
    if (input[field] !== undefined && (typeof input[field] !== "string" || input[field].length > limit)) {
      return { error: `Açıklama alanı metin olmalı ve ${limit} karakteri geçmemelidir.`, status: 400 };
    }
  }
  const subcategoryNames = input.subcategories ?? [];
  if (!Array.isArray(subcategoryNames) || subcategoryNames.length > 30) {
    return { error: "En fazla 30 alt kategori ekleyebilirsiniz.", status: 400 };
  }
  const subcategories: Category["subcategories"] = [];
  for (const value of subcategoryNames) {
    if (typeof value !== "string" || !value.trim() || value.trim().length > 100) {
      return { error: "Alt kategori adları 1–100 karakter olmalıdır.", status: 400 };
    }
    const subSlug = slugify(value.trim());
    if (!subSlug || subSlug.length > 80 || subSlug === "all") {
      return { error: "Alt kategori için geçerli, daha kısa bir ad kullanın.", status: 400 };
    }
    if (subcategories.some((subcategory) => subcategory.slug === subSlug)) {
      return { error: "Alt kategori adları birbirinden farklı olmalıdır.", status: 400 };
    }
    subcategories.push({ name: value.trim(), slug: subSlug });
  }
  const shortDescription = ((input.shortDescription as string | undefined) ?? "").trim();
  const description = ((input.description as string | undefined) ?? "").trim();
  return {
    category: {
      name, slug, shortDescription,
      description: description || shortDescription,
      imageFolder: slug,
      coverImage: null,
      subcategories,
      seoTitle: `${name} | Ömür Çocuk`,
      seoDescription: shortDescription || `${name} modellerini Ömür Çocuk'ta keşfedin.`,
    },
  };
}
