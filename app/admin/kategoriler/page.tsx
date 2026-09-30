"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { slugify } from "@/lib/admin/products";

const inputClass = "mt-2 w-full rounded-xl border border-brand-babyblue/60 bg-white px-3 py-2.5 text-sm font-normal";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [subcategories, setSubcategories] = useState("");

  const load = useCallback(() =>
    fetch("/api/admin/categories/", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Kategoriler yüklenemedi.");
        return body as Category[];
      })
      .then((items) => { setCategories(items); setLoadError(null); })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Kategoriler yüklenemedi."))
      .finally(() => setLoading(false)), []);

  useEffect(() => { void load(); }, [load]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    setCreated(null);
    try {
      const response = await fetch("/api/admin/categories/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, shortDescription, description,
          subcategories: subcategories.split("\n").map((value) => value.trim()).filter(Boolean),
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Kategori eklenemedi.");
      setCreated(body);
      setCategories((current) => [...current.filter((category) => category.slug !== body.slug), body]);
      setName("");
      setShortDescription("");
      setDescription("");
      setSubcategories("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kategori eklenemedi. Bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 text-brand-navy">
      <Link href="/admin" className="text-sm underline underline-offset-4">← Ürün yönetimi</Link>
      <div className="mb-8 mt-5">
        <h1 className="text-2xl font-semibold">Kategori Yönetimi</h1>
        <p className="mt-2 text-sm leading-6 text-brand-gray">Yeni kategoriler oluşturun, ürünlerinizi uygun başlıklar altında toplayın.</p>
      </div>
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-brand-babyblue/40 bg-white p-5 sm:p-7" aria-labelledby="new-category-heading">
          <h2 id="new-category-heading" className="text-lg font-semibold">Yeni kategori ekle</h2>
          <form onSubmit={handleSubmit} className="mt-5 space-y-5">
            <fieldset disabled={saving} className="min-w-0 space-y-5 disabled:opacity-60">
              <label className="block text-sm font-medium">
                Kategori adı <span aria-hidden="true">*</span>
                <input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="Örn. Çalışma Masaları" className={inputClass} aria-describedby="category-url" />
              </label>
              <p id="category-url" className="break-all text-xs text-brand-gray">Sayfa adresi: /{slugify(name) || "kategori-adi"}</p>
              <label className="block text-sm font-medium">
                Kısa açıklama
                <textarea maxLength={300} rows={2} value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} className={inputClass} />
              </label>
              <label className="block text-sm font-medium">
                Kategori sayfası açıklaması
                <textarea maxLength={6000} rows={4} value={description} onChange={(event) => setDescription(event.target.value)} className={inputClass} />
              </label>
              <label className="block text-sm font-medium">
                Alt kategoriler <span className="font-normal text-brand-gray">(isteğe bağlı)</span>
                <textarea rows={3} maxLength={3030} value={subcategories} onChange={(event) => setSubcategories(event.target.value)} placeholder={"Çekmeceli Masalar\nKitaplıklı Masalar"} aria-describedby="subcategory-hint" className={inputClass} />
              </label>
              <p id="subcategory-hint" className="text-xs text-brand-gray">Her satıra bir alt kategori yazın. En fazla 30 alt kategori ekleyebilirsiniz.</p>
            </fieldset>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {created && (
              <div role="status" className="rounded-xl bg-brand-sky p-4 text-sm leading-6">
                <p><strong>{created.name}</strong> eklendi. Artık bu kategoriye ürün ekleyebilirsiniz.</p>
                <p className="mt-1">Menü ve kategori sayfası, sitenin yeniden yayınlanması tamamlandığında görünür.</p>
                <Link href={`/admin/urun/yeni?category=${encodeURIComponent(created.slug)}`} className="mt-3 inline-block font-semibold underline underline-offset-4">Bu kategoriye ürün ekle →</Link>
              </div>
            )}
            <button type="submit" disabled={saving || !name.trim() || loading || !!loadError} className="rounded-xl bg-brand-babyblue px-5 py-3 text-sm font-semibold transition-colors hover:bg-brand-sky disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? "Ekleniyor…" : "Kategori ekle"}
            </button>
          </form>
        </section>
        <section aria-labelledby="category-list-heading">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 id="category-list-heading" className="text-lg font-semibold">Mevcut kategoriler {!loading && !loadError && `(${categories.length})`}</h2>
            <button onClick={() => { setLoading(true); setLoadError(null); void load(); }} disabled={loading || saving} className="text-sm underline underline-offset-4 disabled:opacity-50">Yenile</button>
          </div>
          {loading ? <p role="status" className="text-sm text-brand-gray">Kategoriler yükleniyor…</p> : loadError ? (
            <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{loadError}</p>
          ) : (
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.slug} className="rounded-2xl border border-brand-babyblue/30 bg-white p-5">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="mt-1 break-all text-xs text-brand-gray">/{category.slug}</p>
                  {category.shortDescription && <p className="mt-3 text-sm leading-6 text-brand-gray">{category.shortDescription}</p>}
                  {category.subcategories.length > 0 && <p className="mt-3 text-xs leading-6">Alt kategoriler: {category.subcategories.map((sub) => sub.name).join(" · ")}</p>}
                  <Link href={`/admin/urun/yeni?category=${encodeURIComponent(category.slug)}`} className="mt-3 inline-block text-xs font-semibold underline underline-offset-4">Ürün ekle →</Link>
                </li>
              ))}
              {categories.length === 0 && <li className="text-sm text-brand-gray">Henüz kategori yok. İlk kategorinizi ekleyin.</li>}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
