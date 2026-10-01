"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types";
import { PlaceholderImage } from "@/components/shared/PlaceholderImage";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] w-full overflow-hidden rounded-3xl">
        <PlaceholderImage label={`${productName} görseli yakında`} />
      </div>
    );
  }

  const active = images[activeIndex];

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        setActiveIndex((i) => Math.min(i + 1, images.length - 1));
      } else {
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    }
    touchStartX.current = null;
  }

  return (
    <div>
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-brand-babyblue/30 bg-white"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={active.src}
          alt={active.alt}
          fill
          priority
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-contain"
        />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => setActiveIndex((i) => Math.max(i - 1, 0))}
              disabled={activeIndex === 0}
              aria-label="Önceki görsel"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-sm disabled:opacity-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setActiveIndex((i) => Math.min(i + 1, images.length - 1))}
              disabled={activeIndex === images.length - 1}
              aria-label="Sonraki görsel"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-sm disabled:opacity-0"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 sm:hidden">
              {images.map((img, index) => (
                <span
                  key={img.src}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    index === activeIndex ? "bg-white" : "bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 hidden gap-3 sm:flex">
          {images.map((img, index) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${index + 1}. görseli göster`}
              aria-current={index === activeIndex}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                index === activeIndex ? "border-brand-navy" : "border-transparent"
              )}
            >
              <Image src={img.src} alt={img.alt} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
