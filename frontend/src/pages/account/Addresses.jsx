import { useEffect, useState } from "react";
import { api } from "../../services/api.js";
import { detailsToFieldErrors } from "../../utils/formErrors.js";
import AddressForm, { EMPTY_ADDRESS_FORM } from "../../components/account/AddressForm.jsx";
import Button from "../../components/ui/Button.jsx";
import Icon from "../../components/ui/Icon.jsx";

export default function Addresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_ADDRESS_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [listError, setListError] = useState("");

  async function loadAddresses() {
    setLoading(true);
    setListError("");
    try {
      const res = await api.get("/customers/me/addresses");
      setAddresses(res.data);
    } catch (err) {
      setListError(err.message || "Couldn't load your addresses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_ADDRESS_FORM);
    setFieldErrors({});
    setFormError("");
    setFormOpen(true);
  }

  function openEditForm(address) {
    setEditingId(address.id);
    setForm({
      label: address.label || "Home",
      fullName: address.full_name,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postal_code,
      country: address.country || "India",
      isDefault: Boolean(address.is_default),
    });
    setFieldErrors({});
    setFormError("");
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFormError("");
    setFieldErrors({});

    try {
      if (editingId) {
        await api.put(`/customers/me/addresses/${editingId}`, form);
      } else {
        await api.post("/customers/me/addresses", form);
      }
      closeForm();
      await loadAddresses();
    } catch (err) {
      if (err.status === 422) {
        setFieldErrors(detailsToFieldErrors(err.details));
      } else {
        setFormError(err.message || "Couldn't save this address. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Remove this address?")) return;
    try {
      await api.delete(`/customers/me/addresses/${id}`);
      await loadAddresses();
    } catch (err) {
      setListError(err.message || "Couldn't remove this address.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-neutral-900">Saved addresses</h2>
        {!formOpen && (
          <Button variant="secondary" size="sm" onClick={openAddForm}>
            <Icon name="plus" className="text-[14px]" />
            Add Address
          </Button>
        )}
      </div>

      {listError && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
          <span>{listError}</span>
        </div>
      )}

      {formOpen && (
        <div className="rounded-2xl border border-neutral-200/70 bg-white p-6">
          <h3 className="mb-4 font-display text-base font-bold text-neutral-900">
            {editingId ? "Edit address" : "New address"}
          </h3>

          {formError && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <AddressForm
              form={form}
              fieldErrors={fieldErrors}
              onChange={(field, value) => setForm((f) => ({ ...f, [field]: value }))}
            />

            <div className="flex gap-3">
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting && <Icon name="spinner" className="animate-spin" />}
                {submitting ? "Saving..." : "Save Address"}
              </Button>
              <Button type="button" variant="secondary" onClick={closeForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-neutral-400">Loading addresses...</p>
      ) : addresses.length === 0 && !formOpen ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center">
          <Icon name="mapPin" className="mx-auto mb-3 text-[28px] text-neutral-300" />
          <p className="text-sm text-neutral-500">You haven&apos;t saved any addresses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div key={address.id} className="rounded-2xl border border-neutral-200/70 bg-white p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700">
                  {address.label}
                </span>
                {Boolean(address.is_default) && (
                  <span className="text-xs font-semibold text-brand-600">Default</span>
                )}
              </div>
              <p className="text-sm font-semibold text-neutral-900">{address.full_name}</p>
              <p className="mt-1 text-sm text-neutral-500">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
                <br />
                {address.city}, {address.state} {address.postal_code}
                <br />
                {address.country}
              </p>
              <p className="mt-1 text-sm text-neutral-500">{address.phone}</p>

              <div className="mt-4 flex gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => openEditForm(address)}
                  className="flex items-center gap-1.5 text-neutral-600 hover:text-neutral-900"
                >
                  <Icon name="pencil" className="text-[14px]" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700"
                >
                  <Icon name="trash" className="text-[14px]" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
