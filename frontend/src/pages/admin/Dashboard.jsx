import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge.jsx";
import Icon from "../../components/ui/Icon.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon name={icon} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{label}</p>
          <p className="mt-0.5 font-display text-xl font-bold text-neutral-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Card({ title, action, children }) {
  return (
    <div className="rounded-2xl border border-neutral-200/70 bg-white p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-bold text-neutral-900">{title}</h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get("/admin/dashboard")
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load the dashboard.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Icon name="spinner" className="animate-spin text-[28px] text-neutral-300" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
        <span>{error || "Couldn't load the dashboard."}</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-neutral-900">Dashboard</h2>
      <p className="mt-1 text-sm text-neutral-500">A snapshot of store activity.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue (paid)" value={formatPrice(Number(data.totalRevenue))} icon="chartLine" />
        <StatCard label="Total Orders" value={data.totalOrders} icon="box" />
        <StatCard label="Customers" value={data.totalCustomers} icon="users" />
        <StatCard label="Published Products" value={data.totalProducts} icon="hanger" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card
            title="Recent Orders"
            action={
              <Link to="/admin/orders" className="text-xs font-semibold text-brand-600 hover:underline">
                View all
              </Link>
            }
          >
            {data.recentOrders.length === 0 ? (
              <p className="text-sm text-neutral-400">No orders yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="border-b border-neutral-100 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    <tr>
                      <th className="py-2 pr-3">Order</th>
                      <th className="py-2 pr-3">Customer</th>
                      <th className="py-2 pr-3">Status</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {data.recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="py-2.5 pr-3">
                          <Link
                            to={`/admin/orders/${order.id}`}
                            className="font-semibold text-neutral-900 hover:text-brand-600 hover:underline"
                          >
                            {order.order_number}
                          </Link>
                        </td>
                        <td className="py-2.5 pr-3 text-neutral-600">{order.customer_name}</td>
                        <td className="py-2.5 pr-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="py-2.5 text-right font-semibold text-neutral-900">
                          {formatPrice(Number(order.total))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <div className="mt-6">
            <Card title="Orders by Status">
              {data.ordersByStatus.length === 0 ? (
                <p className="text-sm text-neutral-400">No orders yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data.ordersByStatus.map((row) => (
                    <div
                      key={row.status}
                      className="flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2"
                    >
                      <OrderStatusBadge status={row.status} />
                      <span className="text-sm font-semibold text-neutral-900">{row.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        <Card title="Low Stock">
          {data.lowStockProducts.length === 0 ? (
            <p className="text-sm text-neutral-400">Nothing running low right now.</p>
          ) : (
            <ul className="space-y-3">
              {data.lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-neutral-700">{product.name}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      product.stock === 0
                        ? "bg-rose-50 text-rose-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
