import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon.jsx";
import Button from "../components/ui/Button.jsx";
import MediaTile from "../components/ui/MediaTile.jsx";
import QuantityStepper from "../components/product/QuantityStepper.jsx";
import OrderTotals from "../components/orders/OrderTotals.jsx";
import { useCart } from "../context/CartContext.jsx";
import { api } from "../services/api.js";
import { formatPrice } from "../utils/formatPrice.js";

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 79;

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount }
  const [couponError, setCouponError] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);

  async function handleApplyCoupon(event) {
    event.preventDefault();
    const code = couponInput.trim();
    if (!code) return;

    setCouponChecking(true);
    setCouponError("");
    try {
      const res = await api.get(
        `/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`
      );
      setAppliedCoupon({ code: res.data.code, discount: res.data.discount });
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.message || "That coupon code isn't valid.");
    } finally {
      setCouponChecking(false);
    }
  }

  const discount = appliedCoupon?.discount || 0;
  const shipping = subtotal === 0 || subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1360px] px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50 text-2xl text-neutral-300">
          <Icon name="cart" />
        </span>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Your cart is empty</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
          Looks like you haven&apos;t added anything yet. Start browsing to find something you&apos;ll love.
        </p>
        <Button to="/shop" variant="primary" className="mt-6">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
        Your Cart
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1 divide-y divide-neutral-100 rounded-2xl border border-neutral-200/70 bg-white">
          {items.map((line) => {
            const lineUnitPrice = line.salePrice ?? line.price;
            const optionEntries = Object.entries(line.selectedOptions || {});

            return (
              <div key={line.lineId} className="flex gap-4 p-4 sm:p-5">
                <Link to={`/product/${line.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                  <MediaTile src={line.image} alt={line.name} icon={line.categoryIcon} accent={line.categoryAccent} />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        to={`/product/${line.slug}`}
                        className="line-clamp-1 text-sm font-bold text-neutral-900 hover:text-brand-600"
                      >
                        {line.name}
                      </Link>
                      {optionEntries.length > 0 && (
                        <p className="mt-1 text-xs text-neutral-500">
                          {optionEntries.map(([k, v]) => `${k}: ${v}`).join(" · ")}
                        </p>
                      )}
                      <p className="mt-1 text-sm font-semibold text-neutral-900 sm:hidden">
                        {formatPrice(lineUnitPrice)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(line.lineId)}
                      aria-label={`Remove ${line.name} from cart`}
                      className="shrink-0 text-neutral-400 transition-colors hover:text-rose-500"
                    >
                      <Icon name="close" className="text-[18px]" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <QuantityStepper
                      value={line.quantity}
                      onChange={(qty) => updateQuantity(line.lineId, qty)}
                      max={line.stock ?? 10}
                    />
                    <p className="hidden text-sm font-semibold text-neutral-900 sm:block">
                      {formatPrice(lineUnitPrice * line.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-full shrink-0 lg:w-80">
          <div className="rounded-2xl border border-neutral-200/70 bg-white p-5">
            <h2 className="font-display text-lg font-bold text-neutral-900">Order Summary</h2>

            <form onSubmit={handleApplyCoupon} className="mt-4 flex gap-2">
              <label htmlFor="coupon" className="sr-only">
                Coupon code
              </label>
              <input
                id="coupon"
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon code"
                className="w-full min-w-0 rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={couponChecking}
                className="shrink-0 rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 hover:border-neutral-400 disabled:opacity-50"
              >
                {couponChecking ? "..." : "Apply"}
              </button>
            </form>
            {couponError && <p className="mt-2 text-xs text-rose-600">{couponError}</p>}
            {appliedCoupon && (
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <Icon name="check" className="text-[14px]" />
                {appliedCoupon.code} applied
              </p>
            )}

            <div className="mt-5 border-t border-neutral-100 pt-5">
              <OrderTotals subtotal={subtotal} discount={discount} shipping={shipping} total={total} />
            </div>

            <Button to="/checkout" variant="primary" className="mt-5 w-full justify-center">
              Proceed to Checkout
            </Button>
            <Button to="/shop" variant="secondary" className="mt-3 w-full justify-center">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
