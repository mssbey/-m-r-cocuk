import Image from "next/image";
import gallery from "@/lib/data/gallery.json";
import { sortGallery, type GalleryItem } from "@/lib/admin/catalog-types";
export function CompanyGallery({
  category,
}: {
  category?: "factory" | "delivery";
}) {
  const items = sortGallery(gallery as GalleryItem[]).filter(
    (x) => !category || x.category === category,
  );
  if (!items.length) return null;
  return (
    <section
      className="my-10"
      aria-label={
        category === "factory" ? "Fabrikamız" : "Fabrika ve teslimatlar"
      }
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((x) => (
          <figure key={x.id}>
            <Image
              src={x.src}
              alt={x.caption}
              width={800}
              height={533}
              className="aspect-[3/2] w-full rounded object-cover"
            />
            <figcaption className="mt-2 text-sm">{x.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
