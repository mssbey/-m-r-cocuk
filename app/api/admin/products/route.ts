import { NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/admin/github";
import { PRODUCTS_JSON_PATH, EMPTY_PRODUCT_DEFAULTS, nextProductCode, nowIso, slugify, uniqueSlug } from "@/lib/admin/products";
import categories from "@/lib/data/categories.json";
import type { Product } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const { data } = await readJsonFile<Product[]>(PRODUCTS_JSON_PATH);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.category) {
    return NextResponse.json({ error: "Ürün adı ve kategori zorunludur." }, { status: 400 });
  }

  const category = categories.find((c) => c.slug === body.category);
  if (!category) {
    return NextResponse.json({ error: "Geçersiz kategori." }, { status: 400 });
  }

  const { data: products, sha } = await readJsonFile<Product[]>(PRODUCTS_JSON_PATH);

  const baseSlug = slugify(body.slug && String(body.slug).trim() ? body.slug : body.name);
  const slug = uniqueSlug(products, baseSlug);

  const product: Product = {
    id: slug,
    slug,
    name: body.name,
    category: body.category,
    subcategory: body.subcategory || null,
    productCode: nextProductCode(products, body.category),
    ...EMPTY_PRODUCT_DEFAULTS,
    shortDescription: body.shortDescription || "",
    description: body.description || "",
    seoTitle: body.name,
    seoDescription: body.shortDescription || "",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  const updated = [...products, product];
  await writeJsonFile(PRODUCTS_JSON_PATH, updated, `admin: ürün eklendi — ${product.name}`, sha);

  return NextResponse.json(product, { status: 201 });
}
