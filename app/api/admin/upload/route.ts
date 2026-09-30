import { randomUUID } from "node:crypto";
import { uploadReceipt } from "@/lib/admin/upload-receipt";
import sharp from "sharp";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isSessionValid } from "@/lib/admin/auth";
import {
  CatalogError,
  readCatalog,
  saveCatalog,
} from "@/lib/admin/catalog-store";
export const runtime = "nodejs";
export async function POST(req: Request) {
  if (
    !(await isSessionValid((await cookies()).get(ADMIN_SESSION_COOKIE)?.value))
  )
    return Response.json({ error: "Yetkisiz." }, { status: 401 });
  try {
    const form = await req.formData();
    const file = form.get("file");
    const kind = String(form.get("kind") || "product");
    if (!["product", "taxonomy", "gallery"].includes(kind))
      throw new CatalogError("Geçersiz görsel kategorisi.");
    const gallery = form.get("kind") === "gallery";
    if (!(file instanceof File) || !file.size)
      throw new CatalogError("Bir fotoğraf seçin.");
    const limit = gallery ? 3 : 4;
    if (file.size > limit * 1024 * 1024)
      throw new CatalogError(`Görsel en fazla ${limit} MB olabilir.`);
    if (
      !(
        gallery
          ? ["image/jpeg", "image/png", "image/webp"]
          : ["image/jpeg", "image/png", "image/webp", "image/gif"]
      ).includes(file.type)
    )
      throw new CatalogError("Geçerli bir JPG, PNG veya WEBP görseli seçin.");
    const buffer = Buffer.from(await file.arrayBuffer());
    const format = await sharp(buffer, { limitInputPixels: 40000000 })
      .metadata()
      .then((x) => x.format)
      .catch(() => null);
    const formats: Record<string, string> = {
      "image/jpeg": "jpeg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };
    if (format !== formats[file.type])
      throw new CatalogError(
        "Geçerli bir görsel seçin. Dosya içeriği türüyle uyuşmuyor.",
      );
    const processed = await sharp(buffer)
      .rotate()
      .resize({
        width: 2000,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer({ resolveWithObject: true });
    const catalog = await readCatalog();
    if (form.get("revision") !== catalog.revision)
      throw new CatalogError(
        "Liste değişmiş. Sayfayı yenileyip tekrar deneyin.",
        409,
      );
    const src = `/images/uploads/${randomUUID()}.webp`;
    await saveCatalog(catalog, catalog.revision, [
      { path: `public${src}`, content: processed.data },
    ]);
    return Response.json({
      image: {
        src,
        uploadToken: uploadReceipt(src, kind),
        alt: "",
        width: processed.info.width,
        height: processed.info.height,
      },
      revision: catalog.revision,
    });
  } catch (e) {
    return Response.json(
      {
        error:
          e instanceof CatalogError
            ? e.message
            : "Görsel yüklenemedi. Lütfen tekrar deneyin.",
      },
      { status: e instanceof CatalogError ? e.status : 502 },
    );
  }
}
