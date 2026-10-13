import gallery from "./gallery.json";
import { sortGallery, type GalleryItem } from "@/lib/admin/catalog-types";
export const factory = {
  title: "Ürünleri Mağazamızda Görün, Birlikte Tasarlayalım.",
  description:
    "Ömür Çocuk mağazalarımızda bebek, çocuk ve genç odası mobilyalarını yakından inceleyebilirsiniz. Ölçü, kumaş, renk ve tasarım seçeneklerini birlikte değerlendirerek ihtiyacınıza uygun çözümler oluşturuyoruz. Mağazamızı ziyaret edin, ürünleri ve kumaşları yerinde inceleyin.",
  address: null as string | null,
  mapsUrl: null as string | null,
  // Only approved photographs of the actual facility belong here.
  photos: sortGallery(gallery as GalleryItem[]).filter(x=>x.category==="factory").map(x=>({src:x.src,alt:x.caption})),
};
