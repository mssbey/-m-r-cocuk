import Link from "next/link";
import { CustomProductionForm } from "@/components/forms/CustomProductionForm";
import { PageIntro } from "@/components/shared/PageIntro";
import { getProductBySlug } from "@/lib/data/products";
import { resolveFabric } from "@/lib/data/fabrics";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Özel Üretim",
  description:
    "Ölçü, kumaş, renk ve tasarım tercihlerinizi referans görsellerinizle paylaşın. Birlikte tasarlayalım.",
  path: "/ozel-uretim",
});
export default async function CustomProductionPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const product =
    typeof params.urun === "string" ? getProductBySlug(params.urun) : undefined;
  const selected = resolveFabric(
    typeof params.kumas === "string" ? params.kumas : undefined,
    typeof params.renk === "string" ? params.renk : undefined,
  );
  return (
    <div className="container-brand flow-page">
      <PageIntro
        title="Özel Üretim"
        description="Hayalinizdeki odayı birlikte tasarlayalım. Ölçülerinizi, kumaş ve renk tercihlerinizi, ilham aldığınız görselleri paylaşın."
      />
      <div className="custom-layout">
        <aside>
          <p className="shop-eyebrow">SİZİN ODANIZ. SİZİN SEÇİMLERİNİZ.</p>
          <h2>Her detayı birlikte düşünelim.</h2>
          <p>
            Özel ölçü, kumaş, renk ve tasarım seçeneklerini ihtiyaçlarınıza göre
            değerlendirelim.
          </p>
          <ol>
            <li>İhtiyacınızı ve ölçülerinizi anlatın.</li>
            <li>Referans görsellerinizi ekleyin.</li>
            <li>Talebinizi WhatsApp üzerinden paylaşın.</li>
          </ol>
          <Link href="/fabrikamiz" className="flow-text-link">
            Üretimi yerinde görün →
          </Link>
        </aside>
        <CustomProductionForm
          product={product?.name}
          fabric={
            selected
              ? `${selected.group.name} · ${selected.color.name}`
              : undefined
          }
        />
      </div>
    </div>
  );
}
