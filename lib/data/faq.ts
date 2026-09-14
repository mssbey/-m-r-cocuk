import type { FaqItem } from "@/lib/types";

/**
 * Sıkça sorulan sorular.
 *
 * Yalnızca doğrulanabilir/nötr bilgiler yer alır. Teslimat süresi, garanti
 * yılı, ücretsiz kurulum gibi doğrulanmamış konularda kesin taahhüt
 * verilmez; kullanıcı iletişime yönlendirilir.
 */
export const faqItems: FaqItem[] = [
  {
    id: "urunleri-magazada-gorebilir-miyim",
    question: "Ürünleri satın almadan önce mağazada görebilir miyim?",
    answer:
      "Evet. Esenyurt ve Gaziosmanpaşa mağazalarımızda ürünlerin büyük bölümünü yakından inceleyebilir, ölçü ve malzeme hakkında mağaza ekibimizden bilgi alabilirsiniz.",
  },
  {
    id: "fiyat-bilgisi-nasil-alinir",
    question: "Ürün fiyatlarını web sitesinde neden göremiyorum?",
    answer:
      "Bazı ürünlerimizde fiyat bilgisi stok ve kampanya durumuna göre değişebildiği için web sitesinde güncel olmayan bir fiyat göstermek istemiyoruz. Bu ürünlerde 'Fiyat ve detaylı bilgi için iletişime geçin' butonunu kullanarak WhatsApp veya telefon üzerinden güncel bilgiye hemen ulaşabilirsiniz.",
  },
  {
    id: "teslimat-kurulum",
    question: "Teslimat ve kurulum hizmeti sunuyor musunuz?",
    answer:
      "Teslimat ve kurulum koşulları ürüne ve bulunduğunuz bölgeye göre değişebilir. Güncel ve size özel bilgiyi öğrenmek için ilgili ürün sayfasından veya WhatsApp hattımızdan bizimle iletişime geçmenizi öneririz.",
  },
  {
    id: "hangi-yas-gruplarina-uygun",
    question: "Ürünleriniz hangi yaş gruplarına uygun?",
    answer:
      "Kataloğumuzda bebeklik döneminden gençlik dönemine kadar farklı yaş gruplarına uygun oda çözümleri bulunur. Bebek Odaları, Genç Odaları ve Montessori Odaları kategorilerinden ihtiyacınıza uygun olanı inceleyebilirsiniz.",
  },
  {
    id: "montessori-nedir",
    question: "Montessori odaları diğer odalardan farkı nedir?",
    answer:
      "Montessori odalarımızda yer yataklarına ve çocuğun bağımsız hareket edebileceği düzenlemelere yer verilir. Bu, tıbbi veya pedagojik bir tedavi yöntemi değil; oda içi mobilya tercihiyle ilgili bir tasarım yaklaşımıdır.",
  },
  {
    id: "renk-ve-olcu-secenekleri",
    question: "Ürünlerde farklı renk veya ölçü seçenekleri var mı?",
    answer:
      "Bazı ürünlerde farklı renk seçenekleri bulunur ve bu seçenekler ilgili ürün sayfasında belirtilir. Ürün sayfasında seçenek görünmüyorsa, güncel seçenekleri öğrenmek için bizimle iletişime geçebilirsiniz.",
  },
  {
    id: "favoriler-nasil-calisir",
    question: "Favorilere eklediğim ürünler nerede saklanıyor?",
    answer:
      "Favori ürünleriniz, bir üyelik gerektirmeden tarayıcınızda saklanır. Böylece siteye tekrar girdiğinizde favori listeniz aynı cihaz ve tarayıcıda karşınıza çıkar. Farklı bir cihaz veya tarayıcıda favori listeniz görünmez.",
  },
  {
    id: "magazalarin-adresi",
    question: "Mağazalarınız nerede?",
    answer:
      "Esenyurt mağazamız Eskidji Bazaar Haramidere AVM (Mağaza No: E-26, En Üst Kat) içinde, Gaziosmanpaşa mağazamız ise Yenidoğan Mah. Ordu Cad. No:152 adresinde yer almaktadır. Detaylı yol tarifi için Mağazalarımız sayfamızı ziyaret edebilirsiniz.",
  },
];
