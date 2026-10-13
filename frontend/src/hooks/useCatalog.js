import { useEffect, useMemo, useState } from "react";
import { fetchProductBySlug, fetchProducts } from "../services/catalogApi.js";

/**
 * Fetches a product list from `GET /api/products` (same filter vocabulary as
 * fetchProducts). Re-fetches when the filters change; set `enabled: false` to
 * wait (e.g. until the category tree has loaded). Ignores stale responses.
 *
 * @returns {{ products: object[], total: number, loading: boolean, error: string }}
 */
export function useProductList(filters, { enabled = true } = {}) {
  const key = JSON.stringify(filters);
  const [state, setState] = useState({ products: [], total: 0, loading: enabled, error: "" });

  useEffect(() => {
    if (!enabled) {
      setState((s) => (s.loading ? { ...s, loading: false } : s));
      return undefined;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: "" }));

    fetchProducts(JSON.parse(key))
      .then(({ products, meta }) => {
        if (!cancelled) setState({ products, total: meta?.total ?? products.length, loading: false, error: "" });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ products: [], total: 0, loading: false, error: err.message || "Couldn't load products." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [key, enabled]);

  return state;
}

/** Fetches one product by slug. `product` is null while loading or if it doesn't exist. */
export function useProduct(slug) {
  const [state, setState] = useState({ product: null, loading: Boolean(slug) });

  useEffect(() => {
    if (!slug) {
      setState({ product: null, loading: false });
      return undefined;
    }
    let cancelled = false;
    setState({ product: null, loading: true });

    fetchProductBySlug(slug)
      .then((product) => {
        if (!cancelled) setState({ product, loading: false });
      })
      .catch(() => {
        if (!cancelled) setState({ product: null, loading: false });
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return state;
}

/**
 * Real numbers for a collection's tiles: for every product under `rootSlug`,
 * grouped by the subcategory it is filed under -> { count, minPrice }.
 * (One request for the whole root category, not one per tile.)
 */
export function useCollectionStats(rootSlug, { enabled = true } = {}) {
  const filters = useMemo(() => ({ categorySlugs: [rootSlug], limit: 100 }), [rootSlug]);
  const { products, loading } = useProductList(filters, { enabled: enabled && Boolean(rootSlug) });

  const bySubcategory = useMemo(() => {
    const stats = {};
    for (const p of products) {
      const key = p.subcategory || p.category;
      const price = p.salePrice ?? p.price;
      const entry = stats[key] || { count: 0, minPrice: Infinity };
      entry.count += 1;
      entry.minPrice = Math.min(entry.minPrice, price);
      stats[key] = entry;
    }
    return stats;
  }, [products]);

  return { stats: bySubcategory, loading };
}
