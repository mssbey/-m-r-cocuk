"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Category, Product } from "@/lib/types";

const arrayToText = (arr: string[] | undefined) => (arr || []).join("\n");
const textToArray = (text: string) =>
  text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

export default function EditProductPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatusMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(() => {
    fetch(`/api/admin/products/${params.slug}/`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then(setProduct)
      .catch(() => setError("Ürün bulunamadı."));
  }, [params.slug]);

  useEffect(() => {
    load();
    fetch("/api/admin/categories/", { cache: "no-store" }).then(async (response) => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Kategoriler yüklenemedi.");
      return body;
    }).then(setCategories).catch((err) => setError(err instanceof Error ? err.message : "Kategoriler yüklenemedi."));
  }, [load]);

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setProduct((p) => (p ? { ...p, [key]: value } : p));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    setSaving(true);
    setError(null);
    setStatusMsg(null);
    try {
      const res = await fetch(`/api/admin/products/${product.slug}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || "Kaydedilemedi.");
        return;
      }
      setProduct(body);
      setStatusMsg("Kaydedildi. Değişiklik ~1 dakika içinde canlı sitede görünecek.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!product) return;
    if (!confirm(`"${product.name}" ürünü kalıcı olarak silinsin mi?`)) return;
    const res = await fetch(`/api/admin/products/${product.slug}/`, { method: "DELETE" });
    if (res.ok) router.push("/admin/");
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!product || !e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      for (const file of Array.from(e.target.files)) formData.append("images", file);
      const res = await fetch(`/api/admin/products/${product.slug}/images/`, {
        method: "POST",
        body: formData,
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || "Görsel yüklenemedi.");
        return;
      }
      setProduct(body);
      setStatusMsg("Görsel(ler) yüklendi.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDeleteImage(index: number) {
    if (!product) return;
    if (!confirm("Bu görsel silinsin mi?")) return;
    const res = await fetch(`/api/admin/products/${product.slug}/images/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index }),
    });
    const body = await res.json();
    if (res.ok) setProduct(body);
  }

  async function handleMoveImage(index: number, direction: -1 | 1) {
    if (!product) return;
    const target = index + direction;
    if (target < 0 || target >= product.images.length) return;
    const order = product.images.map((_, i) => i);
    [order[index], order[target]] = [order[target], order[index]];
    const res = await fetch(`/api/admin/products/${product.slug}/images/reorder/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    });
    const body = await res.json();
    if (res.ok) setProduct(body);
  }

  if (error && !product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-8">
        <p className="text-red-600">{error}</p>
        <Link href="/admin/" className="text-brand-navy underline">
          ← Ürün listesi
        </Link>
      </div>
    );
  }

  if (!product) return <div className="mx-auto max-w-xl px-4 py-8 text-brand-gray">Yükleniyor...</div>;

  const selectedCategory = categories.find((c) => c.slug === product.category);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/admin/" className="text-sm text-brand-navy underline">
          ← Ürün listesi
        </Link>
        <button onClick={handleDelete} className="text-sm text-red-600 underline">
          Ürünü sil
        </button>
      </div>
      <h1 className="mb-6 text-2xl font-semibold text-brand-navy">{product.name}</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-medium text-brand-navy">Görseller</h2>
        <div className="flex flex-wrap gap-3">
          {product.images.map((img, i) => (
            <div key={img.src} className="relative w-28 rounded-md border border-brand-babyblue p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt="" className="h-28 w-full rounded object-cover" />
              <div className="mt-1 flex justify-between text-xs">
                <button type="button" onClick={() => handleMoveImage(i, -1)} disabled={i === 0}>
                  ↑
                </button>
                <button type="button" onClick={() => handleMoveImage(i, 1)} disabled={i === product.images.length - 1}>
                  ↓
                </button>
                <button type="button" onClick={() => handleDeleteImage(i)} className="text-red-600">
                  Sil
                </button>
              </div>
              {i === 0 && <span className="absolute left-1 top-1 rounded bg-brand-navy px-1 text-[10px] text-white">Kapak</span>}
            </div>
          ))}
        </div>
        <div className="mt-3">
          <input type="file" accept="image/*" multiple onChange={handleUpload} disabled={uploading} />
          {uploading && <span className="ml-2 text-sm text-brand-gray">Yükleniyor...</span>}
          <p className="mt-1 text-xs text-brand-gray">Tek dosya en fazla 4MB olmalı.</p>
        </div>
      </section>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ürün adı">
            <input value={product.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Ürün kodu">
            <input value={product.productCode} onChange={(e) => set("productCode", e.target.value)} className={inputClass} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Kategori">
            <select
              value={product.category}
              onChange={(e) => setProduct((current) => current ? { ...current, category: e.target.value, subcategory: null } : current)}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Alt kategori">
            <select
              value={product.subcategory || ""}
              onChange={(e) => set("subcategory", e.target.value || null)}
              className={inputClass}
            >
              <option value="">Yok</option>
              {selectedCategory?.subcategories.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Kısa açıklama">
          <textarea value={product.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} rows={2} className={inputClass} />
        </Field>
        <Field label="Açıklama">
          <textarea value={product.description} onChange={(e) => set("description", e.target.value)} rows={5} className={inputClass} />
        </Field>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Fiyat (₺)">
            <input
              type="number"
              value={product.price ?? ""}
              onChange={(e) => set("price", e.target.value ? Number(e.target.value) : null)}
              className={inputClass}
            />
          </Field>
          <Field label="Eski fiyat (₺)">
            <input
              type="number"
              value={product.oldPrice ?? ""}
              onChange={(e) => set("oldPrice", e.target.value ? Number(e.target.value) : null)}
              className={inputClass}
            />
          </Field>
          <Field label="Kampanya etiketi">
            <input
              value={product.campaignLabel ?? ""}
              onChange={(e) => set("campaignLabel", e.target.value || null)}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Ölçüler">
          <input value={product.dimensions ?? ""} onChange={(e) => set("dimensions", e.target.value || null)} className={inputClass} />
        </Field>
        <Field label="Teslimat bilgisi">
          <input value={product.deliveryInfo ?? ""} onChange={(e) => set("deliveryInfo", e.target.value || null)} className={inputClass} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Renkler (her satıra bir tane)">
            <textarea value={arrayToText(product.colors)} onChange={(e) => set("colors", textToArray(e.target.value))} rows={3} className={inputClass} />
          </Field>
          <Field label="Malzemeler (her satıra bir tane)">
            <textarea value={arrayToText(product.materials)} onChange={(e) => set("materials", textToArray(e.target.value))} rows={3} className={inputClass} />
          </Field>
          <Field label="Set içeriği (her satıra bir tane)">
            <textarea value={arrayToText(product.setContents)} onChange={(e) => set("setContents", textToArray(e.target.value))} rows={3} className={inputClass} />
          </Field>
          <Field label="Opsiyonel parçalar (her satıra bir tane)">
            <textarea value={arrayToText(product.optionalParts)} onChange={(e) => set("optionalParts", textToArray(e.target.value))} rows={3} className={inputClass} />
          </Field>
          <Field label="Özellikler (her satıra bir tane)">
            <textarea value={arrayToText(product.features)} onChange={(e) => set("features", textToArray(e.target.value))} rows={3} className={inputClass} />
          </Field>
          <Field label="Bakım notları (her satıra bir tane)">
            <textarea value={arrayToText(product.careNotes)} onChange={(e) => set("careNotes", textToArray(e.target.value))} rows={3} className={inputClass} />
          </Field>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={product.featured} onChange={(e) => set("featured", e.target.checked)} />
            Öne çıkan
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={product.campaign} onChange={(e) => set("campaign", e.target.checked)} />
            Kampanyalı
          </label>
          <Field label="Durum">
            <select value={product.status} onChange={(e) => set("status", e.target.value as Product["status"])} className={inputClass}>
              <option value="active">Aktif</option>
              <option value="draft">Taslak</option>
              <option value="archived">Arşivlenmiş</option>
            </select>
          </Field>
        </div>

        <Field label="SEO başlığı">
          <input value={product.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className={inputClass} />
        </Field>
        <Field label="SEO açıklaması">
          <textarea value={product.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} rows={2} className={inputClass} />
        </Field>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {status && <p className="text-sm text-green-700">{status}</p>}

        <button type="submit" disabled={saving} className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}

const inputClass = "w-full rounded-md border border-brand-babyblue px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-brand-navy">{label}</span>
      {children}
    </label>
  );
}
