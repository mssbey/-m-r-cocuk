import { NextResponse } from "next/server";
import { deleteFile, getFileSha, readJsonFile, writeJsonFile } from "@/lib/admin/github";
import { EDITABLE_FIELDS, PRODUCTS_JSON_PATH, nowIso } from "@/lib/admin/products";
import type { Category, Product } from "@/lib/types";
import { CATEGORIES_JSON_PATH } from "@/lib/admin/categories";

export const runtime = "nodejs";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { slug } = await params;
  const { data: products } = await readJsonFile<Product[]>(PRODUCTS_JSON_PATH);
  const product = products.find((p) => p.slug === slug);
  if (!product) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: Params) {
  const { slug } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  const { data: products, sha } = await readJsonFile<Product[]>(PRODUCTS_JSON_PATH);
  const idx = products.findIndex((p) => p.slug === slug);
  if (idx === -1) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });

  const product = { ...products[idx] };
  for (const field of EDITABLE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      // @ts-expect-error - dinamik alan ataması, EDITABLE_FIELDS Product anahtarlarıyla sınırlı
      product[field] = body[field];
    }
  }
  const { data: categories } = await readJsonFile<Category[]>(CATEGORIES_JSON_PATH);
  const category = categories.find((item) => item.slug === product.category);
  if (!category || (product.subcategory && !category.subcategories.some((sub) => sub.slug === product.subcategory))) {
    return NextResponse.json({ error: "Geçersiz kategori veya alt kategori." }, { status: 400 });
  }
  product.updatedAt = nowIso();
  products[idx] = product;

  await writeJsonFile(PRODUCTS_JSON_PATH, products, `admin: ürün güncellendi — ${product.name}`, sha);
  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: Params) {
  const { slug } = await params;
  const { data: products, sha } = await readJsonFile<Product[]>(PRODUCTS_JSON_PATH);
  const idx = products.findIndex((p) => p.slug === slug);
  if (idx === -1) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });

  const [removed] = products.splice(idx, 1);
  await writeJsonFile(PRODUCTS_JSON_PATH, products, `admin: ürün silindi — ${removed.name}`, sha);

  const results = await Promise.allSettled(
    (removed.images || []).map(async (img) => {
      const path = img.src.replace(/^\//, "");
      const fileSha = await getFileSha(path);
      if (fileSha) await deleteFile(path, fileSha, `admin: ürün görseli silindi — ${removed.name}`);
    })
  );
  const imageDeleteFailed = results.some((r) => r.status === "rejected");

  return NextResponse.json({ ok: true, imageDeleteFailed });
}
