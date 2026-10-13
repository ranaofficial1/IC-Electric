import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge.jsx";
import Icon from "../../components/ui/Icon.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get("/admin/orders")
      .then((res) => {
        if (!cancelled) setOrders(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load orders.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
        Orders
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Update order status, payment status, and shipment tracking. This is a minimal Phase 8
        fulfillment view — the full admin dashboard/nav lands in a later phase.
      </p>

      {loading && <p className="mt-6 text-sm text-neutral-400">Loading orders...</p>}

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <p className="mt-6 text-sm text-neutral-400">No orders yet.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200/70 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-neutral-100 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-neutral-900">{order.order_number}</p>
                    <p className="text-xs text-neutral-400">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">
                    <p>{order.customer_name}</p>
                    <p className="text-xs text-neutral-400">{order.customer_email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3 capitalize text-neutral-600">{order.payment_status}</td>
                  <td className="px-5 py-3 text-right font-semibold text-neutral-900">
                    {formatPrice(Number(order.total))}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="text-xs font-semibold text-brand-600 hover:underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
