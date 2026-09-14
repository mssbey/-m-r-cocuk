"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * /admin altındaki sayfalarda müşteri sitesinin header/footer/WhatsApp
 * butonunu gizler — admin panel kendi sade arayüzünü kullanır.
 */
export function AdminAwareChrome({
  header,
  footer,
  whatsapp,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  whatsapp: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {whatsapp}
    </>
  );
}
