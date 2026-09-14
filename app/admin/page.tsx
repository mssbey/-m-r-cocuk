"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Category, Product } from "@/lib/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products/").then((r) => r.json()),
      fetch("/api/admin/categories/").then((r) => r.json()),
    ])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch(() => setError("Ürünler yüklenemedi."));
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.productCode.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter]);

  async function handleLogout() {
    await fetch("/api/admin/logout/", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-brand-navy">Ürün Yönetimi</h1>
        <div className="flex gap-2">
          <Link
            href="/admin/urun/yeni/"
            className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white"
          >
            + Yeni Ürün
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md border border-brand-babyblue px-4 py-2 text-sm text-brand-navy"
          >
            Çıkış
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ad veya ürün kodu ara..."
          className="rounded-md border border-brand-babyblue px-3 py-2 text-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-md border border-brand-babyblue px-3 py-2 text-sm"
        >
          <option value="">Tüm kategoriler</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-brand-babyblue px-3 py-2 text-sm"
        >
          <option value="">Tüm durumlar</option>
          <option value="active">Aktif</option>
          <option value="draft">Taslak</option>
          <option value="archived">Arşivlenmiş</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {!products && !error && <p className="text-sm text-brand-gray">Yükleniyor...</p>}

      {products && (
        <div className="overflow-x-auto rounded-lg border border-brand-babyblue">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-cream">
              <tr>
                <th className="px-3 py-2">Görsel</th>
                <th className="px-3 py-2">Ad</th>
                <th className="px-3 py-2">Kod</th>
                <th className="px-3 py-2">Kategori</th>
                <th className="px-3 py-2">Fiyat</th>
                <th className="px-3 py-2">Durum</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.slug} className="border-t border-brand-babyblue/50">
                  <td className="px-3 py-2">
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.coverImage.src} alt="" className="h-12 w-12 rounded object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded bg-brand-sky" />
                    )}
                  </td>
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2 text-brand-gray">{p.productCode}</td>
                  <td className="px-3 py-2 text-brand-gray">{p.category}</td>
                  <td className="px-3 py-2">{p.price ? `${p.price.toLocaleString("tr-TR")} ₺` : "—"}</td>
                  <td className="px-3 py-2">{p.status}</td>
                  <td className="px-3 py-2 text-right">
                    <Link href={`/admin/urun/${p.slug}/`} className="text-brand-navy underline">
                      Düzenle
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-brand-gray">
                    Ürün bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
