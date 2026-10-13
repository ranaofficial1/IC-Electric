import Icon from "../ui/Icon.jsx";

const ROWS = [
  { icon: "truck", title: "Free Shipping", copy: "On orders over ₹999 — arrives in 3–5 business days." },
  { icon: "rotate", title: "30-Day Returns", copy: "Simple, no-questions exchanges within 30 days." },
  { icon: "shield", title: "Secure Checkout", copy: "Your payment information is always encrypted." },
];

export default function ShippingInfo() {
  return (
    <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200/70">
      {ROWS.map((row) => (
        <div key={row.title} className="flex items-start gap-3 p-4">
          <Icon name={row.icon} className="mt-0.5 text-brand-500" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">{row.title}</p>
            <p className="text-xs text-neutral-500">{row.copy}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
