/**
 * Merkezi marka / işletme yapılandırması.
 *
 * Bu dosya, sitede kullanılan tüm ticari bilgilerin (telefon, adres, WhatsApp,
 * sosyal medya, çalışma saatleri vb.) TEK kaynağıdır. Bilgi değiştiğinde
 * sadece bu dosyayı güncellemek yeterlidir.
 *
 * Doğrulanmamış hiçbir bilgi (kampanya oranı, teslimat süresi, garanti yılı
 * vb.) burada "kesin bilgi" olarak yazılmamalıdır. Bilinmeyen alanlar `null`
 * bırakılmış ve ilgili arayüz bileşenleri bu durumu buna göre yönetecek
 * şekilde tasarlanmıştır.
 */

export type StoreInfo = {
  id: string;
  name: string;
  shortName: string;
  addressLines: string[];
  fullAddress: string;
  district: string;
  city: string;
  phone: string;
  /** Adrese göre oluşturulmuş güvenli Google Haritalar arama linki (uydurma koordinat yok). */
  googleMapsUrl: string;
  /** Yönetimden doldurulabilecek çalışma saatleri. Bilgi doğrulanana kadar null. */
  openingHours: string | null;
};

export type SocialLink = {
  platform: "instagram" | "facebook" | "tiktok" | "youtube";
  label: string;
  url: string | null;
  enabled: boolean;
};

export const siteConfig = {
  brand: {
    name: "Ömür Çocuk",
    legalName: "Ömür Çocuk",
    slogan: "Onların dünyasına yakışan odalar.",
    shortDescription:
      "Bebek, çocuk ve gençlerin dünyasına yakışan estetik, konforlu ve kullanışlı yaşam alanları.",
  },

  /** Yayına alınacak alan adı. Ortam değişkeninden okunur, yoksa buraya düşer. */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.omurcocuk.com.tr",

  locale: "tr-TR",

  contact: {
    phoneDisplay: "0 543 311 54 33",
    /** tel: bağlantıları için normalize edilmiş numara. */
    phoneHref: "tel:+905433115433",
    whatsappNumber: "905433115433",
    email: null as string | null,
  },

  /** WhatsApp'a giderken kullanılacak varsayılan / genel mesaj. */
  whatsapp: {
    defaultMessage: "Merhaba, Ömür Çocuk ürünleri hakkında bilgi almak istiyorum.",
    productMessageTemplate: (productName: string, productUrl: string) =>
      `Merhaba, Ömür Çocuk web sitesindeki ${productName} hakkında fiyat ve detaylı bilgi almak istiyorum. Ürün bağlantısı: ${productUrl}`,
  },

  stores: [
    {
      id: "esenyurt",
      name: "Ömür Çocuk Esenyurt Mağazası",
      shortName: "Esenyurt Şubesi",
      addressLines: [
        "Eskidji Bazaar Haramidere AVM",
        "Mağaza No: E-26, En Üst Kat",
        "Esenyurt / İstanbul",
      ],
      fullAddress:
        "Eskidji Bazaar Haramidere AVM, Mağaza No: E-26, En Üst Kat, Esenyurt / İstanbul",
      district: "Esenyurt",
      city: "İstanbul",
      phone: "0 543 311 54 33",
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(
          "Eskidji Bazaar Haramidere AVM Esenyurt İstanbul"
        ),
      openingHours: null,
    },
    {
      id: "gaziosmanpasa",
      name: "Ömür Çocuk Gaziosmanpaşa Mağazası",
      shortName: "Gaziosmanpaşa Şubesi",
      addressLines: [
        "Yenidoğan Mah. Ordu Cad. No:152",
        "Gaziosmanpaşa / İstanbul",
      ],
      fullAddress:
        "Yenidoğan Mah. Ordu Cad. No:152, Gaziosmanpaşa / İstanbul",
      district: "Gaziosmanpaşa",
      city: "İstanbul",
      phone: "0 543 311 54 33",
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(
          "Yenidoğan Mah. Ordu Cad. No:152 Gaziosmanpaşa İstanbul"
        ),
      openingHours: null,
    },
  ] satisfies StoreInfo[],

  social: [
    {
      platform: "instagram",
      label: "Instagram",
      url: null,
      enabled: false,
    },
    {
      platform: "facebook",
      label: "Facebook",
      url: null,
      enabled: false,
    },
  ] satisfies SocialLink[],

  /**
   * Doğrulanmamış / henüz teyit edilmemiş ticari bilgiler için özellik
   * bayrakları. `false` / `null` olan alanlar arayüzde gösterilmez.
   * Gerçek bilgi netleştiğinde sadece burası güncellenmelidir.
   */
  features: {
    showCampaignsSection: false,
    showInstagramSection: false,
    showFreeDelivery: false,
    showFreeInstallation: false,
    showEasyReturns: false,
    warrantyYears: null as number | null,
  },

  /** Kurumsal / iletişim sayfalarında gösterilecek genel notlar. */
  legalNoticeDraftWarning:
    "Bu metin taslak niteliğindedir; yayına alınmadan önce bir hukuk danışmanı tarafından incelenmelidir.",
} as const;

export type SiteConfig = typeof siteConfig;
