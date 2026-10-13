import TextField from "../ui/TextField.jsx";

export const EMPTY_ADDRESS_FORM = {
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

/**
 * The address input fields only — no <form> wrapper or submit buttons, so
 * callers (Addresses.jsx, Checkout.jsx) control their own submit behavior
 * and layout around it.
 */
export default function AddressForm({ form, fieldErrors = {}, onChange, showDefaultCheckbox = true }) {
  function update(field) {
    return (e) => {
      const value = field === "isDefault" ? e.target.checked : e.target.value;
      onChange(field, value);
    };
  }

  return (
    <div className="space-y-4">
      <TextField id="addr-label" label="Label" placeholder="Home, Work..." value={form.label} onChange={update("label")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField id="addr-fullName" label="Full name" required value={form.fullName} onChange={update("fullName")} error={fieldErrors.fullName} />
        <TextField id="addr-phone" label="Phone" type="tel" required value={form.phone} onChange={update("phone")} error={fieldErrors.phone} />
      </div>
      <TextField id="addr-line1" label="Address line 1" required value={form.line1} onChange={update("line1")} error={fieldErrors.line1} />
      <TextField id="addr-line2" label="Address line 2 (optional)" value={form.line2} onChange={update("line2")} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <TextField id="addr-city" label="City" required value={form.city} onChange={update("city")} error={fieldErrors.city} />
        <TextField id="addr-state" label="State" required value={form.state} onChange={update("state")} error={fieldErrors.state} />
        <TextField id="addr-postalCode" label="Postal code" required value={form.postalCode} onChange={update("postalCode")} error={fieldErrors.postalCode} />
      </div>
      <TextField id="addr-country" label="Country" value={form.country} onChange={update("country")} />

      {showDefaultCheckbox && (
        <label className="flex items-center gap-2.5 text-sm text-neutral-700">
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={update("isDefault")}
            className="h-4 w-4 rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
          />
          Set as default address
        </label>
      )}
    </div>
  );
}
