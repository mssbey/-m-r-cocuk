import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { getCampaignProducts, getProductsByCategory } from "@/lib/data/products";
import { buildMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProductCatalog } from "@/components/product/ProductCatalog";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  return params.then(({ category: slug }) => {
    const category = getCategoryBySlug(slug);
    if (!category) return buildMetadata({ title: "Kategori Bulunamadı", description: "", path: `/${slug}`, noIndex: true });
    return buildMetadata({
      title: category.seoTitle,
      description: category.seoDescription,
      path: `/${category.slug}`,
    });
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const isCampaignCategory = category.slug === "kampanyali-urunler";
  const products = isCampaignCategory
    ? getCampaignProducts()
    : getProductsByCategory(category.slug);

  return (
    <div className="container-brand py-10 sm:py-14">
      <JsonLd
        data={breadcrumbJsonLd([{ name: category.name, path: `/${category.slug}` }])}
      />
      <Breadcrumbs items={[{ name: category.name }]} />

      <div className="mt-6 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="font-display text-3xl text-brand-navy sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-2xl text-brand-gray">{category.description}</p>
        </div>
        <div className="relative hidden aspect-[4/3] overflow-hidden rounded-3xl lg:block">
          {category.coverImage ? (
            <Image
              src={category.coverImage}
              alt={category.name}
              fill
              sizes="360px"
              className="object-cover"
            />
          ) : (
            <PlaceholderImage label={category.name} />
          )}
        </div>
      </div>

      <div className="mt-10">
        <Suspense fallback={null}>
          <ProductCatalog products={products} lockedCategory={isCampaignCategory ? undefined : category.slug} />
        </Suspense>
      </div>
    </div>
  );
}
