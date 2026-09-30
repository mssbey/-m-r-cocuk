# Yönetim paneli aktarımı

30 Eylül 2026 tarihinde paylaşılan Zenn Bedding rehberi, Ömür Çocuk sitesinin `/admin` paneline uyarlandı. Marka, mevcut 69 ürün, kategoriler, ürün aileleri, fiyatlar, alt kategoriler ve SEO alanları korundu. Kaynak ürün/kategori JSON dosyalarına test kaydı yazılmadı.

## Uygulananlar

- 1152 px açık içerik alanı, krem dış zemin, Manrope/Cormorant fontları, yatay ve satır kıran menü, ortalanmış tek şifreli giriş kartı.
- Ürün listesinde dört anlık filtre, altı sütun, 56 px görseller, Türkçe arama, boş durumlar, tam liste üzerinden kalıcı ve iyimser sıralama.
- Tek ürün formu: slug, kategori, koleksiyon, açıklama, ölçü, renk, kumaş ve etiketler. Mevcut siteye özgü alanlar “Diğer ürün bilgileri” altında bulunur.
- Galeride kapak seçme, yer değiştirme ve kaldırma yalnızca formu değiştirir; ürün kaydedilince uygulanır. Yeni kapak dosyası önceliklidir. Sunucu mevcut görsellerin ürüne ait olduğunu doğrular; yeni görseller yalnızca ilgili yükleme akışının imzalı sonucu ile kabul edilir.
- Kategori/koleksiyon ekleme, düzenleme, görsel değiştirme, sıralama, kullanım sayısı ve kontrollü silme. Slug ve bağlı ürünler tek Git commit’inde güncellenir. Kullanılan alt kategorilerin kaldırılması da engellenir.
- Fabrika/teslimat galerisi: 180 karakter açıklama, 0–9999 sıra, 3 MiB sınırı, dosya türü ve içerik doğrulaması, kayıt/düzenleme/kaldırma.
- Admin sayfaları oturumla, yeni API işlemleri ayrıca sunucuda korunur. Robots metadata `noindex, nofollow` olarak ayarlandı.
- Eski `/admin/urun/...` ve `/admin/kategoriler` bağlantıları yeni adreslere yönlenir.
- Fabrika görselleri ana sayfa, Biz Kimiz ve Fabrikamız; teslimatlar Biz Kimiz alanına bağlandı. Katalogdaki “Önerilen” ve ana sayfanın ilk ürün sekmesi admin sırasını kullanır.

## Mevcut projeye uyarlamalar ve sınırlar

1. **Kalıcılık GitHub üzerinden devam eder.** PostgreSQL/Blob servisine geçilmedi. Katalog, kategoriler, koleksiyonlar ve galeri aynı commit’ten okunur; yazma işlemi zorlamasız branch güncellemesiyle yapılır. Eşzamanlı değişiklikler 409 ile reddedilir. Yeni `lib/data/collection-groups.json` ve `lib/data/gallery.json` dosyaları uygulamayla birlikte yayınlanmalıdır.
2. **Ziyaretçi sitesi yeniden yayınlanınca güncellenir.** Mevcut statik JSON kullanan site mimarisi korundu. Admin kayıtları hemen kalıcıdır; ziyaretçi menüleri, listeleri ve galeri yerleşimleri GitHub/Vercel yeniden yayınlamasından sonra değişir. Rehberdeki “yeniden build gerektirmeme” maddesi bu mimaride karşılanmaz. Yeni yüklenen görseller admin önizlemesinde güvenli, sınırlı bir medya rotasıyla hemen okunabilir.
3. **Ürün/taksonomi dosya sınırı 4 MiB olarak korundu.** Mevcut Vercel istek sınırı nedeniyle rehberdeki 8 MiB uygulanmadı. Çoklu ürün dosyaları ayrı isteklerle yüklenir. Kurumsal galeri sınırı 3 MiB’dir. Mevcut projedeki Sharp yaklaşımıyla görseller WEBP’e dönüştürülür; GIF’in animasyonu korunmaz.
4. **Dosyalar silinmez.** Kayıt silme ve görsel değiştirme eski dosyaları korur. Yükleme başarılı olup sonraki kayıt başarısız olursa yüklenen dosya depoda kalabilir; Blob geri temizleme sözleşmesi uygulanmadı. Katalogda başarısız kayıt oluşmaz.
5. **Eski ürün aileleri korunur.** `collection` alanı mevcut ürün ailesi anlamını korur. Yeni `collectionGroup` alanı editoryal koleksiyonu tutar; eski ürünler mevcut aile eşlemeleriyle çözülür. Eski, atanmamış ürünler koleksiyon seçilmeden güncellenebilir. Yeni ürünlerde koleksiyon zorunludur.
6. `yeni-koleksiyonlar` artık `isNew` işaretli ürünleri gösterir. Mevcut ürünler kendiliğinden “Yeni” işaretlenmedi. Varsayılan kategori görseli mevcut placeholder, koleksiyon görseli Ömür Çocuk logosudur; Zenn Bedding varlıkları kopyalanmadı.
7. Mevcut 30 günlük oturum sistemi korundu. `ADMIN_SESSION_SECRET` yeni dosya yükleme doğrulamasında kullanılabilir; yoksa mevcut yönetici şifresi kullanılır. Üretimde çerez `secure`, `httpOnly`, `sameSite=lax` özelliklerini korur.
8. Eski bağımsız `admin-server/` uygulaması bu aktarımın parçası değildir. Sitenin `/admin` paneli güncellendi.

## Kontroller

- `npm run lint`: başarılı.
- `npx tsc --noEmit`: başarılı.
- `npm test`: 12 mevcut test başarılı.
- `npm run test:admin`: gerçek Next.js sunucusu ve Edge ile, geçici dizindeki veri kopyasında çalışır; canlı GitHub token’ını kullanmaz. Giriş/çıkış, 404, CRUD, sıralama, stale revision, kullanım engeli, slug ilişkileri, görsel doğrulama, kapak seçimi, silme onayı ve formun hata/başarı durumlarını kontrol eder.
- Giriş ve dört panel: 320, 390, 768, 1024, 1440 px genişliklerde gövde taşması yok; masaüstü ve mobil ekran görüntüleri `artifacts/admin/` altında.
- `npm run build`: üretim derlemesi kontrol edilir. Next.js’in mevcut `middleware` → `proxy` adlandırma uyarısı bu değişiklikten önceki yapıya aittir.

Testler gerçek GitHub branch’ine yazmaz ve canlıya yayınlama yapmaz. Üretim GitHub yetkileri ve Vercel otomatik yayını bu çalışma kapsamında uçtan uca çalıştırılmadı. `npm run test:admin` için Edge kurulu olmalıdır; başka kurulu Chromium kanalı `PLAYWRIGHT_CHANNEL` ile seçilebilir. Test ve build komutlarını aynı anda çalıştırmayın; ikisi de `.next` dizinini kullanır.
