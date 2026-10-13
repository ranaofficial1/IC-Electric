import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api.js";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge.jsx";
import OrderItemsList from "../../components/orders/OrderItemsList.jsx";
import OrderTotals from "../../components/orders/OrderTotals.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];
const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

function Card({ title, children }) {
  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-white p-5 sm:p-6">
      <h2 className="font-display text-base font-bold text-neutral-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusInput, setStatusInput] = useState("");
  const [paymentStatusInput, setPaymentStatusInput] = useState("");
  const [carrierInput, setCarrierInput] = useState("");
  const [trackingInput, setTrackingInput] = useState("");
  const [shipmentStatusInput, setShipmentStatusInput] = useState("");

  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [savingShipment, setSavingShipment] = useState(false);
  const [saveError, setSaveError] = useState("");

  function loadOrder() {
    setLoading(true);
    setError("");
    return api
      .get(`/admin/orders/${id}`)
      .then((res) => {
        setOrder(res.data);
        setStatusInput(res.data.status);
        setPaymentStatusInput(res.data.payment_status);
        setCarrierInput(res.data.shipment?.carrier || "");
        setTrackingInput(res.data.shipment?.tracking_number || "");
        setShipmentStatusInput(res.data.shipment?.status || "pending");
      })
      .catch((err) => setError(err.message || "Couldn't load this order."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleUpdateStatus(event) {
    event.preventDefault();
    setSavingStatus(true);
    setSaveError("");
    try {
      const res = await api.patch(`/admin/orders/${id}/status`, { status: statusInput });
      setOrder(res.data);
    } catch (err) {
      setSaveError(err.message || "Couldn't update order status.");
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleUpdatePaymentStatus(event) {
    event.preventDefault();
    setSavingPayment(true);
    setSaveError("");
    try {
      const res = await api.patch(`/admin/orders/${id}/payment-status`, {
        paymentStatus: paymentStatusInput,
      });
      setOrder(res.data);
    } catch (err) {
      setSaveError(err.message || "Couldn't update payment status.");
    } finally {
      setSavingPayment(false);
    }
  }

  async function handleUpdateShipment(event) {
    event.preventDefault();
    setSavingShipment(true);
    setSaveError("");
    try {
      const res = await api.patch(`/admin/orders/${id}/shipment`, {
        carrier: carrierInput.trim() || null,
        trackingNumber: trackingInput.trim() || null,
        status: shipmentStatusInput.trim() || "pending",
      });
      setOrder(res.data);
    } catch (err) {
      setSaveError(err.message || "Couldn't update shipment info.");
    } finally {
      setSavingShipment(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Icon name="spinner" className="animate-spin text-[28px] text-neutral-300" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-sm text-neutral-500">{error || "This order doesn't exist."}</p>
        <Button to="/admin/orders" variant="secondary" className="mt-5">
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900"
      >
        <Icon name="chevronLeft" className="text-[16px]" />
        Back to Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
            {order.order_number}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {order.customer_name} · {order.customer_email}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {saveError && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card title="Order Status">
          <form onSubmit={handleUpdateStatus} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-neutral-500">Status</label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm capitalize focus:border-brand-500 focus:outline-none"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="primary" size="sm" disabled={savingStatus}>
              {savingStatus ? "Saving..." : "Update"}
            </Button>
          </form>
        </Card>

        <Card title="Payment Status">
          <form onSubmit={handleUpdatePaymentStatus} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-neutral-500">Payment</label>
              <select
                value={paymentStatusInput}
                onChange={(e) => setPaymentStatusInput(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm capitalize focus:border-brand-500 focus:outline-none"
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" variant="primary" size="sm" disabled={savingPayment}>
              {savingPayment ? "Saving..." : "Update"}
            </Button>
          </form>
          {order.payment && (
            <p className="mt-3 text-xs text-neutral-400">
              Provider: {order.payment.provider}
              {order.payment.provider_payment_id ? ` · ${order.payment.provider_payment_id}` : ""}
            </p>
          )}
        </Card>

        <Card title="Shipment / Tracking">
          <form onSubmit={handleUpdateShipment} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-500">Carrier</label>
              <input
                type="text"
                value={carrierInput}
                onChange={(e) => setCarrierInput(e.target.value)}
                placeholder="e.g. Delhivery, BlueDart"
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500">Tracking Number</label>
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-500">Shipment Status</label>
              <input
                type="text"
                value={shipmentStatusInput}
                onChange={(e) => setShipmentStatusInput(e.target.value)}
                placeholder="pending, in_transit, delivered, ..."
                className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
              />
            </div>
            <Button type="submit" variant="primary" size="sm" disabled={savingShipment}>
              {savingShipment ? "Saving..." : "Update Shipment"}
            </Button>
          </form>
        </Card>

        <Card title="Shipping Address">
          <p className="text-sm text-neutral-600">
            {order.shipping_name}
            <br />
            {order.shipping_line1}, {order.shipping_city}, {order.shipping_state}{" "}
            {order.shipping_postal_code}
          </p>
        </Card>
      </div>

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
    </div>
  );
}
