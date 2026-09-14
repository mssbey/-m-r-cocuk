import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { siteConfig } from "@/lib/config";

export function LegalPageShell({
  title,
  updatedAtLabel,
  children,
}: {
  title: string;
  updatedAtLabel?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-brand py-10 sm:py-14">
      <Breadcrumbs items={[{ name: title }]} />
      <h1 className="mt-6 font-display text-3xl text-brand-navy sm:text-4xl">{title}</h1>
      {updatedAtLabel ? (
        <p className="mt-2 text-xs text-brand-gray">Son güncelleme: {updatedAtLabel}</p>
      ) : null}

      <div className="mt-5 rounded-2xl border border-brand-sand bg-[#FBF3E7] px-5 py-4 text-sm text-brand-navy">
        <strong className="font-semibold">Geliştirici Notu:</strong>{" "}
        {siteConfig.legalNoticeDraftWarning}
      </div>

      <div className="legal-content mt-8 max-w-3xl text-brand-gray">{children}</div>
    </div>
  );
}
