const TONES = {
  sale: "bg-discount-emerald text-on-primary",
  new: "bg-secondary text-on-secondary",
  neutral: "bg-surface-card text-text-secondary border border-border-subtle",
};

// tone: "sale" | "new" | "neutral"
export default function Badge({ children, tone = "neutral" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-label-sm font-bold shadow-sm ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
