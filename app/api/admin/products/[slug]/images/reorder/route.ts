import { NextResponse } from "next/server";
import { readJsonFile, writeJsonFile } from "@/lib/admin/github";
import { PRODUCTS_JSON_PATH, nowIso } from "@/lib/admin/products";
import type { Product } from "@/lib/types";

export const runtime = "nodejs";

type Params = { params: Promise<{ slug: string }> };

export async function POST(req: Request, { params }: Params) {
  const { slug } = await params;
  const body = await req.json().catch(() => null);
  const order = body?.order;
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: "Geçersiz sıralama." }, { status: 400 });
  }

  const { data: products, sha } = await readJsonFile<Product[]>(PRODUCTS_JSON_PATH);
  const idx = products.findIndex((p) => p.slug === slug);
  if (idx === -1) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  const product = products[idx];

  if (order.length !== product.images.length) {
    return NextResponse.json({ error: "Geçersiz sıralama." }, { status: 400 });
  }
  const reordered = order.map((i: number) => product.images[i]);
  if (reordered.some((img) => !img)) {
    return NextResponse.json({ error: "Geçersiz sıralama indeksi." }, { status: 400 });
  }

  product.images = reordered;
  product.coverImage = product.images[0] || null;
  product.updatedAt = nowIso();
  products[idx] = product;

  await writeJsonFile(PRODUCTS_JSON_PATH, products, `admin: görsel sırası değişti — ${product.name}`, sha);
  return NextResponse.json(product);
}
