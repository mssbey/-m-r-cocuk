import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = buildMetadata({
  title: "İletişim",
  description:
    "Ömür Çocuk ile telefon, WhatsApp veya iletişim formu üzerinden bize ulaşın.",
  path: "/iletisim",
});

export default function ContactPage() {
  return (
    <div className="container-brand py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "İletişim" }]} />
      <h1 className="mt-6 font-display text-3xl text-brand-navy sm:text-4xl">
        İletişim
      </h1>
      <p className="mt-3 max-w-2xl text-brand-gray">
        Ürünler, ölçüler, renk seçenekleri ve mağaza bilgileri için bizimle
        iletişime geçin.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-brand-babyblue/30 bg-white p-6 soft-shadow">
            <h2 className="font-display text-lg text-brand-navy">İletişim Bilgileri</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-brand-gray">
              <li>
                <a href={siteConfig.contact.phoneHref} className="hover:text-brand-navy">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={buildDefaultWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-navy"
                >
                  WhatsApp&apos;tan Yazın
                </a>
              </li>
            </ul>
          </div>

          {siteConfig.stores.map((store) => (
            <div
              key={store.id}
              className="rounded-2xl border border-brand-babyblue/30 bg-white p-6 soft-shadow"
            >
              <h2 className="font-display text-lg text-brand-navy">{store.shortName}</h2>
              <address className="mt-2 not-italic leading-relaxed text-brand-gray">
                {store.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="mt-2 text-sm text-brand-gray">
                {store.openingHours ?? "Çalışma saatleri için lütfen bizi arayın."}
              </p>
              <a
                href={store.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-navy underline-offset-4 hover:underline"
              >
                Yol Tarifi Al
              </a>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-brand-babyblue/30 bg-white p-6 soft-shadow sm:p-8">
          <h2 className="font-display text-lg text-brand-navy">Bize Yazın</h2>
          <div className="mt-5">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
