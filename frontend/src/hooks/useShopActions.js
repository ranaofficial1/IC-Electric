import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const FEEDBACK_MS = 3500;

/**
 * "Add to cart" and "Buy now" for any product card/button outside the product
 * detail page (home sections, hero, product cards).
 *
 *  - addToCart(product): adds 1 and resolves true/false. Products that need a
 *    variant choice are sent to their detail page instead (a variant can't be
 *    guessed). Failures (out of stock, server error) are surfaced in `feedback`
 *    instead of being swallowed.
 *  - buyNow(product): makes sure the product is in the cart — AWAITING the add,
 *    so the checkout page never opens on a cart that doesn't have it yet — then
 *    goes to /checkout. Guests are sent through login by the route guard and
 *    land on checkout afterwards with their cart merged.
 *
 * `feedback` is { type: "success" | "error", text } or null; render it with
 * <ActionFeedback feedback={feedback} />.
 */
export function useShopActions() {
  const navigate = useNavigate();
  const { items, addItem } = useCart();
  const [busy, setBusy] = useState(null); // `${productId}:add` | `${productId}:buy`
  const [feedback, setFeedback] = useState(null);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const notify = useCallback((type, text) => {
    setFeedback({ type, text });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFeedback(null), FEEDBACK_MS);
  }, []);

  const needsOptions = (product) =>
    Boolean(product.hasOptions) || (Array.isArray(product.options) && product.options.length > 0);

  // A line with no variant selection for this product is already in the cart.
  const isInCart = (product) =>
    items.some((line) => line.productId === product.id && Object.keys(line.selectedOptions || {}).length === 0);

  async function addToCart(product, quantity = 1) {
    if (!(product.stock > 0)) {
      notify("error", `${product.name} is out of stock.`);
      return false;
    }
    if (needsOptions(product)) {
      navigate(`/product/${product.slug}`);
      return false;
    }

    setBusy(`${product.id}:add`);
    try {
      await addItem(product, quantity);
      notify("success", `${product.name} added to your cart.`);
      return true;
    } catch (err) {
      notify("error", err?.message || "Couldn't add this item to your cart. Please try again.");
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function buyNow(product, quantity = 1) {
    if (!(product.stock > 0)) {
      notify("error", `${product.name} is out of stock.`);
      return false;
    }
    if (needsOptions(product)) {
      navigate(`/product/${product.slug}`);
      return false;
    }

    setBusy(`${product.id}:buy`);
    try {
      if (!isInCart(product)) await addItem(product, quantity);
      navigate("/checkout");
      return true;
    } catch (err) {
      notify("error", err?.message || "Couldn't start checkout. Please try again.");
      return false;
    } finally {
      setBusy(null);
    }
  }

  return {
    addToCart,
    buyNow,
    isAdding: (product) => busy === `${product.id}:add`,
    isBuying: (product) => busy === `${product.id}:buy`,
    feedback,
  };
}
