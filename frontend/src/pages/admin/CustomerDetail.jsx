import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api.js";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function loadCustomer() {
    setLoading(true);
    setError("");
    return api
      .get(`/admin/customers/${id}`)
      .then((res) => setCustomer(res.data))
      .catch((err) => setError(err.message || "Couldn't load this customer."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function toggleStatus() {
    const nextStatus = customer.status === "active" ? "disabled" : "active";
    if (
      nextStatus === "disabled" &&
      !window.confirm(`Disable ${customer.name}'s account? They won't be able to log in.`)
    ) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api.patch(`/admin/customers/${id}/status`, { status: nextStatus });
      setCustomer((prev) => ({ ...prev, status: nextStatus }));
    } catch (err) {
      setError(err.message || "Couldn't update this customer's status.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Icon name="spinner" className="animate-spin text-[28px] text-neutral-300" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-neutral-500">{error || "This customer doesn't exist."}</p>
        <Button to="/admin/customers" variant="secondary" className="mt-5">
          Back to Customers
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/admin/customers"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
      >
        <Icon name="chevronLeft" className="text-[16px]" />
        Back to Customers
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
            {customer.name}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {customer.email} {customer.phone ? `· ${customer.phone}` : ""}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Joined{" "}
            {new Date(customer.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              customer.status === "active"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {customer.status}
          </span>
          <Button
            variant={customer.status === "active" ? "secondary" : "primary"}
            size="sm"
            disabled={busy}
            onClick={toggleStatus}
          >
            {busy ? "Saving..." : customer.status === "active" ? "Disable Account" : "Activate Account"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <h2 className="mt-8 font-display text-base font-bold text-neutral-900">Order history</h2>

      {(!customer.orders || customer.orders.length === 0) && (
        <p className="mt-3 text-sm text-neutral-400">No orders yet.</p>
      )}

      {customer.orders && customer.orders.length > 0 && (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-neutral-200/70 bg-white">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-neutral-100 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customer.orders.map((order) => (
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
