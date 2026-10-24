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

// These imported sets currently only have individual furniture photographs.
export function hasRoomOverview(product: Product): boolean {
  return ![
    "armin-genc-odasi-takimi",
    "milas-baby-bebek-odasi-takimi",
    "plato-genc-odasi-takimi",
    "smarter-genc-odasi-takimi",
    "storm-genc-odasi-takimi",
    "nest-3-kapili-bebek-odasi",
  ].includes(product.slug);
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

/**
 * Ürün sayfasında "Diğer Çocuk Odaları" olarak önerilecek oda takımları.
 * Ürünün (ya da ait olduğu takımın) kategorisindeki takımlar öne alınır;
 * oda fotoğrafı olan takımlar fotoğrafsızlardan önce gelir.
 */
export function getOtherRoomSets(
  product: Product,
  all: Product[],
  exclude: Set<string>,
  limit = 4,
): Product[] {
  const preferred = new Set(
    [product, ...getParentSets(product, all)].filter(isRoomSet).map((p) => p.category),
  );
  const score = (p: Product) =>
    (preferred.has(p.category) ? 0 : 2) + (hasRoomOverview(p) ? 0 : 1);
  return all
    .filter((p) => isRoomSet(p) && !exclude.has(p.id) && p.collection !== product.collection)
    .map((p, i) => ({ p, i }))
    .sort((a, b) => score(a.p) - score(b.p) || a.i - b.i)
    .slice(0, limit)
    .map(({ p }) => p);
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
