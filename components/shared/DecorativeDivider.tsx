export function DecorativeDivider() {
  return (
    <div
      className="flex items-center justify-center gap-3 text-brand-babyblue"
      aria-hidden="true"
    >
      <span className="h-px w-16 bg-current opacity-60" />
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4L12 2z" />
      </svg>
      <span className="h-px w-16 bg-current opacity-60" />
    </div>
  );
}
