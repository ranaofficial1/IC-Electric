export default function TextField({
  label,
  id,
  error,
  type = "text",
  className = "",
  containerClassName = "",
  ...rest
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-label-md font-semibold text-on-surface">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full rounded-xl border bg-surface-canvas px-3.5 py-2.5 text-body-md text-on-surface outline-none transition-all placeholder:text-text-muted focus:ring-2 disabled:bg-surface-subtle disabled:text-text-muted ${
          error
            ? "border-error focus:border-error focus:ring-error/20"
            : "border-outline-variant focus:border-secondary focus:ring-secondary/20"
        } ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-body-sm font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}
