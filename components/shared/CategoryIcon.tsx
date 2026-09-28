const paths: Record<string, string> = {
  koleksiyonlar: "m32 8 24 13-24 13L8 21ZM8 32l24 13 24-13M8 43l24 13 24-13",
  "ozel-uretim":
    "M12 8h12v48H12ZM12 18h6m-6 10h6m-6 10h6m-6 10h6M34 34l16-22 7 5-16 22-9 5Z",
  kumas: "M14 8h36v48H14ZM14 20h36M14 32h36M14 44h36M26 8v48M38 8v48",
  fabrika: "M8 55V25l16 9V19l16 10V8h12l4 47ZM17 43h5m7 0h5m7 0h5",
  yeni: "m32 8 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z",
  "bebek-odalari":
    "M12 20v30m40-30v30M12 27h40M12 45h40M20 27v18m8-18v18m8-18v18m8-18v18M8 54h48M18 50v4m28-4v4",
  "genc-odalari":
    "M10 48V22h44v26M10 42h44M14 42V32h36v10M18 26h10v6m8-6h10v6M10 48v6m44-6v6",
  "montessori-odalari":
    "M8 29 32 9l24 20M14 25v29m36-29v29M14 48h36M18 48V37h28v11M20 37v-5h10v5",
  "dolap-gardrop": "M14 9h36v45H14ZM32 9v45M27 28v8m10-8v8M18 54v4m28-4v4",
  "sifonyer-komodin":
    "M12 15h40v36H12ZM12 27h40M12 39h40M28 21h8m-8 12h8m-8 12h8M17 51v5m30-5v5",
  "bebek-arabalari":
    "M12 13h8l8 30h21M24 33h29l-5 10H28M31 12v21h22c0-12-9-21-22-21M29 52h.01M47 52h.01",
  "kampanyali-urunler":
    "m32 9 6 16 17 7-17 6-6 17-7-17-16-6 16-7ZM49 9v10m-5-5h10",
};

export function CategoryIcon({ slug }: { slug: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[slug] ?? paths["genc-odalari"]} />
      {slug === "bebek-arabalari" && (
        <>
          <circle cx="29" cy="51" r="4" />
          <circle cx="47" cy="51" r="4" />
        </>
      )}
    </svg>
  );
}
