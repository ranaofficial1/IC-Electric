import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import * as wishlistApi from "../services/wishlistApi.js";

const WishlistContext = createContext(null);
const STORAGE_KEY = "hale_wishlist_v1";

function readStoredWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Wishlist state — same dual-mode approach as CartContext (see that file's
 * comment for the full reasoning, including why the merge uses a shared
 * in-flight promise rather than a plain ref+cancelled combo — that combo
 * broke under React 18 StrictMode's double effect invocation in
 * development): guest mode stores full product snapshots in localStorage
 * (not just ids — there's no local product catalog to look them back up
 * against anymore now that products come from the API), logged-in mode is
 * backed by `/api/wishlist` and merges the guest list in on login.
 */
export function WishlistProvider({ children }) {
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [guestItems, setGuestItems] = useState(readStoredWishlist);
  const [serverItems, setServerItems] = useState([]);
  const hasMergedRef = useRef(false);
  const syncPromiseRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guestItems));
    } catch {
      // Ignore write failures — wishlist still works for the current session.
    }
  }, [guestItems]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      setServerItems([]);
      hasMergedRef.current = false;
      syncPromiseRef.current = null;
      return;
    }

    let cancelled = false;

    if (!syncPromiseRef.current) {
      syncPromiseRef.current = (async () => {
        if (!hasMergedRef.current) {
          hasMergedRef.current = true;
          const itemsToMerge = guestItems;
          for (const product of itemsToMerge) {
            try {
              // eslint-disable-next-line no-await-in-loop
              await wishlistApi.addWishlistItem(product.id);
            } catch {
              // One item failing shouldn't abort merging the rest.
            }
          }
          if (itemsToMerge.length > 0) setGuestItems([]);
        }
        return wishlistApi.getWishlist();
      })();
    }

    syncPromiseRef.current
      .then((items) => {
        if (!cancelled) setServerItems(items);
      })
      .catch(() => {
        // Network/API hiccup — leave server wishlist empty rather than
        // throw; the user can retry actions which will surface errors.
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  const items = isAuthenticated ? serverItems : guestItems;

  async function toggleWishlist(product) {
    const alreadyIn = items.some((item) => item.id === product.id);

    if (isAuthenticated) {
      const updated = alreadyIn
        ? await wishlistApi.removeWishlistItem(product.id)
        : await wishlistApi.addWishlistItem(product.id);
      setServerItems(updated);
      return;
    }

    setGuestItems((current) =>
      alreadyIn ? current.filter((item) => item.id !== product.id) : [...current, product]
    );
  }

  async function removeItem(productId) {
    if (isAuthenticated) {
      const updated = await wishlistApi.removeWishlistItem(productId);
      setServerItems(updated);
      return;
    }
    setGuestItems((current) => current.filter((item) => item.id !== productId));
  }

  function isWishlisted(productId) {
    return items.some((item) => item.id === productId);
  }

  const value = {
    items,
    productIds: items.map((item) => item.id),
    toggleWishlist,
    removeItem,
    isWishlisted,
    count: items.length,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
