"use client";

import { useRef, useState } from "react";
import { CategoryLinks } from "@/components/layout/CategoryLinks";

export function CategoryMenu() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <div
      className="shop-category-menu"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="header-categories"
        onClick={() => setOpen(!open)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        TÜM KATEGORİLER<span aria-hidden="true">⌄</span>
      </button>
      <div
        id="header-categories"
        className="shop-category-dropdown"
        hidden={!open}
      >
        <CategoryLinks onNavigate={() => setOpen(false)} />
      </div>
    </div>
  );
}
