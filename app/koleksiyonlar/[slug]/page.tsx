import Link from "next/link";
import { notFound } from "next/navigation";
import {
  collectionGroups,
  getGroupProducts,
} from "@/lib/data/collection-groups";
import { buildMetadata } from "@/lib/seo";
import { PageIntro } from "@/components/shared/PageIntro";
import { ProductGrid } from "@/components/product/ProductGrid";

export function generateStaticParams() {
  return collectionGroups.map((group) => ({ slug: group.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = collectionGroups.find((item) => item.slug === slug);
  return buildMetadata({
    title: group?.name ?? "Koleksiyon",
    description: group?.description ?? "Ömür Çocuk koleksiyonları",
    path: `/koleksiyonlar/${slug}`,
  });
}
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const group = collectionGroups.find((item) => item.slug === slug);
  if (!group) notFound();
  const products = getGroupProducts(slug);
  return (
    <div className="container-brand flow-page">
      <PageIntro title={group.name} description={group.description} />
      <Link className="flow-back" href="/koleksiyonlar">
        ← Tüm koleksiyonlar
      </Link>
      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <div className="flow-empty">
          <h2>Hayalinizdeki tasarımı konuşalım.</h2>
          <p>
            Bu koleksiyonda henüz listelenen ürün bulunmuyor. Referans
            görselinizle özel üretim talebi oluşturabilirsiniz.
          </p>
          <Link className="shop-button" href="/ozel-uretim">
            Özel Üretim Talebi Oluştur
          </Link>
        </div>
      )}
    </div>
  );
}
