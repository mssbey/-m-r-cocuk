import { formatPrice } from "@/lib/utils";

type PriceTagProps = {
  price: number | null;
  oldPrice: number | null;
  size?: "sm" | "md";
};

export function PriceTag({ price, oldPrice, size = "md" }: PriceTagProps) {
  const formattedPrice = formatPrice(price);
  const formattedOldPrice = formatPrice(oldPrice);

  if (!formattedPrice) {
    return (
      <p
        className={
          size === "sm"
            ? "text-sm font-medium text-brand-navy"
            : "text-base font-medium text-brand-navy"
        }
      >
        Fiyat ve detaylı bilgi için iletişime geçin
      </p>
    );
  }

  return (
    <div className="flex items-baseline gap-2">
      <span
        className={
          size === "sm"
            ? "text-base font-semibold text-brand-navy"
            : "text-xl font-semibold text-brand-navy"
        }
      >
        {formattedPrice}
      </span>
      {formattedOldPrice ? (
        <span className="text-sm text-brand-gray line-through">
          {formattedOldPrice}
        </span>
      ) : null}
    </div>
  );
}
