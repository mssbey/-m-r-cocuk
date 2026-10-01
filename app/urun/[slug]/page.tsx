import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllProducts,
  getCollectionProducts,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/data/products";
import { getCategoryBySlug } from "@/lib/data/categories";
import { buildMetadata, breadcrumbJsonLd, productJsonLd, absoluteUrl } from "@/lib/seo";
import { siteConfig } from "@/lib/config";
import { buildProductWhatsAppUrl } from "@/lib/whatsapp";
import { JsonLd } from "@/components/shared/JsonLd";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PriceTag } from "@/components/shared/PriceTag";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { getParentSets, getSetPieces, isRoomSet } from "@/lib/room-sets";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return buildMetadata({
      title: "Ürün Bulunamadı",
      description: "Aradığınız ürün bulunamadı.",
      path: `/urun/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    path: `/urun/${product.slug}`,
    imagePath: product.coverImage?.src,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const all = getAllProducts();
  const roomSet = isRoomSet(product);
  // Oda takımında: takımın tekli parçaları. Tekli üründe: ait olduğu takım.
  const setPieces = roomSet ? getSetPieces(product, all) : [];
  const parentSets = getParentSets(product, all);
  const shown = new Set([product, ...setPieces, ...parentSets].map((p) => p.id));
  const collectionProducts = product.collection
    ? getCollectionProducts(product.collection).filter((p) => !shown.has(p.id))
    : [];
  collectionProducts.forEach((p) => shown.add(p.id));
  const related = getRelatedProducts(product, 8)
    .filter((p) => !shown.has(p.id))
    .slice(0, 4);

  const productUrl = absoluteUrl(`/urun/${product.slug}`);
  const whatsappUrl = buildProductWhatsAppUrl(product.name, productUrl);

  const specSections: { label: string; values: string[] }[] = [
    { label: "Malzeme", values: product.materials },
    { label: "Takım İçeriği", values: product.setContents },
    { label: "Opsiyonel Parçalar", values: product.optionalParts },
    { label: "Ürün Özellikleri", values: product.features },
    { label: "Bakım Önerileri", values: product.careNotes },
  ].filter((section) => section.values.length > 0);

  return (
    <div className="container-brand py-10 sm:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: category?.name ?? "Ürünler", path: category ? `/${category.slug}` : "/urunler" },
            { name: product.name, path: `/urun/${product.slug}` },
          ]),
          productJsonLd(product),
        ]}
      />

      <Breadcrumbs
        items={[
          ...(category ? [{ name: category.name, href: `/${category.slug}` }] : []),
          { name: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-12">
        <div className="mx-auto w-full max-w-xl lg:mx-0">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        <div>
          {category ? (
            <Link
              href={`/${category.slug}`}
              className="text-xs font-medium uppercase tracking-wide text-brand-gray hover:text-brand-navy"
            >
              {category.name}
            </Link>
          ) : null}

          <div className="mt-2 flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl text-brand-navy sm:text-4xl">
              {product.name}
            </h1>
            <FavoriteButton productId={product.id} productName={product.name} />
          </div>

          <p className="mt-1 text-xs text-brand-gray">Ürün Kodu: {product.productCode}</p>

          <p className="mt-4 leading-relaxed text-brand-gray">{product.shortDescription}</p>

          <div className="mt-6 rounded-2xl border border-brand-babyblue/30 bg-white p-5">
            <PriceTag price={product.price} oldPrice={product.oldPrice} />

            {product.colors.length > 0 ? (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-gray">
                  Renk Seçenekleri
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="rounded-full border border-brand-babyblue/50 bg-brand-cream px-3 py-1 text-xs font-medium text-brand-navy"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {product.dimensions ? (
              <p className="mt-4 text-sm text-brand-gray">
                <span className="font-medium text-brand-navy">Ölçüler:</span>{" "}
                {product.dimensions}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-navy px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-navy/90"
              >
                WhatsApp&apos;tan Bilgi Al
              </a>
              <a
                href={siteConfig.contact.phoneHref}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-navy/20 px-5 py-3 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-cream"
              >
                Telefonla Ara
              </a>
            </div>
          </div>

          {product.deliveryInfo ? (
            <p className="mt-4 text-sm text-brand-gray">
              <span className="font-medium text-brand-navy">Teslimat ve Kurulum:</span>{" "}
              {product.deliveryInfo}
            </p>
          ) : null}

          <section className="product-fabric-invite">
            <p className="shop-eyebrow">RENK / KUMAŞ SEÇİMİ</p>
            <h2>Kumaş Seçeneklerimiz</h2>
            <p>Ürünümüzde kullanabileceğimiz kumaş ve renk seçeneklerini inceleyin. Seçiminizin bu modele uygulanabilirliğini birlikte değerlendirelim.</p>
            <Link href={`/kumas-renk-kartelasi?urun=${encodeURIComponent(product.slug)}`} className="flow-text-link">Kumaş Seçeneklerimizi İncele →</Link>
            <Link href={`/ozel-uretim?urun=${encodeURIComponent(product.slug)}`} className="flow-text-link">Özel ölçü / tasarım talebi oluştur →</Link>
          </section>

          {specSections.length > 0 ? (
            <div className="mt-8 flex flex-col gap-6">
              {specSections.map((section) => (
                <div key={section.label}>
                  <h2 className="font-display text-lg text-brand-navy">{section.label}</h2>
                  <ul className="mt-2 flex flex-col gap-1.5 text-sm text-brand-gray">
                    {section.values.map((value) => (
                      <li key={value} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-brand-babyblue" />
                        {value}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}

          {product.description ? (
            <div className="mt-8">
              <h2 className="font-display text-lg text-brand-navy">Ürün Açıklaması</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-brand-gray">
                {product.description}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {roomSet ? (
        <section className="mt-14" id="takimin-parcalari">
          <h2 className="font-display text-2xl text-brand-navy">Takımın Parçaları</h2>
          <p className="mt-1 text-sm text-brand-gray">
            {setPieces.length > 0
              ? "Bu odadaki ürünleri tek tek inceleyebilir, ayrı ayrı da sipariş verebilirsiniz."
              : "Bu takımın tekli ürünleri yakında eklenecek. Parça parça bilgi için bize yazabilirsiniz."}
          </p>
          {setPieces.length > 0 ? (
            <div className="mt-6">
              <ProductGrid products={setPieces} />
            </div>
          ) : null}
        </section>
      ) : null}

      {parentSets.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl text-brand-navy">Bu Ürünün Yer Aldığı Takım</h2>
          <div className="mt-6">
            <ProductGrid products={parentSets} />
          </div>
        </section>
      ) : null}

      {collectionProducts.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-brand-navy">Aynı Koleksiyondaki Ürünler</h2>
          <div className="mt-6">
            <ProductGrid products={collectionProducts} />
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="font-display text-2xl text-brand-navy">Benzer Ürünler</h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      ) : null}
    </div>
  );
}
