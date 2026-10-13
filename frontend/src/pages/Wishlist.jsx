import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import MediaTile from "../components/ui/MediaTile.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatPrice } from "../utils/formatPrice.js";

export default function Wishlist() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1360px] px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50 text-2xl text-neutral-300">
          <Icon name="heart" />
        </span>
        <h1 className="font-display text-2xl font-bold text-neutral-900">Your wishlist is empty</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
          Save products you love by tapping the heart icon — they&apos;ll show up here.
        </p>
        <Button to="/shop" variant="primary" className="mt-6">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
        Your Wishlist
      </h1>
      <p className="mt-2 text-sm text-neutral-500">
        {items.length} saved {items.length === 1 ? "product" : "products"}
      </p>

      <p className="mt-2 max-w-lg text-xs text-neutral-400">
        {isAuthenticated
          ? "Saved to your account — available on any device you log in from."
          : "Saved on this device as a guest. Log in to keep this list across devices."}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => {
          const onSale = Boolean(product.salePrice);
          const canQuickAdd = !product.hasOptions && product.stock > 0;

          return (
            <article
              key={product.id}
              className="flex flex-col justify-between rounded-2xl border border-border-subtle bg-surface-card p-5 shadow-sm"
            >
              <div className="relative mb-4 h-52 w-full overflow-hidden rounded-xl bg-surface-container-low">
                {onSale && (
                  <span className="absolute left-2 top-2 z-10">
                    <Badge tone="sale">-{Math.round((1 - product.salePrice / product.price) * 100)}%</Badge>
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeItem(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-neutral-600 shadow-sm transition-colors hover:text-rose-500"
                >
                  <Icon name="close" className="text-[16px]" />
                </button>
                <Link to={`/product/${product.slug}`} className="block h-full w-full">
                  <MediaTile
                    src={product.image}
                    alt={product.name}
                    icon={product.categoryIcon}
                    accent={product.categoryAccent}
                  />
                </Link>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                  {product.categoryName}
                </p>
                <h3 className="line-clamp-2 text-title-lg leading-snug text-on-surface">
                  <Link to={`/product/${product.slug}`}>{product.name}</Link>
                </h3>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-sm font-bold text-neutral-900">
                    {formatPrice(onSale ? product.salePrice : product.price)}
                  </span>
                  {onSale && (
                    <span className="text-xs text-neutral-400 line-through">{formatPrice(product.price)}</span>
                  )}
                </div>

                {product.stock <= 0 ? (
                  <p className="mt-3 text-xs font-semibold text-rose-600">Out of Stock</p>
                ) : canQuickAdd ? (
                  <button
                    type="button"
                    onClick={() => addItem(product, 1)}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-label-md font-semibold text-on-secondary shadow-sm transition-colors hover:bg-on-secondary-container"
                  >
                    <Icon name="cart" className="text-[14px]" />
                    Move to Cart
                  </button>
                ) : (
                  <Link
                    to={`/product/${product.slug}`}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-label-md font-semibold text-on-secondary shadow-sm transition-colors hover:bg-on-secondary-container"
                  >
                    Choose Options
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
