import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { DecorativeDivider } from "@/components/shared/DecorativeDivider";

export function BrandMessage() {
  return (
    <section className="bg-brand-cream py-16 sm:py-20">
      <div className="container-brand grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl soft-shadow-lg">
          <PlaceholderImage label="Yaşam alanı görseli yakında" icon="cloud" />
        </div>

        <div>
          <h2 className="text-balance font-display text-3xl leading-tight text-brand-navy sm:text-4xl">
            Onların Dünyasına Konfor ve Şıklık Katın
          </h2>
          <p className="mt-5 text-balance leading-relaxed text-brand-gray">
            Kaliteli malzemeler, kullanışlı tasarımlar ve birbirinden özel
            modellerle çocuk ve genç odalarına keyifli yaşam alanları
            sunuyoruz.
          </p>
          <div className="mt-8">
            <DecorativeDivider />
          </div>
        </div>
      </div>
    </section>
  );
}
