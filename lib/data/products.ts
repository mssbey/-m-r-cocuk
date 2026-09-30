import type { CategorySlug, Product } from "@/lib/types";
import productsData from "./products.json";

/**
 * Ürün kataloğu.
 *
 * Veri, `lib/data/products.json` dosyasında tutulur (bu dosya değil).
 * Bunun nedeni: admin panelinin (bkz. `admin-server/`) ürünleri kolayca
 * okuyup güncelleyebilmesi için düz bir JSON dosyasının bir TypeScript
 * modülünden çok daha uygun olmasıdır. Ürünleri elle düzenlemek isterseniz
 * doğrudan `products.json`'ı düzenleyebilir ya da admin panelini
 * kullanabilirsiniz (bkz. proje kök dizinindeki `README.md` →
 * "Admin Paneli").
 *
 * Fiyat, ölçü, malzeme ve renk gibi doğrulanmamış alanlar bilinçli olarak
 * boş/null bırakılabilir — arayüz bu durumu otomatik olarak yönetir.
 */
export const products: Product[] = productsData as Product[];

export function getAllProducts(): Product[] {
  return products.filter((p) => p.status === "active");
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.status === "active");
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  return getAllProducts().filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return getAllProducts().filter((p) => p.featured);
}

export function getCampaignProducts(): Product[] {
  return getAllProducts().filter((p) => p.campaign);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return getAllProducts()
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function getCollectionProducts(collectionSlug: string): Product[] {
  return getAllProducts().filter((p) => p.collection === collectionSlug);
}

export type ProductSearchFilters = {
  query?: string;
  category?: CategorySlug;
  subcategory?: string;
  color?: string;
  sort?: "recommended" | "newest" | "price-asc" | "price-desc";
};

export function searchProducts(filters: ProductSearchFilters): Product[] {
  let results = getAllProducts();

  if (filters.category) {
    results = results.filter((p) => p.category === filters.category);
  }

  if (filters.subcategory) {
    results = results.filter((p) => p.subcategory === filters.subcategory);
  }

  if (filters.color) {
    results = results.filter((p) => p.colors.includes(filters.color!));
  }

  if (filters.query) {
    const q = filters.query.trim().toLocaleLowerCase("tr-TR");
    if (q) {
      results = results.filter((p) =>
        [p.name, p.shortDescription, p.collection ?? ""].some((field) =>
          field.toLocaleLowerCase("tr-TR").includes(q)
        )
      );
    }
  }

  switch (filters.sort) {
    case "price-asc":
      results = [...results].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case "price-desc":
      results = [...results].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
      break;
    case "newest":
      results = [...results].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    default:
      break;
  }

  return results;
}

/** Filtre panelinde göstermek için mevcut ürünlerden türetilen benzersiz renkler. */
export function getAvailableColors(scoped: Product[] = getAllProducts()): string[] {
  const colors = new Set<string>();
  scoped.forEach((p) => p.colors.forEach((c) => colors.add(c)));
  return Array.from(colors).sort((a, b) => a.localeCompare(b, "tr-TR"));
}
