import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../components/shop/Breadcrumbs.jsx";
import Gallery from "../components/product/Gallery.jsx";
import VariantSelector from "../components/product/VariantSelector.jsx";
import QuantityStepper from "../components/product/QuantityStepper.jsx";
import StockStatus from "../components/product/StockStatus.jsx";
import ShippingInfo from "../components/product/ShippingInfo.jsx";
import ProductTabs from "../components/product/ProductTabs.jsx";
import Icon from "../components/ui/Icon.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import ProductCard from "../components/ui/ProductCard.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import { fetchProductBySlug } from "../services/catalogApi.js";
import { formatPrice } from "../utils/formatPrice.js";
import { optionsMatch } from "../utils/cartOptions.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setProduct(null);

    fetchProductBySlug(slug)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Icon name="spinner" className="animate-spin text-[28px] text-neutral-300" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-[1360px] px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Product not found</h1>
        <p className="mt-2 text-sm text-neutral-500">This product doesn&apos;t exist yet.</p>
        <Button to="/shop" variant="secondary" className="mt-6">
          Browse all products
        </Button>
      </div>
    );
  }

  return <ProductDetailView product={product} />;
}

function ProductDetailView({ product }) {
  const navigate = useNavigate();
  const { items, addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedOptions, setSelectedOptions] = useState(() =>
    Object.fromEntries((product.options || []).map((o) => [o.name, o.values[0]]))
  );
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [actionError, setActionError] = useState("");
  const wishlisted = isWishlisted(product.id);

  const onSale = Boolean(product.salePrice);
  const inStock = product.stock > 0;
  const maxQuantity = Math.min(product.stock || 1, 10);

  // Tracks the *currently selected variant*, not just the product — picking
  // a different Size/Color should independently reflect whether that exact
  // combination is already in the cart.
  const alreadyInCart = items.some(
    (line) => line.productId === product.id && optionsMatch(line.selectedOptions, selectedOptions)
  );

  // Color-variant images: images tagged with a Color value (see
  // product.imageOptionValues) are shown only while that color is selected.
  // Untagged images are shared. Products without tagged images, or without a
  // Color option, get product.images exactly as before.
  const colorOption = (product.options || []).find((o) => /^colou?r$/i.test(o.name.trim()));
  const selectedColor = colorOption ? selectedOptions[colorOption.name] : null;
  const galleryImages = (() => {
    const tags = product.imageOptionValues || [];
    if (!selectedColor || !tags.some(Boolean)) return product.images;
    const norm = (v) => String(v).trim().toLowerCase();
    const forColor = product.images.filter((_, i) => tags[i] && norm(tags[i]) === norm(selectedColor));
    if (forColor.length > 0) return forColor;
    const shared = product.images.filter((_, i) => !tags[i]);
    return shared.length > 0 ? shared : product.images;
  })();

  function handleOptionChange(name, value) {
    setSelectedOptions((current) => ({ ...current, [name]: value }));
  }

  async function handleAddToCart() {
    if (!inStock || alreadyInCart) return;
    setAddingToCart(true);
    setActionError("");
    try {
      await addItem(product, quantity, selectedOptions);
    } catch (err) {
      setActionError(err?.message || "Couldn't add this item to your cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  }

  // Buy Now = make sure this exact variant is in the cart, THEN open checkout.
  // The add is awaited: previously navigation raced the (async, for logged-in
  // shoppers) cart update, so checkout could open on a cart without the item and
  // bounce back to /cart. Guests are sent through login by the route guard and
  // come back to checkout with their cart merged.
  async function handleBuyNow() {
    if (!inStock || buyingNow) return;
    setBuyingNow(true);
    setActionError("");
    try {
      if (!alreadyInCart) await addItem(product, quantity, selectedOptions);
      navigate("/checkout");
    } catch (err) {
      setActionError(err?.message || "Couldn't start checkout. Please try again.");
      setBuyingNow(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: product.categoryName || "Shop", to: product.category ? `/category/${product.category}` : "/shop" },
          ...(product.subcategory
            ? [{ label: product.subcategoryName, to: `/category/${product.subcategory}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
        <Gallery key={selectedColor || "default"} images={galleryImages} alt={product.name} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {product.categoryName}
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="star" className={i < Math.round(product.rating) ? "text-[18px]" : "text-[18px] text-neutral-200"} />
            ))}
            {product.reviewCount > 0 ? (
              <>
                <span className="text-sm font-medium text-neutral-600">{product.rating}</span>
                <span className="text-sm text-neutral-400">({product.reviewCount} reviews)</span>
              </>
            ) : (
              <span className="text-sm text-neutral-400">No reviews yet</span>
            )}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="font-display text-3xl font-bold text-neutral-900">
              {formatPrice(onSale ? product.salePrice : product.price)}
            </span>
            {onSale && (
              <>
                <span className="text-lg text-neutral-400 line-through">{formatPrice(product.price)}</span>
                <Badge tone="sale">-{Math.round((1 - product.salePrice / product.price) * 100)}%</Badge>
              </>
            )}
            {!onSale && product.isNew && <Badge tone="new">New</Badge>}
          </div>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-neutral-600">{product.description}</p>

          {product.options && product.options.length > 0 && (
            <div className="mt-6">
              <VariantSelector
                options={product.options}
                selected={selectedOptions}
                onChange={handleOptionChange}
              />
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Quantity</p>
            <QuantityStepper value={quantity} onChange={setQuantity} max={maxQuantity} />
          </div>

          <div className="mt-4">
            <StockStatus stock={product.stock} />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {alreadyInCart ? (
              <Button variant="primary" to="/cart">
                <Icon name="check" className="text-[16px]" />
                Go to Cart
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={!inStock || addingToCart}
                className={!inStock ? "cursor-not-allowed opacity-40" : ""}
              >
                <Icon name={addingToCart ? "spinner" : "cart"} className={addingToCart ? "animate-spin text-[16px]" : "text-[16px]"} />
                {!inStock ? "Out of Stock" : addingToCart ? "Adding..." : "Add to Cart"}
              </Button>
            )}
            <Button
              variant="dark"
              onClick={handleBuyNow}
              disabled={!inStock || buyingNow}
              className={!inStock ? "cursor-not-allowed opacity-40" : ""}
            >
              {buyingNow ? "Please wait..." : "Buy Now"}
            </Button>
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              aria-pressed={wishlisted}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center self-start rounded-xl border transition-colors ${
                wishlisted
                  ? "border-rose-200 bg-rose-50 text-rose-500"
                  : "border-neutral-200 bg-white text-neutral-500 hover:text-rose-500"
              }`}
            >
              <Icon name={wishlisted ? "heartFilled" : "heart"} />
            </button>
          </div>

          {actionError && (
            <p role="alert" className="mt-3 text-sm font-medium text-rose-600">
              {actionError}
            </p>
          )}

          <div className="mt-8">
            <ShippingInfo />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <ProductTabs product={product} reviews={product.reviews} />
      </div>

      {product.related.length > 0 && (
        <div className="mt-16">
          <SectionHeading title="You Might Also Like" description="More from the same category." />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {product.related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
