import { siteConfig } from "@/lib/config";

/** Verilen mesajla bir wa.me bağlantısı oluşturur. */
export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encoded}`;
}

export function buildDefaultWhatsAppUrl(): string {
  return buildWhatsAppUrl(siteConfig.whatsapp.defaultMessage);
}

export function buildProductWhatsAppUrl(
  productName: string,
  productUrl: string
): string {
  return buildWhatsAppUrl(
    siteConfig.whatsapp.productMessageTemplate(productName, productUrl)
  );
}

export type ContactFormWhatsAppFields = {
  fullName: string;
  phone: string;
  email?: string;
  category?: string;
  message: string;
};

/**
 * İletişim formu, statik (backend'siz) barındırma nedeniyle sunucuya değil
 * doğrudan WhatsApp'a yönlendirir. Form alanları okunaklı bir mesaj olarak
 * biçimlendirilir.
 */
export function buildContactFormWhatsAppUrl(fields: ContactFormWhatsAppFields): string {
  const lines = [
    "Merhaba, Ömür Çocuk web sitesindeki iletişim formundan yazıyorum.",
    `Ad Soyad: ${fields.fullName}`,
    `Telefon: ${fields.phone}`,
  ];
  if (fields.email) lines.push(`E-posta: ${fields.email}`);
  if (fields.category) lines.push(`İlgilendiği Kategori: ${fields.category}`);
  lines.push(`Mesaj: ${fields.message}`);
  return buildWhatsAppUrl(lines.join("\n"));
}
