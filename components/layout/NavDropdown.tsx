"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import type { NavItem } from "@/lib/nav";

export function NavDropdown({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const links =
    item.megaMenu?.sections.flatMap((section) => section.links) ?? [];
  return (
    <div
      className="shop-nav-group"
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
        aria-controls={id}
        onClick={() => setOpen(!open)}
      >
        {item.label}
        <span aria-hidden="true">⌄</span>
      </button>
      <div id={id} className="shop-nav-dropdown" hidden={!open}>
        {links.map((link) => (
          <Link href={link.href} key={link.href} onClick={() => setOpen(false)}>
            {link.label}
            <span aria-hidden="true">›</span>
          </Link>
        ))}
        <Link
          href={item.href}
          onClick={() => setOpen(false)}
          className="shop-dropdown-all"
        >
          {item.megaMenu?.featured.label}
        </Link>
      </div>
    </div>
  );
}
