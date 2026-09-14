import Link from "next/link";
import Image from "next/image";
import { collections } from "@/lib/data/collections";
import { getCategoryBySlug } from "@/lib/data/categories";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { SectionHeading } from "@/components/shared/SectionHeading";

/**
 * Gerçek koleksiyon verisi eklenene kadar bu bölüm otomatik olarak gizlenir
 * (bkz. lib/data/collections.ts).
 */
export function FeaturedCollections() {
  if (collections.length === 0) return null;

  return (
    <section className="bg-brand-sky/30 py-16 sm:py-20">
      <div className="container-brand">
        <SectionHeading
          eyebrow="Koleksiyonlar"
          title="Öne Çıkan Koleksiyonlar"
          description="Farklı oda konseptlerimizden seçtiğimiz koleksiyonları keşfedin."
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => {
            const category = getCategoryBySlug(collection.category);
            return (
              <div
                key={collection.id}
                className="overflow-hidden rounded-2xl border border-brand-babyblue/30 bg-white soft-shadow"
              >
                <div className="relative aspect-[4/3] w-full">
                  {collection.coverImage ? (
                    <Image
                      src={collection.coverImage.src}
                      alt={collection.coverImage.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, 90vw"
                      className="object-cover"
                    />
                  ) : (
                    <PlaceholderImage className="absolute inset-0" />
                  )}
                </div>
                <div className="p-5">
                  {category ? (
                    <span className="text-xs font-medium uppercase tracking-wide text-brand-gray">
                      {category.name}
                    </span>
                  ) : null}
                  <h3 className="mt-1 font-display text-xl text-brand-navy">
                    {collection.name}
                  </h3>
                  <p className="mt-2 text-sm text-brand-gray">
                    {collection.shortDescription}
                  </p>
                  <Link
                    href={`/${collection.category}?koleksiyon=${collection.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-navy"
                  >
                    İncele
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
