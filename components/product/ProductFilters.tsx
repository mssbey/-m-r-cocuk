import type { CategorySlug, Subcategory } from "@/lib/types";
import { categories } from "@/lib/data/categories";

export type CatalogFilterValue = {
  query: string;
  category: CategorySlug | "all";
  subcategory: string | "all";
  color: string | "all";
  sort: "recommended" | "newest" | "price-asc" | "price-desc";
};

type ProductFiltersProps = {
  value: CatalogFilterValue;
  onChange: (next: Partial<CatalogFilterValue>) => void;
  availableSubcategories: Subcategory[];
  availableColors: string[];
  showCategoryFilter: boolean;
  hasPriceData: boolean;
};

export function ProductFilters({
  value,
  onChange,
  availableSubcategories,
  availableColors,
  showCategoryFilter,
  hasPriceData,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="catalog-search" className="mb-1.5 block text-xs font-medium text-brand-gray">
          Ürün Ara
        </label>
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            id="catalog-search"
            type="search"
            value={value.query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Ürün adı ara..."
            className="w-full rounded-full border border-brand-babyblue/50 bg-white py-2.5 pl-9 pr-4 text-sm text-brand-navy placeholder:text-brand-gray focus:border-brand-navy focus:outline-none"
          />
        </div>
      </div>

      {showCategoryFilter ? (
        <FilterSelect
          id="catalog-category"
          label="Kategori"
          value={value.category}
          onChange={(v) => onChange({ category: v as CatalogFilterValue["category"], subcategory: "all" })}
          options={[
            { value: "all", label: "Tüm Kategoriler" },
            ...categories.map((c) => ({ value: c.slug, label: c.name })),
          ]}
        />
      ) : null}

      {availableSubcategories.length > 0 ? (
        <FilterSelect
          id="catalog-subcategory"
          label="Ürün Türü"
          value={value.subcategory}
          onChange={(v) => onChange({ subcategory: v })}
          options={[
            { value: "all", label: "Tüm Türler" },
            ...availableSubcategories.map((s) => ({ value: s.slug, label: s.name })),
          ]}
        />
      ) : null}

      {availableColors.length > 0 ? (
        <FilterSelect
          id="catalog-color"
          label="Renk"
          value={value.color}
          onChange={(v) => onChange({ color: v })}
          options={[
            { value: "all", label: "Tüm Renkler" },
            ...availableColors.map((c) => ({ value: c, label: c })),
          ]}
        />
      ) : null}

      <FilterSelect
        id="catalog-sort"
        label="Sıralama"
        value={value.sort}
        onChange={(v) => onChange({ sort: v as CatalogFilterValue["sort"] })}
        options={[
          { value: "recommended", label: "Önerilen" },
          { value: "newest", label: "Yeniden Eskiye" },
          ...(hasPriceData
            ? [
                { value: "price-asc", label: "Fiyat: Artan" },
                { value: "price-desc", label: "Fiyat: Azalan" },
              ]
            : []),
        ]}
      />
    </div>
  );
}

function FilterSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-brand-gray">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-full border border-brand-babyblue/50 bg-white px-4 py-2.5 text-sm text-brand-navy focus:border-brand-navy focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
