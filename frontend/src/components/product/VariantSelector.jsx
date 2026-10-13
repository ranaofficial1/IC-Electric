export default function VariantSelector({ options, selected, onChange }) {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-5">
      {options.map((option) => (
        <div key={option.name}>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
            {option.name}: <span className="font-semibold text-neutral-800">{selected[option.name]}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isActive = selected[option.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onChange(option.name, value)}
                  aria-pressed={isActive}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
