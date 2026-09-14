import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { BrandRibbon, EditorialStory, SelectedProducts, VisitSection } from "@/components/home/EditorialHome";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.brand.name} | ${siteConfig.brand.slogan}`,
  description: siteConfig.brand.shortDescription,
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <BrandRibbon />
      <CategoryShowcase />
      <EditorialStory />
      <SelectedProducts />
      <VisitSection />
    </>
  );
}
