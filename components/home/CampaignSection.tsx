import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { getCampaignProducts } from "@/lib/data/products";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";

/**
 * Gerçek kampanya verisi olmadığı sürece (veya yönetimden kapatıldığında)
 * bu bölüm hiç render edilmez — sahte indirim/fiyat üretilmez.
 */
export function CampaignSection() {
  if (!siteConfig.features.showCampaignsSection) return null;

  const campaignProducts = getCampaignProducts();
  if (campaignProducts.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="container-brand">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Fırsatlar" title="Kampanyalı Ürünler" />
          <Link
            href="/kampanyali-urunler"
            className="text-sm font-medium text-brand-navy underline-offset-4 hover:underline"
          >
            Tüm Kampanyaları Gör
          </Link>
        </div>

        <div className="mt-10">
          <ProductGrid products={campaignProducts.slice(0, 8)} />
        </div>
      </div>
    </section>
  );
}
