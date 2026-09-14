import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";

export function ContactCTA() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-brand">
        <div className="rounded-[2rem] bg-brand-navy px-6 py-14 text-center sm:px-12 sm:py-16">
          <h2 className="text-balance font-display text-3xl text-white sm:text-4xl">
            Çocuğunuz İçin En Doğru Odayı Birlikte Seçelim
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-white/75 sm:text-base">
            Ürünler, ölçüler, renk seçenekleri ve mağaza bilgileri için
            bizimle iletişime geçin.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildDefaultWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-6 py-3.5 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-cream"
            >
              WhatsApp&apos;tan Yazın
            </a>
            <a
              href={siteConfig.contact.phoneHref}
              className="rounded-full border border-white/30 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {siteConfig.contact.phoneDisplay}
            </a>
            <Link
              href="/magazalarimiz"
              className="rounded-full border border-white/30 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Mağazalarımızı Görün
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
