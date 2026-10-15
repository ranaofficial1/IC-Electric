import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import MediaTile from "./MediaTile.jsx";
import { formatPrice } from "../../utils/formatPrice.js";
import ActionFeedback from "./ActionFeedback.jsx";
import { useShopActions } from "../../hooks/useShopActions.js";
import { useWishlist } from "../../context/WishlistContext.jsx";

const LOW_STOCK_THRESHOLD = 10;

export default function ProductCard({ product, className = "" }) {
  const { addToCart, isAdding, feedback } = useShopActions();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);
  const onSale = Boolean(product.salePrice);
  const wishlisted = isWishlisted(product.id);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= LOW_STOCK_THRESHOLD;
  const discountPct = onSale ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
  const savings = onSale ? product.price - product.salePrice : 0;

  async function handleAddToCart() {
    if (!inStock || product.hasOptions) return;
    const added = await addToCart(product, 1);
    if (added) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    }
  }

  const actionClasses =
    "mt-2.5 flex w-full items-center justify-center gap-1 rounded-lg bg-secondary py-2 text-center text-[12px] font-semibold text-on-secondary shadow-sm transition-colors hover:bg-on-secondary-container disabled:cursor-not-allowed disabled:bg-outline-variant disabled:text-on-surface-variant sm:mt-3 sm:gap-1.5 sm:rounded-xl sm:py-2.5 sm:text-label-md";

  return (
    <article
      className={`group flex h-full min-w-0 flex-col rounded-xl border border-border-subtle bg-surface-card p-2.5 shadow-sm transition-all duration-200 hover:shadow-lg sm:rounded-2xl sm:p-4 lg:p-5 ${className}`}
    >
      {/* ---------- Image panel ---------- */}
      <div className="relative h-36 overflow-hidden rounded-lg bg-surface-container-low min-[400px]:h-40 sm:h-48 sm:rounded-xl lg:h-52">
        <div className="absolute left-1.5 top-1.5 z-10 flex flex-col items-start gap-1 sm:left-2.5 sm:top-2.5 sm:gap-1.5">
          {onSale && (
            <span className="rounded-full bg-discount-emerald px-1.5 py-0.5 text-[10px] font-semibold leading-none text-on-primary shadow-sm sm:px-2.5 sm:py-1 sm:text-label-sm">
              -{discountPct}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-on-secondary shadow-sm sm:px-2.5 sm:py-1 sm:text-label-sm">
              New
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          onClick={() => toggleWishlist(product)}
          className={`absolute right-1.5 top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-colors sm:right-2.5 sm:top-2.5 sm:h-8 sm:w-8 ${
            wishlisted
              ? "bg-surface-card text-error"
              : "bg-surface-card/90 text-text-secondary hover:bg-surface-card hover:text-error"
          }`}
        >
          <Icon name={wishlisted ? "heartFilled" : "heart"} className="text-[14px] sm:text-[18px]" />
        </button>

        <Link to={`/product/${product.slug}`} aria-label={product.name} className="block h-full w-full">
          <div className="h-full w-full transition-transform duration-300 group-hover:scale-105">
            <MediaTile
              src={product.image}
              alt={product.name}
              icon={product.categoryIcon}
              accent={product.categoryAccent}
            />
          </div>
        </Link>
      </div>

      {/* ---------- Content ---------- */}
      <div className="mt-2.5 flex flex-1 flex-col sm:mt-4">
        {/* Rating + stock */}
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
          <span className="flex items-center gap-0.5 text-[11px] font-semibold text-energy-amber sm:gap-1 sm:text-label-sm">
            <Icon name="star" className="text-[12px] sm:text-[14px]" />
            {product.reviewCount > 0 ? (
              <>
                {Number(product.rating).toFixed(1)}
                <span className="font-normal text-text-muted">({product.reviewCount})</span>
              </>
            ) : (
              <span className="font-normal text-text-muted">No reviews</span>
            )}
          </span>

          {inStock ? (
            <span
              className={`flex items-center gap-0.5 text-[11px] font-semibold sm:gap-1 sm:text-label-sm ${
                lowStock ? "text-energy-amber" : "text-discount-emerald"
              }`}
            >
              <Icon
                name={lowStock ? "circleExclamation" : "verified"}
                className="text-[12px] sm:text-[14px]"
              />
              {lowStock ? `Only ${product.stock} left` : "In Stock"}
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-error sm:gap-1 sm:text-label-sm">
              <Icon name="circleX" className="text-[12px] sm:text-[14px]" />
              Out of Stock
            </span>
          )}
        </div>

        {/* Category */}
        <p className="mt-1.5 truncate text-[10px] font-medium uppercase tracking-wide text-text-muted sm:mt-2 sm:text-body-sm">
          {product.categoryName}
        </p>

        {/* Title: hamesha 2 line ki height reserve, taaki saare cards align rahein */}
        <h3 className="mt-0.5 line-clamp-2 h-[34px] overflow-hidden text-[13px] font-medium leading-[17px] text-on-surface transition-colors group-hover:text-secondary sm:h-[40px] sm:text-[15px] sm:leading-5 lg:h-[48px] lg:text-[17px] lg:leading-6">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Price */}
        <div className="mt-2 flex flex-col items-start gap-0.5 border-t border-border-subtle pt-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2 sm:pt-3 lg:pt-4">
          <div className="flex flex-wrap items-baseline gap-x-1.5 sm:gap-x-2">
            <span className="text-[15px] font-bold leading-tight text-primary sm:text-lg lg:text-headline-sm">
              {formatPrice(onSale ? product.salePrice : product.price)}
            </span>
            {onSale && (
              <span className="text-[11px] text-text-muted line-through sm:text-body-sm">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          {onSale && (
            <span className="shrink-0 text-[11px] font-bold text-discount-emerald sm:text-label-sm">
              Save {formatPrice(savings)}
            </span>
          )}
        </div>

        {/* Action */}
        {product.hasOptions ? (
          <Link
            to={`/product/${product.slug}`}
            aria-label={`Choose options for ${product.name}`}
            className={actionClasses}
          >
            Choose Options
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock || isAdding(product)}
            aria-label={inStock ? `Add ${product.name} to cart` : `${product.name} is out of stock`}
            className={actionClasses}
          >
            <Icon
              name={isAdding(product) ? "spinner" : justAdded ? "check" : "cart"}
              className={`text-[14px] sm:text-[18px] ${isAdding(product) ? "animate-spin" : ""}`}
            />
            {!inStock ? "Out of Stock" : isAdding(product) ? "Adding..." : justAdded ? "Added" : "Add to Cart"}
          </button>
        )}
      </div>
      <ActionFeedback feedback={feedback} />
    </article>
  );
}