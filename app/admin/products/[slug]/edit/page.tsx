import { ProductEditor } from "@/components/admin/ProductEditor";
import { readCatalog } from "@/lib/admin/catalog-store";
import { notFound } from "next/navigation";
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const catalog = await readCatalog();
  if (!catalog.products.some((p) => p.slug === slug)) notFound();
  return <ProductEditor slug={slug} />;
}
