import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

export default function SectionHeading({ title, description, linkTo, linkLabel, eyebrow, className = "mb-6" }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        {eyebrow && (
          <span className="text-label-sm font-bold uppercase tracking-wider text-secondary">{eyebrow}</span>
        )}
        <h2 className="text-headline-lg-mobile font-bold tracking-tight text-primary sm:text-headline-lg">
          {title}
        </h2>
        {description && <p className="mt-1 max-w-xl text-body-md text-text-secondary">{description}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="inline-flex items-center gap-1 text-label-lg font-semibold text-secondary transition-colors hover:text-on-secondary-container"
        >
          {linkLabel || "View all"}
          <Icon name="chevronRight" className="text-[18px]" />
        </Link>
      )}
    </div>
  );
}
