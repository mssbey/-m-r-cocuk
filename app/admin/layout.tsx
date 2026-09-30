import type { Metadata } from "next";
import { Manrope, Cormorant_Garamond } from "next/font/google";
import { AdminShell } from "@/components/admin/AdminShell";
import "./admin.css";
const sans = Manrope({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--admin-sans",
});
const serif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--admin-serif",
});
export const metadata: Metadata = {
  title: "Yönetim",
  robots: { index: false, follow: false },
};
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`admin-root ${sans.variable} ${serif.variable}`}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
