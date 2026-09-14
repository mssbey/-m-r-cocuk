import { siteConfig } from "@/lib/config";
import { SectionHeading } from "@/components/shared/SectionHeading";

const coreReasons = [
  {
    title: "Geniş Ürün Seçeneği",
    description: "Bebek, çocuk ve gençlere uygun geniş ürün seçenekleri.",
  },
  {
    title: "Fonksiyonel Çözümler",
    description: "Farklı yaşam alanlarına uygun kullanışlı mobilya çözümleri.",
  },
  {
    title: "Mağazada İnceleme",
    description: "Ürünleri satın almadan önce mağazada yakından inceleme imkânı.",
  },
  {
    title: "İlgili İletişim",
    description: "Satış öncesi ve satış sonrasında ilgili ve ulaşılabilir iletişim.",
  },
  {
    title: "İki Mağaza",
    description: "Esenyurt ve Gaziosmanpaşa'da iki farklı İstanbul mağazası.",
  },
];

export function WhyUs() {
  const extraBadges = [
    siteConfig.features.showFreeDelivery ? "Ücretsiz Teslimat" : null,
    siteConfig.features.showFreeInstallation ? "Ücretsiz Kurulum" : null,
    siteConfig.features.showEasyReturns ? "Kolay İade" : null,
    siteConfig.features.warrantyYears
      ? `${siteConfig.features.warrantyYears} Yıl Garanti`
      : null,
  ].filter((v): v is string => Boolean(v));

  return (
    <section className="bg-brand-cream py-16 sm:py-20">
      <div className="container-brand">
        <SectionHeading
          align="center"
          eyebrow="Neden Ömür Çocuk?"
          title="Kalite ve Güvenle Yanınızdayız"
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {coreReasons.map((reason) => (
            <div
              key={reason.title}
              className="rounded-2xl border border-brand-babyblue/30 bg-white p-5 text-center soft-shadow"
            >
              <h3 className="font-display text-base text-brand-navy">{reason.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        {extraBadges.length > 0 ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {extraBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-brand-sky px-4 py-2 text-xs font-semibold text-brand-navy"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
