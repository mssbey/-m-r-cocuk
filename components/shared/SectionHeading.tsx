import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-gray">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-balance font-display text-3xl leading-tight text-brand-navy sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-balance text-base leading-relaxed text-brand-gray">
          {description}
        </p>
      ) : null}
    </div>
  );
}
