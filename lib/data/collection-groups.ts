import { collections } from "./collections";
import { getAllProducts } from "./products";

// Editorial selections use existing catalog records; unassigned collections
// remain empty rather than showing unrelated products as stock.
export const collectionGroups = [
  {
    slug: "modern-koleksiyon",
    name: "Modern Koleksiyon",
    description: "Sade çizgilerle bir araya gelen oda tasarımları.",
    families: ["vera", "nova-beyaz"],
  },
  {
    slug: "luxury-koleksiyon",
    name: "Luxury Koleksiyon",
    description: "Detaylarıyla öne çıkan oda takımlarından bir seçki.",
    families: ["alya-beyaz", "orion-aytasi"],
  },
  {
    slug: "bohem-koleksiyon",
    name: "Bohem Koleksiyon",
    description: "Hayalinizdeki bohem yaşam alanını birlikte tasarlayalım.",
    families: [],
  },
  {
    slug: "rustic-koleksiyon",
    name: "Rustic Koleksiyon",
    description:
      "Doğal bir görünüm için ölçü, renk ve tasarımı birlikte değerlendirelim.",
    families: [],
  },
  {
    slug: "kids-collection",
    name: "Kids Collection",
    description: "Miniklerin dünyası için beşik ve Montessori tasarımları.",
    families: ["grow-buyuyen-besik", "bloom"],
  },
  {
    slug: "yeni-koleksiyonlar",
    name: "Yeni Koleksiyonlar",
    description: "Kataloğumuza en son eklenen tasarımları keşfedin.",
    families: [],
  },
];

export function getGroupProducts(slug: string) {
  const group = collectionGroups.find((item) => item.slug === slug);
  if (!group) return [];
  const products = getAllProducts();
  if (slug === "yeni-koleksiyonlar")
    return [...products]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 12);
  const slugs = new Set(
    collections
      .filter((item) => group.families.includes(item.slug))
      .flatMap((item) => item.productSlugs),
  );
  return products.filter((product) => slugs.has(product.slug));
}
