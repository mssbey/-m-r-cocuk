import type { FaqItem } from "@/lib/types";

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <details
          key={item.id}
          className="group rounded-2xl border border-brand-babyblue/30 bg-white px-5 py-4 soft-shadow open:pb-5"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base text-brand-navy marker:content-none">
            {item.question}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4 flex-shrink-0 text-brand-gray transition-transform group-open:rotate-180"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-brand-gray">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
