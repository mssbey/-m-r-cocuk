import { collections } from "./collections";
import { getAllProducts } from "./products";
import groups from "./collection-groups.json";
import type { AdminCollection } from "@/lib/admin/catalog-types";
export const collectionGroups: AdminCollection[] = groups;
export function getGroupProducts(slug: string) {
  const group = collectionGroups.find((item) => item.slug === slug);
  if (!group) return [];
  const products = getAllProducts();
  if (slug === "yeni-koleksiyonlar") return products.filter((p) => p.isNew);
  const slugs = new Set(
    collections
      .filter((item) => group.families.includes(item.slug))
      .flatMap((item) => item.productSlugs),
  );
  return products.filter((p) =>
    p.collectionGroup
      ? p.collectionGroup === slug
      : p.collection === slug || slugs.has(p.slug),
  );
}
