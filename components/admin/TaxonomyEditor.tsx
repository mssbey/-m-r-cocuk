"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useCatalog, type CatalogController } from "./useCatalog";
import { collectionOf, type AdminCollection } from "@/lib/admin/catalog-types";
import type { Category } from "@/lib/types";
export default function TaxonomyEditor() {
  const c = useCatalog();
  if (!c.catalog)
    return (
      <p role={c.error ? "alert" : "status"}>{c.error || "Yükleniyor…"}</p>
    );
  return (
    <>
      {(["categories", "collections"] as const).map((kind) => (
        <section key={kind} className="admin-section">
          <h1 className="admin-heading">
            {kind === "categories" ? "Kategoriler" : "Koleksiyonlar"}
          </h1>
          <p className="admin-intro">
            {kind === "categories"
              ? "Kategoriler menüde, ana sayfada, ürün filtrelerinde ve talep formunda ↑ ↓ ile belirlediğiniz sırayla gösterilir. Ürünü olan bir kategori silinemez."
              : 'Koleksiyonlar menüde, ana sayfada ve Koleksiyonlar sayfasında gösterilir. "yeni-koleksiyonlar" adresli koleksiyon, "Yeni ürün" işaretli tüm ürünleri otomatik listeler.'}
          </p>
          <div className="admin-grid">
            <TaxonomyCard kind={kind} c={c} />
            {c.catalog![kind].map((item, i) => (
              <TaxonomyCard
                key={item.slug}
                item={item}
                index={i}
                kind={kind}
                c={c}
              />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
function TaxonomyCard({
  kind,
  item,
  index = 0,
  c,
}: {
  kind: "categories" | "collections";
  item?: Category | AdminCollection;
  index?: number;
  c: CatalogController;
}) {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState("");
  const category = kind === "categories",
    name = category ? "kategori" : "koleksiyon";
  const src = item && ("coverImage" in item ? item.coverImage : item.image);
  const count = item
    ? c.catalog!.products.filter((p) =>
        category
          ? p.category === item.slug
          : collectionOf(p, c.catalog!.collections) === item.slug,
      ).length
    : 0;
  async function run(action: string, data: Record<string, unknown> = {}) {
    if (c.busy) return false;
    setError("");
    setMessage("");
    setPending(action);
    c.setBusy(true);
    try {
      await c.mutate({ action, kind, originalSlug: item?.slug, ...data });
      setMessage(
        `${category ? "Kategori" : "Koleksiyon"} ${item ? "güncellendi" : "eklendi"}.`,
      );
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      c.setBusy(false);
      setPending("");
    }
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (c.busy) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    setError("");
    setMessage("");
    c.setBusy(true);
    setPending("saveTaxonomy");
    try {
      const file = fd.get("image") as File;
      const uploaded = file?.size ? await c.upload(file, "taxonomy") : null;
      const image = uploaded?.src || src || "";
      await c.mutate({
        action: "saveTaxonomy",
        kind,
        originalSlug: item?.slug,
        data: {
          name: fd.get("name"),
          slug: fd.get("slug"),
          description: fd.get("description"),
          subtitle: fd.get("subtitle"),
          image,
          uploadToken: uploaded?.uploadToken,
          ...(category
            ? {
                subcategories: String(fd.get("subcategories") || "")
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }
            : {}),
        },
      });
      setMessage(
        `${category ? "Kategori" : "Koleksiyon"} ${item ? "güncellendi" : "eklendi"}.`,
      );
      if (!item) form.reset();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      c.setBusy(false);
      setPending("");
    }
  }
  return (
    <article className="admin-card">
      {item && (
        <div className="admin-card-top">
          <img src={src || "/logo/omur-cocuk-logo-navy.png"} alt="" />
          <div className="admin-card-meta">
            <p title={item.slug}>
              {category ? `/${item.slug}` : `/koleksiyonlar/${item.slug}`}
            </p>
            <p>{count} ürün</p>
          </div>
          <div className="admin-arrows">
            <button
              disabled={c.busy || index === 0}
              aria-label={`${item.name} yukarı taşı`}
              onClick={() => run("moveTaxonomy", { direction: -1 })}
            >
              ↑
            </button>
            <button
              disabled={c.busy || index === c.catalog![kind].length - 1}
              aria-label={`${item.name} aşağı taşı`}
              onClick={() => run("moveTaxonomy", { direction: 1 })}
            >
              ↓
            </button>
          </div>
        </div>
      )}
      <h3>{item?.name || `Yeni ${name} ekle`}</h3>
      <form onSubmit={submit}>
        <fieldset disabled={c.busy} className="admin-fields">
          <label>
            <span>Ad</span>
            <input
              name="name"
              required
              maxLength={80}
              defaultValue={item?.name || ""}
            />
          </label>
          <label>
            <span>URL (slug)</span>
            <input
              name="slug"
              placeholder="boş bırakırsanız addan oluşturulur"
              defaultValue={item?.slug || ""}
            />
          </label>
          {count > 0 && (
            <p className="admin-help">
              Değiştirirseniz {count} ürün yeni adrese taşınır; eski bağlantılar
              çalışmaz.
            </p>
          )}
          {!category && (
            <label>
              <span>Alt başlık</span>
              <input
                name="subtitle"
                maxLength={120}
                defaultValue={item && "subtitle" in item ? item.subtitle : ""}
                placeholder="Örn. Az detay. Çok his."
              />
            </label>
          )}
          <label>
            <span>Açıklama</span>
            <textarea
              name="description"
              rows={2}
              maxLength={400}
              defaultValue={item?.description || ""}
            />
          </label>
          {category && (
            <details>
              <summary>Alt kategoriler (isteğe bağlı)</summary>
              <label>
                <span>Her satıra bir alt kategori</span>
                <textarea
                  name="subcategories"
                  rows={3}
                  defaultValue={
                    item && "subcategories" in item
                      ? item.subcategories.map((s) => s.name).join("\n")
                      : ""
                  }
                />
              </label>
              <p className="admin-help">
                En fazla 30 alt kategori. Kullanılan alt kategoriler
                kaldırılamaz.
              </p>
            </details>
          )}
          <label>
            <span>
              Görsel{item ? " değiştir (isteğe bağlı)" : " (isteğe bağlı)"}
            </span>
            <input
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
            />
          </label>
          <p className="admin-help">JPG, PNG veya WEBP · En fazla 4 MB.</p>
          <button className="admin-button" type="submit">
            {pending === "saveTaxonomy"
              ? "Kaydediliyor…"
              : item
                ? "Değişiklikleri kaydet"
                : "Ekle"}
          </button>
        </fieldset>
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
      </form>
      {item && (
        <div className="admin-card-footer">
          <button
            className="admin-danger"
            disabled={c.busy}
            onClick={() => {
              if (confirm(`"${item.name}" silinsin mi?`))
                void run("deleteTaxonomy");
            }}
          >
            {pending === "deleteTaxonomy" ? "Siliniyor…" : "Sil"}
          </button>
        </div>
      )}
    </article>
  );
}
