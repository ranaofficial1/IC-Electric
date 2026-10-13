import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api.js";
import OrderStatusBadge from "../components/orders/OrderStatusBadge.jsx";
import OrderItemsList from "../components/orders/OrderItemsList.jsx";
import OrderTotals from "../components/orders/OrderTotals.jsx";
import RazorpayPayButton from "../components/orders/RazorpayPayButton.jsx";
import Button from "../components/ui/Button.jsx";
import Icon from "../components/ui/Icon.jsx";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/orders/${orderId}`)
      .then((res) => {
        if (!cancelled) setOrder(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load your order.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Icon name="spinner" className="animate-spin text-[28px] text-neutral-300" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-[1360px] px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Order not found</h1>
        <p className="mt-2 text-sm text-neutral-500">
          {error || "We couldn't find that order."}
        </p>
        <Button to="/account/orders" variant="secondary" className="mt-6">
          View Your Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-500">
          <Icon name="check" />
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900">
          Order placed!
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Thanks — we&apos;ve received your order and will get it on its way soon.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-neutral-200/70 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Order Number</p>
            <p className="text-lg font-bold text-neutral-900">{order.order_number}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="mt-4 border-t border-neutral-100 pt-4 text-sm text-neutral-600">
          <p className="font-semibold text-neutral-900">Shipping to</p>
          <p className="mt-1">
            {order.shipping_name}
            <br />
            {order.shipping_line1}, {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
          </p>
        </div>
      </div>

      <RazorpayPayButton order={order} onPaid={setOrder} className="mt-6" />

      <div className="mt-6">
        <OrderItemsList items={order.items} />
      </div>

      <div className="mt-6 rounded-2xl border border-neutral-200/70 bg-white p-5 sm:p-6">
        <OrderTotals
          subtotal={order.subtotal}
          discount={order.discount}
          shipping={order.shipping_fee}
          total={order.total}
        />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button to={`/account/orders/${order.id}`} variant="primary">
          View Order Details
        </Button>
        <Button to="/shop" variant="secondary">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
