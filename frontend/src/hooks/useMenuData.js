import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../services/catalogApi.js";
import { useCategories } from "../context/CategoriesContext.jsx";
import { collectionContent } from "../config/collectionContent.js";

// Mega-menu data. Products come from the existing GET /products endpoint and
// are cached per category slug for the session, so hovering back and forth
// never re-requests, and prefetch() lets the header warm a menu on hover.
const cache = new Map(); // key -> { status, products, promise }

function load(slug) {
  const key = slug || "__all__";
  let entry = cache.get(key);
  if (!entry) {
    entry = { status: "loading", products: [], promise: null };
    entry.promise = fetchProducts({ categorySlugs: slug ? [slug] : [], limit: 100 })
      .then(({ products }) => {
        entry.status = "ready";
        entry.products = products;
      })
      .catch(() => {
        // Allow a retry on the next hover instead of caching the failure forever.
        cache.delete(key);
        entry.status = "error";
      });
    cache.set(key, entry);
  }
  return entry;
}

export function prefetchMenuProducts(slug) {
  load(slug);
}

/** Products under a category (or the whole catalog when slug is falsy). */
export function useMenuProducts(slug, enabled = true) {
  const [, force] = useState(0);
  const entry = enabled ? load(slug) : null;

  useEffect(() => {
    if (!entry || entry.status !== "loading") return undefined;
    let alive = true;
    entry.promise.then(() => alive && force((n) => n + 1));
    return () => {
      alive = false;
    };
  }, [entry, slug]);

  return {
    products: entry?.products || [],
    loading: !entry || entry.status === "loading",
    failed: entry?.status === "error",
  };
}

const priceOf = (p) => p.salePrice ?? p.price;

/** { [subcategorySlug|categorySlug]: { count, minPrice } } for a product list. */
export function summarize(products) {
  const stats = {};
  for (const p of products) {
    for (const key of new Set([p.subcategory, p.category].filter(Boolean))) {
      const s = stats[key] || { count: 0, minPrice: Infinity };
      s.count += 1;
      s.minPrice = Math.min(s.minPrice, priceOf(p));
      stats[key] = s;
    }
  }
  return stats;
}

export function productsIn(products, slug) {
  return products.filter((p) => p.subcategory === slug || p.category === slug);
}

/** Best available picture for a category node: admin image > curated > a product photo. */
export function imageFor(node, products = []) {
  if (!node) return null;
  const curated = collectionContent(node.slug).image;
  if (node.image) return node.image;
  if (curated) return curated;
  const kid = (node.children || []).map((c) => collectionContent(c.slug).image || c.image).find(Boolean);
  if (kid) return kid;
  return productsIn(products, node.slug).find((p) => p.image)?.image || null;
}

/** Category node by slug + its children, from the shared categories context. */
export function useMenuCategory(slug) {
  const { findCategory, categories, loading } = useCategories();
  return useMemo(
    () => ({ node: slug ? findCategory(slug) : null, categories, loading }),
    [slug, findCategory, categories, loading]
  );
}
