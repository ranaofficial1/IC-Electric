import Icon from "../ui/Icon.jsx";
import { getRatingBreakdown } from "../../data/reviews.js";

export default function RatingSummary({ rating, reviewCount }) {
  if (!reviewCount) {
    return <p className="text-sm text-neutral-500">No reviews yet.</p>;
  }
  const breakdown = getRatingBreakdown(rating);

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="shrink-0 text-center sm:text-left">
        <p className="font-display text-4xl font-bold text-neutral-900">{rating.toFixed(1)}</p>
        <div className="mt-1 flex items-center justify-center gap-0.5 text-amber-500 sm:justify-start">
          {Array.from({ length: 5 }).map((_, i) => (
            <Icon key={i} name="star" className={i < Math.round(rating) ? "" : "text-neutral-200"} />
          ))}
        </div>
        <p className="mt-1 text-xs text-neutral-500">{reviewCount} reviews</p>
      </div>

      <div className="flex-1 space-y-1.5">
        {breakdown.map((row) => (
          <div key={row.stars} className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="w-8 shrink-0">{row.stars} star</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-amber-400" style={{ width: `${row.percent}%` }} />
            </div>
            <span className="w-8 shrink-0 text-right">{row.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
