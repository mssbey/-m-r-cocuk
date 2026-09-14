"use client";

import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  productId,
  productName,
  size = "md",
}: {
  productId: string;
  productName: string;
  size?: "sm" | "md";
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      aria-pressed={active}
      aria-label={
        active
          ? `${productName} ürününü favorilerden çıkar`
          : `${productName} ürününü favorilere ekle`
      }
      className={cn(
        "flex items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-sm transition-colors hover:bg-white",
        size === "sm" ? "h-8 w-8" : "h-10 w-10"
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        className={size === "sm" ? "h-4 w-4" : "h-5 w-5"}
        aria-hidden="true"
      >
        <path
          d="M12 20s-7-4.35-9.5-8.8C.8 7.7 2.4 4.5 5.6 4c2-.3 3.8.7 4.9 2.3C11.6 4.7 13.4 3.7 15.4 4c3.2.5 4.8 3.7 3.1 7.2C16 15.65 12 20 12 20z"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
