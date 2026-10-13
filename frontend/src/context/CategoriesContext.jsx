import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchCategories } from "../services/catalogApi.js";

const CategoriesContext = createContext(null);

/** Finds a category/subcategory anywhere in a nested tree by slug. */
export function findCategoryInTree(tree, slug) {
  for (const node of tree) {
    if (node.slug === slug) return node;
    const hit = findCategoryInTree(node.children || [], slug);
    if (hit) return hit;
  }
  return null;
}

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await fetchCategories();
        if (!cancelled) setCategories(data);
      } catch (err) {
        if (!cancelled) setError(err.message || "Couldn't load categories.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // `categories` = top-level categories, each with nested `children`
  // (subcategories). Existing consumers only render the top level, so they
  // are unaffected; subcategory-aware UI reads `children`.
  const value = useMemo(
    () => ({
      categories,
      loading,
      error,
      findCategory: (slug) => findCategoryInTree(categories, slug),
    }),
    [categories, loading, error]
  );

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useCategories must be used within a CategoriesProvider");
  return ctx;
}
