import { Link } from "react-router-dom";

type CatalogIntroProps = {
  description: string;
  ctaLabel?: string;
  ctaTo?: string;
};

export default function CatalogIntro({
  description,
  ctaLabel,
  ctaTo,
}: CatalogIntroProps) {
  return (
    <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm text-slate-600">{description}</p>
        {ctaLabel && ctaTo ? (
          <Link
            to={ctaTo}
            className="text-sm font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-900"
          >
            {ctaLabel}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
