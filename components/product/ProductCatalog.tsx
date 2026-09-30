"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { CategorySlug, Product } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/data/categories";
import { getAvailableColors, searchProducts } from "@/lib/data/products";
import { ProductFilters, type CatalogFilterValue } from "@/components/product/ProductFilters";
import { MobileFilterDrawer } from "@/components/product/MobileFilterDrawer";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/product/EmptyState";
import { cn } from "@/lib/utils";

const DEFAULT_FILTERS: CatalogFilterValue = {
  query: "",
  category: "all",
  subcategory: "all",
  color: "all",
  sort: "recommended",
};

export function ProductCatalog({
  products,
  lockedCategory,
}: {
  products: Product[];
  lockedCategory?: CategorySlug;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<CatalogFilterValue>(() => ({
    ...DEFAULT_FILTERS,
    query: searchParams.get("q") ?? "",
    category: lockedCategory ?? "all",
    subcategory: searchParams.get("alt") ?? "all",
  }));
  const [view, setView] = useState<"grid" | "list">("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);

  function updateFilters(next: Partial<CatalogFilterValue>) {
    setFilters((prev) => {
      const merged = { ...prev, ...next };
      const params = new URLSearchParams(searchParams.toString());
      if (merged.query) params.set("q", merged.query);
      else params.delete("q");
      if (merged.subcategory !== "all") params.set("alt", merged.subcategory);
      else params.delete("alt");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      return merged;
    });
  }

  function clearFilters() {
    setFilters({ ...DEFAULT_FILTERS, category: lockedCategory ?? "all" });
    router.replace(pathname, { scroll: false });
  }

  const activeCategory = lockedCategory ?? (filters.category !== "all" ? filters.category : undefined);
  const availableSubcategories = activeCategory
    ? getCategoryBySlug(activeCategory)?.subcategories ?? []
    : [];

  const categoryScopedProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;
  const availableColors = getAvailableColors(categoryScopedProducts);
  const hasPriceData = categoryScopedProducts.some((p) => p.price !== null);

  const results = useMemo(() => {
    return searchProducts({
      query: filters.query,
      category: activeCategory,
      subcategory: filters.subcategory !== "all" ? filters.subcategory : undefined,
      color: filters.color !== "all" ? filters.color : undefined,
      sort: filters.sort,
    }).filter((p) => products.some((sourceProduct) => sourceProduct.id === p.id));
  }, [filters, activeCategory, products]);

  const isFiltered =
    filters.query !== "" ||
    filters.subcategory !== "all" ||
    filters.color !== "all" ||
    (!lockedCategory && filters.category !== "all");

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-2xl border border-brand-babyblue/30 bg-white p-5">
          <h2 className="mb-4 font-display text-lg text-brand-navy">Filtrele</h2>
          <ProductFilters
            value={filters}
            onChange={updateFilters}
            availableSubcategories={availableSubcategories}
            availableColors={availableColors}
            showCategoryFilter={!lockedCategory}
            hasPriceData={hasPriceData}
          />
        </div>
      </aside>

      <div>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-brand-gray">
            <span className="font-medium text-brand-navy">{results.length}</span> ürün bulundu
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-brand-babyblue/50 bg-white px-4 py-2 text-sm font-medium text-brand-navy lg:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
              </svg>
              Filtrele
            </button>

            <div className="flex items-center gap-1 rounded-full border border-brand-babyblue/50 bg-white p-1">
              <button
                type="button"
                onClick={() => setView("grid")}
                aria-label="Izgara görünümü"
                aria-pressed={view === "grid"}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  view === "grid" ? "bg-brand-navy text-white" : "text-brand-gray hover:text-brand-navy"
                )}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <rect x="3" y="3" width="8" height="8" rx="1.5" />
                  <rect x="13" y="3" width="8" height="8" rx="1.5" />
                  <rect x="3" y="13" width="8" height="8" rx="1.5" />
                  <rect x="13" y="13" width="8" height="8" rx="1.5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                aria-label="Liste görünümü"
                aria-pressed={view === "list"}
                className={cn(
                  "rounded-full p-2 transition-colors",
                  view === "list" ? "bg-brand-navy text-white" : "text-brand-gray hover:text-brand-navy"
                )}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {results.length > 0 ? (
          <ProductGrid products={results} view={view} />
        ) : (
          <EmptyState
            title="Aradığınız özelliklere uygun ürün bulunamadı."
            description={
              isFiltered
                ? "Filtreleri temizleyerek tüm ürünleri görüntüleyebilir ya da bize doğrudan ulaşabilirsiniz."
                : "Bu kategoride ürünler yakında eklenecektir. Güncel seçenekler için bizimle iletişime geçebilirsiniz."
            }
            showClearFilters={isFiltered}
            onClearFilters={clearFilters}
          />
        )}
      </div>

      <MobileFilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        value={filters}
        onChange={updateFilters}
        onClear={clearFilters}
        availableSubcategories={availableSubcategories}
        availableColors={availableColors}
        showCategoryFilter={!lockedCategory}
        hasPriceData={hasPriceData}
        resultCount={results.length}
      />
    </div>
  );
}
