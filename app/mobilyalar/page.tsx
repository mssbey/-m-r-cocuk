import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryBySlug } from "@/lib/data/categories";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";

export const metadata: Metadata = buildMetadata({
  title: "Mobilyalar",
  description:
    "Çocuk ve genç odalarını tamamlayan gardırop, şifonyer ve komodin modelleri.",
  path: "/mobilyalar",
});

const furnitureCategories = ["dolap-gardrop", "sifonyer-komodin"] as const;

export default function FurnitureHubPage() {
  const items = furnitureCategories
    .map((slug) => getCategoryBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="container-brand py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Mobilyalar" }]} />
      <h1 className="mt-6 font-display text-3xl text-brand-navy sm:text-4xl">
        Mobilyalar
      </h1>
      <p className="mt-3 max-w-2xl text-brand-gray">
        Odayı tamamlayan gardırop, şifonyer ve komodin modellerini kategoriye
        göre inceleyin.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((category) => (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className="group relative flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-3xl soft-shadow transition-transform hover:-translate-y-1"
          >
            <PlaceholderImage className="absolute inset-0" label={category.name} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-brand-navy/10 to-transparent" />
            <div className="relative p-6">
              <h2 className="font-display text-2xl text-white">{category.name}</h2>
              <p className="mt-1 max-w-sm text-sm text-white/85">
                {category.shortDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
