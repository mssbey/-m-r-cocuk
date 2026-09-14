import Link from "next/link";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";

type EmptyStateProps = {
  title: string;
  description: string;
  showClearFilters?: boolean;
  onClearFilters?: () => void;
  showWhatsApp?: boolean;
  fallbackHref?: string;
  fallbackLabel?: string;
};

export function EmptyState({
  title,
  description,
  showClearFilters,
  onClearFilters,
  showWhatsApp = true,
  fallbackHref = "/",
  fallbackLabel = "Ana Sayfaya Dön",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-brand-babyblue/50 bg-white/60 px-6 py-16 text-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-12 w-12 text-brand-babyblue"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
      </svg>
      <div>
        <h3 className="font-display text-xl text-brand-navy">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-brand-gray">{description}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {showClearFilters && onClearFilters ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="rounded-full bg-brand-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-navy/90"
          >
            Filtreleri Temizle
          </button>
        ) : null}
        {showWhatsApp ? (
          <a
            href={buildDefaultWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-brand-navy/20 px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-cream"
          >
            WhatsApp&apos;tan Bilgi Al
          </a>
        ) : (
          <Link
            href={fallbackHref}
            className="rounded-full border border-brand-navy/20 px-5 py-2.5 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-cream"
          >
            {fallbackLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
