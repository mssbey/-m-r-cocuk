"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Giriş başarısız.");
        return;
      }
      const next = searchParams.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-brand-navy px-4 py-12">
      {/* Dekoratif fon: markanın halka motifinden ilham alan yumuşak daireler */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-babyblue/10" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-brand-sky/10" />
      <div className="pointer-events-none absolute right-1/3 top-1/4 h-40 w-40 rounded-full border border-white/10" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logo/omur-cocuk-logo-white.png"
            alt="Ömür Çocuk"
            width={140}
            height={116}
            priority
            className="h-24 w-auto"
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-brand-offwhite p-8 shadow-2xl"
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray">
            Yönetim Paneli
          </p>
          <h1 className="mb-6 font-display text-2xl leading-tight text-brand-navy">
            Devam etmek için giriş yap
          </h1>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-brand-navy">Şifre</span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-brand-babyblue bg-white px-3.5 py-2.5 text-sm text-brand-navy outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-babyblue/40"
            />
          </label>

          {error && (
            <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-5 w-full rounded-lg bg-brand-navy py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy/90 disabled:opacity-50"
          >
            {loading ? "Giriş yapılıyor..." : "Giriş yap"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-white/40">
          Ömür Çocuk · Ürün Yönetim Paneli
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
