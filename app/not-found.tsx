import Link from "next/link";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";
import { DecorativeDivider } from "@/components/shared/DecorativeDivider";

export default function NotFound() {
  return (
    <div className="container-brand flex flex-col items-center justify-center py-24 text-center sm:py-32">
      <p className="font-display text-7xl text-brand-babyblue sm:text-8xl">404</p>
      <div className="my-6">
        <DecorativeDivider />
      </div>
      <h1 className="font-display text-2xl text-brand-navy sm:text-3xl">
        Aradığınız Sayfa Bulunamadı
      </h1>
      <p className="mt-3 max-w-md text-brand-gray">
        Bağlantı hatalı olabilir ya da aradığınız sayfa taşınmış olabilir.
        Aşağıdaki bağlantılardan devam edebilirsiniz.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand-navy px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-navy/90"
        >
          Ana Sayfaya Dön
        </Link>
        <Link
          href="/urunler"
          className="rounded-full border border-brand-navy/20 px-6 py-3 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-cream"
        >
          Tüm Ürünler
        </Link>
        <a
          href={buildDefaultWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-brand-navy/20 px-6 py-3 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-cream"
        >
          WhatsApp&apos;tan Ulaşın
        </a>
      </div>
    </div>
  );
}
