"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { useCatalog, type CatalogController } from "./useCatalog";
import type { HeroSlide } from "@/lib/admin/catalog-types";
export default function SlidesEditor() {
  const c = useCatalog();
  return (
    <>
      <h1 className="admin-heading">Ana Sayfa Slider</h1>
      <p className="admin-intro">
        Ana sayfanın en üstündeki büyük slider. Görseli, yazıları ve
        bağlantıyı buradan değiştirebilirsiniz. Değişiklikler birkaç dakika
        içinde siteye yansır.
      </p>
      {!c.catalog ? (
        <p role={c.error ? "alert" : "status"}>{c.error || "Yükleniyor…"}</p>
      ) : (
        <div className="admin-grid">
          {c.catalog.slides.map((slide, i) => (
            <SlideCard
              key={slide.id}
              slide={slide}
              index={i}
              total={c.catalog!.slides.length}
              c={c}
            />
          ))}
          <SlideCard c={c} />
        </div>
      )}
    </>
  );
}
function SlideCard({
  slide,
  index = 0,
  total = 0,
  c,
}: {
  slide?: HeroSlide;
  index?: number;
  total?: number;
  c: CatalogController;
}) {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState("");
  const [preview, setPreview] = useState("");
  async function run(kind: string, action: () => Promise<unknown>) {
    setError("");
    setMessage("");
    setPending(kind);
    c.setBusy(true);
    try {
      await action();
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setPending("");
      c.setBusy(false);
    }
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (c.busy) return;
    const form = e.currentTarget,
      fd = new FormData(form);
    const ok = await run("save", async () => {
      const file = fd.get("image") as File;
      const uploaded = file?.size ? await c.upload(file, "slide") : null;
      await c.mutate({
        action: "saveSlide",
        id: slide?.id,
        data: {
          eyebrow: fd.get("eyebrow"),
          title: fd.get("title"),
          text: fd.get("text"),
          href: fd.get("href"),
          name: fd.get("name"),
          tag: fd.get("tag"),
          image: uploaded?.src || slide?.image,
          uploadToken: uploaded?.uploadToken,
        },
      });
    });
    if (ok) {
      setMessage(slide ? "Slayt güncellendi." : "Slayt eklendi.");
      setPreview("");
      if (!slide) form.reset();
      else (form.elements.namedItem("image") as HTMLInputElement).value = "";
    }
  }
  const image = preview || slide?.image;
  return (
    <article className="admin-card">
      {image && (
        <img
          className="admin-photo admin-slide-photo"
          src={image}
          alt={slide?.name || "Yeni slayt önizlemesi"}
        />
      )}
      <h3>{slide ? `${index + 1}. slayt` : "Yeni slayt ekle"}</h3>
      <form onSubmit={submit}>
        <fieldset disabled={c.busy} className="admin-fields">
          <label>
            <span>{slide ? "Görseli değiştir" : "Görsel"}</span>
            <input
              type="file"
              name="image"
              required={!slide}
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const f = e.currentTarget.files?.[0];
                setPreview(f ? URL.createObjectURL(f) : "");
              }}
            />
          </label>
          <p className="admin-help">
            JPG, PNG veya WEBP · En fazla 4 MB. Arka planı beyaz, ürünü ortada
            olan yatay görseller en iyi sonucu verir.
          </p>
          <label>
            <span>Üst başlık</span>
            <input
              name="eyebrow"
              maxLength={80}
              defaultValue={slide?.eyebrow || ""}
              placeholder="Örn. ÖMÜR ÇOCUK KOLEKSİYONU"
            />
          </label>
          <label>
            <span>Başlık</span>
            <textarea
              name="title"
              required
              rows={2}
              maxLength={120}
              defaultValue={slide?.title || ""}
              placeholder={"Küçük odalar.\nBüyük hayaller."}
            />
          </label>
          <p className="admin-help">Enter ile alt satıra geçebilirsiniz.</p>
          <label>
            <span>Açıklama</span>
            <textarea
              name="text"
              rows={3}
              maxLength={300}
              defaultValue={slide?.text || ""}
            />
          </label>
          <label>
            <span>Buton yazısı</span>
            <input
              name="name"
              required
              maxLength={80}
              defaultValue={slide?.name || ""}
              placeholder="Örn. Bebek odalarını keşfet"
            />
          </label>
          <label>
            <span>Bağlantı</span>
            <input
              name="href"
              required
              maxLength={300}
              pattern="/.*"
              defaultValue={slide?.href || ""}
              placeholder="/bebek-odalari"
            />
          </label>
          <label>
            <span>Kısa etiket</span>
            <input
              name="tag"
              maxLength={40}
              defaultValue={slide?.tag || ""}
              placeholder="Örn. BEBEK ODALARI"
            />
          </label>
          <button className="admin-button">
            {pending === "save"
              ? "Kaydediliyor…"
              : slide
                ? "Değişiklikleri kaydet"
                : "Slayt ekle"}
          </button>
        </fieldset>
        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}
      </form>
      {slide && (
        <div className="admin-card-footer admin-row-actions">
          <button
            className="admin-outline"
            disabled={c.busy || index === 0}
            aria-label="Öne al"
            onClick={() =>
              run("move", () =>
                c.mutate({ action: "moveSlide", id: slide.id, direction: -1 }),
              )
            }
          >
            ← Öne
          </button>
          <button
            className="admin-outline"
            disabled={c.busy || index === total - 1}
            aria-label="Arkaya al"
            onClick={() =>
              run("move", () =>
                c.mutate({ action: "moveSlide", id: slide.id, direction: 1 }),
              )
            }
          >
            Arkaya →
          </button>
          <button
            className="admin-danger"
            disabled={c.busy || total <= 1}
            onClick={() =>
              confirm("Bu slayt kaldırılsın mı?") &&
              run("delete", () =>
                c.mutate({ action: "deleteSlide", id: slide.id }),
              )
            }
          >
            {pending === "delete" ? "Kaldırılıyor…" : "Kaldır"}
          </button>
        </div>
      )}
    </article>
  );
}
