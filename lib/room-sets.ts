import type { Product } from "@/lib/types";

/**
 * Oda takımı ↔ tekli ürün ilişkisi.
 *
 * Ana sayfada yalnızca oda takımları gösterilir; takıma girildiğinde o
 * takımın tekli parçaları (karyola, gardırop, şifonyer…) listelenir.
 * Bir ürün, alt kategorisi "…-takimlari" ise oda takımıdır. Tekli ürün,
 * admin panelinden seçilen `parentSet` ile ya da (eski veride) aynı
 * `collection` ailesini paylaşarak bir takıma bağlanır.
 */
export function isRoomSet(product: Product): boolean {
  return Boolean(product.subcategory?.endsWith("-takimlari"));
}

export function getSetPieces(set: Product, all: Product[]): Product[] {
  return all.filter(
    (p) =>
      p.id !== set.id &&
      !isRoomSet(p) &&
      (p.parentSet
        ? p.parentSet === set.slug
        : Boolean(set.collection) && p.collection === set.collection),
  );
}

export function getParentSets(piece: Product, all: Product[]): Product[] {
  if (isRoomSet(piece)) return [];
  return all.filter(
    (p) =>
      p.id !== piece.id &&
      isRoomSet(p) &&
      (piece.parentSet
        ? p.slug === piece.parentSet
        : Boolean(piece.collection) && p.collection === piece.collection),
  );
}
