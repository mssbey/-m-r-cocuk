import type { CategorySlug, Product } from "@/lib/types";

export const PRODUCTS_JSON_PATH = "lib/data/products.json";

const TR_MAP: Record<string, string> = {
  ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", I: "i", İ: "i",
  ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
};

export function slugify(input: string): string {
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

const CATEGORY_CODE_PREFIX: Record<string, string> = {
  "bebek-odalari": "BO",
  "genc-odalari": "GO",
  "montessori-odalari": "MT",
  "dolap-gardrop": "DG",
  "sifonyer-komodin": "SK",
  "bebek-arabalari": "BA",
  "kampanyali-urunler": "KA",
};

export function nextProductCode(products: Product[], category: string): string {
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

export function uniqueSlug(products: Product[], baseSlug: string, ignoreSlug?: string): string {
  let candidate = baseSlug;
  let i = 1;
  const taken = new Set(products.filter((p) => p.slug !== ignoreSlug).map((p) => p.slug));
  while (taken.has(candidate)) {
    i += 1;
    candidate = `${baseSlug}-${i}`;
  }
  return candidate;
}

export function nowIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export const EMPTY_PRODUCT_DEFAULTS = {
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
  status: "active" as const,
  seoTitle: "",
  seoDescription: "",
};

export const EDITABLE_FIELDS: (keyof Product)[] = [
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

export function imageFolderFor(category: CategorySlug): string {
  return `public/images/products/${category}`;
}
