import { redirect } from "next/navigation";
export default function NewPage() {
  redirect("/admin/products/new/");
}
