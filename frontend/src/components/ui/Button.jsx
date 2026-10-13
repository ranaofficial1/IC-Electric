import { Link } from "react-router-dom";

// Reference design buttons: pill-shaped, blue (secondary) primary, navy "dark".
const VARIANTS = {
  primary:
    "bg-secondary hover:bg-on-secondary-container text-on-secondary shadow-sm",
  secondary:
    "bg-surface-card hover:bg-surface-container-low text-on-surface border border-border-subtle shadow-sm",
  ghost:
    "bg-surface-card text-secondary hover:bg-surface-container-low",
  dark:
    "bg-primary hover:bg-primary-container text-on-primary shadow-md",
};

const SIZES = {
  sm: "px-4 py-2 text-label-md",
  md: "px-6 py-3 text-label-lg",
};

/**
 * Shared button/link component.
 * variant: "primary" | "secondary" | "ghost" | "dark"
 * If `to` is provided it renders as a router Link; otherwise a <button>.
 */
export default function Button({
  children,
  to,
  href,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  className = "",
  ...rest
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
