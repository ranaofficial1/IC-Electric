import Icon from "../ui/Icon.jsx";

export default function QuantityStepper({ value, onChange, max = 10 }) {
  function clamp(next) {
    return Math.min(max, Math.max(1, next));
  }

  return (
    <div className="inline-flex items-center rounded-xl border border-neutral-200">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className="flex h-11 w-11 items-center justify-center text-neutral-600 transition-colors hover:text-brand-500 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Icon name="minus" className="text-[16px]" />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-neutral-900" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="flex h-11 w-11 items-center justify-center text-neutral-600 transition-colors hover:text-brand-500 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Icon name="plus" className="text-[16px]" />
      </button>
    </div>
  );
}
