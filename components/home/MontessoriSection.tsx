import Link from "next/link";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";

export function MontessoriSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-brand grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray">
            Montessori Odaları
          </p>
          <h2 className="text-balance font-display text-3xl leading-tight text-brand-navy sm:text-4xl">
            Bağımsız ve Güvenli Bir Yaşam Alanı
          </h2>
          <p className="mt-5 max-w-lg text-balance leading-relaxed text-brand-gray">
            Çocukların bağımsız hareket edebileceği, kendilerini özgür ve
            güvende hissedebileceği yaşam alanları.
          </p>
          <Link
            href="/montessori-odalari"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-navy px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-brand-navy/90"
          >
            Montessori Odalarını Keşfet
          </Link>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl soft-shadow-lg">
            <PlaceholderImage label="Montessori oda görseli yakında" icon="star" />
          </div>
        </div>
      </div>
    </section>
  );
}
