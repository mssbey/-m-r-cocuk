import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  /**
   * Statik HTML export (ör. httpdocs / paylaşımlı hosting için). Node.js
   * sunucusu gerektirmez; `npm run build` çıktısı `out/` klasörüne yazılır.
   * Bu modda next/image'in sunucu tarafı optimizasyonu çalışmadığından
   * `unoptimized: true` gerekir (görseller derleme sırasında zaten WebP'ye
   * optimize edilmiştir, bkz. public/images/products).
   */
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  /**
   * Build sırasında paralel worker sayısını sınırlar. Varsayılan (CPU
   * sayısı kadar, burada 15) worker fanout'u, admin panelinin build'i bir
   * alt süreç olarak tetiklediği senaryolarda bazı Windows ortamlarında
   * kararsızlığa yol açabiliyor; düşük bir sayı hem daha güvenli hem de
   * bu boyuttaki bir site için performans farkı yaratmıyor.
   */
  experimental: { cpus: 2 },
};

export default nextConfig;
