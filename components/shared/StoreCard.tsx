import type { StoreInfo } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/config";

export function StoreCard({ store }: { store: StoreInfo }) {
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    store.fullAddress
  )}&output=embed`;

  const whatsappUrl = buildWhatsAppUrl(
    `Merhaba, ${store.shortName} hakkında bilgi almak istiyorum.`
  );

  return (
    <div
      id={store.id}
      className="overflow-hidden rounded-3xl border border-brand-babyblue/40 bg-white soft-shadow"
    >
      <div className="aspect-[16/9] w-full bg-brand-sky">
        <iframe
          src={mapEmbedSrc}
          title={`${store.shortName} harita konumu`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>

      <div className="p-6 sm:p-8">
        <h3 className="font-display text-2xl text-brand-navy">{store.shortName}</h3>
        <address className="mt-3 not-italic leading-relaxed text-brand-gray">
          {store.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>

        {store.openingHours ? (
          <p className="mt-3 text-sm text-brand-gray">
            <span className="font-medium text-brand-navy">Çalışma Saatleri:</span>{" "}
            {store.openingHours}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={store.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-navy/90"
            aria-label={`${store.shortName} için yol tarifi al`}
          >
            Yol Tarifi Al
          </a>
          <a
            href={siteConfig.contact.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-brand-navy/20 px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-cream"
            aria-label={`${store.shortName} numarasını ara`}
          >
            Telefonla Ara
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-babyblue bg-brand-sky px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-babyblue/50"
            aria-label={`${store.shortName} için WhatsApp'tan yazın`}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
