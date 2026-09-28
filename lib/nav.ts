import { categories } from "@/lib/data/categories";
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
          links: [
            { label: "Bebek Odaları", href: "/bebek-odalari" },
            { label: "Genç Odaları", href: "/genc-odalari" },
            { label: "Montessori Odaları", href: "/montessori-odalari" },
          ],
        },
        {
          title: "Mobilyalar",
          links: [
            { label: "Dolap & Gardırop", href: "/dolap-gardrop" },
            { label: "Şifonyer & Komodin", href: "/sifonyer-komodin" },
          ],
        },
        {
          title: "Diğer",
          links: [
            { label: "Bebek Arabaları", href: "/bebek-arabalari" },
            { label: "Kampanyalı Ürünler", href: "/kampanyali-urunler" },
          ],
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

export const footerCategoryLinks: NavLink[] = categories.map((category) => ({
  label: category.name,
  href: `/${category.slug}`,
}));

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
