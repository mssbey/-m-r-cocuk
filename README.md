# Ömür Çocuk — Kurumsal Web Sitesi

Bebek, çocuk ve genç odası mobilyaları markası **Ömür Çocuk** için
Next.js (App Router) + TypeScript + Tailwind CSS ile geliştirilmiş,
production seviyesinde bir katalog/kurumsal web sitesi.

> **Durum:** Site teknik olarak tamamen çalışır durumdadır (menü, arama,
> filtreleme, favoriler, WhatsApp entegrasyonu, formlar). Paylaşılan
> ürün fotoğraflarından **69 gerçek ürün** işlenip kataloğa eklenmiştir
> (bkz. [Ürün Kataloğu](#ürün-kataloğu)). Bazı klasörlerdeki görseller
> ürün adı belirsiz olduğu için henüz eklenmemiştir — bkz. [Eşleştirme
> Bekleyen Görseller](#eşleştirme-bekleyen-görseller). Site **statik
> HTML export** olarak yapılandırılmıştır ve `npm run build` sonrası
> üretilen `out/` klasörü Node.js gerektirmeden `httpdocs` gibi bir
> paylaşımlı hosting kök dizinine doğrudan yüklenebilir — bkz. [Statik
> Export ile Yayınlama](#statik-export-ile-yayınlama). Ürünleri
> düzenlemek (açıklama yazma, görsel değiştirme, ürün ekleme/silme) için
> yerel bir [Admin Paneli](#admin-paneli) (`admin-server/`) bulunur.

---

## İçindekiler

1. [Teknoloji Yığını](#teknoloji-yığını)
2. [Kurulum](#kurulum)
3. [Geliştirme Ortamını Çalıştırma](#geliştirme-ortamını-çalıştırma)
4. [Production Build](#production-build)
5. [Environment Variables](#environment-variables)
6. [Proje Yapısı](#proje-yapısı)
7. [Ürün Kataloğu](#ürün-kataloğu)
8. [Eşleştirme Bekleyen Görseller](#eşleştirme-bekleyen-görseller)
9. [Ürün Ekleme / Düzenleme](#ürün-ekleme--düzenleme)
10. [Görsel Ekleme](#görsel-ekleme)
11. [Kategori Yönetimi](#kategori-yönetimi)
12. [Telefon, Adres ve İşletme Bilgilerini Değiştirme](#telefon-adres-ve-i̇şletme-bilgilerini-değiştirme)
13. [Admin Paneli](#admin-paneli)
14. [Statik Export ile Yayınlama](#statik-export-ile-yayınlama)
15. [Domain Bağlama](#domain-bağlama)
16. [Google Search Console Kurulumu](#google-search-console-kurulumu)
17. [Analytics Kurulumu](#analytics-kurulumu)
18. [Yayına Almadan Önce Gerekenler](#yayına-almadan-önce-gerekenler)

---

## Teknoloji Yığını

- **Next.js 16** (App Router, React Server Components)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **next/font** (Fraunces — başlıklar, Plus Jakarta Sans — gövde metni)
- **next/image** (otomatik WebP/AVIF, responsive `sizes`)
- Veri katmanı: yerel TypeScript modülleri (`lib/data/*`) — harici bir
  veritabanı veya CMS **kullanılmamıştır** (bkz. [Admin Paneli
  Notu](#admin-paneli-notu))
- Favoriler: `localStorage` (üyelik gerektirmez)

Harici bağımlılık yoktur (analytics, CMS, ödeme vb. entegre edilmemiştir).

## Kurulum

```bash
npm install
```

## Geliştirme Ortamını Çalıştırma

```bash
npm run dev
```

Site [http://localhost:3000](http://localhost:3000) adresinde açılır.

## Production Build

Bu proje **statik HTML export** olarak yapılandırılmıştır
(`next.config.ts` → `output: "export"`) — Node.js sunucusu
gerektirmeden herhangi bir paylaşımlı hosting / `httpdocs` klasörüne
yüklenebilir.

```bash
npm run build
```

Bu komut `out/` klasörüne tamamen statik bir site üretir (HTML, CSS, JS,
optimize edilmiş görseller, `sitemap.xml`, `robots.txt`). `npm run start`
komutu bu modda **kullanılmaz** (statik export'ta çalışan bir Next.js
sunucusu yoktur); üretilen `out/` klasörünü doğrudan bir statik dosya
sunucusuyla veya hosting panelinizin web kök dizinine (`httpdocs`,
`public_html` vb.) kopyalayarak yayınlayabilirsiniz — bkz. [Statik
Export ile Yayınlama](#statik-export-ile-yayınlama).

`npm run lint` ile ESLint kontrolünü, `npx tsc --noEmit` ile TypeScript
kontrolünü ayrı ayrı çalıştırabilirsiniz. Bu proje her iki kontrolü de
hatasız geçmektedir.

## Environment Variables

`.env.example` dosyasını `.env.local` olarak kopyalayıp
`NEXT_PUBLIC_SITE_URL` değerini yayına alınacak gerçek alan adıyla
güncelleyin:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SITE_URL=https://www.omurcocuk.com.tr
```

Bu değer; canonical URL, Open Graph, sitemap.xml ve yapılandırılmış
veri (JSON-LD) üretiminde kullanılır. Ayarlanmazsa kod içindeki
varsayılan değere (`lib/config.ts`) düşer.

## Proje Yapısı

```
app/                     Rotalar (App Router)
  [category]/             7 ana kategori (dinamik, tek şablon)
  urun/[slug]/             Ürün detay sayfası
  urunler/                 Tüm ürünler (arama/filtre)
  mobilyalar/               Dolap&Gardırop + Şifonyer&Komodin vitrini
  hakkimizda/, magazalarimiz/, iletisim/, sss/, favorilerim/
  gizlilik-politikasi/, kvkk-aydinlatma-metni/, cerez-politikasi/
  sitemap.ts, robots.ts

components/
  layout/                  Header, mega menü, mobil menü, arama, footer
  home/                    Ana sayfa bölümleri
  product/                 Ürün kartı, galeri, filtre, favoriler
  shared/                  Logo, breadcrumb, placeholder görsel, vb.
  forms/                   İletişim formu (WhatsApp'a yönlendirir)

lib/
  config.ts                MERKEZİ işletme/marka ayarları (tek kaynak)
  types.ts                 Ürün/kategori veri modelleri
  data/
    categories.json         7 ana kategori + alt kategoriler (veri)
    categories.ts            categories.json'ı okuyup tipler
    products.json            Ürün kataloğu verisi (69 gerçek ürün)
    products.ts               products.json'ı okuyup tipler + yardımcı fonksiyonlar
    collections.ts           Öne çıkan koleksiyonlar (6 koleksiyon)
    stores.ts, faq.ts
  seo.ts                   Metadata + JSON-LD üreticileri
  whatsapp.ts, favorites.ts, search.ts, utils.ts, nav.ts

public/
  logo/                    Marka logosu (navy/white varyantlar, favicon)
  images/products/         Kategoriye göre işlenmiş ürün görselleri (786 görsel)

admin-server/              Yerel ürün yönetim paneli (ayrı Express uygulaması,
                            bkz. "Admin Paneli" bölümü ve admin-server/README.md)

out/                       `npm run build` çıktısı — httpdocs'a yüklenecek statik site
```

## Ürün Kataloğu

Marka tarafından paylaşılan ürün fotoğraf klasörlerinden (proje kök
dizininde geçici olarak duran `1/`, `2/`, `3/` klasörleri — bkz. aşağıda)
**69 ürün, 786 görsel** otomatik olarak işlenip kataloğa eklenmiştir:

- Her görsel EXIF yönlendirmesi düzeltilerek, en fazla 2000 px genişliğe
  ölçeklenerek ve WebP formatına (kalite ~82) dönüştürülerek optimize
  edilmiştir — orijinal kaynak dosyalar 3,9 GB iken işlenmiş görseller
  toplam ~88 MB'a inmiştir.
- Dosya adları SEO uyumlu hale getirilmiştir (ör.
  `vera-full-oda-takimi-beyaz-01.webp`).
- Aynı koleksiyonun farklı parçaları (gardırop, şifonyer, karyola vb.)
  `collection` alanıyla birbirine bağlanmıştır; ürün detay sayfasında
  "Aynı Koleksiyondaki Parçalar" bölümünde otomatik olarak listelenir.
- 6 zengin koleksiyon (Vera, Alya, Nova - Beyaz, Orion - Aytaşı, Grow
  Büyüyen Beşik, Bloom Montessori) anasayfadaki "Öne Çıkan
  Koleksiyonlar" bölümünde öne çıkarılmıştır (`lib/data/collections.ts`).
- **Fiyat, ölçü, malzeme, renk bilgisi eklenmemiştir** — bunlar
  doğrulanmadığı için uydurulmamıştır. Ürün detay sayfalarında "Fiyat ve
  detaylı bilgi için iletişime geçin" + WhatsApp/telefon yönlendirmesi
  gösterilir (talep edilen "WhatsApp yönlendirmeli katalog site" modeli).
  Bu bilgiler netleştiğinde [Admin Paneli](#admin-paneli) üzerinden
  veya doğrudan `lib/data/products.json` içinde doldurulabilir.

## Eşleştirme Bekleyen Görseller

Aşağıdaki klasörlerdeki görseller **hiçbir ürüne otomatik olarak
eşleştirilmemiştir** çünkü dosya adları jenerik (`prettybaby-123.jpg`
gibi) olup hangi ürüne ait olduğunu belirtmemektedir. Talimat gereği
("emin değilseniz tahmin etmeyin") bu görseller için ürün kaydı
oluşturulmamıştır:

| Klasör | Görsel Sayısı | Not |
| --- | --- | --- |
| `2/180526_Cekimler/1` … `2/180526_Cekimler/6` | 179 | Muhtemelen 6 farklı ürün/oda çekimi; klasör adları yalnızca numara. |
| `2/180526_Cekimler/BEŞİKLER` | 134 | Birden fazla beşik modeli karışık olabilir. |
| `2/180526_Cekimler/TEKİL ÜRÜNLER` | 88 | Ürün adı belirtilmemiş tekil parçalar. |

Bu görselleri kataloğa eklemek için: ilgili klasördeki fotoğrafları
inceleyip hangi ürüne ait olduklarını (model adı, kategori) bildirin;
aynı işleme mantığı bu klasörler için de uygulanabilir.

Kaynak klasörler (`/1`, `/2`, `/3`) proje kök dizininde referans amacıyla
bırakılmıştır ancak **`.gitignore` ile hariç tutulmuştur** (toplam ~3,9 GB).
Depoyu şişirmemek için bu klasörleri projeden ayrı bir yere (harici disk,
ayrı bir arşiv deposu) taşımanız önerilir; taşımadan önce işlenmiş
görsellerin (`public/images/products/`) beklendiği gibi çalıştığını
doğrulayın.

## Ürün Ekleme / Düzenleme

**Önerilen yöntem: [Admin Paneli](#admin-paneli)** (`admin-server/`) —
tarayıcı üzerinden ürün açıklaması yazma, görsel yükleme/silme/sıralama,
ürün ekleme/silme ve tek tıkla yeniden yayınlama sağlar.

Alternatif olarak veriyi elle de düzenleyebilirsiniz — ürünler
`lib/data/products.json` içinde düz bir JSON dizisi olarak tutulur
(`lib/data/products.ts` bu dosyayı okuyup tipler ve yardımcı
fonksiyonları sağlar, kendisi düzenlenmez):

1. `lib/types.ts` içindeki `Product` tipini inceleyin.
2. `lib/data/products.json` içindeki diziye yeni bir kayıt ekleyin.
   Örnek:

```ts
{
  id: "bebek-karyolasi-luna",
  slug: "bebek-karyolasi-luna",
  name: "Luna Bebek Karyolası",
  category: "bebek-odalari",
  subcategory: "bebek-karyolalari",
  collection: null,
  shortDescription: "...",
  description: "...",
  productCode: "BK-001",
  images: [
    { src: "/images/products/bebek-odalari/luna-bebek-karyolasi-01.webp", alt: "Luna bebek karyolası önden görünüm", width: 1200, height: 1200 },
  ],
  coverImage: { src: "/images/products/bebek-odalari/luna-bebek-karyolasi-01.webp", alt: "Luna bebek karyolası önden görünüm", width: 1200, height: 1200 },
  price: null,            // Fiyat netleşene kadar null bırakın
  oldPrice: null,
  campaignLabel: null,
  colors: ["Beyaz", "Ceviz"],
  dimensions: "120 x 60 cm",
  materials: ["MDF"],
  setContents: [],
  optionalParts: [],
  features: [],
  careNotes: [],
  deliveryInfo: null,
  featured: false,
  campaign: false,
  status: "active",       // "draft" yaparsanız sitede görünmez
  seoTitle: "Luna Bebek Karyolası | Ömür Çocuk",
  seoDescription: "...",
  createdAt: "2026-01-15",
  updatedAt: "2026-01-15",
}
```

3. **Bilmediğiniz alanları `null` veya `[]` bırakın.** Arayüz bileşenleri
   bu alanları otomatik olarak gizler (ör. fiyat yoksa "Fiyat ve
   detaylı bilgi için iletişime geçin" yazısı gösterilir).
4. Kaydettiğinizde `npm run dev` otomatik olarak yeniden yükler; ürün
   ilgili kategori sayfasında, "Tüm Ürünler" sayfasında, aramada ve
   (varsa) favorilerde otomatik olarak görünür.

## Görsel Ekleme

1. Görselleri ilgili kategori klasörüne yerleştirin:
   `public/images/products/<kategori-klasoru>/` (bkz.
   `public/images/products/README.md`).
2. Dosya adlarını SEO uyumlu, Türkçe karaktersiz yazın
   (`montessori-yer-yatagi-01.webp`).
3. **WebP** formatını tercih edin; kaliteyi belirgin biçimde bozmadan
   sıkıştırın (örn. `sharp-cli`, Squoosh).
4. Ürün kaydında `images` dizisine ekleyin ve her görsel için anlamlı
   bir Türkçe `alt` metni yazın — bu hem erişilebilirlik hem SEO için
   zorunludur.
5. `next/image` bileşeni görselleri otomatik olarak optimize eder ve
   ekran boyutuna uygun sürümü sunar; ayrıca büyük orijinal dosyayı
   küçük kartlara yüklemez.

## Kategori Yönetimi

Kategoriler ve alt kategoriler `lib/data/categories.ts` içinde
tanımlıdır. Yeni bir alt kategori eklemek için ilgili kategorinin
`subcategories` dizisine `{ slug, name }` ekleyin — ürün filtrelerinde
ve mega menüde otomatik olarak görünür.

Yeni bir **ana kategori** eklemek (nadiren gerekir) için:
1. `lib/types.ts` içindeki `CategorySlug` union tipine yeni slug'ı ekleyin.
2. `lib/data/categories.ts` içine yeni `Category` kaydını ekleyin.
3. `public/images/products/` altına ilgili klasörü oluşturun.
4. Gerekirse `lib/nav.ts` içindeki mega menüye ekleyin.

## Telefon, Adres ve İşletme Bilgilerini Değiştirme

**Tek dosya:** `lib/config.ts`. Telefon numarası, WhatsApp numarası,
mağaza adresleri, sosyal medya bağlantıları ve "doğrulanmamış bilgi"
özellik bayrakları (`features`) burada toplanmıştır. Bu dosyayı
güncellediğinizde tüm sayfalar (header, footer, mağaza kartları,
WhatsApp linkleri, JSON-LD yapılandırılmış veri) otomatik olarak
güncellenir.

Örneğin ücretsiz teslimat, ücretsiz kurulum veya garanti süresi gibi
bilgiler doğrulandığında:

```ts
features: {
  showFreeDelivery: true,
  showFreeInstallation: true,
  showEasyReturns: true,
  warrantyYears: 2,
}
```

## Admin Paneli

Site statik export olarak yayınlandığı (canlı bir sunucu/veritabanı
olmadığı) için, **`admin-server/`** klasöründe ayrı, yalnızca yerel
bilgisayarınızda çalışan hafif bir Node/Express yönetim paneli
bulunmaktadır. Bu panel gerçek bir admin paneli olarak çalışır —
sahte/kilitli bir arayüz değildir:

```bash
cd admin-server
npm install   # yalnızca ilk seferde
npm start
```

Sonra `http://localhost:4000` adresini açın. Ürün açıklaması yazabilir,
fiyat/renk/ölçü gibi alanları düzenleyebilir, görsel yükleyip
silebilir/sıralayabilir, yeni ürün ekleyip mevcut ürünleri
silebilirsiniz. **"Yayınla"** butonu siteyi yeniden derleyip sonucu
otomatik olarak `httpdocs` klasörünüze kopyalar.

Detaylar, güvenlik notu ve sorun giderme için `admin-server/README.md`
dosyasına bakın.

Bu panel **kimlik doğrulaması içermez ve yalnızca localhost'ta
çalışır** — internete açmayın.

### Gerçek zamanlı (sunucu tabanlı) bir CMS eklemek isterseniz

Yukarıdaki yerel panel çoğu ihtiyaç için yeterlidir. Bunun yerine
gerçek zamanlı, çok kullanıcılı bir CMS/admin paneli isterseniz
önerilen yaklaşım:

1. `lib/types.ts` içindeki `Product`, `Category`, `Collection`,
   `FaqItem` tiplerini olduğu gibi koruyun — arayüz bileşenleri bu
   tiplere göre yazılmıştır.
2. `lib/data/products.ts` içindeki `products` sabitinin kaynağını
   (şu an `lib/data/products.json`), bir veritabanından (ör.
   PostgreSQL + Prisma) veya headless bir CMS'ten (ör. Sanity, Payload
   CMS) veri çeken fonksiyonlarla değiştirin. Yardımcı fonksiyon
   imzaları (`getAllProducts()`, `getProductBySlug()` vb.) aynı
   kalabilir.
3. Medya kütüphanesi için görselleri `public/images/products/` yerine
   bir obje depolama servisine (S3, Cloudinary) taşıyın ve `next.config.ts`
   içinde `images.remotePatterns` ile izin verin.
4. Slider/banner, kampanya ve SSS yönetimi için benzer şekilde
   `lib/data/collections.ts` ve `lib/data/faq.ts` dosyalarını CMS
   sorgularına dönüştürün.

**Not:** Yukarıdaki gibi gerçek bir admin paneli/CMS eklenirse site artık
tamamen statik üretilemez (veriler build anında değil istek anında
çekilir) — bu durumda `next.config.ts` içindeki `output: "export"`
satırının kaldırılıp Node.js çalıştırabilen bir hosting'e (Vercel vb.)
geçilmesi gerekir.

## Statik Export ile Yayınlama

Site, Node.js sunucusu **gerektirmeyen** tam statik bir HTML export
olarak yapılandırılmıştır (`next.config.ts` → `output: "export"`).
Bu, paylaşımlı hosting (Plesk/cPanel `httpdocs`, `public_html` vb.)
gibi ortamlara doğrudan yüklenebileceği anlamına gelir.

### Bu neden mümkün oldu?

- Tüm sayfalar (`/`, kategori sayfaları, 69 ürün detay sayfası) derleme
  anında `generateStaticParams` ile önceden üretilir; sunucu tarafında
  çalışan hiçbir dinamik kod yoktur.
- İletişim formu bir API rotasına istek atmaz — doğrulamayı tarayıcıda
  yapar ve girilen bilgilerle otomatik olarak bir **WhatsApp** sohbeti
  açar (`lib/whatsapp.ts` → `buildContactFormWhatsAppUrl`). Eskiden
  var olan `app/api/iletisim` sunucu rotası bu nedenle kaldırılmıştır.
- Favoriler, arama ve filtreleme tamamen tarayıcı tarafında
  (`localStorage`, istemci bileşenleri) çalışır.
- Görseller derleme öncesinde zaten optimize edilmiş WebP dosyaları
  olduğundan `next/image`'in sunucu tarafı optimizasyonuna ihtiyaç
  yoktur (`images.unoptimized: true`).

### Build ve yayınlama adımları

```bash
npm run build
```

1. Bu komut projeyi derler ve tamamen statik siteyi **`out/`** klasörüne
   yazar.
2. `out/` klasörünün **içeriğini** (klasörün kendisini değil, içindeki
   dosya ve klasörleri) hosting panelinizin web kök dizinine
   (`httpdocs`, `public_html`, `www` vb.) kopyalayın — FTP/SFTP veya
   panelin dosya yöneticisiyle.
3. Yalnızca bir önizleme/yerel test amacıyla, herhangi bir statik dosya
   sunucusuyla çalıştırabilirsiniz, örneğin:
   ```bash
   npx serve out
   ```
   (`serve -s out` **kullanmayın** — `-s` tek sayfalı uygulama modudur
   ve her adresi ana sayfaya yönlendirerek kategori/ürün sayfalarını
   bozar.)

### Sınırlamalar

- `npm run start` bu modda çalışmaz (statik export'ta çalışan bir
  Next.js sunucusu yoktur).
- Sunucu tarafı API rotaları veya orta katman (middleware) eklenemez;
  eklenirse `output: "export"` kaldırılıp Node.js destekli bir hosting
  gerekir (bkz. bir üstteki not).
- İletişim formu yalnızca WhatsApp'a yönlendirir; e-posta/CRM entegre
  edilmek istenirse (ör. Formspree gibi üçüncü taraf bir form servisi)
  `components/forms/ContactForm.tsx` güncellenmelidir.

## Domain Bağlama

**Statik export ile (varsayılan, `httpdocs` vb.):**
1. `out/` klasörünün içeriğini hosting panelinizin web kök dizinine
   yükleyin (bkz. [Statik Export ile Yayınlama](#statik-export-ile-yayınlama)).
2. `www.omurcocuk.com.tr` alan adını hosting sağlayıcınızın verdiği DNS
   kayıtlarıyla (genellikle bir `A` kaydı) yönlendirin.
3. `NEXT_PUBLIC_SITE_URL` değerini `.env.local` içinde
   `https://www.omurcocuk.com.tr` olarak ayarlayıp **yeniden build alın**
   (statik export'ta bu değer yalnızca build anında okunur).

**Alternatif — Node.js destekli hosting (Vercel vb.):**
1. `next.config.ts` içinden `output: "export"` satırını kaldırın (aksi
   halde platform statik dosyaları sunar, sunucu özellik eklemek
   mümkün olmaz).
2. Barındırma sağlayıcınızda projeyi deploy edin.
3. Aynı şekilde alan adını yönlendirin.
4. SSL sertifikasının (çoğu sağlayıcıda otomatik) aktif olduğunu doğrulayın.

## Google Search Console Kurulumu

1. [Google Search Console](https://search.google.com/search-console)
   üzerinde `https://www.omurcocuk.com.tr` mülkünü ekleyin.
2. Doğrulamayı DNS TXT kaydı veya HTML dosya yöntemiyle tamamlayın.
3. Site yayına alındıktan sonra `https://www.omurcocuk.com.tr/sitemap.xml`
   adresini "Site Haritaları" bölümünden gönderin (sitemap otomatik
   olarak `app/sitemap.ts` tarafından üretilir).

## Analytics Kurulumu

Bu proje şu an herhangi bir analytics scripti içermez (üçüncü taraf
script eklenmeden önce KVKK/çerez politikasının güncellenmesi gerekir).
Google Analytics 4 veya benzeri bir araç eklemek için:

1. Ölçüm ID'sini alın.
2. `app/layout.tsx` içine, kullanıcı onayına bağlı olarak (KVKK/çerez
   rızası sonrası) yüklenecek şekilde `next/script` ile ekleyin.
3. `app/cerez-politikasi/page.tsx` içeriğini kullanılan analytics
   aracını belirtecek şekilde güncelleyin.

---

## Yayına Almadan Önce Gerekenler

Bu liste, gerçek/doğrulanmış ticari verisi eksik olduğu için **kasıtlı
olarak boş veya taslak bırakılmış** alanları içerir:

- [ ] **786 görsel eşleştirme bekliyor.** Bkz. [Eşleştirme Bekleyen
      Görseller](#eşleştirme-bekleyen-görseller) — 401 görsel, ürün adı
      belirsiz olduğu için henüz kataloğa eklenmedi.
- [ ] **Fiyat, ölçü, malzeme, renk bilgisi eksik.** Mevcut 69 üründe bu
      alanlar `null`/`[]` bırakılmıştır; ürün sayfalarında bunun yerine
      WhatsApp/telefon yönlendirmesi gösterilir. Bilgiler netleştiğinde
      [Admin Paneli](#admin-paneli) üzerinden veya doğrudan
      `lib/data/products.json` içinde güncellenebilir.
  - "Bebek Arabaları" ve "Kampanyalı Ürünler" kategorilerinde hiç ürün
    fotoğrafı paylaşılmadığı için bu iki kategori şu an boş durum
    gösteriyor.
- [ ] **Logo.** `public/logo/kaynak-logo-orijinal.png` marka
      tarafından sağlanan gerçek logodur; navy/white varyantlar ve
      favicon bu dosyadan otomatik türetilmiştir. Marka kurumsal kimlik
      kılavuzu netleştiğinde (renk kodları, tipografi vb.) logo dosyaları
      güncellenebilir.
- [ ] **İletişim formu bir e-posta/CRM servisine bağlı değil.** Statik
      export nedeniyle sunucu tarafı yoktur; form doğrulamayı
      tarayıcıda yapıp doğrudan WhatsApp'a yönlendirir
      (`components/forms/ContactForm.tsx`). E-posta/CRM entegrasyonu
      istenirse ya bu davranış korunur ya da statik export'tan
      vazgeçilip bir form servisi (Formspree vb.) veya Node.js hosting
      + API rotası eklenir (bkz. [Statik Export ile
      Yayınlama](#statik-export-ile-yayınlama)).
- [ ] **Çalışma saatleri belirtilmedi.** `lib/config.ts` içindeki
      `openingHours: null` alanları doldurulmalıdır.
- [ ] **Ücretsiz teslimat / kurulum / garanti süresi / kolay iade**
      bilgileri doğrulanmadığı için sitede gösterilmiyor
      (`lib/config.ts` → `features`). Netleştiğinde `true` yapılabilir.
- [ ] **Instagram/Facebook hesapları** paylaşılmadığı için footer ve
      anasayfadaki ilgili bölümler pasif (`lib/config.ts` → `social`).
- [ ] **Hukuki sayfalar taslaktır.** Gizlilik Politikası, KVKK
      Aydınlatma Metni ve Çerez Politikası sayfaları genel taslak
      metinler içerir ve her sayfada bu açıkça belirtilir
      (`noindex` olarak işaretlenmiştir). Yayına alınmadan önce bir
      hukuk danışmanı tarafından incelenmelidir.
- [ ] **Analytics ve Search Console** henüz kurulmadı (yukarıdaki
      bölümlere bakın).
- [ ] **NEXT_PUBLIC_SITE_URL** production ortamında gerçek alan adına
      ayarlanıp `npm run build` ile yeniden export alınmalıdır (statik
      export'ta bu değer yalnızca build anında okunur, çalışma
      zamanında değiştirilemez).
- [ ] **Masaüstündeki `httpdocs` klasörü bir anlık görüntüdür.** İçerik
      (ürün, metin, ayar) her değiştiğinde `npm run build` yeniden
      çalıştırılıp `out/` içeriği `httpdocs`'a (veya gerçek hosting kök
      dizinine) tekrar kopyalanmalıdır — otomatik senkronizasyon yoktur.
- [ ] **Google Haritalar gömülü haritaları** adres bazlı arama
      sorgusuyla çalışır (uydurma koordinat kullanılmamıştır); ancak
      kesin bir Google Business konumu paylaşıldığında `googleMapsUrl`
      değerleri o bağlantıyla güncellenebilir.

Bunların dışındaki tüm site altyapısı (menü, arama, filtreleme, ürün
kartları/detayları, favoriler, WhatsApp bağlantıları, mobil menü, SEO
metadata/JSON-LD, sitemap/robots, erişilebilirlik, responsive tasarım)
tamamlanmış ve test edilmiş durumdadır.

## Güncel yönetim paneli

`/admin` paneli, Zenn Bedding aktarım rehberine göre Ömür Çocuk markasına uyarlanmıştır. Ürünler, kategoriler/koleksiyonlar ve fabrika/teslimat galerisi aynı menüden yönetilir. Kurulum, veri saklama farkları ve kabul kontrolleri için [panel aktarım notlarına](docs/admin-panel-transfer.md) bakın. Tarayıcı kontrolleri `npm run test:admin` ile geçici test verileri üzerinde çalıştırılır.
