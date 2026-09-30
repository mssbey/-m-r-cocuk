"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const password = new FormData(e.currentTarget).get("password");
    try {
      const res = await fetch("/api/admin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Giriş yapılamadı.");
      router.push("/admin/");
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Bağlantınızı kontrol edip tekrar deneyin.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <Image
          className="admin-login-logo"
          src="/logo/omur-cocuk-logo-navy.png"
          alt="Ömür Çocuk"
          width={102}
          height={150}
          priority
        />
        <p className="admin-eyebrow">YÖNETİM PANELİ</p>
        <h1>Hoş geldiniz.</h1>
        <p className="admin-intro">
          Ürünleri yönetmek için şifrenizle giriş yapın.
        </p>
        <form className="admin-fields" onSubmit={submit}>
          <label>
            <span>Şifre</span>
            <input
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              disabled={busy}
            />
          </label>
          {error && <p role="alert">{error}</p>}
          <button className="admin-button" disabled={busy}>
            {busy ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>
        <Link className="admin-login-back" href="/">
          &lt; Siteye dön
        </Link>
      </div>
    </div>
  );
}
