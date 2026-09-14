import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { siteConfig } from "@/lib/config";
import {
  footerCategoryLinks,
  footerCorporateLinks,
  footerLegalLinks,
} from "@/lib/nav";
import { buildDefaultWhatsAppUrl } from "@/lib/whatsapp";

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
          <ul className="mt-4 flex flex-col gap-2.5 text-sm text-brand-gray">
            <li>
              <a href={siteConfig.contact.phoneHref} className="transition-colors hover:text-brand-navy">
                {siteConfig.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={buildDefaultWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-brand-navy"
              >
                WhatsApp&apos;tan Yazın
              </a>
            </li>
            {siteConfig.stores.map((store) => (
              <li key={store.id}>
                <Link
                  href={`/magazalarimiz#${store.id}`}
                  className="transition-colors hover:text-brand-navy"
                >
                  {store.shortName}
                </Link>
              </li>
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
    </footer>
  );
}
