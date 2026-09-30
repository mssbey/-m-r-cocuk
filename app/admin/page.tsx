"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "next/link";
import { useCatalog } from "@/components/admin/useCatalog";
import { collectionOf } from "@/lib/admin/catalog-types";
export default function AdminPage() {
  const c = useCatalog();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [tag, setTag] = useState("");
  if (!c.catalog)
    return (
      <p role={c.error ? "alert" : "status"}>{c.error || "Yükleniyor…"}</p>
    );
  const data = c.catalog;
  const q = search.trim().toLocaleLowerCase("tr");
  const visible = data.products.filter(
    (p) =>
      (!q ||
        [p.name, p.slug, p.productCode].some((s) =>
          s.toLocaleLowerCase("tr").includes(q),
        )) &&
      (!category || p.category === category) &&
      (!collection || collectionOf(p, data.collections) === collection) &&
      (!tag ||
        (tag === "new"
          ? p.isNew
          : tag === "campaign"
            ? p.campaign
            : !p.isNew && !p.campaign)),
  );
  async function move(slug: string, direction: number) {
    if (c.busy) return;
    const other =
      visible[visible.findIndex((p) => p.slug === slug) + direction];
    if (!other) return;
    const products = [...data.products],
      a = products.findIndex((p) => p.slug === slug),
      b = products.findIndex((p) => p.slug === other.slug);
    [products[a], products[b]] = [products[b], products[a]];
    c.setCatalog({ ...data, products });
    c.setBusy(true);
    c.setError("");
    try {
      await c.mutate({
        action: "reorderProducts",
        slugs: products.map((p) => p.slug),
      });
    } catch (e) {
      c.setCatalog(data);
      c.setError((e as Error).message);
    } finally {
      c.setBusy(false);
    }
  }
  async function remove(slug: string) {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    c.setBusy(true);
    c.setError("");
    try {
      await c.mutate({ action: "deleteProduct", slug });
    } catch (e) {
      c.setError((e as Error).message);
    } finally {
      c.setBusy(false);
    }
  }
  return (
    <>
      <h1>Ürünler</h1>
      <p className="admin-intro">
        {data.products.length} ürün. Açıklama, görsel ve diğer bilgileri
        düzenlemek için bir ürüne tıklayın.
      </p>
      <div className="admin-filters">
        <input
          aria-label="Ürün ara"
          placeholder="Ürün ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Kategori filtresi"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Tüm kategoriler</option>
          {data.categories.map((x) => (
            <option key={x.slug} value={x.slug}>
              {x.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Koleksiyon filtresi"
          value={collection}
          onChange={(e) => setCollection(e.target.value)}
        >
          <option value="">Tüm koleksiyonlar</option>
          {data.collections.map((x) => (
            <option key={x.slug} value={x.slug}>
              {x.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Etiket filtresi"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value="">Tüm etiketler</option>
          <option value="new">Yeni</option>
          <option value="campaign">Kampanya</option>
          <option value="none">Etiketsiz</option>
        </select>
      </div>
      <p className="admin-help">
        ↑ ↓ ile sitedeki sıralamayı değiştirin; ürün listesi ve ana sayfa bu
        sırayı kullanır.
      </p>
      <p aria-live="polite" className="admin-help">
        {visible.length !== data.products.length
          ? `${visible.length} / ${data.products.length} ürün gösteriliyor.`
          : ""}{" "}
        {c.busy ? "Kaydediliyor…" : ""}
      </p>
      {c.error && <p role="alert">{c.error}</p>}
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              {["Sıra", "Görsel", "Ürün", "Kategori", "Etiketler", ""].map(
                (x, i) => (
                  <th key={i} scope="col">
                    {x}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {visible.map((p, i) => (
              <tr key={p.slug}>
                <td>
                  <div className="admin-arrows">
                    <button
                      aria-label={`${p.name} yukarı taşı`}
                      disabled={c.busy || i === 0}
                      onClick={() => move(p.slug, -1)}
                    >
                      ↑
                    </button>
                    <button
                      aria-label={`${p.name} aşağı taşı`}
                      disabled={c.busy || i === visible.length - 1}
                      onClick={() => move(p.slug, 1)}
                    >
                      ↓
                    </button>
                  </div>
                </td>
                <td>
                  <img
                    src={p.coverImage?.src || "/logo/omur-cocuk-logo-navy.png"}
                    alt=""
                  />
                </td>
                <td>
                  <Link href={`/admin/products/${p.slug}/edit/`}>{p.name}</Link>
                </td>
                <td>
                  {data.categories.find((x) => x.slug === p.category)?.name ||
                    p.category}
                </td>
                <td className="admin-help">
                  {[p.isNew && "Yeni", p.campaign && "Kampanya"]
                    .filter(Boolean)
                    .join(" · ")}
                </td>
                <td>
                  <div className="admin-row-actions">
                    <Link href={`/admin/products/${p.slug}/edit/`}>
                      Düzenle
                    </Link>
                    <button
                      className="admin-danger"
                      disabled={c.busy}
                      onClick={() => remove(p.slug)}
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td colSpan={6}>
                  {data.products.length ? (
                    "Filtrelere uyan ürün yok."
                  ) : (
                    <>
                      Henüz ürün yok.{" "}
                      <Link href="/admin/products/new/">
                        İlk ürünü ekleyin.
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
