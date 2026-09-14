"use client";

import { useMemo } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { getAllProducts } from "@/lib/data/products";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/product/EmptyState";

export default function FavoritesPage() {
  const { favoriteIds } = useFavorites();

  const favoriteProducts = useMemo(() => {
    const all = getAllProducts();
    return all.filter((p) => favoriteIds.includes(p.id));
  }, [favoriteIds]);

  return (
    <div className="container-brand py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Favorilerim" }]} />
      <h1 className="mt-6 font-display text-3xl text-brand-navy sm:text-4xl">
        Favorilerim
      </h1>
      <p className="mt-3 max-w-2xl text-brand-gray">
        Favorilere eklediğiniz ürünler bu cihaz ve tarayıcıda saklanır.
      </p>

      <div className="mt-10">
        {favoriteProducts.length > 0 ? (
          <ProductGrid products={favoriteProducts} />
        ) : (
          <EmptyState
            title="Henüz favori ürününüz yok."
            description="Beğendiğiniz ürünleri kalp ikonuna dokunarak favorilerinize ekleyebilir, buradan hızlıca ulaşabilirsiniz."
            showWhatsApp={false}
            fallbackHref="/urunler"
            fallbackLabel="Tüm Ürünleri İncele"
          />
        )}
      </div>
    </div>
  );
}
