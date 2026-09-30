import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/data/categories";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { PriceTag } from "@/components/shared/PriceTag";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { buildProductWhatsAppUrl } from "@/lib/whatsapp";
import { absoluteUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  view = "grid",
}: {
  product: Product;
  view?: "grid" | "list";
}) {
  const category = getCategoryBySlug(product.category);
  const productUrl = absoluteUrl(`/urun/${product.slug}`);
  const whatsappUrl = buildProductWhatsAppUrl(product.name, productUrl);

  return (
    <div
      className={cn(
        "catalog-product-card group relative overflow-hidden rounded-2xl border border-brand-babyblue/30 bg-white transition-shadow hover:soft-shadow-lg",
        view === "grid" ? "flex flex-col" : "flex flex-row"
      )}
    >
      <Link
        href={`/urun/${product.slug}`}
        className={cn(
          "catalog-product-image relative block overflow-hidden bg-brand-sky",
          view === "grid" ? "aspect-[4/3] w-full" : "aspect-square w-32 flex-shrink-0 sm:w-48"
        )}
      >
        {product.coverImage ? (
          <Image
            src={product.coverImage.src}
            alt={product.coverImage.alt}
            fill
            sizes={
              view === "grid"
                ? "(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 90vw"
                : "192px"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PlaceholderImage className="absolute inset-0" />
        )}
        {product.campaignLabel ? (
          <span className="absolute left-3 top-3 max-w-[65%] rounded-full bg-brand-babyblue px-3 py-1 text-xs font-semibold text-brand-navy">
            {product.campaignLabel}
          </span>
        ) : null}
      </Link>

      <div
        className={cn(
          "absolute top-3",
          view === "grid" ? "right-3" : "right-3 sm:right-4"
        )}
      >
        <FavoriteButton productId={product.id} productName={product.name} size="sm" />
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col gap-2 p-4",
          view === "list" && "justify-center pr-12 sm:p-5 sm:pr-14"
        )}
      >
        {category ? (
          <span className="text-xs font-medium uppercase tracking-wide text-brand-gray">
            {category.name}
          </span>
        ) : null}
        <Link href={`/urun/${product.slug}`}>
          <h3 className="font-display text-lg leading-snug text-brand-navy transition-colors group-hover:text-brand-navy/80">
            {product.name}
          </h3>
        </Link>
        {view === "list" ? (
          <p className="hidden text-sm text-brand-gray sm:line-clamp-2 sm:block">
            {product.shortDescription}
          </p>
        ) : null}

        <div className={cn(view === "grid" ? "mt-auto pt-2" : "pt-1")}>
          <PriceTag price={product.price} oldPrice={product.oldPrice} size="sm" />

          <div className="mt-3 flex gap-2">
            <Link
              href={`/urun/${product.slug}`}
              className="flex-1 rounded-full bg-brand-babyblue px-3 py-2 text-center text-xs font-semibold text-brand-navy transition-colors hover:bg-brand-babyblue/75 sm:flex-initial sm:px-4"
            >
              Ürünü İncele
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${product.name} için WhatsApp'tan bilgi al`}
              className="flex items-center justify-center rounded-full border border-brand-babyblue bg-brand-sky px-3 py-2 text-brand-navy transition-colors hover:bg-brand-babyblue/50"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M12.02 2c-5.5 0-10 4.48-10 10 0 1.86.5 3.6 1.4 5.12L2 22l5.05-1.33A9.96 9.96 0 0 0 12.02 22c5.5 0 10-4.48 10-10s-4.5-10-10-10zm5.85 14.15c-.25.7-1.46 1.36-2.02 1.44-.52.08-1.17.11-1.9-.12-.44-.13-1-.32-1.72-.62-3.03-1.31-5-4.35-5.15-4.56-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.05-2.49.27-.29.6-.36.8-.36.2 0 .4 0 .58.01.19.01.44-.07.68.52.25.6.86 2.1.94 2.25.08.15.13.33.02.53-.1.2-.16.32-.31.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.77 1.27 1.66 2.06 1.14 1.02 2.1 1.34 2.4 1.49.3.15.48.13.65-.05.18-.18.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.08.13.08.72-.17 1.41z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
