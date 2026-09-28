export const MAX_REFERENCE_FILES = 6;
export const MAX_REFERENCE_SIZE = 8 * 1024 * 1024;
export const MAX_REFERENCE_TOTAL = 24 * 1024 * 1024;
export const REFERENCE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateReferenceFiles(
  files: readonly { size: number; type: string }[],
): string | null {
  if (files.length > MAX_REFERENCE_FILES)
    return "En fazla 6 görsel seçebilirsiniz.";
  if (files.some((file) => !REFERENCE_TYPES.includes(file.type)))
    return "Yalnızca JPG, PNG veya WebP görsel seçin.";
  if (files.some((file) => file.size === 0 || file.size > MAX_REFERENCE_SIZE))
    return "Her görsel 8 MB veya daha küçük olmalı ve boş olmamalıdır.";
  if (files.reduce((sum, file) => sum + file.size, 0) > MAX_REFERENCE_TOTAL)
    return "Görsellerin toplamı 24 MB’ı geçmemelidir.";
  return null;
}

export type CustomRequestFields = {
  name: string;
  phone: string;
  product: string;
  dimensions: string;
  fabric: string;
  message: string;
};
export function buildCustomRequestMessage(
  fields: CustomRequestFields,
  requestId: string,
  fileNames: string[],
) {
  return [
    "Merhaba, Ömür Çocuk özel üretim talebim:",
    `Talep No: ${requestId}`,
    `Ad Soyad: ${fields.name}`,
    `Telefon: ${fields.phone}`,
    fields.product ? `Ürün / Tasarım: ${fields.product}` : null,
    fields.dimensions ? `Ölçüler: ${fields.dimensions}` : null,
    fields.fabric
      ? `Kumaş / Renk tercihi (numune teyidi gerekli): ${fields.fabric}`
      : null,
    `Talebim: ${fields.message}`,
    fileNames.length
      ? `Referans görseller (${fileNames.length}):\n${fileNames.map((name, index) => `${index + 1}. ${name}`).join("\n")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
}
