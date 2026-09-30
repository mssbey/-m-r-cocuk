import gallery from "./gallery.json";
import { sortGallery, type GalleryItem } from "@/lib/admin/catalog-types";
export const factory = {
  title: "Üretimi Yerinde Görün, Birlikte Tasarlayalım.",
  description:
    "Ömür Çocuk olarak ürünlerimizi kendi üretim tesisimizde üretiyoruz. Ölçü, kumaş, renk ve tasarım seçeneklerini birlikte değerlendirerek ihtiyacınıza uygun çözümler oluşturuyoruz. Fabrikamızı ziyaret edin, ürünleri ve kumaşları yerinde inceleyin.",
  address: null as string | null,
  mapsUrl: null as string | null,
  // Only approved photographs of the actual facility belong here.
  photos: sortGallery(gallery as GalleryItem[]).filter(x=>x.category==="factory").map(x=>({src:x.src,alt:x.caption})),
};
