"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Category } from "@/lib/types";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories/", { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Kategoriler yüklenemedi.");
        return body as Category[];
      })
      .then((items) => {
        setCategories(items);
        const requestedCategory = new URLSearchParams(window.location.search).get("category");
        if (items.some((item) => item.slug === requestedCategory)) setCategory(requestedCategory!);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Kategoriler yüklenemedi."));
  }, []);

  const selectedCategory = categories.find((c) => c.slug === category);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, subcategory: subcategory || null, shortDescription }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error || "Ürün oluşturulamadı.");
        return;
      }
      router.push(`/admin/urun/${body.slug}/`);
    } catch {
      setError("Ürün oluşturulamadı. Bağlantınızı kontrol edip tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Link href="/admin/" className="text-sm text-brand-navy underline">
        ← Ürün listesi
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold text-brand-navy">Yeni Ürün</h1>
      <p className="mb-5 text-sm text-brand-gray">Aradığınız kategori yok mu? <Link href="/admin/kategoriler" className="text-brand-navy underline">Kategori ekleyin</Link>.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-brand-navy">Ürün adı *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-brand-babyblue px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-brand-navy">Kategori *</label>
          <select
            required
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory("");
            }}
            className="w-full rounded-md border border-brand-babyblue px-3 py-2 text-sm"
          >
            <option value="">Seçiniz</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && selectedCategory.subcategories.length > 0 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-brand-navy">Alt kategori</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full rounded-md border border-brand-babyblue px-3 py-2 text-sm"
            >
              <option value="">Yok</option>
              {selectedCategory.subcategories.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-brand-navy">Kısa açıklama</label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-brand-babyblue px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Oluşturuluyor..." : "Ürünü oluştur"}
        </button>
      </form>
    </div>
  );
}
