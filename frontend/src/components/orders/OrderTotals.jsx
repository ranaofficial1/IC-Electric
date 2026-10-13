import { formatPrice } from "../../utils/formatPrice.js";

export default function OrderTotals({ subtotal, discount = 0, shipping = 0, total }) {
  return (
    <div className="space-y-2.5 text-sm">
      <div className="flex justify-between text-neutral-600">
        <span>Subtotal</span>
        <span className="font-medium text-neutral-900">{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-emerald-600">
          <span>Discount</span>
          <span className="font-medium">-{formatPrice(discount)}</span>
        </div>
      )}
      <div className="flex justify-between text-neutral-600">
        <span>Shipping</span>
        <span className="font-medium text-neutral-900">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
      </div>
      <div className="flex justify-between border-t border-neutral-100 pt-2.5 text-base font-bold text-neutral-900">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
