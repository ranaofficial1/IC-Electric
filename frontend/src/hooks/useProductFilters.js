import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../services/catalogApi.js";
import { findCategoryInTree, useCategories } from "../context/CategoriesContext.jsx";

const PAGE_SIZE = 8;

// Static, generous slider bounds rather than a real min/max query against
// the catalog (the backend has no dedicated "price bounds" endpoint, and
// adding one just for a slider's outer limits felt like more than this
// needed — the actual min/maxPrice *filtering* still goes to the server
// and is fully correct either way, this only affects the slider's range).
// A slider left at either end sends no bound at all, so the top end means
// "₹15,000 and above" (air conditioners cost more than the slider's range).
const bounds = { min: 0, max: 15000 };

/**
 * Turns the checked categories into the slugs sent to the API.
 * `selected` holds slugs at any level. A checked category narrows to its
 * checked subcategories (recursively); with none checked it means "everything
 * in this category" — the server expands a slug to all of its descendants.
 */
export function effectiveCategorySlugs(tree, selected, lockedCategory) {
  const pick = (node) => {
    const checked = (node.children || []).filter((c) => selected.includes(c.slug));
    return checked.length > 0 ? checked.flatMap(pick) : [node.slug];
  };

  if (lockedCategory) {
    const root = findCategoryInTree(tree, lockedCategory);
    return root ? pick(root) : [lockedCategory];
  }
  return tree.filter((c) => selected.includes(c.slug)).flatMap(pick);
}

function collectSlugs(node) {
  return [node.slug, ...(node.children || []).flatMap(collectSlugs)];
}

/**
 * Shared filter/sort/pagination state for the Shop, Category and Search
 * pages — now backed by the real `GET /api/products` endpoint instead of
 * the local placeholder catalog. Returns the exact same shape as before
 * (plus `loading`/`error`), so the pages that consume this hook didn't
 * need to change. Reads a handful of query-string shortcuts on first load
 * so links like `/shop?filter=sale` or `/shop?filter=new` (used by the
 * header/home page) land with the right filter already applied.
 *
 * @param {object} options
 * @param {string} [options.lockedCategory] - when set (category pages),
 *   results are always restricted to this category (or subcategory); its own
 *   subcategories are offered as the category-checkbox list instead.
 */
export function useProductFilters({ lockedCategory } = {}) {
  const [searchParams] = useSearchParams();
  const { categories: categoryTree } = useCategories();

  const [selectedCategories, setSelectedCategories] = useState(() =>
    lockedCategory ? [lockedCategory] : []
  );
  const [minPrice, setMinPrice] = useState(bounds.min);
  const [maxPrice, setMaxPrice] = useState(bounds.max);
  const [saleOnly, setSaleOnly] = useState(searchParams.get("filter") === "sale");
  const [newOnly, setNewOnly] = useState(searchParams.get("filter") === "new");
  const [bestSellersOnly, setBestSellersOnly] = useState(
    searchParams.get("filter") === "best-sellers"
  );
  const [sort, setSort] = useState(
    searchParams.get("filter") === "new" ? "newest" : "popularity"
  );
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const [page, setPage] = useState(1);
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Keep the locked category (category pages) in sync if the route param changes.
  useEffect(() => {
    if (lockedCategory) setSelectedCategories([lockedCategory]);
  }, [lockedCategory]);

  const categorySlugs = effectiveCategorySlugs(categoryTree, selectedCategories, lockedCategory);

  const filtersKey = JSON.stringify({
    categorySlugs,
    minPrice,
    maxPrice,
    saleOnly,
    newOnly,
    bestSellersOnly,
    sort,
    query,
  });

  // Any change to the filter/sort criteria resets pagination back to page 1.
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  // Fetches the current page and either replaces (page 1) or appends
  // (loadMore) the results.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchProducts({
      categorySlugs,
      query,
      minPrice: minPrice > bounds.min ? minPrice : undefined,
      maxPrice: maxPrice < bounds.max ? maxPrice : undefined,
      saleOnly,
      newOnly,
      bestSellersOnly,
      sort,
      page,
      limit: PAGE_SIZE,
    })
      .then(({ products, meta }) => {
        if (cancelled) return;
        setResults((prev) => (page === 1 ? products : [...prev, ...products]));
        setTotalCount(meta.total);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load products.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, page]);

  const hasMore = results.length < totalCount;

  // Works at any level. Unchecking a category also unchecks everything beneath it.
  function toggleCategory(slug) {
    if (slug === lockedCategory) return;
    setSelectedCategories((current) => {
      if (!current.includes(slug)) return [...current, slug];
      const node = findCategoryInTree(categoryTree, slug);
      const removed = node ? collectSlugs(node) : [slug];
      return current.filter((c) => !removed.includes(c));
    });
  }

  function clearFilters() {
    setSelectedCategories(lockedCategory ? [lockedCategory] : []);
    setMinPrice(bounds.min);
    setMaxPrice(bounds.max);
    setSaleOnly(false);
    setNewOnly(false);
    setBestSellersOnly(false);
    setSort("popularity");
  }

  const activeFilterCount =
    selectedCategories.filter((slug) => slug !== lockedCategory).length +
    (minPrice > bounds.min || maxPrice < bounds.max ? 1 : 0) +
    (saleOnly ? 1 : 0) +
    (newOnly ? 1 : 0) +
    (bestSellersOnly ? 1 : 0);

  return {
    bounds,
    selectedCategories,
    toggleCategory,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    saleOnly,
    setSaleOnly,
    newOnly,
    setNewOnly,
    bestSellersOnly,
    setBestSellersOnly,
    sort,
    setSort,
    query,
    setQuery,
    results,
    totalCount,
    loading,
    error,
    hasMore,
    loadMore: () => setPage((p) => p + 1),
    clearFilters,
    activeFilterCount,
  };
}
