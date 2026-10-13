import { formatPrice } from "../../utils/formatPrice.js";

// order_items only stores a product name snapshot (+ unit price/qty/options)
// — no image or slug, so these rows are text-only. See PROJECT_PROGRESS.md
// for the note on why (order_items doesn't join back to product_images).
export default function OrderItemsList({ items }) {
  return (
    <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200/70 bg-white">
      {items.map((item) => {
        const optionEntries = Object.entries(item.selected_options || {});
        return (
          <div key={item.id} className="flex items-center justify-between gap-4 p-4 sm:p-5">
            <div className="min-w-0">
              <p className="text-sm font-bold text-neutral-900">{item.product_name}</p>
              {optionEntries.length > 0 && (
                <p className="mt-1 text-xs text-neutral-500">
                  {optionEntries.map(([k, v]) => `${k}: ${v}`).join(" · ")}
                </p>
              )}
              <p className="mt-1 text-xs text-neutral-500">
                Qty {item.quantity} × {formatPrice(item.unit_price)}
              </p>
            </div>
            <p className="shrink-0 text-sm font-bold text-neutral-900">{formatPrice(item.line_total)}</p>
          </div>
        );
      })}
    </div>
  );
}
