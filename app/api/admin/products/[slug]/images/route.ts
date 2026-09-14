import { NextResponse } from "next/server";
import sharp from "sharp";
import { readJsonFile, writeJsonFile, writeFile, deleteFile, getFileSha } from "@/lib/admin/github";
import { PRODUCTS_JSON_PATH, imageFolderFor, nowIso } from "@/lib/admin/products";
import type { Product, ProductImage } from "@/lib/types";

export const runtime = "nodejs";

type Params = { params: Promise<{ slug: string }> };

// Vercel Serverless Functions'ta istek gövdesi ~4.5MB ile sınırlıdır;
// tek bir orijinal fotoğrafın bu sınırın altında kalması gerekir.
const MAX_ORIGINAL_BYTES = 4 * 1024 * 1024;

export async function POST(req: Request, { params }: Params) {
  const { slug } = await params;
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Geçersiz form verisi." }, { status: 400 });

  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "Görsel gönderilmedi." }, { status: 400 });
  }
  for (const file of files) {
    if (file.size > MAX_ORIGINAL_BYTES) {
      return NextResponse.json(
        { error: `"${file.name}" dosyası çok büyük (max 4MB). Lütfen önce sıkıştırıp tekrar deneyin.` },
        { status: 413 }
      );
    }
  }

  const { data: products, sha } = await readJsonFile<Product[]>(PRODUCTS_JSON_PATH);
  const idx = products.findIndex((p) => p.slug === slug);
  if (idx === -1) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  const product = products[idx];

  let maxIndex = 0;
  const existingPattern = new RegExp(`^${product.slug}-(\\d+)\\.webp$`);
  for (const img of product.images) {
    const base = img.src.split("/").pop() || "";
    const match = base.match(existingPattern);
    if (match) maxIndex = Math.max(maxIndex, parseInt(match[1], 10));
  }

  const newImages: ProductImage[] = [];
  for (const file of files) {
    maxIndex += 1;
    const fileName = `${product.slug}-${String(maxIndex).padStart(2, "0")}.webp`;
    const arrayBuffer = await file.arrayBuffer();
    let processed;
    try {
      processed = await sharp(Buffer.from(arrayBuffer))
        .rotate()
        .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer({ resolveWithObject: true });
    } catch (e) {
      return NextResponse.json({ error: `Görsel işlenemedi: ${(e as Error).message}` }, { status: 500 });
    }

    const repoPath = `${imageFolderFor(product.category)}/${fileName}`;
    await writeFile(repoPath, processed.data, `admin: görsel eklendi — ${product.name} (${fileName})`);

    newImages.push({
      src: `/images/products/${product.category}/${fileName}`,
      alt: `${product.name} - ${maxIndex}. görsel`,
      width: processed.info.width,
      height: processed.info.height,
    });
  }

  product.images = [...product.images, ...newImages];
  if (!product.coverImage && product.images.length > 0) {
    product.coverImage = product.images[0];
  }
  product.updatedAt = nowIso();
  products[idx] = product;

  await writeJsonFile(PRODUCTS_JSON_PATH, products, `admin: ${newImages.length} görsel eklendi — ${product.name}`, sha);
  return NextResponse.json(product);
}

export async function DELETE(req: Request, { params }: Params) {
  const { slug } = await params;
  const body = await req.json().catch(() => null);
  const index = body?.index;
  if (typeof index !== "number") {
    return NextResponse.json({ error: "Geçersiz görsel indeksi." }, { status: 400 });
  }

  const { data: products, sha } = await readJsonFile<Product[]>(PRODUCTS_JSON_PATH);
  const idx = products.findIndex((p) => p.slug === slug);
  if (idx === -1) return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  const product = products[idx];

  if (index < 0 || index >= product.images.length) {
    return NextResponse.json({ error: "Geçersiz görsel indeksi." }, { status: 400 });
  }

  const [removed] = product.images.splice(index, 1);
  product.coverImage = product.images[0] || null;
  product.updatedAt = nowIso();
  products[idx] = product;

  await writeJsonFile(PRODUCTS_JSON_PATH, products, `admin: görsel silindi — ${product.name}`, sha);

  const repoPath = removed.src.replace(/^\//, "");
  const fileSha = await getFileSha(repoPath);
  if (fileSha) {
    await deleteFile(repoPath, fileSha, `admin: görsel dosyası silindi — ${product.name}`);
  }

  return NextResponse.json(product);
}
