const STATUS_TONE = {
  delivered: "text-emerald-600 bg-emerald-50",
  shipped: "text-blue-600 bg-blue-50",
  processing: "text-amber-600 bg-amber-50",
  confirmed: "text-amber-600 bg-amber-50",
  pending: "text-neutral-600 bg-neutral-100",
  cancelled: "text-rose-600 bg-rose-50",
  refunded: "text-rose-600 bg-rose-50",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        STATUS_TONE[status] || "bg-neutral-100 text-neutral-600"
      }`}
    >
      {status}
    </span>
  );
}
