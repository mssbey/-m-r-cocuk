"use client";
import { useEffect, useRef, useState } from "react";
import type { Catalog } from "@/lib/admin/catalog-types";
import type { ProductImage } from "@/lib/types";
export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const revision = useRef("");
  useEffect(() => {
    let active = true;
    fetch("/api/admin/manage/", { cache: "no-store" })
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error);
        return body;
      })
      .then((data) => {
        if (active) {
          revision.current = data.revision;
          setCatalog(data);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  async function mutate(input: Record<string, unknown>) {
    const res = await fetch("/api/admin/manage/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, revision: revision.current }),
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || "Kaydedilemedi.");
    revision.current = body.revision;
    setCatalog(body);
    return body as Catalog;
  }
  async function upload(
    file: File,
    kind = "product",
  ): Promise<ProductImage & { uploadToken: string }> {
    if (file.size > (kind === "gallery" ? 3 : 4) * 1024 * 1024)
      throw new Error(
        `Görsel en fazla ${kind === "gallery" ? 3 : 4} MB olabilir.`,
      );
    const data = new FormData();
    data.set("file", file);
    data.set("kind", kind);
    data.set("revision", revision.current);
    const res = await fetch("/api/admin/upload/", {
      method: "POST",
      body: data,
    });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || "Görsel yüklenemedi.");
    revision.current = body.revision;
    return body.image;
  }
  return {
    catalog,
    setCatalog,
    error,
    setError,
    busy,
    setBusy,
    mutate,
    upload,
  };
}
export type CatalogController = ReturnType<typeof useCatalog>;
