import Image from "next/image";
import Link from "next/link";
import { factory } from "@/lib/data/factory";
import { buildMetadata } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { PageIntro } from "@/components/shared/PageIntro";

export const metadata = buildMetadata({
  title: "Fabrikamız",
  description: factory.description,
  path: "/fabrikamiz",
});
export default function FactoryPage() {
  return (
    <div className="container-brand flow-page">
      <PageIntro title="Fabrikamız" description={factory.title} />
      <div className="factory-details">
        <div>
          <p className="flow-lead">{factory.description}</p>
          <ol className="factory-steps">
            <li>
              <h2>Önce tanışalım.</h2>
              <p>WhatsApp üzerinden ziyaret gününü birlikte planlayalım.</p>
            </li>
            <li>
              <h2>Dokuları ve detayları inceleyin.</h2>
              <p>Ürünleri ve kumaş numunelerini yerinde görün.</p>
            </li>
            <li>
              <h2>Birlikte tasarlayalım.</h2>
              <p>
                Odanızın ölçülerini, renk tercihlerinizi ve referans
                görsellerinizi paylaşın.
              </p>
            </li>
          </ol>
        </div>
        <aside className="factory-visit">
          <p className="shop-eyebrow">SİZİ AĞIRLAMAK İSTERİZ</p>
          <h2>Üretim tesisimize gelin.</h2>
          {factory.address ? (
            <p>{factory.address}</p>
          ) : (
            <p>
              Ziyaret adresi ve uygun gün bilgisi için ekibimizle iletişime
              geçin.
            </p>
          )}
          <a
            href={buildWhatsAppUrl(
              "Merhaba, Ömür Çocuk üretim tesisini ziyaret etmek istiyorum. Adres ve randevu bilgisi alabilir miyim?",
            )}
            className="shop-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ziyaret Planlayın
          </a>
          {factory.mapsUrl && (
            <a href={factory.mapsUrl} target="_blank" rel="noopener noreferrer">
              Yol Tarifi Al →
            </a>
          )}
          <Link href="/ozel-uretim">Özel üretim talebi oluştur →</Link>
        </aside>
      </div>
      {factory.photos.length > 0 && (
        <section className="factory-gallery" aria-label="Üretim tesisimiz">
          {factory.photos.map((photo) => (
            <figure key={photo.src}>
              <Image src={photo.src} alt={photo.alt} width={900} height={675} />
              <figcaption>{photo.alt}</figcaption>
            </figure>
          ))}
        </section>
      )}
    </div>
  );
}
