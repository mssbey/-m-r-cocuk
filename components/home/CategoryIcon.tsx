// Ana sayfadaki "Öne Çıkan Kategoriler" kartları için ince çizgili ikonlar.
const icons: Record<string, React.ReactNode> = {
  // Parmaklıklı beşik
  "bebek-odalari": (
    <>
      <path d="M8 16v28M56 16v28M8 24h48M8 40h48" />
      <path d="M16 24v16M24 24v16M32 24v16M40 24v16M48 24v16" />
      <path d="M8 44v4M56 44v4" />
    </>
  ),
  // Ranza
  "genc-odalari": (
    <>
      <path d="M10 8v42M46 8v42M10 22h36M10 40h36" />
      <path d="M14 18h10M14 36h10" />
      <path d="M46 14h6M52 14v36M46 24h6M46 34h6M46 44h6" />
    </>
  ),
  // Çatılı Montessori yatak
  "montessori-odalari": (
    <>
      <path d="M10 26 32 10l22 16" />
      <path d="M14 23v25M50 23v25M8 48h48" />
      <path d="M14 40h36M18 36h10" />
      <path d="M30 22h4v4h-4z" />
    </>
  ),
  // Gardırop
  "dolap-gardrop": (
    <>
      <rect x="12" y="8" width="40" height="42" rx="2" />
      <path d="M32 8v42M28 26v6M36 26v6M16 50v4M48 50v4" />
    </>
  ),
  // Şifonyer
  "sifonyer-komodin": (
    <>
      <rect x="10" y="16" width="44" height="32" rx="2" />
      <path d="M10 27h44M10 38h44M32 16v11" />
      <path d="M20 22h4M40 22h4M30 33h4M30 44h4M14 48v4M50 48v4" />
    </>
  ),
  // Bebek arabası
  "bebek-arabalari": (
    <>
      <path d="M12 26h34c0 8-7 14-17 14S12 34 12 26z" />
      <path d="M12 26A17 17 0 0 1 29 10v16" />
      <path d="M46 26l4-10h6" />
      <circle cx="20" cy="50" r="4" />
      <circle cx="40" cy="50" r="4" />
      <path d="M24 40l-3 6M35 40l3 6" />
    </>
  ),
  // Etiket
  "kampanyali-urunler": (
    <>
      <path d="M34 8h20v20L28 54 8 34z" />
      <circle cx="44" cy="18" r="3" />
      <path d="M23 40l12-12" />
      <circle cx="24" cy="30" r="2" />
      <circle cx="34" cy="38" r="2" />
    </>
  ),
};

export function CategoryIcon({ slug }: { slug: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[slug] ?? icons["dolap-gardrop"]}
    </svg>
  );
}
