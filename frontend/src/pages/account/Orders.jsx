import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/customers/me/orders");
        setOrders(res.data);
      } catch (err) {
        setError(err.message || "Couldn't load your orders.");
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (loading) {
    return <p className="text-sm text-neutral-400">Loading orders...</p>;
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center">
        <Icon name="box" className="mx-auto mb-3 text-[28px] text-neutral-300" />
        <h2 className="font-display text-lg font-bold text-neutral-900">No orders yet</h2>
        <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500">
          Your orders will show up here once you&apos;ve placed one.
        </p>
        <Button to="/shop" variant="secondary" className="mt-5">
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-lg font-bold text-neutral-900">Order history</h2>
      {orders.map((order) => (
        <Link
          key={order.id}
          to={`/account/orders/${order.id}`}
          className="block rounded-2xl border border-neutral-200/70 bg-white p-5 transition-colors hover:border-neutral-300"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-neutral-900">{order.order_number}</p>
              <p className="text-xs text-neutral-400">
                {new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <span className="text-sm font-bold text-neutral-900">{formatPrice(order.total)}</span>
              <Icon name="chevronRight" className="text-[16px] text-neutral-300" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
