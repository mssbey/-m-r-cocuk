import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloatingButton } from "@/components/layout/WhatsAppFloatingButton";
import { AdminAwareChrome } from "@/components/layout/AdminAwareChrome";
import { JsonLd } from "@/components/shared/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/config";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.brand.name} | ${siteConfig.brand.slogan}`,
    template: `%s | ${siteConfig.brand.name}`,
  },
  description: siteConfig.brand.shortDescription,
  keywords: [
    "çocuk odası mobilyası",
    "genç odası takımları",
    "bebek odası takımları",
    "montessori çocuk odası",
    "çocuk gardırop modelleri",
    "çocuk odası esenyurt",
    "genç odası gaziosmanpaşa",
  ],
  icons: {
    icon: [
      { url: "/logo/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/logo/icon-180.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${fraunces.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <AdminAwareChrome
          header={<SiteHeader />}
          footer={<Footer />}
          whatsapp={<WhatsAppFloatingButton />}
        >
          {children}
        </AdminAwareChrome>
      </body>
    </html>
  );
}
