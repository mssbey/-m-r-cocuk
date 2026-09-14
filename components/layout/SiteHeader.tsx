"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { primaryNav } from "@/lib/nav";
import { Logo } from "@/components/shared/Logo";
import { MegaMenu } from "@/components/layout/MegaMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { favoriteIds } = useFavorites();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function openMenuFor(href: string) {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setOpenMenu(href);
  }

  function scheduleClose() {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => setOpenMenu(null), 150);
  }

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-300",
          scrolled ? "max-h-0 opacity-0" : "max-h-9 opacity-100"
        )}
      >
        <AnnouncementBar />
      </div>

      <div className="border-b border-brand-babyblue/30 bg-brand-offwhite/95 backdrop-blur-sm">
        <div
          className={cn(
            "container-brand flex items-center justify-between transition-[height] duration-300",
            scrolled ? "h-16" : "h-20"
          )}
        >
          <Logo priority />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana site navigasyonu">
            {primaryNav.map((item) => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => item.megaMenu && openMenuFor(item.href)}
                onMouseLeave={() => item.megaMenu && scheduleClose()}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-cream"
                  aria-haspopup={item.megaMenu ? "true" : undefined}
                  aria-expanded={item.megaMenu ? openMenu === item.href : undefined}
                >
                  {item.label}
                  {item.megaMenu ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </Link>
                {item.megaMenu && openMenu === item.href ? <MegaMenu item={item} /> : null}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Arama aç"
              className="rounded-full p-2.5 text-brand-navy transition-colors hover:bg-brand-cream"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
            </button>

            <Link
              href="/favorilerim"
              aria-label="Favorilerim"
              className="relative rounded-full p-2.5 text-brand-navy transition-colors hover:bg-brand-cream"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path
                  d="M12 20s-7-4.35-9.5-8.8C.8 7.7 2.4 4.5 5.6 4c2-.3 3.8.7 4.9 2.3C11.6 4.7 13.4 3.7 15.4 4c3.2.5 4.8 3.7 3.1 7.2C16 15.65 12 20 12 20z"
                  strokeLinejoin="round"
                />
              </svg>
              {favoriteIds.length > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-navy px-1 text-[10px] font-semibold text-white">
                  {favoriteIds.length}
                </span>
              ) : null}
            </Link>

            <a
              href={buildDefaultWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full bg-brand-navy px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-navy/90 sm:inline-flex"
            >
              Bize Ulaşın
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Menüyü aç"
              className="rounded-full p-2.5 text-brand-navy transition-colors hover:bg-brand-cream lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
