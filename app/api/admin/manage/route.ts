import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isSessionValid } from "@/lib/admin/auth";
import {
  readCatalog,
  saveCatalog,
  CatalogError,
} from "@/lib/admin/catalog-store";
import { applyCatalogAction } from "@/lib/admin/catalog-actions";
export const runtime = "nodejs";
async function authorized() {
  return isSessionValid((await cookies()).get(ADMIN_SESSION_COOKIE)?.value);
}
const errorResponse = (e: unknown) =>
  Response.json(
    {
      error:
        e instanceof CatalogError
          ? e.message
          : "Kayıt verilerine erişilemedi. Bağlantıyı kontrol edip tekrar deneyin.",
    },
    { status: e instanceof CatalogError ? e.status : 502 },
  );
export async function GET() {
  if (!(await authorized()))
    return Response.json({ error: "Yetkisiz." }, { status: 401 });
  try {
    return Response.json(await readCatalog(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
export async function POST(req: Request) {
  if (!(await authorized()))
    return Response.json({ error: "Yetkisiz." }, { status: 401 });
  try {
    const input = await req.json().catch(() => null);
    if (!input || typeof input !== "object")
      throw new CatalogError("Geçersiz form.");
    const catalog = await readCatalog();
    if (input.revision !== catalog.revision)
      throw new CatalogError(
        "Liste değişmiş. Sayfayı yenileyip tekrar deneyin.",
        409,
      );
    applyCatalogAction(catalog, input);
    await saveCatalog(catalog, catalog.revision);
    return Response.json(catalog);
  } catch (e) {
    return errorResponse(e);
  }
}
