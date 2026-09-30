"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (pathname.replace(/\/$/, "") === "/admin/login") return children;
  async function logout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/logout/", { method: "POST" });
      if (!response.ok) throw new Error("Çıkış yapılamadı. Tekrar deneyin.");
      router.push("/admin/login/");
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  return (
    <div className="admin-shell">
      <header className="admin-nav">
        <Link className="admin-brand" href="/admin/">
          Ömür Çocuk · Yönetim
        </Link>
        <nav aria-label="Yönetim menüsü">
          <Link href="/admin/taxonomy/">Kategoriler ve Koleksiyonlar</Link>
          <Link href="/admin/gallery/">Fabrika ve Teslimatlar</Link>
          <Link href="/admin/products/new/">+ Yeni Ürün</Link>
          <Link href="/" target="_blank" rel="noopener noreferrer">
            Siteyi Görüntüle
          </Link>
          <button className="admin-outline" disabled={busy} onClick={logout}>
            {busy ? "Çıkılıyor…" : "Çıkış Yap"}
          </button>
        </nav>
      </header>
      {error && <p role="alert">{error}</p>}
      {children}
    </div>
  );
}
