import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="dream-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="editorial-eyebrow"><span /> KÜÇÜK DÜNYALAR, BÜYÜK HAYALLER</p>
        <h1 id="hero-title">Bir oda.<br />Bin hayal.<br /><em>Bir ömür mutluluk.</em></h1>
        <p className="hero-description">İlk uykusundan en büyük hayallerine…<br />Büyürken biriktireceği tüm güzel anılara<br className="hidden sm:block" /> eşlik eden odalar.</p>
        <Link href="#odalari-kesfet" className="editorial-button">Onun dünyasını keşfet <span aria-hidden="true">↗</span></Link>
        <div className="hero-footnote"><span className="little-spark" aria-hidden="true">✳</span><span>Sevgiyle seçilen detaylar.<br /><strong>Çocukluk kadar özel yaşam alanları.</strong></span></div>
      </div>
      <div className="hero-photograph">
        <Image src="/images/editorial/montessori-dream.webp" alt="Doğal ahşap ev çatılı yatak ve pudra mavisi detaylarla çocuk odası ilhamı" fill priority sizes="(min-width: 1024px) 62vw, 100vw" className="object-cover" />
        <div className="hero-image-label"><span>ÖMÜR ÇOCUK / ODA İLHAMINIZ</span><p>Hayallere yer açın.</p></div>
        <Link href="/montessori-odalari" className="hero-discover" aria-label="Montessori odalarını keşfet">↗</Link>
        <span className="concept-caption">Konsept oda görselidir.</span>
      </div>
    </section>
  );
}
