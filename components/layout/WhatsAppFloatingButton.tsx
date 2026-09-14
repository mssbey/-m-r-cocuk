"use client";

import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={buildDefaultWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp'tan bize ulaşın"
      className="fixed bottom-5 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white soft-shadow-lg transition-transform hover:scale-105 sm:bottom-6 sm:right-6"
      style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true">
        <path d="M12.02 2c-5.5 0-10 4.48-10 10 0 1.86.5 3.6 1.4 5.12L2 22l5.05-1.33A9.96 9.96 0 0 0 12.02 22c5.5 0 10-4.48 10-10s-4.5-10-10-10zm5.85 14.15c-.25.7-1.46 1.36-2.02 1.44-.52.08-1.17.11-1.9-.12-.44-.13-1-.32-1.72-.62-3.03-1.31-5-4.35-5.15-4.56-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.05-2.49.27-.29.6-.36.8-.36.2 0 .4 0 .58.01.19.01.44-.07.68.52.25.6.86 2.1.94 2.25.08.15.13.33.02.53-.1.2-.16.32-.31.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.77 1.27 1.66 2.06 1.14 1.02 2.1 1.34 2.4 1.49.3.15.48.13.65-.05.18-.18.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.08.13.08.72-.17 1.41z" />
      </svg>
    </a>
  );
}
