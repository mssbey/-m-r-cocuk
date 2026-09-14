import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  view = "grid",
}: {
  products: Product[];
  view?: "grid" | "list";
}) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6",
        view === "grid"
          ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} view={view} />
      ))}
    </div>
  );
}
