import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

type LogoProps = {
  variant?: "navy" | "white";
  className?: string;
  priority?: boolean;
};

/**
 * Ömür Çocuk logosu. Gerçek logo `public/logo/` altındadır (marka
 * tarafından sağlanan logo.png işlenerek navy/white varyantları
 * üretilmiştir). İleride yeni bir logo geldiğinde sadece bu klasördeki
 * dosyaları değiştirmek yeterlidir; bileşen arayüzü değişmez.
 */
export function Logo({ variant = "navy", className, priority }: LogoProps) {
  const src =
    variant === "white"
      ? "/logo/omur-cocuk-logo-white.png"
      : "/logo/omur-cocuk-logo-navy.png";

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.brand.name} - Ana sayfa`}
      className={className}
    >
      <Image
        src={src}
        alt={`${siteConfig.brand.name} logosu`}
        width={167}
        height={138}
        priority={priority}
        className="brand-logo-image"
      />
    </Link>
  );
}
