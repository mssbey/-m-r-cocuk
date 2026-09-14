import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { buildMetadata, breadcrumbJsonLd, furnitureStoreJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { StoreCard } from "@/components/shared/StoreCard";

export const metadata: Metadata = buildMetadata({
  title: "Mağazalarımız",
  description:
    "Ömür Çocuk Esenyurt ve Gaziosmanpaşa mağazaları: adres, yol tarifi ve iletişim bilgileri.",
  path: "/magazalarimiz",
});

export default function StoresPage() {
  return (
    <div className="container-brand py-10 sm:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Mağazalarımız", path: "/magazalarimiz" }]),
          ...siteConfig.stores.map((_, index) => furnitureStoreJsonLd(index)).filter(Boolean),
        ]}
      />
      <Breadcrumbs items={[{ name: "Mağazalarımız" }]} />
      <h1 className="mt-6 font-display text-3xl text-brand-navy sm:text-4xl">
        Mağazalarımız
      </h1>
      <p className="mt-3 max-w-2xl text-brand-gray">
        İstanbul&apos;daki iki mağazamızda ürünlerimizi yakından inceleyebilir,
        mağaza ekibimizden bilgi alabilirsiniz.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {siteConfig.stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}
