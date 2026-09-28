"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { fabricColors, fabricGroups, resolveFabric } from "@/lib/data/fabrics";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { absoluteUrl } from "@/lib/seo";

export function FabricPalette({
  product,
  initialGroup,
  initialColor,
}: {
  product?: { name: string; slug: string };
  initialGroup?: string;
  initialColor?: string;
}) {
  const initial = resolveFabric(initialGroup, initialColor);
  const [selection, setSelection] = useState(
    initial ? { group: initial.group.slug, color: initial.color.slug } : null,
  );
  const selected = resolveFabric(selection?.group, selection?.color);
  const query = new URLSearchParams();
  if (product) query.set("urun", product.slug);
  if (selected) {
    query.set("kumas", selected.group.slug);
    query.set("renk", selected.color.slug);
  }
  return (
    <>
      {product && (
        <div className="fabric-product-context">
          <span>
            Seçim yaptığınız ürün: <strong>{product.name}</strong>
          </span>
          <Link href={`/urun/${product.slug}`}>Ürüne dön →</Link>
        </div>
      )}
      <p className="fabric-note">
        Kartelalar temsili doku ve renk önizlemeleridir; gerçek kumaş fotoğrafı
        veya stok listesi değildir. Renk, doku ve ürününüze uygulanabilirliği
        için gerçek numuneyi ekibimizle birlikte inceleyin.
      </p>
      <nav className="fabric-jump" aria-label="Kumaş grupları">
        {fabricGroups.map((group) => (
          <a href={`#${group.slug}`} key={group.slug}>
            {group.name} <span aria-hidden="true">↓</span>
          </a>
        ))}
      </nav>
      <div className="fabric-groups">
        {fabricGroups.map((group) => (
          <section className="fabric-group" id={group.slug} key={group.slug}>
            <div className="fabric-group-heading">
              <div>
                <p className="shop-eyebrow">KUMAŞ GRUBU</p>
                <h2>{group.name}</h2>
              </div>
              <span>Temsili doku ve renkler</span>
            </div>
            <div className="fabric-swatches">
              {fabricColors.map((color) => (
                <button
                  key={color.slug}
                  type="button"
                  className="fabric-swatch"
                  aria-label={`${group.name} — ${color.name}`}
                  aria-pressed={
                    selection?.group === group.slug &&
                    selection.color === color.slug
                  }
                  onClick={() =>
                    setSelection({ group: group.slug, color: color.slug })
                  }
                >
                  <span
                    className={`fabric-texture ${group.texture}`}
                    style={{ "--swatch": color.hex } as CSSProperties}
                  >
                    {color.image && (
                      <Image
                        src={color.image}
                        alt={`${group.name} ${color.name} kumaş numunesi`}
                        fill
                        sizes="(max-width:540px) 30vw, 16vw"
                      />
                    )}
                    <span className="fabric-tick" aria-hidden="true">
                      ✓
                    </span>
                  </span>
                  <span className="fabric-color-label">{color.name}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
      {selected && (
        <div className="fabric-selection">
          <div aria-live="polite">
            <span className="shop-eyebrow">SEÇTİĞİNİZ KUMAŞ / RENK</span>
            <p>
              {selected.group.name} · {selected.color.name}
            </p>
          </div>
          <div className="flow-actions">
            <Link href={`/ozel-uretim?${query}`} className="shop-button">
              Bu Seçimle Talep Oluştur
            </Link>
            <a
              href={buildWhatsAppUrl(
                `Merhaba, ${product ? `${product.name} ürünü için ` : ""}${selected.group.name} kumaş grubunun ${selected.color.name} rengini değerlendirmek istiyorum. Gerçek numune ve uygulanabilirlik hakkında bilgi alabilir miyim?${product ? `\nÜrün: ${absoluteUrl(`/urun/${product.slug}`)}` : ""}`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="shop-outline-button"
            >
              WhatsApp’tan Sorun
            </a>
          </div>
        </div>
      )}
    </>
  );
}
