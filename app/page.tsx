import type { Metadata } from "next";
import { WoodmartHome } from "@/components/home/WoodmartHome";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.brand.name} | ${siteConfig.brand.slogan}`,
  description: siteConfig.brand.shortDescription,
  path: "/",
});

export default function Home() {
  return (
    <WoodmartHome />
  );
}
