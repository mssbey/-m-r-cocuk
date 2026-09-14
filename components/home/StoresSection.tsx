import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { StoreCard } from "@/components/shared/StoreCard";

export function StoresSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-brand">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Mağazalarımız" title="Sizi Mağazalarımızda Ağırlamaktan Mutluluk Duyarız" />
          <Link
            href="/magazalarimiz"
            className="text-sm font-medium text-brand-navy underline-offset-4 hover:underline"
          >
            Tüm Mağazalar
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {siteConfig.stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      </div>
    </section>
  );
}
