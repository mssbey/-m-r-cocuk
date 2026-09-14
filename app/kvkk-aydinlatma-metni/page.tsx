import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LegalPageShell } from "@/components/shared/LegalPageShell";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = buildMetadata({
  title: "KVKK Aydınlatma Metni",
  description: "6698 Sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni taslağı.",
  path: "/kvkk-aydinlatma-metni",
  noIndex: true,
});

export default function KvkkPage() {
  return (
    <LegalPageShell title="KVKK Aydınlatma Metni">
      <p>
        İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu
        (&quot;KVKK&quot;) uyarınca, veri sorumlusu sıfatıyla{" "}
        {siteConfig.brand.legalName} tarafından, iletişim formu üzerinden
        paylaştığınız kişisel verilerinizin işlenmesine ilişkin genel
        çerçeveyi taslak olarak ortaya koymak amacıyla hazırlanmıştır.
      </p>

      <h2>1. Veri Sorumlusu</h2>
      <p>
        {siteConfig.brand.legalName} — Esenyurt ve Gaziosmanpaşa
        mağazaları, İstanbul.
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <ul>
        <li>Kimlik bilgisi (ad soyad)</li>
        <li>İletişim bilgisi (telefon, e-posta)</li>
        <li>İletişim formunda paylaştığınız mesaj içeriği</li>
      </ul>

      <h2>3. Kişisel Verilerin İşlenme Amacı</h2>
      <p>
        Paylaştığınız kişisel veriler; talebinizin değerlendirilmesi ve
        tarafınızla iletişime geçilmesi amacıyla işlenir. Bu amaç dışında
        üçüncü taraflarla paylaşılmaz.
      </p>

      <h2>4. Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi</h2>
      <p>
        Kişisel verileriniz, internet sitemizdeki iletişim formunu
        doldurmanız suretiyle elektronik ortamda, KVKK m.5/2 kapsamındaki
        &quot;ilgili kişinin talebi üzerine sözleşmenin kurulması veya ifasıyla
        doğrudan doğruya ilgili olması&quot; ve açık rızanız hukuki sebeplerine
        dayanılarak toplanmaktadır.
      </p>

      <h2>5. Haklarınız</h2>
      <p>
        KVKK&apos;nın 11. maddesi uyarınca kişisel verilerinizin işlenip
        işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,
        işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,
        yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,
        eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya
        yok edilmesini isteme haklarına sahipsiniz.
      </p>
      <p>
        Bu haklarınızı kullanmak için {siteConfig.contact.phoneDisplay}{" "}
        numarasından bizimle iletişime geçebilirsiniz.
      </p>
    </LegalPageShell>
  );
}
