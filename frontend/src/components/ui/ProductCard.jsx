import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import MediaTile from "./MediaTile.jsx";
import { formatPrice } from "../../utils/formatPrice.js";
import ActionFeedback from "./ActionFeedback.jsx";
import { useShopActions } from "../../hooks/useShopActions.js";
import { useWishlist } from "../../context/WishlistContext.jsx";

const LOW_STOCK_THRESHOLD = 10;

// Product card in the reference design's "bestseller" style: image panel with
// badges, rating + stock row, title, blurb, price block (MRP / savings) and a
// full-width action button. All data comes from the API-mapped product.
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
    "mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-secondary py-2.5 text-center text-label-md font-semibold text-on-secondary shadow-sm transition-colors hover:bg-on-secondary-container disabled:cursor-not-allowed disabled:bg-outline-variant disabled:text-on-surface-variant";

  return (
    <article
      className={`group flex flex-col rounded-2xl border border-border-subtle bg-surface-card p-5 shadow-sm transition-all duration-200 hover:shadow-lg ${className}`}
    >
      <div className="relative h-52 overflow-hidden rounded-xl bg-surface-container-low">
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1.5">
          {onSale && (
            <span className="rounded-full bg-discount-emerald px-2.5 py-0.5 text-label-sm text-on-primary shadow-sm">
              -{discountPct}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-label-sm text-on-secondary shadow-sm">
              New
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          onClick={() => toggleWishlist(product)}
          className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-colors ${
            wishlisted
              ? "bg-surface-card text-error"
              : "bg-surface-card/90 text-text-secondary hover:bg-surface-card hover:text-error"
          }`}
        >
          <Icon name={wishlisted ? "heartFilled" : "heart"} className="text-[18px]" />
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

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-label-sm text-energy-amber">
            <Icon name="star" className="text-[14px]" />
            {product.reviewCount > 0 ? (
              <>
                {Number(product.rating).toFixed(1)}
                <span className="font-normal text-text-muted">({product.reviewCount})</span>
              </>
            ) : (
              <span className="font-normal text-text-muted">No reviews yet</span>
            )}
          </span>
          {inStock ? (
            <span
              className={`flex items-center gap-1 text-label-sm ${
                lowStock ? "text-energy-amber" : "text-discount-emerald"
              }`}
            >
              <Icon name={lowStock ? "circleExclamation" : "verified"} className="text-[14px]" />
              {lowStock ? `Only ${product.stock} left` : "In Stock"}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-label-sm text-error">
              <Icon name="circleX" className="text-[14px]" />
              Out of Stock
            </span>
          )}
        </div>

        <p className="mt-2 text-body-sm font-medium uppercase tracking-wide text-text-muted">
          {product.categoryName}
        </p>
        <h3 className="mt-0.5 pb-4 line-clamp-2 text-title-lg leading-snug text-on-surface transition-colors group-hover:text-secondary">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        {/* {product.description && (
          <p className="mt-1 line-clamp-2 text-body-sm text-text-secondary">{product.description}</p>
        )} */}

        <div className="mt-auto flex items-baseline justify-between gap-2 border-t border-border-subtle pt-4">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-headline-sm font-bold text-primary">
              {formatPrice(onSale ? product.salePrice : product.price)}
            </span>
            {onSale && (
              <span className="text-body-sm text-text-muted line-through">MRP {formatPrice(product.price)}</span>
            )}
          </div>
          {onSale && (
            <span className="shrink-0 text-label-sm font-bold text-discount-emerald">
              Save {formatPrice(savings)}
            </span>
          )}
        </div>

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
              className={isAdding(product) ? "animate-spin text-[18px]" : "text-[18px]"}
            />
            {!inStock ? "Out of Stock" : isAdding(product) ? "Adding..." : justAdded ? "Added" : "Add to Cart"}
          </button>
        )}
      </div>
      <ActionFeedback feedback={feedback} />
    </article>
  );
}
