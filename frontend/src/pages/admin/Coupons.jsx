import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import { detailsToFieldErrors } from "../../utils/formErrors.js";
import { formatPrice } from "../../utils/formatPrice.js";
import TextField from "../../components/ui/TextField.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";

const EMPTY_FORM = {
  code: "",
  type: "percent",
  value: "",
  minOrderAmount: "",
  usageLimit: "",
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

// Backend stores full timestamps; <input type="date"> wants YYYY-MM-DD.
function toDateInput(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function toForm(coupon) {
  return {
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    minOrderAmount: coupon.min_order_amount ?? "",
    usageLimit: coupon.usage_limit ?? "",
    startsAt: toDateInput(coupon.starts_at),
    expiresAt: toDateInput(coupon.expires_at),
    isActive: Boolean(coupon.is_active),
  };
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function loadCoupons() {
    setLoading(true);
    setListError("");
    try {
      const res = await api.get("/coupons");
      setCoupons(res.data);
    } catch (err) {
      setListError(err.message || "Couldn't load coupons.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFieldErrors({});
    setFormError("");
    setFormOpen(true);
  }

  function openEditForm(coupon) {
    setEditingId(coupon.id);
    setForm(toForm(coupon));
    setFieldErrors({});
    setFormError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    setFieldErrors({});

    const payload = {
      code: form.code.trim(),
      type: form.type,
      value: Number(form.value) || 0,
      minOrderAmount: form.minOrderAmount !== "" ? Number(form.minOrderAmount) : null,
      usageLimit: form.usageLimit !== "" ? Number(form.usageLimit) : null,
      startsAt: form.startsAt || null,
      expiresAt: form.expiresAt || null,
      isActive: form.isActive,
    };

    try {
      if (editingId) {
        await api.put(`/coupons/${editingId}`, payload);
      } else {
        await api.post("/coupons", payload);
      }
      closeForm();
      await loadCoupons();
    } catch (err) {
      if (err.status === 422) {
        setFieldErrors(detailsToFieldErrors(err.details));
      } else {
        setFormError(err.message || "Couldn't save this coupon.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(coupon) {
    if (!window.confirm(`Delete coupon "${coupon.code}"? This can't be undone.`)) return;
    try {
      await api.delete(`/coupons/${coupon.id}`);
      await loadCoupons();
    } catch (err) {
      setListError(err.message || "Couldn't delete this coupon.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
            Coupons
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Manage discount codes used at Cart and Checkout.
          </p>
        </div>
        {!formOpen && (
          <Button variant="primary" size="sm" onClick={openAddForm}>
            <Icon name="plus" className="text-[14px]" />
            New Coupon
          </Button>
        )}
      </div>

      {listError && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
          <span>{listError}</span>
        </div>
      )}

      {formOpen && (
        <div className="mt-6 rounded-2xl border border-neutral-200/70 bg-white p-5 sm:p-6">
          <h2 className="mb-4 font-display text-base font-bold text-neutral-900">
            {editingId ? "Edit coupon" : "New coupon"}
          </h2>

          {formError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <TextField
                id="coupon-code"
                label="Code"
                value={form.code}
                onChange={(e) => updateField("code", e.target.value.toUpperCase())}
                error={fieldErrors.code}
                placeholder="e.g. HALE10"
                required
              />
              <div>
                <label htmlFor="coupon-type" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Type
                </label>
                <select
                  id="coupon-type"
                  value={form.type}
                  onChange={(e) => updateField("type", e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none"
                >
                  <option value="percent">Percent off</option>
                  <option value="fixed">Fixed amount off</option>
                </select>
              </div>
              <TextField
                id="coupon-value"
                type="number"
                label={form.type === "percent" ? "Value (%)" : "Value (₹)"}
                value={form.value}
                onChange={(e) => updateField("value", e.target.value)}
                error={fieldErrors.value}
                min="0"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                id="coupon-min-order"
                type="number"
                label="Minimum order amount (₹, optional)"
                value={form.minOrderAmount}
                onChange={(e) => updateField("minOrderAmount", e.target.value)}
                min="0"
              />
              <TextField
                id="coupon-usage-limit"
                type="number"
                label="Usage limit (optional)"
                value={form.usageLimit}
                onChange={(e) => updateField("usageLimit", e.target.value)}
                min="0"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField
                id="coupon-starts"
                type="date"
                label="Starts (optional)"
                value={form.startsAt}
                onChange={(e) => updateField("startsAt", e.target.value)}
              />
              <TextField
                id="coupon-expires"
                type="date"
                label="Expires (optional)"
                value={form.expiresAt}
                onChange={(e) => updateField("expiresAt", e.target.value)}
              />
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
              />
              Active
            </label>

            <div className="flex gap-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting && <Icon name="spinner" className="animate-spin" />}
                {submitting ? "Saving..." : "Save Coupon"}
              </Button>
              <Button type="button" variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading && <p className="mt-6 text-sm text-neutral-400">Loading coupons...</p>}

      {!loading && coupons.length === 0 && !formOpen && (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center">
          <Icon name="ticket" className="mx-auto mb-3 text-[28px] text-neutral-300" />
          <p className="text-sm text-neutral-500">No coupons yet.</p>
        </div>
      )}

      {!loading && coupons.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-neutral-200/70 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-neutral-100 text-xs font-semibold uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3">Min. order</th>
                <th className="px-5 py-3">Usage</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-neutral-50">
                  <td className="px-5 py-3 font-semibold text-neutral-900">{coupon.code}</td>
                  <td className="px-5 py-3 text-neutral-600">
                    {coupon.type === "percent"
                      ? `${Number(coupon.value)}% off`
                      : `${formatPrice(Number(coupon.value))} off`}
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {coupon.min_order_amount ? formatPrice(Number(coupon.min_order_amount)) : "—"}
                  </td>
                  <td className="px-5 py-3 text-neutral-500">
                    {coupon.used_count}
                    {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        coupon.is_active
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {coupon.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-3 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => openEditForm(coupon)}
                        className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900"
                      >
                        <Icon name="pencil" className="text-[14px]" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(coupon)}
                        className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700"
                      >
                        <Icon name="trash" className="text-[14px]" />
                        Delete
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
