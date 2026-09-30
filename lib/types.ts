/** Ürün ve katalog veri modelleri. */

/** Kategoriler yönetim panelinden eklenebilir; geçerlilik kategori verisinden kontrol edilir. */
export type CategorySlug = string;

export type Category = {
  slug: CategorySlug;
  name: string;
  shortDescription: string;
  description: string;
  /** public/images/products altındaki klasör adı. */
  imageFolder: string;
  /** Kapak görseli (varsa). Yoksa arayüz markalı placeholder gösterir. */
  coverImage: string | null;
  subcategories: Subcategory[];
  seoTitle: string;
  seoDescription: string;
};

export type Subcategory = {
  slug: string;
  name: string;
};

export type ProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProductStatus = "active" | "draft" | "archived";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  subcategory: string | null;
  collection: string | null;
  shortDescription: string;
  description: string;
  productCode: string;
  images: ProductImage[];
  coverImage: ProductImage | null;
  price: number | null;
  oldPrice: number | null;
  campaignLabel: string | null;
  colors: string[];
  dimensions: string | null;
  materials: string[];
  setContents: string[];
  optionalParts: string[];
  features: string[];
  careNotes: string[];
  deliveryInfo: string | null;
  featured: boolean;
  campaign: boolean;
  status: ProductStatus;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  coverImage: ProductImage | null;
  productSlugs: string[];
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};
