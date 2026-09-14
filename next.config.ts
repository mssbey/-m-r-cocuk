import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  /**
   * Not: bu proje önceden `output: "export"` (statik HTML, httpdocs/FTP
   * hosting) kullanıyordu. Site artık Vercel + GitHub üzerinden deploy
   * ediliyor ve /admin altında middleware + API route'larla çalışan bir
   * bulut admin paneli var — statik export bu ikisiyle (middleware,
   * dinamik route handler) tamamen uyumsuz olduğundan kaldırıldı.
   * Normal Next.js sunucu modu Vercel'de zaten önerilen/varsayılan moddur.
   */
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
