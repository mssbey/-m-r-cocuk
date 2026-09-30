"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useCatalog, type CatalogController } from "./useCatalog";
import { sortGallery, type GalleryItem } from "@/lib/admin/catalog-types";
export default function GalleryEditor() {
  const c = useCatalog();
  return (
    <>
      <h1 className="admin-heading">Fabrika ve Teslimatlar</h1>
      <p className="admin-intro">
        Fotoğraflar Biz Kimiz sayfasında yayınlanır. Fabrika fotoğrafları ana
        sayfa ve Fabrikamız sayfasında da gösterilir.
      </p>
      {!c.catalog ? (
        <p role={c.error ? "alert" : "status"}>{c.error || "Yükleniyor…"}</p>
      ) : (
        <div className="admin-grid">
          <GalleryCard c={c} />
          {sortGallery(c.catalog.gallery).map((item) => (
            <GalleryCard key={item.id} item={item} c={c} />
          ))}
        </div>
      )}
    </>
  );
}
function GalleryCard({
  item,
  c,
}: {
  item?: GalleryItem;
  c: CatalogController;
}) {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (c.busy) return;
    const form = e.currentTarget,
      fd = new FormData(form);
    setError("");
    setMessage("");
    setPending("save");
    c.setBusy(true);
    try {
      const file = fd.get("image") as File;
      const uploaded = file?.size ? await c.upload(file, "gallery") : null;
      const src = uploaded?.src || item?.src;
      await c.mutate({
        action: "saveGallery",
        id: item?.id,
        data: {
          category: fd.get("category"),
          caption: fd.get("caption"),
          position: Number(fd.get("position")),
          src,
          uploadToken: uploaded?.uploadToken,
        },
      });
      setMessage(item ? "Görsel güncellendi." : "Görsel galeriye eklendi.");
      if (!item) form.reset();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending("");
      c.setBusy(false);
    }
  }
  async function remove() {
    if (!confirm("Bu fotoğraf galeriden kaldırılsın mı?")) return;
    setError("");
    setMessage("");
    setPending("delete");
    c.setBusy(true);
    try {
      await c.mutate({ action: "deleteGallery", id: item!.id });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setPending("");
      c.setBusy(false);
    }
  }
  return (
    <article className="admin-card">
      {item && (
        <img className="admin-photo" src={item.src} alt={item.caption} />
      )}
      <h3>{item ? "Görseli düzenle" : "Yeni fotoğraf ekle"}</h3>
      <form onSubmit={submit}>
        <fieldset disabled={c.busy} className="admin-fields">
          <label>
            <span>Kategori</span>
            <select name="category" defaultValue={item?.category || "factory"}>
              <option value="factory">Fabrikamız</option>
              <option value="delivery">Teslimatlarımız</option>
            </select>
          </label>
          <label>
            <span>Fotoğraf açıklaması</span>
            <input
              name="caption"
              required
              maxLength={180}
              defaultValue={item?.caption || ""}
              placeholder="Örn. Başlık döşeme atölyemiz"
            />
          </label>
          <label>
            <span>Görüntülenme sırası</span>
            <input
              name="position"
              type="number"
              required
              min={0}
              max={9999}
              step={1}
              defaultValue={item?.position ?? 0}
            />
          </label>
          <p className="admin-help">Küçük sayılar önce gösterilir.</p>
          <label>
            <span>
              {item ? "Fotoğrafı değiştir (isteğe bağlı)" : "Fotoğraf"}
            </span>
            <input
              type="file"
              name="image"
              required={!item}
              accept="image/jpeg,image/png,image/webp"
            />
          </label>
          <p className="admin-help">
            JPG, PNG veya WEBP · En fazla 3 MB. Yalnızca paylaşım izniniz olan
            gerçek fabrika ve teslimat fotoğraflarını yükleyin.
          </p>
          <button className="admin-button">
            {pending === "save"
              ? "Kaydediliyor…"
              : item
                ? "Değişiklikleri kaydet"
                : "Galeriye ekle"}
          </button>
        </fieldset>
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
      </form>
      {item && (
        <div className="admin-card-footer">
          <button className="admin-danger" disabled={c.busy} onClick={remove}>
            {pending === "delete" ? "Kaldırılıyor…" : "Galeriden kaldır"}
          </button>
        </div>
      )}
    </article>
  );
}
