"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { primaryNav } from "@/lib/nav";
import { siteConfig } from "@/lib/config";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";
import { Logo } from "@/components/shared/Logo";

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 801px)");
    const closeOnDesktop = () => {
      if (desktop.matches) onClose();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, [open, onClose]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    if (open) {
      document.body.style.overflow = "hidden";
      panelRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      if (open) previousFocus?.focus();
    };
  }, [open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panelRef.current) {
        const elements = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button, input, select, textarea, [tabindex="0"]',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = elements[0],
          last = elements[elements.length - 1];
        if (
          event.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === panelRef.current)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="mobile-menu-layer fixed inset-0 z-[80]">
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-brand-navy/50"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Mobil menü"
        className="absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-brand-offwhite p-5 shadow-2xl outline-none"
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="rounded-full p-2 text-brand-navy transition-colors hover:bg-brand-cream"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-6 w-6"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav
          className="mt-6 flex-1 overflow-y-auto"
          aria-label="Mobil site navigasyonu"
        >
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                {item.megaMenu ? (
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((prev) =>
                          prev === item.href ? null : item.href,
                        )
                      }
                      aria-expanded={expanded === item.href}
                      aria-controls={`mobile-submenu-${item.href.slice(1)}`}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-base font-medium text-brand-navy transition-colors hover:bg-brand-cream"
                    >
                      {item.label}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className={`h-4 w-4 transition-transform ${
                          expanded === item.href ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      >
                        <path
                          d="M6 9l6 6 6-6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {expanded === item.href ? (
                      <div
                        id={`mobile-submenu-${item.href.slice(1)}`}
                        className="mobile-submenu"
                      >
                        {item.megaMenu.sections
                          .flatMap((section) => section.links)
                          .map((link) => (
                            <Link
                              href={link.href}
                              key={link.href}
                              onClick={onClose}
                            >
                              {link.label}
                              <span aria-hidden="true">›</span>
                            </Link>
                          ))}
                        <Link
                          href={item.megaMenu.featured.href}
                          onClick={onClose}
                          className="px-3 text-sm font-medium text-brand-navy underline-offset-4 hover:underline"
                        >
                          {item.megaMenu.featured.label}
                        </Link>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block rounded-xl px-3 py-3 text-base font-medium text-brand-navy transition-colors hover:bg-brand-cream"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                href="/favorilerim"
                onClick={onClose}
                className="block rounded-xl px-3 py-3 text-base font-medium text-brand-navy transition-colors hover:bg-brand-cream"
              >
                Favorilerim
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-4 flex flex-col gap-2 border-t border-brand-babyblue/30 pt-4">
          <a
            href={buildDefaultWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full bg-brand-navy px-5 py-3 text-sm font-medium text-white"
          >
            WhatsApp&apos;tan Yazın
          </a>
          <a
            href={siteConfig.contact.phoneHref}
            className="flex items-center justify-center gap-2 rounded-full border border-brand-navy/20 px-5 py-3 text-sm font-medium text-brand-navy"
          >
            {siteConfig.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
