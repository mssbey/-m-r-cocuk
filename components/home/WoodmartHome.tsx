"use client";

import { useRef, useState } from "react";
import { useProductCarousel } from "@/hooks/useProductCarousel";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { PriceTag } from "@/components/shared/PriceTag";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/config";

import { FactoryInvite } from "@/components/shared/FactoryInvite";
import { ReferencesSection } from "@/components/home/ReferencesSection";
import { CategoryLinks } from "@/components/layout/CategoryLinks";
import { collectionGroups } from "@/lib/data/collection-groups";

const slides = [
  {
    eyebrow: "ÖMÜR ÇOCUK KOLEKSİYONU",
    title: (
      <>
        Küçük odalar.
        <br /> Büyük hayaller.
      </>
    ),
    text: "İlk uykusundan en güzel hayallerine, birlikte büyüyen yaşam alanları.",
    image:
      "/images/products/montessori-odalari/vera-montessori-catili-yatak-01.webp",
    href: "/montessori-odalari",
    name: "Montessori odalarını keşfet",
    tag: "MONTESSORİ",
  },
  {
    eyebrow: "HAYATIN EN GÜZEL BAŞLANGICI",
    title: (
      <>
        İlk odası.
        <br /> İlk dünyası.
      </>
    ),
    text: "Bebeğinizin odasına sıcaklık katan, her detayı özenle seçilmiş mobilyalar.",
    image:
      "/images/products/bebek-odalari/vera-bebek-odasi-takimi-beyaz-01.webp",
    href: "/bebek-odalari",
    name: "Bebek odalarını keşfet",
    tag: "BEBEK ODALARI",
  },
  {
    eyebrow: "KENDİ DÜNYASINI KURSUN",
    title: (
      <>
        Onun tarzı.
        <br /> Onun odası.
      </>
    ),
    text: "Çalışmaya, dinlenmeye ve hayal kurmaya yer açan genç odası koleksiyonu.",
    image: "/images/products/genc-odalari/vera-full-oda-takimi-beyaz-01.webp",
    href: "/genc-odalari",
    name: "Genç odalarını keşfet",
    tag: "GENÇ ODALARI",
  },
];
const tabs = ["Öne çıkanlar", "Yeni ürünler", "Kampanyalar"];

function Heading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="shop-section-heading">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span className="shop-heading-rule" />
      <div>{text}</div>
    </div>
  );
}

export function WoodmartHome() {
  const [slide, setSlide] = useState(0);
  const [tab, setTab] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const current = slides[slide];
  function changeTab(index: number) {
    setTab(index);
    reset();
  }
  const active = products.filter((p) => p.status === "active");
  const shown = (
    tab === 2
      ? active.filter((p) => p.campaign)
      : tab === 1
        ? [...active].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        : active
  ).slice(0, 8);
  const {
    railRef,
    reset,
    move,
    playing,
    togglePlaying,
    dragging,
    interactionProps,
    railProps,
  } = useProductCarousel(shown.length, tab);
  return (
    <div className="woodmart-home">
      <section className="shop-hero" id="ana-slider">
        <div className="container-brand shop-hero-layout">
          <aside
            className="shop-sidebar"
            aria-label="Ürün kategorileri ve koleksiyonlar"
          >
            <CategoryLinks />
          </aside>
          <div
            className="shop-slider"
            role="region"
            aria-label="Ömür Çocuk koleksiyonları"
            aria-roledescription="slayt gösterisi"
            onTouchStart={(e) => {
              touchStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
              };
            }}
            onTouchEnd={(e) => {
              const start = touchStart.current;
              touchStart.current = null;
              if (!start) return;
              const dx = e.changedTouches[0].clientX - start.x;
              const dy = e.changedTouches[0].clientY - start.y;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy))
                setSlide(
                  (slide + (dx < 0 ? 1 : slides.length - 1)) % slides.length,
                );
            }}
          >
            <div className="shop-hero-inner" key={slide} aria-live="polite">
              <Link href={current.href} className="shop-hero-picture">
                <Image
                  src={current.image}
                  alt={current.name}
                  fill
                  priority={slide === 0}
                  sizes="(min-width: 1232px) 972px, (min-width: 1051px) calc(100vw - 260px), (min-width: 801px) calc(100vw - 210px), calc(100vw - 30px)"
                  className="object-contain"
                />
              </Link>
              <div className="shop-hero-copy">
                <p>{current.eyebrow}</p>
                <h1>{current.title}</h1>
                <div className="shop-hero-description">{current.text}</div>
                <Link className="shop-hero-link" href={current.href}>
                  {current.name} <span aria-hidden="true">›</span>
                </Link>
              </div>
            </div>
            <button
              className="shop-slide-arrow shop-slide-prev"
              aria-label="Önceki koleksiyon"
              onClick={() =>
                setSlide((slide + slides.length - 1) % slides.length)
              }
            >
              ‹
            </button>
            <button
              className="shop-slide-arrow shop-slide-next"
              aria-label="Sonraki koleksiyon"
              onClick={() => setSlide((slide + 1) % slides.length)}
            >
              ›
            </button>
            <div className="shop-slide-dots">
              {slides.map((s, i) => (
                <button
                  key={s.href}
                  aria-label={`${i + 1}. koleksiyon: ${s.tag}`}
                  aria-pressed={i === slide}
                  onClick={() => setSlide(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="shop-categories" id="odalari-kesfet">
        <div className="container-brand">
          <Heading
            eyebrow="ÖMÜR ÇOCUK KOLEKSİYONLARI"
            title="ÖNE ÇIKAN KATEGORİLER"
            text="Bebeklikten gençliğe, her yaşa ve her hayale bir oda."
          />
          <div className="room-discovery-grid">
            {categories
              .filter((c) => c.coverImage)
              .slice(0, 5)
              .map((c) => (
                <Link
                  className="room-discovery-card"
                  href={`/${c.slug}`}
                  key={c.slug}
                >
                  <div className="room-discovery-image">
                    <Image
                      src={c.coverImage!}
                      alt={c.name}
                      fill
                      sizes="(min-width: 801px) 40vw, (min-width: 541px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <span className="room-discovery-count">
                      {active.filter((p) => p.category === c.slug).length} ürün
                    </span>
                  </div>
                  <div className="room-discovery-copy">
                    <h3>{c.name}</h3>
                    <p>{c.shortDescription}</p>
                    <span className="room-discovery-link">
                      Koleksiyonu keşfet <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
      <section
        className="container-brand shop-section shop-products-section"
        {...interactionProps}
      >
        <Heading
          eyebrow="ODASININ YENİ FAVORİLERİ"
          title="SEÇİLİ ÜRÜNLER"
          text="Hayatınıza eşlik edecek tasarımları yakından keşfedin."
        />
        <div
          className="shop-product-tabs"
          role="tablist"
          aria-label="Ürün seçimi"
        >
          {tabs.map((label, i) => (
            <button
              key={label}
              role="tab"
              id={`product-tab-${i}`}
              aria-controls="home-products"
              aria-selected={tab === i}
              tabIndex={tab === i ? 0 : -1}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.preventDefault();
                  const next = (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                  changeTab(next);
                  document.getElementById(`product-tab-${next}`)?.focus();
                }
              }}
              onClick={() => changeTab(i)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="shop-rail-controls">
          {shown.length > 1 && (
            <button
              className="shop-rail-play"
              onClick={togglePlaying}
              aria-pressed={playing}
              aria-controls="home-products"
            >
              {playing ? "Kaydırmayı durdur" : "Otomatik kaydır"}
            </button>
          )}
          <button
            aria-label="Önceki ürünler"
            aria-controls="home-products"
            onClick={() => move(-1)}
          >
            ‹
          </button>
          <button
            aria-label="Sonraki ürünler"
            aria-controls="home-products"
            onClick={() => move(1)}
          >
            ›
          </button>
        </div>
        <div
          ref={railRef}
          tabIndex={0}
          id="home-products"
          role="tabpanel"
          aria-labelledby={`product-tab-${tab}`}
          className={`shop-product-grid${dragging ? " is-dragging" : ""}`}
          {...railProps}
        >
          {shown.map((p) => (
            <article className="shop-product" key={p.id}>
              <div className="shop-product-image">
                <Link href={`/urun/${p.slug}`}>
                  {p.coverImage && (
                    <Image
                      src={p.coverImage.src}
                      alt={p.coverImage.alt}
                      fill
                      sizes="(min-width: 900px) 25vw, 50vw"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="shop-product-favorite">
                  <FavoriteButton
                    productId={p.id}
                    productName={p.name}
                    size="sm"
                  />
                </div>
                {p.campaignLabel && (
                  <span className="shop-product-badge">{p.campaignLabel}</span>
                )}
              </div>
              <div className="shop-product-content">
                <p className="shop-product-category">{categories.find((c) => c.slug === p.category)?.name}</p>
                <Link href={`/urun/${p.slug}`}>
                  <h3>{p.name}</h3>
                </Link>
                <div className="shop-product-bottom">
                  <PriceTag price={p.price} oldPrice={p.oldPrice} size="sm" />
                  <Link className="shop-product-detail" href={`/urun/${p.slug}`}>
                    Ürünü incele <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        {shown.length === 0 && (
          <div className="shop-empty">
            <p>Şu anda kampanyalı ürün bulunmuyor.</p>
            <Link href="/urunler" className="shop-button">
              Tüm ürünleri keşfet →
            </Link>
          </div>
        )}
        <div className="shop-view-all">
          <Link href="/urunler" className="shop-outline-button">
            TÜM ÜRÜNLERİ GÖRÜNTÜLE
          </Link>
        </div>
      </section>
      <section className="shop-spotlight">
        <div className="container-brand shop-spotlight-inner">
          <div className="shop-spotlight-image">
            <Image
              src="/images/products/montessori-odalari/vera-montessori-transparent.png"
              alt="Vera Montessori çatılı yatak"
              fill
              sizes="(min-width: 900px) 55vw, 100vw"
              className="object-contain"
            />
          </div>
          <div className="shop-spotlight-copy">
            <p className="shop-eyebrow">BİR ODADAN DAHA FAZLASI</p>
            <h2>
              Montessori.
              <br />
              Keşfetmeye yer açın.
            </h2>
            <dl>
              <div>
                <dt>KOLEKSİYON</dt>
                <dd>Montessori Odaları</dd>
              </div>
              <div>
                <dt>YAŞAM ALANI</dt>
                <dd>Oyun, uyku ve hayaller</dd>
              </div>
              <div>
                <dt>MARKA</dt>
                <dd>Ömür Çocuk</dd>
              </div>
            </dl>
            <Link href="/montessori-odalari" className="shop-button">
              KOLEKSİYONU İNCELE →
            </Link>
          </div>
        </div>
      </section>
      <section className="container-brand shop-about">
        <div className="shop-about-image">
          <Image
            src="/images/editorial/nursery-sunlight.webp"
            alt="Bebek odası dekorasyon konsepti"
            fill
            sizes="(min-width: 900px) 50vw, 100vw"
            className="object-cover"
          />
          <small>Konsept oda görselidir.</small>
        </div>
        <div>
          <p className="shop-eyebrow">HER DETAYINDA SEVGİ</p>
          <h2>
            Ömür Çocuk.
            <br />
            Birlikte büyüyen tasarımlar.
          </h2>
          <p>
            Bebeklikten gençliğe, hayatın her dönemine eşlik eden mobilyaları
            bir araya getiriyoruz. Onun hayallerine, sizin hayatınıza yer açan
            odaları mağazalarımızda keşfedin.
          </p>
          <div className="shop-about-links">
            <Link href="/biz-kimiz" className="shop-button">
              BİZİ TANIYIN
            </Link>
            <Link href="/iletisim" className="shop-outline-button">
              İLETİŞİM
            </Link>
          </div>
        </div>
      </section>
      <section className="shop-contact-banner">
        <div className="container-brand">
          <p className="shop-eyebrow">HAYALİNİZDEKİ ODAYI BİRLİKTE BULALIM</p>
          <h2>Bir mesaj kadar yakınız.</h2>
          <p>
            Ürünler, ölçüler ve güncel bilgiler için bizimle iletişime geçin.
          </p>
          <a
            href={buildDefaultWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="shop-button"
          >
            WHATSAPP’TAN BİZE YAZIN →
          </a>
        </div>
      </section>
      <section
        className="container-brand shop-section shop-collections"
        aria-label="Ömür Çocuk koleksiyonları"
      >
        <Heading
          eyebrow="YAŞAM ALANINIZA BİR BAKIŞ"
          title="KOLEKSİYONLARIMIZ"
          text="Farklı tasarım yaklaşımlarını keşfedin, size uygun odayı birlikte oluşturalım."
        />
        <div className="flow-directory">
          {collectionGroups.map((group) => (
            <Link href={`/koleksiyonlar/${group.slug}`} key={group.slug}>
              <div>
                <h3>{group.name}</h3>
                <p>{group.description}</p>
              </div>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
      <FactoryInvite />
      <ReferencesSection />
      <section className="container-brand shop-section">
        <Heading
          eyebrow="ÖMÜR ÇOCUK’A BEKLİYORUZ"
          title="YAKINDAN TANIŞALIM"
          text="Dokulara dokunun, detayları keşfedin. İstanbul’daki mağazalarımızı ziyaret edin."
        />
        <div className="shop-stores">
          {siteConfig.stores.map((s, i) => (
            <article key={s.id}>
              <span className="shop-store-number">0{i + 1}</span>
              <h3>{s.district}</h3>
              <p>{s.addressLines.join(", ")}</p>
              <a
                href={s.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                YOL TARİFİ AL →
              </a>
            </article>
          ))}
          <article className="shop-store-help">
            <span className="shop-eyebrow">MERAK ETTİKLERİNİZ</span>
            <h3>Size yardımcı olalım.</h3>
            <p>Ürünlerimiz ve mağazalarımız hakkında sıkça sorulan sorular.</p>
            <Link href="/sss">SORULAR VE YANITLAR →</Link>
          </article>
        </div>
      </section>
    </div>
  );
}
