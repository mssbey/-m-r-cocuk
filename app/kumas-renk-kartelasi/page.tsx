import { buildMetadata } from "@/lib/seo";
import { getProductBySlug } from "@/lib/data/products";
import { PageIntro } from "@/components/shared/PageIntro";
import { FabricPalette } from "@/components/product/FabricPalette";

export const metadata = buildMetadata({
  title: "Kumaş & Renk Kartelası",
  description:
    "Baby Face, Luna, Teddy, Puffy, Muzzy, Anka, Coco ve Bukle kumaş gruplarını keşfedin.",
  path: "/kumas-renk-kartelasi",
});
export default async function FabricPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const product =
    typeof params.urun === "string" ? getProductBySlug(params.urun) : undefined;
  return (
    <div className="container-brand flow-page">
      <PageIntro
        title="Kumaş & Renk Kartelası"
        description="Önce kumaş grubunu, ardından renginizi seçin. Detayları gerçek numunelerle birlikte değerlendirelim."
      />
      <FabricPalette
        product={
          product ? { name: product.name, slug: product.slug } : undefined
        }
        initialGroup={
          typeof params.kumas === "string" ? params.kumas : undefined
        }
        initialColor={typeof params.renk === "string" ? params.renk : undefined}
      />
    </div>
  );
}
