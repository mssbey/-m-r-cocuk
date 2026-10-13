import Link from "next/link";
import { CompanyGallery } from "./CompanyGallery";
import { factory } from "@/lib/data/factory";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function FactoryInvite() {
  return (
    <section className="factory-invite">
      <div className="container-brand">
        <p className="shop-eyebrow">MAĞAZAMIZDA TANIŞALIM</p>
        <h2>{factory.title}</h2>
        <p>{factory.description}</p>
        <CompanyGallery category="factory" />
        <div className="flow-actions">
          <Link className="shop-button" href="/fabrikamiz">
            Mağazamızı Ziyaret Edin
          </Link>
          <a
            className="shop-outline-button"
            href={buildWhatsAppUrl(
              "Merhaba, mağazanızı ziyaret edip ürünleri ve kumaşları incelemek istiyorum. Ziyaret için bilgi alabilir miyim?",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp’tan İletişime Geçin
          </a>
        </div>
      </div>
    </section>
  );
}
