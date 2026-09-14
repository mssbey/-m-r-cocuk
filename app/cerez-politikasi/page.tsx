import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LegalPageShell } from "@/components/shared/LegalPageShell";

export const metadata: Metadata = buildMetadata({
  title: "Çerez Politikası",
  description: "Ömür Çocuk çerez politikası taslağı.",
  path: "/cerez-politikasi",
  noIndex: true,
});

export default function CookiePolicyPage() {
  return (
    <LegalPageShell title="Çerez Politikası">
      <p>
        Bu Çerez Politikası, internet sitemizde kullanılan çerezler (cookie)
        ve benzeri teknolojiler hakkında genel bilgilendirme amacıyla
        hazırlanmış bir taslaktır.
      </p>

      <h2>1. Çerez Nedir?</h2>
      <p>
        Çerezler, ziyaret ettiğiniz internet siteleri tarafından
        tarayıcınıza kaydedilen küçük metin dosyalarıdır.
      </p>

      <h2>2. Sitemizde Kullanılan Depolama Teknolojileri</h2>
      <p>
        Sitemiz, favori ürünlerinizi hatırlamak amacıyla tarayıcınızın yerel
        depolama alanını (localStorage) kullanır. Bu veri, üyelik
        gerektirmeden yalnızca kullandığınız cihaz ve tarayıcıda saklanır;
        sunucularımıza gönderilmez ve farklı bir cihazda görüntülenmez.
      </p>
      <p>
        Site şu anda reklam/izleme amaçlı üçüncü taraf çerezleri
        kullanmamaktadır. Google Haritalar gömülü harita alanları
        kullanıldığında, Google&apos;ın kendi çerez politikası geçerli
        olabilir.
      </p>

      <h2>3. Çerezleri Nasıl Yönetebilirsiniz?</h2>
      <p>
        Tarayıcı ayarlarınızdan çerezleri/yerel depolama verilerini
        dilediğiniz zaman silebilir veya engelleyebilirsiniz. Bu durumda
        favori ürünler listeniz sıfırlanabilir.
      </p>
    </LegalPageShell>
  );
}
