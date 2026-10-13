import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import * as cartApi from "../services/cartApi.js";
import { serializeOptions } from "../utils/cartOptions.js";

const CartContext = createContext(null);
const STORAGE_KEY = "hale_cart_v1";

function readStoredCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // localStorage unavailable (private browsing) or corrupted data — start empty.
    return [];
  }
}

/**
 * Cart state — dual mode:
 *   - Guest (not logged in): localStorage, exactly as it worked from
 *     Phase 4 onward. No regression for anonymous shoppers.
 *   - Logged in: backed by the real `/api/cart` endpoints. On the
 *     transition from guest -> logged in, whatever was in the local guest
 *     cart is merged into the server cart (one POST per line, the backend
 *     merges quantities for matching product+variant automatically), then
 *     local storage is cleared and the server becomes the source of truth
 *     for the rest of the session.
 * Every function below returns the same item shape either way (see
 * services/cartApi.js's mapper), so components never need to know which
 * mode is active.
 */
export function CartProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [guestItems, setGuestItems] = useState(readStoredCart);
  const [serverItems, setServerItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  // True once the server cart has been merged + fetched for the CURRENT login.
  // Without this, the render right after logging in has serverItems = [] and
  // cartLoading = false for one commit, so a page that guards on an empty cart
  // (checkout, after "Buy Now" -> login) bounced to /cart before the merge ran.
  const [serverSynced, setServerSynced] = useState(false);
  const hasMergedRef = useRef(false);
  // Holds the in-flight merge+fetch promise so React 18 StrictMode's
  // intentional double-invocation of effects in development (mount ->
  // cleanup -> mount again, synchronously) can't kick off a second,
  // overlapping sync that races the first one and wins with stale/partial
  // data. Both invocations await the SAME promise instead of each starting
  // their own.
  const syncPromiseRef = useRef(null);

  // Persist the guest cart. Harmless to keep writing even while logged in
  // (it just sits there unused), but simplest to reason about.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guestItems));
    } catch {
      // Ignore write failures (e.g. storage full/disabled) — cart still
      // works for the current session via in-memory state.
    }
  }, [guestItems]);

  // On login: merge the guest cart into the server cart once, then load
  // the (now-merged) server cart. On logout: drop the in-memory server
  // items and reset the merge guards so a future login merges again.
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setServerItems([]);
      setServerSynced(false);
      hasMergedRef.current = false;
      syncPromiseRef.current = null;
      setCartLoading(false);
      return;
    }

    let cancelled = false;
    setCartLoading(true);

    if (!syncPromiseRef.current) {
      syncPromiseRef.current = (async () => {
        if (!hasMergedRef.current) {
          hasMergedRef.current = true;
          const itemsToMerge = guestItems;
          for (const line of itemsToMerge) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await cartApi.addCartItem(line.productId, line.quantity, line.selectedOptions);
            } catch {
              // One line failing (e.g. that product is no longer available)
              // shouldn't abort merging the rest of the guest cart.
            }
          }
          if (itemsToMerge.length > 0) setGuestItems([]);
        }
        return cartApi.getCart();
      })();
    }

    syncPromiseRef.current
      .then((items) => {
        if (!cancelled) setServerItems(items);
      })
      .catch(() => {
        // Network/API hiccup — leave server cart empty rather than throw;
        // the user can retry actions (add/remove) which will surface errors.
      })
      .finally(() => {
        if (!cancelled) {
          setCartLoading(false);
          setServerSynced(true);
        }
      });

    return () => {
      cancelled = true;
    };
    // guestItems intentionally omitted — this should only re-run on an
    // actual auth transition, not every time the guest cart changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  const items = isAuthenticated ? serverItems : guestItems;

  async function addItem(product, quantity = 1, selectedOptions = {}) {
    if (isAuthenticated) {
      const updated = await cartApi.addCartItem(product.id, quantity, selectedOptions);
      setServerItems(updated);
      return;
    }

    const lineId = `${product.id}::${serializeOptions(selectedOptions)}`;
    const maxQty = product.stock ?? 99;

    setGuestItems((current) => {
      const existing = current.find((line) => line.lineId === lineId);
      if (existing) {
        return current.map((line) =>
          line.lineId === lineId
            ? { ...line, quantity: Math.min(maxQty, line.quantity + quantity) }
            : line
        );
      }
      return [
        ...current,
        {
          lineId,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          category: product.category,
          categoryName: product.categoryName,
          categoryIcon: product.categoryIcon,
          categoryAccent: product.categoryAccent,
          price: product.price,
          salePrice: product.salePrice,
          stock: product.stock,
          selectedOptions,
          quantity: Math.min(maxQty, Math.max(1, quantity)),
        },
      ];
    });
  }

  async function updateQuantity(lineId, quantity) {
    if (isAuthenticated) {
      const line = serverItems.find((l) => l.lineId === lineId);
      if (!line) return;
      const clamped = Math.min(line.stock ?? 99, Math.max(1, quantity));
      const updated = await cartApi.updateCartItem(line.serverId, clamped);
      setServerItems(updated);
      return;
    }

    setGuestItems((current) =>
      current
        .map((line) =>
          line.lineId === lineId
            ? { ...line, quantity: Math.min(line.stock ?? 99, Math.max(1, quantity)) }
            : line
        )
        // Removing via the stepper (quantity < 1) drops the line entirely.
        .filter((line) => line.quantity >= 1)
    );
  }

  async function removeItem(lineId) {
    if (isAuthenticated) {
      const line = serverItems.find((l) => l.lineId === lineId);
      if (!line) return;
      const updated = await cartApi.removeCartItem(line.serverId);
      setServerItems(updated);
      return;
    }

    setGuestItems((current) => current.filter((line) => line.lineId !== lineId));
  }

  async function clearCart() {
    if (isAuthenticated) {
      const updated = await cartApi.clearServerCart();
      setServerItems(updated);
      return;
    }
    setGuestItems([]);
  }

  const itemCount = useMemo(() => items.reduce((sum, line) => sum + line.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, line) => sum + (line.salePrice ?? line.price) * line.quantity, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
    subtotal,
    // Also "loading" for the brief window after login before the server cart is in.
    cartLoading: cartLoading || (isAuthenticated && !serverSynced),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
