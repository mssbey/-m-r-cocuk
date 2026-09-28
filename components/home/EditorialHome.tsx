import Image from "next/image";
import Link from "next/link";
import { products } from "@/lib/data/products";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { siteConfig } from "@/lib/config";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";

export function BrandRibbon() {
  return <div className="brand-ribbon"><span>Birlikte büyüyen tasarımlar</span><i aria-hidden="true">✳</i><span>Hayal kurmaya yer var</span><i aria-hidden="true">✳</i><span>Her detayında sevgi</span><i aria-hidden="true">✳</i><span>Bebeklikten gençliğe</span></div>;
}

export function EditorialStory() {
  return <section className="story-section"><div className="story-image"><Image src="/images/editorial/nursery-sunlight.webp" alt="Adaçayı yeşili duvarlar, ahşap beşik ve doğal dokularla sıcak bir bebek odası konsepti" fill sizes="(min-width: 900px) 55vw, 100vw" className="object-cover" /><span className="concept-caption">Konsept oda görselidir.</span><span className="story-image-note">İlk odası.<br /><em>İlk dünyası.</em></span></div><div className="story-copy"><p className="editorial-eyebrow">BİR MOBİLYADAN ÇOK DAHA FAZLASI</p><h2>En güzel anılar,<br /><em>onun odasında<br />başlar.</em></h2><p>Bir masalın son cümlesi, ilk kez kendi başına açtığı bir çekmece, saatlerce süren oyunlar… Bir çocuk odası, büyümenin en güzel tanığıdır.</p><p>Ömür Çocuk’ta bebeklikten gençliğe her döneme eşlik eden, hayatınıza ve onun hayallerine yer açan mobilyaları bir araya getiriyoruz.</p><Link href="/biz-kimiz" className="editorial-text-link">Hikâyemizi tanıyın <span aria-hidden="true">↗</span></Link></div></section>;
}

export function SelectedProducts() {
  const selected = ["bebek-odalari", "montessori-odalari", "genc-odalari", "sifonyer-komodin"].map(category => products.find(p => p.category === category && p.status === "active" && p.coverImage)).filter(p => p !== undefined);
  return <section className="editorial-section container-brand"><div className="editorial-heading"><div><p className="editorial-eyebrow">ODASININ YENİ FAVORİLERİ</p><h2>Küçük dünyalara <em>özel seçimler.</em></h2></div><Link href="/urunler" className="editorial-text-link">Kataloğu inceleyin ↗</Link></div><div className="selection-grid">{selected.map(product => <article className="selection-card" key={product.id}><div className="selection-image"><Link href={`/urun/${product.slug}`}><Image src={product.coverImage!.src} alt={product.coverImage!.alt} fill sizes="(min-width: 900px) 25vw, 50vw" className="object-cover" /></Link><div className="selection-favorite"><FavoriteButton productId={product.id} productName={product.name} size="sm" /></div></div><p className="selection-label">ÖMÜR ÇOCUK KOLEKSİYONU</p><Link href={`/urun/${product.slug}`}><h3>{product.name}</h3></Link><Link href={`/urun/${product.slug}`} className="selection-link">Detayları keşfet <span aria-hidden="true">↗</span></Link></article>)}</div></section>;
}

export function VisitSection() {
  return <section className="visit-section"><div className="container-brand"><div className="visit-intro"><p className="editorial-eyebrow">EKRANDAN GÜZEL. YAKINDAN DAHA GÜZEL.</p><h2>Gelin, hayalindeki odayı<br /><em>birlikte bulalım.</em></h2><p>Dokulara dokunun, detayları keşfedin. Sizi İstanbul’daki mağazalarımızda bekliyoruz.</p></div><div className="visit-stores">{siteConfig.stores.map((store, index) => <a href={store.googleMapsUrl} target="_blank" rel="noopener noreferrer" key={store.id} className="visit-store"><span className="store-index">0{index + 1} / İSTANBUL</span><h3>{store.district} <span aria-hidden="true">↗</span></h3><p>{store.addressLines.join(", ")}</p><span className="store-directions">Yol tarifi alın</span></a>)}</div><div className="visit-contact"><span>Aklınızda bir soru mu var? Bir mesaj kadar yakınız.</span><a href={buildDefaultWhatsAppUrl()} target="_blank" rel="noopener noreferrer">WhatsApp’tan konuşalım ↗</a></div></div></section>;
}
