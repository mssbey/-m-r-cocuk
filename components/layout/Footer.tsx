import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { siteConfig } from "@/lib/config";
import {
  footerCategoryLinks,
  footerCorporateLinks,
  footerLegalLinks,
} from "@/lib/nav";
import type { ReactNode } from "react";

export function Footer() {
  const year = new Date().getFullYear();
  const enabledSocial = siteConfig.social.filter((s) => s.enabled && s.url);

  return (
    <footer className="mt-16 border-t border-brand-babyblue/30 bg-brand-cream">
      <div className="container-brand grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-gray">
            {siteConfig.brand.shortDescription}
          </p>
          {enabledSocial.length > 0 ? (
            <div className="mt-5 flex gap-3">
              {enabledSocial.map((s) => (
                <a
                  key={s.platform}
                  href={s.url ?? undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-brand-navy/15 px-3 py-1.5 text-xs font-medium text-brand-navy transition-colors hover:bg-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="font-display text-base text-brand-navy">Ürün Kategorileri</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-brand-gray">
            {footerCategoryLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-brand-navy">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base text-brand-navy">Kurumsal</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-brand-gray">
            {footerCorporateLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-brand-navy">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-base text-brand-navy">İletişim</h3>
          <ul className="mt-4 flex flex-col gap-4">
            <FooterContact
              href={siteConfig.contact.supportPhoneHref}
              label="Müşteri Destek"
              value={siteConfig.contact.supportPhoneDisplay}
              icon={
                <path
                  d="M4 13v-1a8 8 0 0116 0v1M4 13a2 2 0 012-2h1v6H6a2 2 0 01-2-2v-2zm16 0a2 2 0 00-2-2h-1v6h1a2 2 0 002-2v-2zm-3 4v1a3 3 0 01-3 3h-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              }
            />
            <FooterContact
              href={siteConfig.contact.phoneHref}
              label="Mağaza Hattı"
              value={siteConfig.contact.phoneDisplay}
              icon={
                <path
                  d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              }
            />
            {siteConfig.stores.map((store) => (
              <FooterContact
                key={store.id}
                href={`/magazalarimiz#${store.id}`}
                label={store.shortName}
                value={`${store.district} / ${store.city}`}
                icon={
                  <>
                    <path
                      d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="10" r="2.5" />
                  </>
                }
              />
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-babyblue/30">
        <div className="container-brand flex flex-col items-center justify-between gap-3 py-6 text-xs text-brand-gray sm:flex-row">
          <p>
            © {year} {siteConfig.brand.name}. Tüm hakları saklıdır.
          </p>
          <ul className="flex flex-wrap items-center gap-4">
            {footerLegalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-brand-navy">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-brand-babyblue/30">
        <p className="container-brand py-4 text-center text-xs text-brand-gray">
          Zeynart Web Bilişim tarafından yapılmıştır.
        </p>
        <div className="footer-mss" aria-hidden="true">
          <span>MSS</span>
        </div>
      </div>
    </footer>
  );
}

function FooterContact({
  href,
  label,
  value,
  icon,
}: {
  href: string;
  label: string;
  value: string;
  icon: ReactNode;
}) {
  const content = (
    <>
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy text-white">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="h-5 w-5"
          aria-hidden="true"
        >
          {icon}
        </svg>
      </span>
      <span className="flex flex-col">
        <span className="text-xs text-brand-gray">{label}</span>
        <span className="text-base font-semibold text-brand-navy">{value}</span>
      </span>
    </>
  );
  const className = "group flex items-center gap-3 transition-opacity hover:opacity-80";
  return (
    <li>
      {href.startsWith("/") ? (
        <Link href={href} className={className}>
          {content}
        </Link>
      ) : (
        <a href={href} className={className}>
          {content}
        </a>
      )}
    </li>
  );
}
