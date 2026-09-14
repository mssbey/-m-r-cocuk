# Ömür Çocuk — Yerel Ürün Yönetim Paneli

Bu klasör, ana Next.js sitesinden tamamen ayrı, **yalnızca yerel
bilgisayarınızda** çalışan küçük bir Express uygulamasıdır. Site statik
export olarak (`httpdocs`'a yüklenen düz HTML/CSS/JS) yayınlandığı için
canlı bir sunucu/veritabanı yoktur — bu panel, ürün verisini
(`lib/data/products.json`) ve görsellerini (`public/images/products/`)
sizin bilgisayarınızda düzenlemenizi, ardından siteyi yeniden derleyip
`httpdocs` klasörünü güncellemenizi sağlar.

## ⚠️ Güvenlik Notu

Bu panelin **kimlik doğrulaması yoktur** ve yalnızca `127.0.0.1`
(localhost) üzerinden dinler. **İnternete açmayın**, port yönlendirmesi
yapmayın, herkese açık bir sunucuda çalıştırmayın. Yalnızca kendi
bilgisayarınızda, kendi kullanımınız için tasarlanmıştır.

## Kurulum (yalnızca ilk seferde)

```bash
cd admin-server
npm install
```

## Çalıştırma

```bash
npm start
```

Ardından tarayıcınızda **http://localhost:4000** adresini açın.

## Neler Yapabilirsiniz?

- **Ürün listesi**: Tüm ürünleri arayın, kategoriye/duruma göre
  filtreleyin.
- **Ürün düzenleme**: Ad, açıklama, fiyat, renkler, ölçüler, malzemeler,
  SEO alanları gibi tüm alanları düzenleyin.
- **Görsel yönetimi**: Yeni görsel yükleyin (otomatik olarak EXIF
  yönlendirmesi düzeltilir, yeniden boyutlandırılır ve WebP'ye
  dönüştürülür — tıpkı orijinal Drive içe aktarma işlemi gibi), görsel
  silin, sırasını değiştirin (ilk görsel her zaman kapak fotoğrafıdır).
- **Yeni ürün ekleme / ürün silme.**
- **Yayınla butonu**: Sitenizi yeniden derler (`next build`) ve
  sonucu doğrudan `config.json`'da belirtilen `httpdocsPath`'e
  kopyalar — Masaüstündeki `httpdocs` klasörünüzü otomatik olarak
  günceller. Bu işlem mevcut `httpdocs` içeriğinin üzerine yazar.

## Yapılandırma

`admin-server/config.json`:

```json
{
  "httpdocsPath": "C:/Users/PC/Desktop/httpdocs",
  "port": 4000
}
```

`httpdocsPath` değerini, sitenin gerçek yayın klasörünüze (ör. FTP ile
senkronize edilen bir klasör) işaret edecek şekilde değiştirebilirsiniz.

## Nasıl Çalışır?

- Ürün ve kategori verisi düz JSON dosyalarıdır
  (`lib/data/products.json`, `lib/data/categories.json`); panel bunları
  doğrudan okur/yazar. Next.js uygulaması da aynı dosyaları derleme
  anında okur — yani panelde yaptığınız değişiklikler, "Yayınla"
  butonuna bastığınızda siteye yansır.
- Görseller `sharp` ile işlenir: EXIF döndürme uygulanır, en fazla
  2000px genişliğe ölçeklenir ve WebP kalite ~82 ile kaydedilir.
- "Yayınla" butonu arka planda `node node_modules/next/dist/bin/next
  build` çalıştırır (bilinçli olarak `npm run build` / `npm.cmd`
  kullanılmaz — Windows'ta Unicode/boşluk içeren proje yollarında bu
  `EINVAL` hatası verebiliyordu) ve ardından `out/` klasörünü
  asenkron (`fs/promises`) dosya işlemleriyle `httpdocs`'a kopyalar.

## Sorun Giderme

- **"EADDRINUSE" hatası**: 4000 portu zaten kullanılıyor demektir.
  `config.json`'da `port` değerini değiştirin veya o portu kullanan
  süreci kapatın.
- **Görseller admin panelinde görünmüyor**: Sunucuyu yeniden başlatıp
  tarayıcıyı yenileyin; `lib/data/products.json` dosyasının bozulmadığını
  kontrol edin (JSON söz dizimi hatası varsa panel açılışta hata verir).
- **"Yayınla" başarısız oluyor**: Üstteki siyah günlük panelinde build
  hatasının tamamını görebilirsiniz. Genellikle bir TypeScript/ESLint
  hatasıdır — aynı hatayı ana projede `npm run build` çalıştırarak da
  görebilirsiniz.
