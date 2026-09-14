import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllProducts } from "@/lib/data/products";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProductCatalog } from "@/components/product/ProductCatalog";

export const metadata: Metadata = buildMetadata({
  title: "Tüm Ürünler",
  description:
    "Ömür Çocuk kataloğundaki tüm bebek, çocuk ve genç odası mobilyalarını inceleyin.",
  path: "/urunler",
});

export default function AllProductsPage() {
  const products = getAllProducts();

  return (
    <div className="container-brand py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Tüm Ürünler" }]} />
      <h1 className="mt-6 font-display text-3xl text-brand-navy sm:text-4xl">
        Tüm Ürünler
      </h1>
      <p className="mt-3 max-w-2xl text-brand-gray">
        Bebek, çocuk ve genç odaları için tüm ürünlerimizi tek bir sayfada
        keşfedin. Kategori, ürün türü ve renk seçeneklerine göre filtreleyin.
      </p>

      <div className="mt-10">
        <Suspense fallback={null}>
          <ProductCatalog products={products} />
        </Suspense>
      </div>
    </div>
  );
}
