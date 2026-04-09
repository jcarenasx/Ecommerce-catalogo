type SectionHeadingProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  if (!eyebrow && !title && !description) {
    return null;
  }

  return (
    <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h1>
      ) : null}
      {description ? (
        <p className="mt-2 max-w-2xl text-sm text-slate-600">{description}</p>
      ) : null}
    </header>
  );
}
