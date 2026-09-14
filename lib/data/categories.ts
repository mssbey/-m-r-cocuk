import type { Category } from "@/lib/types";
import categoriesData from "./categories.json";

/**
 * Ana kategori verisi. `lib/data/categories.json` dosyasından okunur (admin
 * panelinin okuyup güncelleyebilmesi için). Alt kategoriler, gerçek
 * ürünlerin (bkz. lib/data/products.ts) `subcategory` alanına göre
 * otomatik olarak filtrelenir. `bebek-arabalari` ve `kampanyali-urunler`
 * için henüz gerçek ürün fotoğrafı paylaşılmadığından bu kategoriler boş
 * görünür.
 */
export const categories: Category[] = categoriesData as Category[];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function isValidCategorySlug(slug: string): boolean {
  return categories.some((c) => c.slug === slug);
}
