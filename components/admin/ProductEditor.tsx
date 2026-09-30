"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCatalog, type CatalogController } from "./useCatalog";
import { collectionOf } from "@/lib/admin/catalog-types";
import type { Product, ProductImage } from "@/lib/types";
export function ProductEditor({ slug }: { slug?: string }) {
  const c = useCatalog();
  if (!c.catalog)
    return (
      <p role={c.error ? "alert" : "status"}>{c.error || "Yükleniyor…"}</p>
    );
  const product = c.catalog.products.find((p) => p.slug === slug);
  if (slug && !product) return <p role="alert">Ürün bulunamadı.</p>;
  return <Editor key={slug || "new"} c={c} product={product} />;
}
function Editor({ c, product }: { c: CatalogController; product?: Product }) {
  const router = useRouter();
  const [cover, setCover] = useState<ProductImage | null>(
    product?.coverImage || null,
  );
  const [extras, setExtras] = useState<ProductImage[]>(
    (product?.images || []).filter((x) => x.src !== product?.coverImage?.src),
  );
  const [category, setCategory] = useState(product?.category || "");
  const [error, setError] = useState("");
  const selected = c.catalog!.categories.find((x) => x.slug === category);
  const split = (value: FormDataEntryValue | null) =>
    String(value || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (c.busy) return;
    const fd = new FormData(e.currentTarget);
    c.setBusy(true);
    setError("");
    try {
      const newCover = fd.get("coverFile") as File;
      const finalCover = newCover?.size ? await c.upload(newCover) : cover;
      const images = [...extras];
      for (const file of fd.getAll("galleryFiles"))
        if (file instanceof File && file.size)
          images.push(await c.upload(file));
      const data: Record<string, unknown> = {
        name: fd.get("name"),
        slug: fd.get("slug"),
        category,
        collectionGroup: fd.get("collectionGroup"),
        description: fd.get("description"),
        dimensions: fd.get("dimensions"),
        colors: split(fd.get("colors")),
        fabrics: split(fd.get("fabrics")),
        isNew: fd.has("isNew"),
        campaign: fd.has("campaign"),
        coverImage: finalCover,
        images,
      };
      for (const key of [
        "shortDescription",
        "productCode",
        "campaignLabel",
        "deliveryInfo",
        "seoTitle",
        "seoDescription",
        "subcategory",
        "status",
      ])
        data[key] = fd.get(key);
      // An empty auto-generated product code is omitted on creation.
      if (!data.productCode) delete data.productCode;
      for (const key of [
        "materials",
        "setContents",
        "optionalParts",
        "features",
        "careNotes",
      ])
        data[key] = String(fd.get(key) || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      for (const key of ["price", "oldPrice"])
        data[key] = fd.get(key) ? Number(fd.get(key)) : null;
      data.featured = fd.has("featured");
      await c.mutate({
        action: "saveProduct",
        originalSlug: product?.slug,
        data,
      });
      router.push("/admin/");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      c.setBusy(false);
    }
  }
  function move(i: number, d: number) {
    const next = [...extras];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setExtras(next);
  }
  return (
    <>
      <Link href="/admin/">← Ürün listesi</Link>
      <h1 style={{ marginTop: 16 }}>
        {product ? `${product.name} — Düzenle` : "Yeni Ürün Ekle"}
      </h1>
      <div className="admin-product-form">
        <form onSubmit={submit}>
          <fieldset disabled={c.busy} className="admin-fields">
            <Field label="Ürün adı">
              <input
                name="name"
                required
                maxLength={200}
                defaultValue={product?.name || ""}
              />
            </Field>
            <Field label="URL (slug)">
              <input
                name="slug"
                defaultValue={product?.slug || ""}
                placeholder="boş bırakırsanız ürün adından oluşturulur"
              />
            </Field>
            <p className="admin-help">
              Örn. /urun/mini-luna — sadece küçük harf, rakam ve tire.
            </p>
            <Field label="Kategori">
              <select
                name="category"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
                  Seçin
                </option>
                {c.catalog!.categories.map((x) => (
                  <option key={x.slug} value={x.slug}>
                    {x.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Koleksiyon">
              <select
                name="collectionGroup"
                required={!product}
                defaultValue={
                  product ? collectionOf(product, c.catalog!.collections) : ""
                }
              >
                <option value="">
                  {product ? "Koleksiyon atanmamış" : "Seçin"}
                </option>
                {c.catalog!.collections.map((x) => (
                  <option key={x.slug} value={x.slug}>
                    {x.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Açıklama">
              <textarea
                name="description"
                required
                rows={4}
                defaultValue={product?.description || ""}
              />
            </Field>
            <Field label="Ölçüler">
              <input
                name="dimensions"
                placeholder="140 × 200 cm, 160 × 200 cm"
                defaultValue={product?.dimensions || ""}
              />
            </Field>
            <Field label="Renkler">
              <input
                name="colors"
                placeholder="Krem, Bej"
                defaultValue={product?.colors.join(", ") || ""}
              />
            </Field>
            <Field label="Kumaşlar">
              <input
                name="fabrics"
                placeholder="Keten dokulu, Kadife"
                defaultValue={product?.fabrics?.join(", ") || ""}
              />
            </Field>
            <p className="admin-help">
              Ölçü, renk ve kumaşları virgülle ayırarak yazın.
            </p>
            <label className="admin-check">
              <input
                name="isNew"
                type="checkbox"
                defaultChecked={product?.isNew || false}
              />
              Yeni ürün
            </label>
            <label className="admin-check">
              <input
                name="campaign"
                type="checkbox"
                defaultChecked={product?.campaign || false}
              />
              Kampanyalı ürün
            </label>
            <Field label="Kapak görseli">
              <input
                name="coverFile"
                type="file"
                required={!cover}
                accept="image/jpeg,image/png,image/webp,image/gif"
              />
            </Field>
            {cover && (
              <div className="admin-cover">
                <img src={cover.src} alt="Mevcut kapak" />
                <p className="admin-help">
                  Yeni dosya seçmezseniz mevcut kapak korunur.
                </p>
              </div>
            )}
            <Field label="Ek görseller">
              <input
                name="galleryFiles"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
              />
            </Field>
            <p className="admin-help">
              JPG, PNG, WEBP veya GIF · Dosya başına en fazla 4 MB. Görseller
              tek tek yüklenir.
            </p>
            {product && (
              <>
                <h3>Mevcut ek görseller</h3>
                <div className="admin-images">
                  {extras.map((img, i) => (
                    <div className="admin-image-card" key={img.src}>
                      <img
                        src={img.src}
                        alt={`${product.name} ${i + 1}. ek görsel`}
                      />
                      <div>
                        <button
                          type="button"
                          aria-label={`${i + 1}. görseli sola taşı`}
                          disabled={i === 0}
                          onClick={() => move(i, -1)}
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          aria-label={`${i + 1}. görseli sağa taşı`}
                          disabled={i === extras.length - 1}
                          onClick={() => move(i, 1)}
                        >
                          →
                        </button>
                        <button
                          type="button"
                          aria-label={`${i + 1}. görseli kaldır`}
                          className="admin-danger"
                          onClick={() =>
                            setExtras(extras.filter((_, j) => j !== i))
                          }
                        >
                          ×
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCover(img);
                          setExtras(
                            extras.flatMap((x, j) =>
                              j === i ? (cover ? [cover] : []) : [x],
                            ),
                          );
                        }}
                      >
                        Kapak yap
                      </button>
                    </div>
                  ))}
                </div>
                {!extras.length && (
                  <p className="admin-help">
                    Galeride kapak dışında görsel yok.
                  </p>
                )}
              </>
            )}
            <details className="admin-extra">
              <summary>Diğer ürün bilgileri</summary>
              <div className="admin-fields">
                <Field label="Ürün kodu">
                  <input
                    name="productCode"
                    defaultValue={product?.productCode || ""}
                    placeholder="Otomatik oluşturulur"
                  />
                </Field>
                <Field label="Alt kategori">
                  <select
                    key={category}
                    name="subcategory"
                    defaultValue={
                      product?.category === category
                        ? product.subcategory || ""
                        : ""
                    }
                  >
                    <option value="">Yok</option>
                    {selected?.subcategories.map((x) => (
                      <option key={x.slug} value={x.slug}>
                        {x.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Kısa açıklama">
                  <textarea
                    name="shortDescription"
                    rows={2}
                    defaultValue={product?.shortDescription || ""}
                  />
                </Field>
                <Field label="Fiyat (₺)">
                  <input
                    name="price"
                    type="number"
                    min={0}
                    step="0.01"
                    defaultValue={product?.price ?? ""}
                  />
                </Field>
                <Field label="Eski fiyat (₺)">
                  <input
                    name="oldPrice"
                    type="number"
                    min={0}
                    step="0.01"
                    defaultValue={product?.oldPrice ?? ""}
                  />
                </Field>
                <Field label="Kampanya etiketi">
                  <input
                    name="campaignLabel"
                    defaultValue={product?.campaignLabel || ""}
                  />
                </Field>
                <Field label="Teslimat bilgisi">
                  <input
                    name="deliveryInfo"
                    defaultValue={product?.deliveryInfo || ""}
                  />
                </Field>
                {(
                  [
                    ["materials", "Malzemeler"],
                    ["setContents", "Set içeriği"],
                    ["optionalParts", "Opsiyonel parçalar"],
                    ["features", "Özellikler"],
                    ["careNotes", "Bakım notları"],
                  ] as const
                ).map(([key, label]) => (
                  <Field key={key} label={`${label} (her satıra bir tane)`}>
                    <textarea
                      rows={3}
                      name={key}
                      defaultValue={product?.[key].join("\n") || ""}
                    />
                  </Field>
                ))}
                <label className="admin-check">
                  <input
                    name="featured"
                    type="checkbox"
                    defaultChecked={product?.featured || false}
                  />
                  Öne çıkan
                </label>
                <Field label="Durum">
                  <select
                    name="status"
                    defaultValue={product?.status || "active"}
                  >
                    <option value="active">Aktif</option>
                    <option value="draft">Taslak</option>
                    <option value="archived">Arşivlenmiş</option>
                  </select>
                </Field>
                <Field label="SEO başlığı">
                  <input
                    name="seoTitle"
                    defaultValue={product?.seoTitle || ""}
                  />
                </Field>
                <Field label="SEO açıklaması">
                  <textarea
                    name="seoDescription"
                    rows={2}
                    defaultValue={product?.seoDescription || ""}
                  />
                </Field>
              </div>
            </details>
            <div>
              <button className="admin-button">
                {c.busy
                  ? "Kaydediliyor…"
                  : product
                    ? "Değişiklikleri Kaydet"
                    : "Ürünü Ekle"}
              </button>
            </div>
          </fieldset>
          {error && (
            <p role="alert" style={{ marginTop: 16 }}>
              {error}
            </p>
          )}
        </form>
      </div>
    </>
  );
}
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label>
      <span>{label}</span>
      {children}
    </label>
  );
}
