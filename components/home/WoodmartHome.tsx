"use client";

import { useEffect, useRef, useState } from "react";
import { useProductCarousel } from "@/hooks/useProductCarousel";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { isRoomSet } from "@/lib/room-sets";
import { FavoriteButton } from "@/components/product/FavoriteButton";
import { PriceTag } from "@/components/shared/PriceTag";
import { buildDefaultWhatsAppUrl, buildWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/config";

import { FactoryInvite } from "@/components/shared/FactoryInvite";
import { ReferencesSection } from "@/components/home/ReferencesSection";
import { CategoryLinks } from "@/components/layout/CategoryLinks";
import { CategoryIcon } from "@/components/home/CategoryIcon";
import { collectionGroups } from "@/lib/data/collection-groups";
import heroSlides from "@/lib/data/hero-slides.json";
import type { HeroSlide } from "@/lib/admin/catalog-types";

// Admin panelindeki "Ana Sayfa Slider" ekranından yönetilir.
const slides = heroSlides as HeroSlide[];
const tabs = ["Öne çıkanlar", "Yeni ürünler", "Kampanyalar"];
const SLIDE_INTERVAL = 5000;
// İlk slayt sabit "görüntülü arama" duyurusu; ardından admin slaytları gelir.
const slideCount = slides.length + 1;
const videoCallUrl = buildWhatsAppUrl(
  "Merhaba, mağazanıza gelemiyorum. Ürünlerinizi görüntülü arama ile canlı olarak incelemek istiyorum.",
);
const slideSizes =
  "(min-width: 1232px) 972px, (min-width: 1051px) calc(100vw - 260px), (min-width: 801px) calc(100vw - 210px), calc(100vw - 30px)";

function VideoCallSlide({
  image,
  alt,
  priority,
}: {
  image: string;
  alt: string;
  priority: boolean;
}) {
  return (
    <div className="shop-hero-picture video-call-slide">
      <div className="video-call-media">
        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes={slideSizes}
          className="object-cover"
        />
      </div>
      <div className="video-call-content">
        <p className="video-call-eyebrow">Mağazaya gelemediniz mi?</p>
        <h1>
          Ürünlerimizi <span>Görüntülü Arama</span> ile Canlı Olarak
          İnceleyin!
        </h1>
        <p className="video-call-text">
          Ürünleri canlı görün, detayları yakından inceleyin.
        </p>
        <a
          href={videoCallUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="video-call-button"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 7a2 2 0 012-2h9a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm14 3.2l4-2.7v9l-4-2.7v-3.6z" />
          </svg>
          Görüntülü Arama Başlat
          <span aria-hidden="true">›</span>
        </a>
      </div>
    </div>
  );
}

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
  const [sliderPaused, setSliderPaused] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const current = slide > 0 ? slides[slide - 1] : null;
  // Slider kendiliğinden ilerler; fareyle üzerine gelince veya odaklanınca
  // durur. Her slayt değişiminde süre baştan başlar.
  useEffect(() => {
    if (sliderPaused || slideCount < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(
      () => setSlide((s) => (s + 1) % slideCount),
      SLIDE_INTERVAL,
    );
    return () => window.clearTimeout(timer);
  }, [slide, sliderPaused]);
  function changeTab(index: number) {
    setTab(index);
    reset();
  }
  // Ana sayfada yalnızca oda takımları; tekli parçalar takımın içinde.
  const active = products.filter((p) => p.status === "active" && isRoomSet(p));
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
            onMouseEnter={() => setSliderPaused(true)}
            onMouseLeave={() => setSliderPaused(false)}
            onFocus={() => setSliderPaused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget))
                setSliderPaused(false);
            }}
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
                  (slide + (dx < 0 ? 1 : slideCount - 1)) % slideCount,
                );
            }}
          >
            <div
              className="shop-hero-inner"
              key={slide}
              aria-live={sliderPaused ? "polite" : "off"}
            >
              {/* Her slaytta görüntülü arama çağrısı; arka planda slayt görseli. */}
              <VideoCallSlide
                image={
                  current?.image ??
                  "/images/editorial/anne-bebek-goruntulu-arama.webp"
                }
                alt={
                  current
                    ? current.name ||
                      current.title.replace(/\n/g, " ") ||
                      current.tag ||
                      "Ömür Çocuk koleksiyonu"
                    : "Kucağında bebeğiyle telefonundan görüntülü görüşme yapan anne"
                }
                priority={slide === 0}
              />
            </div>
            <button
              className="shop-slide-arrow shop-slide-prev"
              aria-label="Önceki koleksiyon"
              onClick={() =>
                setSlide((slide + slideCount - 1) % slideCount)
              }
            >
              ‹
            </button>
            <button
              className="shop-slide-arrow shop-slide-next"
              aria-label="Sonraki koleksiyon"
              onClick={() => setSlide((slide + 1) % slideCount)}
            >
              ›
            </button>
            <div className="shop-slide-dots">
              {[{ id: "goruntulu-arama", tag: "GÖRÜNTÜLÜ ARAMA" }, ...slides].map(
                (s, i) => (
                  <button
                    key={s.id}
                    aria-label={
                      s.tag ? `${i + 1}. slayt: ${s.tag}` : `${i + 1}. slayt`
                    }
                    aria-pressed={i === slide}
                    onClick={() => setSlide(i)}
                  />
                ),
              )}
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
          <div className="category-icon-grid">
            {categories.map((c) => (
              <Link
                className="category-icon-card"
                href={`/${c.slug}`}
                key={c.slug}
              >
                <span className="category-icon">
                  <CategoryIcon slug={c.slug} />
                </span>
                <div className="category-icon-copy">
                  <h3>{c.name}</h3>
                  <p>{c.shortDescription}</p>
                </div>
                <span className="category-icon-arrow" aria-hidden="true">
                  ›
                </span>
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
          title="ODA TAKIMLARI"
          text="Bir odaya girin, takımın tüm parçalarını tek tek keşfedin."
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
                {(p.campaignLabel || p.isNew) && (
                  <span className="shop-product-badge">
                    {p.campaignLabel || "Yeni"}
                  </span>
                )}
              </div>
              <div className="shop-product-content">
                <p className="shop-product-category">{categories.find((c) => c.slug === p.category)?.name}</p>
                <Link href={`/urun/${p.slug}`}>
                  <h3>{p.name}</h3>
                </Link>
                <div className="shop-product-bottom">
                  <PriceTag price={p.price} oldPrice={p.oldPrice} size="sm" />
                </div>
              </div>
            </article>
          ))}
        </div>
        {shown.length === 0 && (
          <div className="shop-empty">
            <p>Şu anda kampanyalı oda takımı bulunmuyor.</p>
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
      <section className="container-brand shop-montessori-banner">
        <Link href="/montessori" aria-label="Montessori yatakları inceleyin">
          <Image src="/images/editorial/montessori-dream.webp" alt="Montessori yataklı, aydınlık çocuk odası konsepti" width={1536} height={1024} sizes="(min-width: 1232px) 1200px, 100vw" />
        </Link>
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
            <span className="shop-about-brand">Ömür Çocuk.</span>
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
