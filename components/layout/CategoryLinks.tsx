import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { CategoryIcon } from "@/components/shared/CategoryIcon";

// Kategoriler admin panelindeki sırayla, yalnızca kategori verisinden listelenir.
export function CategoryLinks({ onNavigate }: { onNavigate?: () => void }) {
  return categories.map((category) => (
    <Link
      href={`/${category.slug}`}
      key={category.slug}
      onClick={onNavigate}
    >
      <CategoryIcon slug={category.slug} />
      <span>{category.name}</span>
      <span aria-hidden="true">›</span>
    </Link>
  ));
}
