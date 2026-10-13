import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api.js";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge.jsx";
import OrderItemsList from "../../components/orders/OrderItemsList.jsx";
import OrderTotals from "../../components/orders/OrderTotals.jsx";
import RazorpayPayButton from "../../components/orders/RazorpayPayButton.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    api
      .get(`/orders/${id}`)
      .then((res) => {
        if (!cancelled) setOrder(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load this order.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[30vh] items-center justify-center">
        <Icon name="spinner" className="animate-spin text-[28px] text-neutral-300" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center">
        <Icon name="circleExclamation" className="mx-auto mb-3 text-[28px] text-neutral-300" />
        <p className="text-sm text-neutral-500">{error || "This order doesn't exist."}</p>
        <Button to="/account/orders" variant="secondary" className="mt-5">
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
      >
        <Icon name="chevronLeft" className="text-[16px]" />
        Back to Orders
      </Link>

      <div className="rounded-2xl border border-neutral-200/70 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Order Number</p>
            <p className="text-lg font-bold text-neutral-900">{order.order_number}</p>
            <p className="mt-1 text-xs text-neutral-400">
              Placed{" "}
              {new Date(order.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold capitalize text-neutral-600">
              Payment: {order.payment_status}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-neutral-100 pt-4 text-sm text-neutral-600 sm:grid-cols-2">
          <div>
            <p className="font-semibold text-neutral-900">Shipping Address</p>
            <p className="mt-1">
              {order.shipping_name}
              <br />
              {order.shipping_line1}, {order.shipping_city}, {order.shipping_state}{" "}
              {order.shipping_postal_code}
            </p>
          </div>
          {order.shipment && (order.shipment.tracking_number || order.shipment.carrier) && (
            <div>
              <p className="font-semibold text-neutral-900">Tracking</p>
              <p className="mt-1">
                {order.shipment.carrier && <>{order.shipment.carrier}<br /></>}
                {order.shipment.tracking_number}
              </p>
            </div>
          )}
        </div>

        {order.customer_notes && (
          <div className="mt-4 border-t border-neutral-100 pt-4 text-sm text-neutral-600">
            <p className="font-semibold text-neutral-900">Notes</p>
            <p className="mt-1">{order.customer_notes}</p>
          </div>
        )}
      </div>

      <RazorpayPayButton order={order} onPaid={setOrder} />

      <OrderItemsList items={order.items} />

      <div className="rounded-2xl border border-neutral-200/70 bg-white p-5 sm:p-6">
        <OrderTotals
          subtotal={order.subtotal}
          discount={order.discount}
          shipping={order.shipping_fee}
          total={order.total}
        />
      </div>
    </div>
  );
}
