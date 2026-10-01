import { categories } from "@/lib/data/categories";
import type { Category } from "@/lib/types";
import { collectionGroups } from "@/lib/data/collection-groups";

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type MegaMenuSection = {
  title: string;
  links: NavLink[];
};

export type NavItem = NavLink & {
  megaMenu?: {
    sections: MegaMenuSection[];
    featured: NavLink;
  };
};

// Adresi "odasi/odalari" içeren kategoriler (Bebek Odası, Çocuk Odası…) "Odalar" altında toplanır.
const isRoomCategory = (category: Category) =>
  /oda(s|lar)/i.test(category.slug);
const categoryLinks = (list: Category[]): NavLink[] =>
  list.map((category) => ({ label: category.name, href: `/${category.slug}` }));

/**
 * Masaüstünde kategori sayısı tek satıra sığmayacak kadar fazla olduğu için
 * (9 üst seviye öge yerine) tüm ürün kategorileri tek bir "Ürünler" mega
 * menüsü altında toplanmıştır. Bu, header talimatındaki "Kategori sayısı
 * masaüstünde fazla gelirse 'Ürünler' mega menüsü kullan" yönlendirmesine
 * dayanır.
 */
export const primaryNav: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Biz Kimiz", href: "/biz-kimiz" },
  {
    label: "Ürünler",
    href: "/urunler",
    megaMenu: {
      sections: [
        {
          title: "Odalar",
          links: categoryLinks(categories.filter(isRoomCategory)),
        },
        {
          title: "Mobilya ve Diğer",
          links: categoryLinks(
            categories.filter((category) => !isRoomCategory(category)),
          ),
        },
      ],
      featured: { label: "Tüm Ürünleri Görüntüle", href: "/urunler" },
    },
  },
  {
    label: "Koleksiyonlar",
    href: "/koleksiyonlar",
    megaMenu: {
      sections: [
        {
          title: "Koleksiyonlar",
          links: collectionGroups.map((group) => ({
            label: group.name,
            href: `/koleksiyonlar/${group.slug}`,
          })),
        },
      ],
      featured: { label: "Tüm Koleksiyonlar", href: "/koleksiyonlar" },
    },
  },
  { label: "Özel Üretim", href: "/ozel-uretim" },
  { label: "Kumaş & Renk", href: "/kumas-renk-kartelasi" },
  { label: "Fabrikamız", href: "/fabrikamiz" },
  { label: "İletişim", href: "/iletisim" },
];

export const footerCategoryLinks: NavLink[] = categoryLinks(categories);

export const footerCorporateLinks: NavLink[] = [
  { label: "Biz Kimiz", href: "/biz-kimiz" },
  { label: "Koleksiyonlar", href: "/koleksiyonlar" },
  { label: "Özel Üretim", href: "/ozel-uretim" },
  { label: "Kumaş & Renk Kartelası", href: "/kumas-renk-kartelasi" },
  { label: "Fabrikamız", href: "/fabrikamiz" },
  { label: "Mağazalarımız", href: "/magazalarimiz" },
  { label: "İletişim", href: "/iletisim" },
  { label: "Sıkça Sorulan Sorular", href: "/sss" },
];

export const footerLegalLinks: NavLink[] = [
  { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
  { label: "KVKK Aydınlatma Metni", href: "/kvkk-aydinlatma-metni" },
  { label: "Çerez Politikası", href: "/cerez-politikasi" },
];
