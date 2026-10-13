import { Link } from "react-router-dom";
import MediaTile from "../ui/MediaTile.jsx";
import { formatPrice } from "../../utils/formatPrice.js";

/**
 * Card used by the Kitchen and Home Appliances home sections (same design as the
 * reference): image panel with badges, name, price block, round add-to-cart
 * button and a Buy Now action. Everything comes from the API product; the two
 * actions are wired to the real cart (see hooks/useShopActions).
 *
 * variant "kitchen" = Buy Now as a full-width button under the price row;
 * variant "home"    = compact Buy Now pill beside the price.
 */
export default function HomeProductTile({ product, variant = "kitchen", actions }) {
  const { addToCart, buyNow, isAdding, isBuying } = actions;
  const onSale = Boolean(product.salePrice);
  const inStock = product.stock > 0;
  const discountPct = onSale ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  const to = `/product/${product.slug}`;

  const roundCart = (
    <button
      type="button"
      onClick={() => addToCart(product)}
      disabled={!inStock || isAdding(product)}
      aria-label={inStock ? `Add ${product.name} to cart` : `${product.name} is out of stock`}
      className="w-9 h-9 rounded-full bg-secondary hover:bg-on-secondary-container text-on-secondary flex items-center justify-center transition-colors disabled:cursor-not-allowed disabled:bg-outline-variant disabled:text-on-surface-variant flex-shrink-0"
    >
      <span className={`material-symbols-outlined text-[18px] ${isAdding(product) ? "animate-spin" : ""}`}>
        {isAdding(product) ? "progress_activity" : "add_shopping_cart"}
      </span>
    </button>
  );

  const buyLabel = !inStock ? "Out of Stock" : isBuying(product) ? "Please wait..." : "Buy Now";

  return (
    <div className="bg-surface-card rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col group">
      <div className="relative bg-surface-container-low rounded-xl p-4 flex items-center justify-center h-56 overflow-hidden">
        <span
          className={`absolute top-2 left-2 z-10 font-label-sm text-label-sm px-2 py-0.5 rounded font-bold ${
            variant === "home" ? "bg-energy-amber text-on-primary" : "bg-secondary text-on-secondary"
          }`}
        >
          {product.subcategoryName || product.categoryName}
        </span>
        {onSale && (
          <span className="absolute top-2 right-2 z-10 bg-discount-emerald text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded font-bold">
            {`SAVE ${discountPct}%`}
          </span>
        )}
        <Link to={to} aria-label={product.name} className="block h-44 w-full overflow-hidden rounded-lg">
          <div className="h-full w-full group-hover:scale-105 transition-transform duration-300">
            <MediaTile src={product.image} alt={product.name} icon={product.categoryIcon} accent={product.categoryAccent} />
          </div>
        </Link>
      </div>
      <div className="flex flex-col flex-1 mt-4">
        <span className="font-body-sm text-body-sm text-text-muted">{product.categoryName}</span>
        <h3 className="font-title-lg text-title-lg text-on-surface mt-0.5 group-hover:text-secondary transition-colors">
          <Link to={to}>{product.name}</Link>
        </h3>
        {product.description && (
          <p className="font-body-sm text-body-sm text-text-secondary mt-1 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-auto pt-3">
          <div className="mt-4 pt-3 border-t border-border-subtle flex items-baseline justify-between gap-2">
            <div>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">
                {formatPrice(onSale ? product.salePrice : product.price)}
              </span>
              {onSale && (
                <span className="font-body-sm text-body-sm text-text-muted line-through ml-2">
                  {`MRP: ${formatPrice(product.price)}`}
                </span>
              )}
            </div>
            {variant === "home" ? (
              <div className="flex items-center gap-2">
                {roundCart}
                <button
                  type="button"
                  onClick={() => buyNow(product)}
                  disabled={!inStock || isBuying(product)}
                  className="inline-flex items-center gap-1 bg-secondary text-on-secondary px-3 py-1.5 rounded-full font-label-sm text-label-sm font-semibold hover:bg-on-secondary-container transition-colors disabled:cursor-not-allowed disabled:bg-outline-variant disabled:text-on-surface-variant"
                >
                  {buyLabel}
                </button>
              </div>
            ) : (
              roundCart
            )}
          </div>
          {variant !== "home" && (
            <button
              type="button"
              onClick={() => buyNow(product)}
              disabled={!inStock || isBuying(product)}
              className="mt-3 block w-full text-center bg-surface-container-low hover:bg-surface-container text-on-surface py-2 rounded-lg font-label-md text-label-md font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {buyLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
