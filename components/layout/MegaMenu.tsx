import Link from "next/link";
import type { NavItem } from "@/lib/nav";

export function MegaMenu({ item }: { item: NavItem }) {
  if (!item.megaMenu) return null;

  return (
    <div
      className="absolute left-1/2 top-full z-40 w-[min(92vw,680px)] -translate-x-1/2 pt-3"
      role="menu"
    >
      <div className="overflow-hidden rounded-2xl border border-brand-babyblue/40 bg-white p-6 soft-shadow-lg">
        <div className="grid grid-cols-3 gap-6">
          {item.megaMenu.sections.map((section) => (
            <div key={section.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-gray">
                {section.title}
              </p>
              <ul className="flex flex-col gap-0.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      role="menuitem"
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-brand-navy transition-colors hover:bg-brand-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-brand-cream pt-4">
          <Link
            href={item.megaMenu.featured.href}
            role="menuitem"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy underline-offset-4 hover:underline"
          >
            {item.megaMenu.featured.label}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
