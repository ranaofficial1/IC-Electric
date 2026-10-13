import { Link } from "react-router-dom";
import Icon from "../ui/Icon.jsx";

// items: [{ label, to }] — the last item is rendered as plain text (current page).
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-neutral-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-2">
            {index > 0 && <Icon name="chevronRight" className="text-[9px] text-neutral-300" />}
            {isLast || !item.to ? (
              <span className="font-medium text-blue-800">{item.label}</span>
            ) : (
              <Link to={item.to} className="transition-colors hover:text-brand-500">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
