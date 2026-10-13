import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";
import Icon from "../../components/ui/Icon.jsx";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function loadCustomers() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/admin/customers");
      setCustomers(res.data);
    } catch (err) {
      setError(err.message || "Couldn't load customers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function toggleStatus(customer) {
    const nextStatus = customer.status === "active" ? "disabled" : "active";
    if (
      nextStatus === "disabled" &&
      !window.confirm(`Disable ${customer.name}'s account? They won't be able to log in.`)
    ) {
      return;
    }
    setBusyId(customer.id);
    setError("");
    try {
      await api.patch(`/admin/customers/${customer.id}/status`, { status: nextStatus });
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, status: nextStatus } : c))
      );
    } catch (err) {
      setError(err.message || "Couldn't update this customer's status.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
        Customers
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        View customer accounts and disable access if needed.
      </p>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && <p className="mt-6 text-sm text-neutral-400">Loading customers...</p>}

      {!loading && customers.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center">
          <Icon name="users" className="mx-auto mb-3 text-[28px] text-neutral-300" />
          <p className="text-sm text-neutral-500">No customers yet.</p>
        </div>
      )}

      {!loading && customers.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200/70 bg-white">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-neutral-100 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3">
                    <Link
                      to={`/admin/customers/${customer.id}`}
                      className="font-semibold text-neutral-900 hover:text-brand-600 hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-neutral-500">{customer.email}</td>
                  <td className="px-5 py-3 text-neutral-500">{customer.phone || "—"}</td>
                  <td className="px-5 py-3 text-neutral-500">
                    {new Date(customer.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        customer.status === "active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-3 text-xs font-semibold">
                      <Link
                        to={`/admin/customers/${customer.id}`}
                        className="text-neutral-600 hover:text-neutral-900"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        disabled={busyId === customer.id}
                        onClick={() => toggleStatus(customer)}
                        className={`disabled:opacity-50 ${
                          customer.status === "active"
                            ? "text-rose-600 hover:text-rose-700"
                            : "text-emerald-600 hover:text-emerald-700"
                        }`}
                      >
                        {customer.status === "active" ? "Disable" : "Activate"}
                      </button>
                    </div>
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
