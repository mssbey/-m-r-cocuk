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
    fetch("/api/admin/categories/")
      .then((r) => r.json())
      .then(setCategories);
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
