import type { Category, Product } from "@/lib/types";
export type AdminCollection = {
  slug: string;
  name: string;
  description: string;
  subtitle: string;
  image: string;
  families: string[];
};
export type GalleryItem = {
  id: string;
  category: "factory" | "delivery";
  caption: string;
  position: number;
  src: string;
  createdAt: string;
};
export type Catalog = {
  products: Product[];
  categories: Category[];
  collections: AdminCollection[];
  gallery: GalleryItem[];
  revision: string;
};
export function collectionOf(product: Product, collections: AdminCollection[]) {
  return (
    product.collectionGroup ??
    collections.find(
      (c) =>
        c.slug === product.collection ||
        c.families.includes(product.collection || ""),
    )?.slug ??
    ""
  );
}
export function sortGallery(items: GalleryItem[]) {
  return [...items].sort(
    (a, b) =>
      a.position - b.position ||
      b.createdAt.localeCompare(a.createdAt) ||
      a.id.localeCompare(b.id),
  );
}
