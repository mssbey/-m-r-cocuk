# Kategori ekleme

Güncel yönetim panelinde `/admin` → **Kategoriler** yolunu izleyin.
Ekran doğrudan `/admin/kategoriler` adresinde de açılır ve mevcut admin
oturumunu gerektirir.

- Kategori adı zorunludur. Kısa açıklama, sayfa açıklaması ve satır başına
  bir alt kategori isteğe bağlıdır.
- Sayfa adresi addan otomatik oluşturulur; Türkçe karakterler dönüştürülür.
  Aynı adresi kullanan kategoriler ve mevcut site sayfalarıyla çakışan adlar
  kabul edilmez.
- Kaydetme, mevcut GitHub bağlantısını kullanarak `lib/data/categories.json`
  dosyasını günceller. `ADMIN_PASSWORD` ve GitHub erişim ayarları mevcut
  admin paneliyle ortaktır.
- Kaydın ardından **Bu kategoriye ürün ekle** bağlantısı yeni ürün formunu
  kategori seçili olarak açar. Admin kategori listesi ve ürün doğrulaması
  GitHub'daki güncel veriyi okur; yeniden yayınlanmayı beklemez.
- Site menüsü, arama/filtre seçenekleri, site haritası ve kategori sayfası
  sonraki başarılı derleme/yayınlama ile güncellenir. GitHub–Vercel otomatik
  yayınlama bağlantısı varsa bu süreç commit sonrasında başlar.
- Yeni kategoride kapak görseli bulunmaz; kategori sayfasında mevcut
  yer tutucu gösterilir. Ana sayfadaki seçili beş fotoğraflı kategori
  bölümüne otomatik eklenmez.

Doğrulama: `node --test tests/admin-categories.test.mjs`. Bu testler
GitHub'a gerçek veri yazmadan kayıt, çakışma, ürün atama ve menü akışını
kontrol eder.
