import { siteConfig } from "@/lib/config";
import { SectionHeading } from "@/components/shared/SectionHeading";

/**
 * Gerçek Instagram hesabı ve son paylaşım verisi bağlanmadan bu bölüm
 * gösterilmez. Hesap netleştiğinde `siteConfig.social` ve
 * `features.showInstagramSection` güncellenerek etkinleştirilebilir.
 */
export function InstagramSection() {
  const instagram = siteConfig.social.find((s) => s.platform === "instagram");
  if (!siteConfig.features.showInstagramSection || !instagram?.enabled || !instagram.url) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="container-brand">
        <SectionHeading align="center" eyebrow="Instagram" title="Bizi Takip Edin" />
        <div className="mt-8 text-center">
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-brand-navy underline-offset-4 hover:underline"
          >
            Instagram&apos;da Görüntüle
          </a>
        </div>
      </div>
    </section>
  );
}
