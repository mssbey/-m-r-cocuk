import type { Metadata } from "next";
import { faqItems } from "@/lib/data/faq";
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/shared/JsonLd";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { FaqAccordion } from "@/components/shared/FaqAccordion";

export const metadata: Metadata = buildMetadata({
  title: "Sıkça Sorulan Sorular",
  description: "Ömür Çocuk hakkında sıkça sorulan sorular ve cevapları.",
  path: "/sss",
});

export default function FaqPage() {
  return (
    <div className="container-brand py-10 sm:py-14">
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Sıkça Sorulan Sorular", path: "/sss" }]),
          faqJsonLd(faqItems.map(({ question, answer }) => ({ question, answer }))),
        ]}
      />
      <Breadcrumbs items={[{ name: "Sıkça Sorulan Sorular" }]} />
      <h1 className="mt-6 font-display text-3xl text-brand-navy sm:text-4xl">
        Sıkça Sorulan Sorular
      </h1>
      <p className="mt-3 max-w-2xl text-brand-gray">
        Aradığınız cevabı bulamazsanız bizimle doğrudan iletişime geçebilirsiniz.
      </p>

      <div className="mt-10 max-w-3xl">
        <FaqAccordion items={faqItems} />
      </div>
    </div>
  );
}
