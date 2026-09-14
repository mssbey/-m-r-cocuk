import type { Collection } from "@/lib/types";

/**
 * Öne çıkan koleksiyonlar (anasayfa "Öne Çıkan Koleksiyonlar" bölümü).
 * Drive'dan işlenen gerçek ürün fotoğraflarına dayanan, birden fazla
 * parçası olan (gardırop + şifonyer + karyola vb.) koleksiyonlardan
 * seçilmiştir.
 */
export const collections: Collection[] = [
  {
    "id": "vera",
    "slug": "vera",
    "name": "Vera - Beyaz",
    "category": "genc-odalari",
    "shortDescription": "Gardırop, şifonyer, sedir karyola ve Montessori çatılı seçeneğiyle geniş bir Vera koleksiyonu.",
    "coverImage": {
      "src": "/images/products/genc-odalari/vera-full-oda-takimi-beyaz-01.webp",
      "alt": "Vera Full Oda Takımı - Beyaz - 1. görsel",
      "width": 1920,
      "height": 1062
    },
    "productSlugs": [
      "vera-sedir-karyola-100x200",
      "vera-full-oda-takimi-beyaz",
      "vera-4-kapakli-gardirop-beyaz",
      "vera-4-kapakli-cekmeceli-gardirop-beyaz",
      "vera-bebek-odasi-takimi-beyaz",
      "vera-sedir-karyola-beyaz",
      "vera-sifonyer-beyaz",
      "vera-montessori-catili-yatak"
    ]
  },
  {
    "id": "alya-beyaz",
    "slug": "alya-beyaz",
    "name": "Alya - Beyaz",
    "category": "genc-odalari",
    "shortDescription": "Gardırop, şifonyer ve sedir karyola ile eksiksiz bir Alya oda takımı.",
    "coverImage": {
      "src": "/images/products/genc-odalari/alya-full-oda-takimi-beyaz-01.webp",
      "alt": "Alya Full Oda Takımı - Beyaz - 1. görsel",
      "width": 1920,
      "height": 1137
    },
    "productSlugs": [
      "alya-full-oda-takimi-beyaz",
      "alya-3-kapakli-gardirop-beyaz",
      "alya-4-kapakli-gardirop-beyaz",
      "alya-6-cekmeceli-sifonyer-beyaz",
      "alya-sedir-karyola-beyaz",
      "alya-sifonyer-beyaz"
    ]
  },
  {
    "id": "nova-beyaz",
    "slug": "nova-beyaz",
    "name": "Nova - Beyaz",
    "category": "genc-odalari",
    "shortDescription": "Çalışma masası, gardırop, şifonyer ve karyolasıyla fonksiyonel Nova genç odası.",
    "coverImage": {
      "src": "/images/products/genc-odalari/nova-full-oda-takimi-beyaz-01.webp",
      "alt": "Nova Full Oda Takımı - Beyaz - 1. görsel",
      "width": 1920,
      "height": 1172
    },
    "productSlugs": [
      "nova-full-oda-takimi-beyaz",
      "nova-3-kapakli-gardirop-beyaz",
      "nova-sedir-karyola-beyaz",
      "nova-calisma-masasi-beyaz",
      "nova-sifonyer-beyaz"
    ]
  },
  {
    "id": "orion-aytasi",
    "slug": "orion-aytasi",
    "name": "Orion - Aytaşı",
    "category": "genc-odalari",
    "shortDescription": "Kitaplıklı gardırop seçeneğiyle şık ve kullanışlı Orion koleksiyonu.",
    "coverImage": {
      "src": "/images/products/genc-odalari/orion-full-oda-takimi-aytasi-01.webp",
      "alt": "Orion Full Oda Takımı - Aytaşı - 1. görsel",
      "width": 1920,
      "height": 1076
    },
    "productSlugs": [
      "orion-full-oda-takimi-aytasi",
      "orion-4-kapakli-gardirop-aytasi",
      "orion-4-kapakli-kitaplikli-cekmeceli-gardirop-aytasi",
      "orion-sedir-karyola-aytasi",
      "orion-sifonyer-aytasi"
    ]
  },
  {
    "id": "grow-buyuyen-besik",
    "slug": "grow-buyuyen-besik",
    "name": "Grow Büyüyen Beşik",
    "category": "bebek-odalari",
    "shortDescription": "Beyaz ve beyaz-natural renk seçenekleriyle sallanan/sallanmayan Grow büyüyen beşik ailesi.",
    "coverImage": {
      "src": "/images/products/bebek-odalari/grow-buyuyen-besik-beyaz-cekmeceli-sallanir-01.webp",
      "alt": "Grow Büyüyen Beşik - Beyaz (Çekmeceli, Sallanır) - 1. görsel",
      "width": 1920,
      "height": 1280
    },
    "productSlugs": [
      "grow-buyuyen-besik-beyaz-sallanmayan",
      "grow-buyuyen-besik-beyaz-cekmeceli-sallanir",
      "grow-buyuyen-besik-beyaz-natural-sallanmayan",
      "grow-buyuyen-besik-beyaz-natural-cekmeceli-sallanir"
    ]
  },
  {
    "id": "bloom",
    "slug": "bloom",
    "name": "Bloom Montessori",
    "category": "montessori-odalari",
    "shortDescription": "Standart ve çatılı seçenekleriyle Bloom Montessori yatak ailesi.",
    "coverImage": {
      "src": "/images/products/montessori-odalari/bloom-catili-montessori-2-cekmeceli-yavru-yatakli-blm03mt-01.webp",
      "alt": "Bloom Çatılı Montessori - 2 Çekmeceli + Yavru Yataklı (BLM03MT) - 1. görsel",
      "width": 1920,
      "height": 1280
    },
    "productSlugs": [
      "bloom-montessori-yatak",
      "bloom-catili-montessori-2-cekmeceli-yavru-yatakli-blm03mt",
      "bloom-catili-montessori-yavru-yatakli-blm01mt"
    ]
  }
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
