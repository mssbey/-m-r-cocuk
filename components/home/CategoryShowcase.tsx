import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/data/categories";

const rooms = [
  { slug: "bebek-odalari", note: "İlk merhabaya, ilk rüyaya…", number: "01" },
  { slug: "montessori-odalari", note: "Kendi başına keşfetsin.", number: "02" },
  { slug: "genc-odalari", note: "Kendi dünyası, kendi tarzı.", number: "03" },
];
export function CategoryShowcase() {
  return (
    <section id="odalari-kesfet" className="editorial-section container-brand">
      <div className="editorial-heading"><div><p className="editorial-eyebrow">HER YAŞIN AYRI BİR HİKÂYESİ VAR</p><h2>Onun dünyasına <em>yakışan.</em></h2></div><Link href="/urunler" className="editorial-text-link">Tüm ürünleri keşfet <span aria-hidden="true">↗</span></Link></div>
      <div className="room-grid">{rooms.map((room) => {
        const category = categories.find((item) => item.slug === room.slug)!;
        return <Link key={room.slug} href={`/${room.slug}`} className="room-card group"><div className="room-image"><Image src={category.coverImage!} alt={category.name} fill sizes="(min-width: 768px) 33vw, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /><span className="room-number">{room.number}</span><span className="room-arrow" aria-hidden="true">↗</span></div><div className="room-caption"><h3>{category.name}</h3><p>{room.note}</p></div></Link>;
      })}</div>
      <div className="category-tail"><span>Odayı tamamlayan küçük dokunuşlar</span><Link href="/dolap-gardrop">Dolap & Gardırop ↗</Link><Link href="/sifonyer-komodin">Şifonyer & Komodin ↗</Link><Link href="/genc-odalari">Genç odası mobilyaları ↗</Link></div>
    </section>
  );
}
