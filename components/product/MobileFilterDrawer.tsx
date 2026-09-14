"use client";

import { useEffect } from "react";
import { ProductFilters, type CatalogFilterValue } from "@/components/product/ProductFilters";
import type { Subcategory } from "@/lib/types";

type MobileFilterDrawerProps = {
  open: boolean;
  onClose: () => void;
  value: CatalogFilterValue;
  onChange: (next: Partial<CatalogFilterValue>) => void;
  onClear: () => void;
  availableSubcategories: Subcategory[];
  availableColors: string[];
  showCategoryFilter: boolean;
  hasPriceData: boolean;
  resultCount: number;
};

export function MobileFilterDrawer({
  open,
  onClose,
  resultCount,
  onClear,
  ...filterProps
}: MobileFilterDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-brand-navy/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filtreler"
        className="absolute bottom-0 left-0 right-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-brand-offwhite p-5 shadow-2xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-brand-navy">Filtrele</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Filtreleri kapat"
            className="rounded-full p-2 text-brand-navy hover:bg-brand-cream"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pb-4">
          <ProductFilters {...filterProps} />
        </div>

        <div className="flex gap-3 border-t border-brand-babyblue/30 pt-4">
          <button
            type="button"
            onClick={onClear}
            className="flex-1 rounded-full border border-brand-navy/20 px-4 py-3 text-sm font-medium text-brand-navy"
          >
            Filtreleri Temizle
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-brand-navy px-4 py-3 text-sm font-medium text-white"
          >
            {resultCount} Ürünü Göster
          </button>
        </div>
      </div>
    </div>
  );
}
