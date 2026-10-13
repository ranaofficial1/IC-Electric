import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { payWithRazorpay } from "../utils/razorpay.js";
import { detailsToFieldErrors } from "../utils/formErrors.js";
import { formatPrice } from "../utils/formatPrice.js";
import AddressForm, { EMPTY_ADDRESS_FORM } from "../components/account/AddressForm.jsx";
import OrderTotals from "../components/orders/OrderTotals.jsx";
import Breadcrumbs from "../components/shop/Breadcrumbs.jsx";
import Button from "../components/ui/Button.jsx";
import Icon from "../components/ui/Icon.jsx";

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 79;

function AddressOption({ address, selected, onSelect }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm transition-colors ${
        selected ? "border-brand-500 bg-brand-50/40" : "border-neutral-200 hover:border-neutral-300"
      }`}
    >
      <input
        type="radio"
        checked={selected}
        onChange={onSelect}
        className="mt-1 h-4 w-4 shrink-0 text-brand-500 focus:ring-brand-500"
      />
      <span>
        <span className="flex items-center gap-2">
          <span className="font-semibold text-neutral-900">{address.full_name}</span>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-600">
            {address.label}
          </span>
        </span>
        <span className="mt-1 block text-neutral-500">
          {address.line1}
          {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} {address.postal_code}
        </span>
        <span className="mt-1 block text-neutral-500">{address.phone}</span>
      </span>
    </label>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-white p-5 sm:p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, itemCount, cartLoading, clearCart } = useCart();
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedShippingId, setSelectedShippingId] = useState(null);

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [selectedBillingId, setSelectedBillingId] = useState(null);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS_FORM);
  const [addressFormErrors, setAddressFormErrors] = useState({});
  const [addressFormError, setAddressFormError] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);

  const [paymentProvider, setPaymentProvider] = useState("cod");
  const [notes, setNotes] = useState("");

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount }
  const [couponError, setCouponError] = useState("");
  const [couponChecking, setCouponChecking] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");

  // Nothing to check out — send them back rather than showing an empty form.
  // Guarded by cartLoading so a logged-in user's still-loading server cart
  // doesn't cause a false "empty cart" bounce on a fresh page load.
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [cartLoading, items.length, navigate]);

  async function loadAddresses() {
    setAddressesLoading(true);
    try {
      const res = await api.get("/customers/me/addresses");
      setAddresses(res.data);
      const defaultAddress = res.data.find((a) => a.is_default) || res.data[0];
      if (defaultAddress) {
        setSelectedShippingId(defaultAddress.id);
      } else {
        setShowAddressForm(true);
      }
    } catch {
      // Leave addresses empty — the inline "add address" form still lets
      // the person proceed even if the list fetch failed.
      setShowAddressForm(true);
    } finally {
      setAddressesLoading(false);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  async function handleSaveAddress(event) {
    event.preventDefault();
    setSavingAddress(true);
    setAddressFormError("");
    setAddressFormErrors({});
    try {
      const res = await api.post("/customers/me/addresses", addressForm);
      setAddresses((current) => [...current, res.data]);
      setSelectedShippingId(res.data.id);
      setShowAddressForm(false);
      setAddressForm(EMPTY_ADDRESS_FORM);
    } catch (err) {
      if (err.status === 422) {
        setAddressFormErrors(detailsToFieldErrors(err.details));
      } else {
        setAddressFormError(err.message || "Couldn't save this address. Please try again.");
      }
    } finally {
      setSavingAddress(false);
    }
  }

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
  const shippingFee = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shippingFee;

  async function handlePlaceOrder() {
    if (!selectedShippingId) {
      setPlaceError("Please select or add a shipping address.");
      return;
    }
    if (!billingSameAsShipping && !selectedBillingId) {
      setPlaceError("Please select a billing address.");
      return;
    }

    setPlacing(true);
    setPlaceError("");
    try {
      const res = await api.post("/orders", {
        shippingAddressId: selectedShippingId,
        billingAddressId: billingSameAsShipping ? undefined : selectedBillingId,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        paymentProvider,
        notes: notes.trim() || undefined,
      });

      // The order is created either way at this point (payment_status is
      // 'pending' for both cod and razorpay) — the backend's transaction
      // already cleared the server-side cart, so sync the frontend's
      // cached state to match regardless of what happens with payment next.
      await clearCart();

      if (paymentProvider === "razorpay") {
        // Open the payment widget right here rather than sending them to
        // another page first. Whatever happens — success, dismiss, or a
        // failed attempt — they end up on the order confirmation page,
        // which shows a "Complete Payment" retry if it's still pending.
        payWithRazorpay(
          res.data,
          { name: user?.name, email: user?.email, contact: user?.phone },
          {
            onSuccess: () => navigate(`/order-success/${res.data.id}`, { replace: true }),
            onError: () => navigate(`/order-success/${res.data.id}`, { replace: true }),
            onDismiss: () => navigate(`/order-success/${res.data.id}`, { replace: true }),
          }
        ).catch(() => navigate(`/order-success/${res.data.id}`, { replace: true }));
        return;
      }

      navigate(`/order-success/${res.data.id}`, { replace: true });
    } catch (err) {
      setPlaceError(err.message || "Couldn't place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  if (cartLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Icon name="spinner" className="animate-spin text-[28px] text-neutral-300" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Cart", to: "/cart" }, { label: "Checkout" }]} />

      <h1 className="mb-8 font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
        Checkout
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <Card title="Shipping Address">
            {addressesLoading ? (
              <p className="text-sm text-neutral-400">Loading addresses...</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <AddressOption
                    key={address.id}
                    address={address}
                    selected={selectedShippingId === address.id}
                    onSelect={() => setSelectedShippingId(address.id)}
                  />
                ))}

                {!showAddressForm && (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 text-sm font-semibold text-brand-600 hover:underline"
                  >
                    <Icon name="plus" className="text-[14px]" />
                    Add a new address
                  </button>
                )}

                {showAddressForm && (
                  <form
                    onSubmit={handleSaveAddress}
                    className="space-y-4 rounded-xl border border-neutral-200 p-4"
                  >
                    {addressFormError && (
                      <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
                        <span>{addressFormError}</span>
                      </div>
                    )}
                    <AddressForm
                      form={addressForm}
                      fieldErrors={addressFormErrors}
                      onChange={(field, value) => setAddressForm((f) => ({ ...f, [field]: value }))}
                    />
                    <div className="flex gap-3">
                      <Button type="submit" variant="primary" size="sm" disabled={savingAddress}>
                        {savingAddress && <Icon name="spinner" className="animate-spin" />}
                        {savingAddress ? "Saving..." : "Save & Use This Address"}
                      </Button>
                      {addresses.length > 0 && (
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowAddressForm(false)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            )}
          </Card>

          <Card title="Billing Address">
            <label className="flex items-center gap-2.5 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={billingSameAsShipping}
                onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
              />
              Same as shipping address
            </label>

            {!billingSameAsShipping && (
              <div className="mt-4 space-y-3">
                {addresses.map((address) => (
                  <AddressOption
                    key={address.id}
                    address={address}
                    selected={selectedBillingId === address.id}
                    onSelect={() => setSelectedBillingId(address.id)}
                  />
                ))}
              </div>
            )}
          </Card>

          <Card title="Delivery Method">
            <div className="flex items-start gap-3 text-sm">
              <Icon name="truck" className="mt-0.5 text-brand-500" />
              <div>
                <p className="font-semibold text-neutral-900">Standard Delivery</p>
                <p className="text-neutral-500">
                  3–5 business days · Free over ₹999, otherwise {formatPrice(SHIPPING_FEE)}
                </p>
              </div>
            </div>
          </Card>

          <Card title="Payment Method">
            <div className="space-y-3">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors ${
                  paymentProvider === "cod"
                    ? "border-brand-500 bg-brand-50/40"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  checked={paymentProvider === "cod"}
                  onChange={() => setPaymentProvider("cod")}
                  className="h-4 w-4 text-brand-500 focus:ring-brand-500"
                />
                <span className="font-semibold text-neutral-900">Cash on Delivery</span>
              </label>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition-colors ${
                  paymentProvider === "razorpay"
                    ? "border-brand-500 bg-brand-50/40"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <input
                  type="radio"
                  checked={paymentProvider === "razorpay"}
                  onChange={() => setPaymentProvider("razorpay")}
                  className="h-4 w-4 text-brand-500 focus:ring-brand-500"
                />
                <span className="flex-1 font-semibold text-neutral-900">Card / UPI / Netbanking</span>
                <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                  via Razorpay
                </span>
              </label>
              {paymentProvider === "razorpay" && (
                <p className="text-xs text-neutral-500">
                  You&apos;ll place the order first, then complete payment in a secure Razorpay window.
                  If you close it before finishing, your order is still saved — you can retry payment
                  from the order confirmation page.
                </p>
              )}
            </div>
          </Card>

          <Card title="Order Notes (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Delivery instructions, landmark, etc."
              className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
            />
          </Card>
        </div>

        <div className="w-full shrink-0 lg:w-80">
          <div className="sticky top-36 rounded-2xl border border-neutral-200/70 bg-white p-5">
            <h2 className="font-display text-lg font-bold text-neutral-900">Order Summary</h2>
            <p className="mt-1 text-xs text-neutral-500">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>

            <form onSubmit={handleApplyCoupon} className="mt-4 flex gap-2">
              <label htmlFor="checkout-coupon" className="sr-only">
                Coupon code
              </label>
              <input
                id="checkout-coupon"
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
              <OrderTotals subtotal={subtotal} discount={discount} shipping={shippingFee} total={total} />
            </div>

            {placeError && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
                <span>{placeError}</span>
              </div>
            )}

            <Button
              variant="primary"
              className="mt-5 w-full justify-center"
              onClick={handlePlaceOrder}
              disabled={placing || !selectedShippingId}
            >
              {placing && <Icon name="spinner" className="animate-spin" />}
              {placing
                ? "Placing Order..."
                : paymentProvider === "razorpay"
                  ? "Place Order & Pay"
                  : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
