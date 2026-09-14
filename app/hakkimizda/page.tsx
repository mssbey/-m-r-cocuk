import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { DecorativeDivider } from "@/components/shared/DecorativeDivider";

export const metadata: Metadata = buildMetadata({
  title: "Hakkımızda",
  description:
    "Ömür Çocuk, çocukların ve gençlerin dünyasını yansıtan bebek, çocuk ve genç odası mobilyaları sunar.",
  path: "/hakkimizda",
});

export default function AboutPage() {
  return (
    <div className="container-brand py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Hakkımızda" }]} />

      <div className="mt-6 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h1 className="font-display text-3xl text-brand-navy sm:text-4xl">
            Hakkımızda
          </h1>
          <div className="mt-6 flex flex-col gap-4 leading-relaxed text-brand-gray">
            <p>
              Ömür Çocuk, çocukların ve gençlerin kendilerini mutlu, rahat ve
              güvende hissedebilecekleri yaşam alanları oluşturmak amacıyla
              hizmet veren bir çocuk ve genç odası mobilya markasıdır.
            </p>
            <p>
              Her çocuğun odasının onun dünyasını yansıttığına inanıyor;
              bebek, çocuk ve genç odası mobilyalarında estetik, fonksiyonellik
              ve kullanışlılığı bir araya getiren geniş ürün seçeneklerini
              ailelerle buluşturuyoruz.
            </p>
            <p>
              Karyoladan ranzaya, gardıroptan çalışma masasına, tamamlayıcı
              mobilyalardan farklı oda konseptlerine kadar sunduğumuz
              ürünlerle farklı ihtiyaçlara ve zevklere uygun çözümler
              geliştirmeyi hedefliyoruz.
            </p>
            <p>
              Bugün Esenyurt ve Gaziosmanpaşa şubelerimizle müşterilerimize
              hizmet verirken, satış öncesinden ürün seçimine ve satış
              sonrasına kadar güvenilir ve ilgili bir alışveriş deneyimi
              sunmayı önemsiyoruz.
            </p>
            <p>
              Ömür Çocuk olarak amacımız; çocukların hayallerine, gençlerin
              tarzına ve ailelerin beklentilerine uygun odalar oluşturmak.
            </p>
            <p className="font-display text-lg italic text-brand-navy">
              Ömür Çocuk – Onların dünyasına yakışan odalar.
            </p>
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl soft-shadow-lg">
          <PlaceholderImage label="Mağaza görseli yakında" icon="house" />
        </div>
      </div>

      <div className="my-14">
        <DecorativeDivider />
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <AboutPillar
          title="Her Yaşa Uygun Yaşam Alanları"
          description="Bebeklik döneminden gençliğe kadar, her yaş grubuna uygun oda çözümleri sunuyoruz."
        />
        <AboutPillar
          title="Estetik ve Fonksiyonellik"
          description="Şık tasarımları kullanışlı çözümlerle bir araya getirerek konforlu yaşam alanları oluşturuyoruz."
        />
        <AboutPillar
          title="Ailelerin Yanında"
          description="Ürün seçiminden satış sonrasına kadar ailelerimizin yanında olmayı önemsiyoruz."
        />
        <AboutPillar
          title="Esenyurt ve Gaziosmanpaşa Mağazalarımız"
          description="İstanbul'daki iki mağazamızda sizi ağırlamaktan mutluluk duyarız."
        />
      </div>
    </div>
  );
}

function AboutPillar({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-brand-babyblue/30 bg-white p-6 soft-shadow">
      <h2 className="font-display text-lg text-brand-navy">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-brand-gray">{description}</p>
    </div>
  );
}
