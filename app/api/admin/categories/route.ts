import { NextResponse } from "next/server";
import type { Category } from "@/lib/types";
import { CATEGORIES_JSON_PATH, prepareCategory } from "@/lib/admin/categories";
import { GitHubApiError, readJsonFile, writeJsonFile } from "@/lib/admin/github";

export const runtime = "nodejs";

function storageError(error: unknown) {
  if (error instanceof GitHubApiError && error.status === 409) {
    return NextResponse.json({ error: "Kategoriler başka bir işlemde güncellendi. Listeyi yenileyip tekrar deneyin." }, { status: 409 });
  }
  return NextResponse.json({ error: "Kategori verilerine erişilemedi. GitHub bağlantısını kontrol edip tekrar deneyin." }, { status: 502 });
}

export async function GET() {
  try {
    const { data } = await readJsonFile<Category[]>(CATEGORIES_JSON_PATH);
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return storageError(error);
  }
}

export async function POST(req: Request) {
  const body: unknown = await req.json().catch(() => null);
  // Reject invalid input before accessing storage.
  const validation = prepareCategory(body, []);
  if (validation.error !== undefined) return NextResponse.json({ error: validation.error }, { status: validation.status });
  try {
    const { data, sha } = await readJsonFile<Category[]>(CATEGORIES_JSON_PATH);
    const result = prepareCategory(body, data);
    if (result.error !== undefined) return NextResponse.json({ error: result.error }, { status: result.status });
    await writeJsonFile(CATEGORIES_JSON_PATH, [...data, result.category], `admin: kategori eklendi — ${result.category.name}`, sha);
    return NextResponse.json(result.category, { status: 201 });
  } catch (error) {
    return storageError(error);
  }
}
