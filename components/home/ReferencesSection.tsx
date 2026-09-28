"use client";

import { useEffect, useRef, useState } from "react";
import { referenceShowcase } from "@/lib/data/references";

export function ReferencesSection() {
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let onScreen = false;
    const update = () => setVisible(onScreen && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    observer.observe(section);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  if (!referenceShowcase.names.length) return null;

  return (
    <section
      ref={sectionRef}
      id="referanslar"
      className="shop-references container-brand"
      aria-labelledby="references-heading"
    >
      <div className="shop-section-heading">
        <p>BİRLİKTE DEĞER ÜRETİYORUZ</p>
        <h2 id="references-heading">REFERANSLARIMIZ</h2>
        {referenceShowcase.isExample && <div>Örnek referans isimleridir.</div>}
      </div>
      <div className="reference-controls">
        <button
          type="button"
          aria-controls="reference-marquee"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? "Kaydırmayı başlat" : "Kaydırmayı durdur"}
        </button>
      </div>
      <div
        id="reference-marquee"
        className="reference-window"
        tabIndex={0}
        role="region"
        aria-label="Referans isimleri"
        data-paused={paused || !visible}
      >
        <div className="reference-track">
          <ul className="reference-group">
            {referenceShowcase.names.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <ul className="reference-group" aria-hidden="true">
            {referenceShowcase.names.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
