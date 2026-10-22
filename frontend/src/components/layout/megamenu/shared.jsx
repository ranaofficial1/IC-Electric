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

// Compact product grid shared by every mega menu (the Kitchen card pattern,
// slightly smaller). Max 2 rows: 4 columns × 2 below `xl` (8 cards), 5 × 2
// from `xl` up (10 cards). Fewer products simply fill the first cells.
export const MENU_GRID_MAX = 10;

export function MenuProductGrid({ products, loading, icon = "kitchen", accent, emptyText }) {
  const shown = products.slice(0, MENU_GRID_MAX);
  return (
    <div className="grid grid-cols-4 gap-3 xl:grid-cols-5">
      {loading && [0, 1, 2, 3].map((i) => <MenuSkeleton key={i} className="h-[170px]" />)}
      {shown.map((p, i) => (
        <Link key={p.id} to={`/product/${p.slug}`} className={`group min-w-0 ${i >= 8 ? "hidden xl:block" : ""}`}>
          <div className="aspect-square overflow-hidden rounded-xl bg-surface-container-low">
            <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
              <MediaTile src={p.image} alt={p.name} icon={icon} accent={accent} />
            </div>
          </div>
          <div className="mt-1.5 line-clamp-2 font-label-md text-label-md text-primary group-hover:text-secondary">{p.name}</div>
          <Price product={p} className="text-body-sm text-secondary" />
        </Link>
      ))}
      {!loading && shown.length === 0 && (
        <p className="col-span-4 py-10 text-center font-body-md text-body-md text-text-muted xl:col-span-5">{emptyText}</p>
      )}
    </div>
  );
}
