import Icon from "../ui/Icon.jsx";

export default function ReviewCard({ review }) {
  return (
    <div className="border-t border-neutral-100 py-5 first:border-t-0 first:pt-0">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
          {review.initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-sm font-semibold text-neutral-900">{review.name}</p>
            <span className="text-xs text-neutral-400">
              {review.daysAgo === 1 ? "1 day ago" : `${review.daysAgo} days ago`}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-0.5 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon
                key={i}
                name="star"
                className={`text-[14px] ${i < review.rating ? "" : "text-neutral-200"}`}
              />
            ))}
          </div>
          <p className="mt-2 text-sm text-neutral-600">{review.comment}</p>
          {typeof review.helpful === "number" && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
              <Icon name="thumbsUp" className="text-[14px]" />
              {review.helpful} people found this helpful
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
