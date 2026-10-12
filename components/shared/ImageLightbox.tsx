"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";

/** Görsele basılınca tam ekran büyütülmüş hâlini gösterir; kaydırma, oklar ve ESC destekli. */
export function ImageLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: ProductImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const touchStartX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  const count = images.length;
  const go = (step: number) => setIndex((i) => (i + step + count) % count);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
      if (event.key === "ArrowLeft") setIndex((i) => (i - 1 + count) % count);
      if (event.key === "ArrowRight") setIndex((i) => (i + 1) % count);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [count]);

  const image = images[index];

  return createPortal(
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90"
      role="dialog"
      aria-modal="true"
      aria-label="Büyütülmüş görsel"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (count > 1 && Math.abs(deltaX) > 40) go(deltaX < 0 ? 1 : -1);
      }}
    >
      <div className="relative h-[85vh] w-[94vw]" onClick={(e) => e.stopPropagation()}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="94vw"
          className="object-contain"
        />
      </div>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Kapat"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
            aria-label="Önceki görsel"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
            aria-label="Sonraki görsel"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/80">
            {index + 1} / {count}
          </p>
        </>
      ) : null}
    </div>,
    document.body,
  );
}

/** Tıklanınca lightbox açan tekil görsel (ör. ürün sayfasındaki ek görsel). */
export function ZoomableImage({
  images,
  index,
  sizes,
  className,
}: {
  images: ProductImage[];
  index: number;
  sizes: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const image = images[index];
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${image.alt} — büyüt`}
        className={`relative block w-full cursor-zoom-in overflow-hidden ${className ?? ""}`}
      >
        <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" />
      </button>
      {open ? (
        <ImageLightbox images={images} startIndex={index} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
