import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { categories } from "@/lib/data/categories";
import { getAllProducts } from "@/lib/data/products";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1, lastModified: now },
    { url: `${base}/urunler`, changeFrequency: "daily", priority: 0.9, lastModified: now },
    { url: `${base}/mobilyalar`, changeFrequency: "weekly", priority: 0.6, lastModified: now },
    { url: `${base}/hakkimizda`, changeFrequency: "monthly", priority: 0.5, lastModified: now },
    { url: `${base}/magazalarimiz`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${base}/iletisim`, changeFrequency: "monthly", priority: 0.5, lastModified: now },
    { url: `${base}/sss`, changeFrequency: "monthly", priority: 0.4, lastModified: now },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.8,
    lastModified: now,
  }));

  const productRoutes: MetadataRoute.Sitemap = getAllProducts().map((p) => ({
    url: `${base}/urun/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: new Date(p.updatedAt),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
