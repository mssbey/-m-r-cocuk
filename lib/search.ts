import { categories } from "@/lib/data/categories";
import { getAllProducts } from "@/lib/data/products";

export type SearchSuggestion = {
  id: string;
  label: string;
  meta: string;
  href: string;
};

/**
 * Kategori, alt kategori ve (varsa) ürün adları üzerinden basit ama
 * gerçek zamanlı çalışan bir öneri arama fonksiyonu.
 */
export function getSearchSuggestions(rawQuery: string, limit = 8): SearchSuggestion[] {
  const query = rawQuery.trim().toLocaleLowerCase("tr-TR");
  if (!query) return [];

  const suggestions: SearchSuggestion[] = [];

  for (const category of categories) {
    if (category.name.toLocaleLowerCase("tr-TR").includes(query)) {
      suggestions.push({
        id: `category-${category.slug}`,
        label: category.name,
        meta: "Kategori",
        href: `/${category.slug}`,
      });
    }
    for (const sub of category.subcategories) {
      if (sub.name.toLocaleLowerCase("tr-TR").includes(query)) {
        suggestions.push({
          id: `subcategory-${category.slug}-${sub.slug}`,
          label: sub.name,
          meta: category.name,
          href: `/${category.slug}?alt=${sub.slug}`,
        });
      }
    }
  }

  for (const product of getAllProducts()) {
    if (product.name.toLocaleLowerCase("tr-TR").includes(query)) {
      suggestions.push({
        id: `product-${product.id}`,
        label: product.name,
        meta: "Ürün",
        href: `/urun/${product.slug}`,
      });
    }
  }

  return suggestions.slice(0, limit);
}
