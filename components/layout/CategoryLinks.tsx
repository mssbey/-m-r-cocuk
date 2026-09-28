import Link from "next/link";
import { categories } from "@/lib/data/categories";
import { CategoryIcon } from "@/components/shared/CategoryIcon";

const links = [
  ...categories
    .filter((category) => category.slug !== "kampanyali-urunler")
    .map((category) => ({
      label: category.name,
      href: `/${category.slug}`,
      icon: category.slug,
    })),
  { label: "Koleksiyonlar", href: "/koleksiyonlar", icon: "koleksiyonlar" },
  { label: "Özel Üretim", href: "/ozel-uretim", icon: "ozel-uretim" },
  {
    label: "Kumaş & Renk Kartelası",
    href: "/kumas-renk-kartelasi",
    icon: "kumas",
  },
  { label: "Fabrikamız", href: "/fabrikamiz", icon: "fabrika" },
  {
    label: "Yeni Ürünler",
    href: "/koleksiyonlar/yeni-koleksiyonlar",
    icon: "yeni",
  },
  {
    label: "Kampanyalı Ürünler",
    href: "/kampanyali-urunler",
    icon: "kampanyali-urunler",
  },
];

export function CategoryLinks({ onNavigate }: { onNavigate?: () => void }) {
  return links.map((link) => (
    <Link href={link.href} key={link.href} onClick={onNavigate}>
      <CategoryIcon slug={link.icon} />
      <span>{link.label}</span>
      <span aria-hidden="true">›</span>
    </Link>
  ));
}
