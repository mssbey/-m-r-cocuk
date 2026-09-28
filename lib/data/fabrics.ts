// These are explicitly illustrative previews, not supplier stock or color codes.
// Replace image=null with an approved real swatch photograph when supplied.
export const fabricGroups = [
  { slug: "baby-face", name: "Baby Face", texture: "soft" },
  { slug: "luna", name: "Luna", texture: "woven" },
  { slug: "teddy", name: "Teddy", texture: "loop" },
  { slug: "puffy", name: "Puffy", texture: "plush" },
  { slug: "muzzy", name: "Muzzy", texture: "soft" },
  { slug: "anka", name: "Anka", texture: "woven" },
  { slug: "coco", name: "Coco", texture: "woven" },
  { slug: "bukle", name: "Bukle", texture: "loop" },
];

export const fabricColors = [
  { slug: "krem", name: "Krem", hex: "#e8dfce", image: null as string | null },
  { slug: "tas", name: "Taş", hex: "#b9ad9c", image: null as string | null },
  {
    slug: "vizon",
    name: "Vizon",
    hex: "#948275",
    image: null as string | null,
  },
  {
    slug: "pudra",
    name: "Pudra",
    hex: "#cda7a3",
    image: null as string | null,
  },
  {
    slug: "ada-cayi",
    name: "Ada Çayı",
    hex: "#8a9987",
    image: null as string | null,
  },
  { slug: "mavi", name: "Mavi", hex: "#829baa", image: null as string | null },
];

export function resolveFabric(groupSlug?: string, colorSlug?: string) {
  const group = fabricGroups.find((item) => item.slug === groupSlug);
  const color = fabricColors.find((item) => item.slug === colorSlug);
  return group && color ? { group, color } : null;
}
