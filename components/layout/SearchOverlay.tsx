"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSearchSuggestions } from "@/lib/search";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  function handleClose() {
    setQuery("");
    onClose();
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const suggestions = getSearchSuggestions(query);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/urunler?q=${encodeURIComponent(trimmed)}`);
    handleClose();
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] flex flex-col bg-brand-navy/40 backdrop-blur-sm sm:items-start sm:justify-start sm:p-0">
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={handleClose}
        className="absolute inset-0 h-full w-full cursor-default"
      />
      <div className="relative mx-auto mt-0 w-full max-w-2xl bg-white p-5 shadow-xl sm:mt-24 sm:rounded-2xl sm:p-6">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-5 w-5 flex-shrink-0 text-brand-gray"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ürün veya kategori ara... (örn. ranza, gardırop)"
            aria-label="Ürün veya kategori ara"
            className="w-full border-0 bg-transparent text-base text-brand-navy placeholder:text-brand-gray focus:outline-none"
          />
          <button
            type="button"
            onClick={handleClose}
            aria-label="Kapat"
            className="rounded-full p-1.5 text-brand-gray transition-colors hover:bg-brand-cream hover:text-brand-navy"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        {query.trim() ? (
          <div className="mt-4 max-h-[60vh] overflow-y-auto border-t border-brand-cream pt-4">
            {suggestions.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {suggestions.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={s.href}
                      onClick={handleClose}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-brand-cream"
                    >
                      <span className="font-medium text-brand-navy">{s.label}</span>
                      <span className="text-xs text-brand-gray">{s.meta}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 py-4 text-sm text-brand-gray">
                &ldquo;{query}&rdquo; için sonuç bulunamadı. Aramayı tamamlamak için Enter
                tuşuna basarak tüm ürünlerde arayabilirsiniz.
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}
