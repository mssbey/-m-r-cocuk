import { cn } from "@/lib/utils";

type PlaceholderImageProps = {
  className?: string;
  label?: string;
  icon?: "house" | "star" | "cloud";
};

/**
 * Marka kimliğine uygun görsel yer tutucu. Kırık görsel ikonu yerine,
 * ürün/oda fotoğrafı henüz yüklenmediğinde gösterilir.
 */
export function PlaceholderImage({
  className,
  label = "Görsel Yakında",
  icon = "house",
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-brand-sky via-brand-cream to-brand-babyblue/40",
        className
      )}
      role="img"
      aria-label={label}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 140 Q 50 110 100 140 T 200 140 V200 H0 Z"
          fill="var(--color-baby-blue)"
        />
      </svg>
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <PlaceholderIcon icon={icon} className="h-9 w-9 text-brand-navy/40" />
        <span className="text-xs font-medium tracking-wide text-brand-navy/50">
          {label}
        </span>
      </div>
    </div>
  );
}

function PlaceholderIcon({
  icon,
  className,
}: {
  icon: "house" | "star" | "cloud";
  className?: string;
}) {
  if (icon === "star") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
      </svg>
    );
  }
  if (icon === "cloud") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M6.5 19a4.5 4.5 0 0 1-.4-8.98A5.5 5.5 0 0 1 16.9 8.1 4 4 0 0 1 17.5 16v.02A3.98 3.98 0 0 1 17 19H6.5z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 3.2 3 10.5V21h6.2v-6.4h5.6V21H21V10.5L12 3.2z" />
    </svg>
  );
}
