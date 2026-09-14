import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import type { Product } from "@/lib/types";

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  /** OG görseli — verilmezse varsayılan marka görseli kullanılır. */
  imagePath?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.siteUrl}${clean}`;
}

export function buildMetadata({
  title,
  description,
  path,
  imagePath = "/logo/omur-cocuk-logo-navy.png",
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(siteConfig.brand.name)
    ? title
    : `${title} | ${siteConfig.brand.name}`;

  return {
    // `absolute`, kök layout'taki title template'ini (`%s | Ömür Çocuk`) atlar;
    // fullTitle zaten marka adını içerdiği için ikinci kez eklenmesini önler.
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.brand.name,
      locale: "tr_TR",
      type: "website",
      images: [{ url: absoluteUrl(imagePath) }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(imagePath)],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brand.name,
    url: siteConfig.siteUrl,
    logo: absoluteUrl("/logo/omur-cocuk-logo-navy.png"),
    slogan: siteConfig.brand.slogan,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phoneDisplay,
        contactType: "customer service",
        areaServed: "TR",
        availableLanguage: ["tr"],
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brand.name,
    url: siteConfig.siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.siteUrl}/urunler?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function furnitureStoreJsonLd(storeIndex: number) {
  const store = siteConfig.stores[storeIndex];
  if (!store) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": absoluteUrl(`/magazalarimiz#${store.id}`),
    name: store.name,
    url: absoluteUrl("/magazalarimiz"),
    telephone: siteConfig.contact.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: store.addressLines.join(", "),
      addressLocality: store.district,
      addressRegion: store.city,
      addressCountry: "TR",
    },
    hasMap: store.googleMapsUrl,
    ...(store.openingHours ? { openingHours: store.openingHours } : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.productCode,
    image: product.images.map((img) => absoluteUrl(img.src)),
    url: absoluteUrl(`/urun/${product.slug}`),
    ...(product.price
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "TRY",
            price: product.price,
            availability: "https://schema.org/InStock",
            url: absoluteUrl(`/urun/${product.slug}`),
          },
        }
      : {}),
  };
}
