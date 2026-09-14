# Ürün Görselleri

Bu klasör, gerçek ürün ve oda fotoğraflarının kategoriye göre
yerleştirildiği yapıdır. Şu anda 69 ürüne ait 786 optimize edilmiş WebP
görsel bulunmaktadır. Yeni görseller eklerken aynı kurallara uyun (bkz.
proje kök dizinindeki `README.md` → "Ürün Kataloğu" ve "Görsel Ekleme").

## Klasör Yapısı

- `bebek-odalari/`
- `genc-odalari/`
- `montessori-odalari/`
- `dolap-gardrop/`
- `sifonyer-komodin/`
- `bebek-arabalari/`
- `kampanyali-urunler/`

## Görsel Ekleme Kuralları

1. Dosya adlarını SEO uyumlu, Türkçe karaktersiz ve kısa tutun.
   Örnek: `montessori-yer-yatagi-tek-kisilik-01.webp`
2. Görselleri **WebP** (tercihen) veya **AVIF** formatında, kaliteyi
   belirgin biçimde bozmadan optimize ederek ekleyin.
3. Aynı ürünün farklı açılardan çekilmiş görsellerini aynı önek ile
   numaralandırın (`-01`, `-02`, `-03` ...) ki `lib/data/products.ts`
   içinde tek bir ürünün galerisi olarak birleştirilebilsin.
4. Her görsel için anlamlı bir Türkçe `alt` metni, ürünü
   `lib/data/products.ts` dosyasına eklerken `ProductImage.alt` alanına
   yazılmalıdır.
5. Görseli hangi ürüne ait olduğundan emin değilseniz eklemeyin; önce
   marka ile teyit edin.

Detaylı adımlar için proje kök dizinindeki `README.md` dosyasındaki
"Ürün Ekleme/Düzenleme" bölümüne bakın.
