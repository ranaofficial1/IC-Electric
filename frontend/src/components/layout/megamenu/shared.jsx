import { Link } from "react-router-dom";
import MediaTile from "../../ui/MediaTile.jsx";
import { formatPrice } from "../../../utils/formatPrice.js";

export function Price({ product, className = "" }) {
  const onSale = product.salePrice && product.salePrice < product.price;
  return (
    <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className="font-bold">{formatPrice(product.salePrice ?? product.price)}</span>
      {onSale && <span className="text-[11px] line-through opacity-60">{formatPrice(product.price)}</span>}
    </span>
  );
}

export function ViewAll({ to, children, className = "" }) {
  return (
    <Link
      to={to}
      className={`group/cta inline-flex items-center gap-1.5 font-label-lg text-label-lg font-bold ${className}`}
    >
      {children}
      <span className="material-symbols-outlined text-[18px] transition-transform group-hover/cta:translate-x-1">
        arrow_forward
      </span>
    </Link>
  );
}

export function MenuSkeleton({ className = "h-20", dark = false }) {
  return <div className={`animate-pulse rounded-xl ${dark ? "bg-white/10" : "bg-surface-container"} ${className}`} />;
}

/** Image-led tile used by several panels. */
export function ImageCard({ to, src, alt, icon, accent, className = "", style, children }) {
  return (
    <Link to={to} style={style} className={`group relative block overflow-hidden rounded-2xl ${className}`}>
      <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.06]">
        <MediaTile src={src} alt={alt} icon={icon} accent={accent} />
      </div>
      {children}
    </Link>
  );
}

export function productCountLabel(n) {
  return `${n} ${n === 1 ? "product" : "products"}`;
}
