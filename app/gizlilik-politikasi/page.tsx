import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { LegalPageShell } from "@/components/shared/LegalPageShell";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = buildMetadata({
  title: "Gizlilik Politikası",
  description: "Ömür Çocuk gizlilik politikası taslağı.",
  path: "/gizlilik-politikasi",
  noIndex: true,
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Gizlilik Politikası">
      <p>
        Bu Gizlilik Politikası, {siteConfig.brand.legalName} (&quot;Ömür
        Çocuk&quot;) tarafından işletilen {siteConfig.siteUrl} internet
        sitesini ziyaret eden kullanıcıların kişisel verilerinin ne şekilde
        işlendiğine ilişkin genel bilgilendirme amacıyla hazırlanmış bir
        taslaktır.
      </p>

      <h2>1. Hangi Bilgiler Toplanır?</h2>
      <p>
        Site üzerinden iletişim formunu doldurduğunuzda, form bir sunucuya
        veri göndermez; ad soyad, telefon, e-posta (opsiyonel) ve mesaj
        içeriğiniz WhatsApp uygulaması üzerinden doğrudan tarafımıza
        iletilmek üzere hazırlanır. Bu bilgiler WhatsApp&apos;ın kendi
        gizlilik politikası kapsamında işlenir.
      </p>
      <p>
        Favori ürünler özelliği, herhangi bir kişisel veri sunucuya
        gönderilmeden, yalnızca tarayıcınızın yerel depolama alanında
        (localStorage) saklanır.
      </p>

      <h2>2. Bilgilerin Kullanım Amacı</h2>
      <p>
        Toplanan bilgiler; talebinizin değerlendirilmesi, sizinle iletişime
        geçilmesi ve mağazalarımızdaki ürün/hizmetler hakkında bilgi
        verilmesi amacıyla kullanılır.
      </p>

      <h2>3. Çerezler</h2>
      <p>
        Site üzerinde kullanılan çerezler hakkında detaylı bilgiye{" "}
        <Link href="/cerez-politikasi">Çerez Politikası</Link> sayfasından
        ulaşabilirsiniz.
      </p>

      <h2>4. İletişim</h2>
      <p>
        Gizlilikle ilgili sorularınız için {siteConfig.contact.phoneDisplay}{" "}
        numarasından bizimle iletişime geçebilirsiniz.
      </p>
    </LegalPageShell>
  );
}
