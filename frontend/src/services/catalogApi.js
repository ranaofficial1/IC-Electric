import { api } from "./api.js";

// --- Response normalization -------------------------------------------
// The backend returns snake_case DB rows. Every UI component was written
// against the shape frontend/src/data/{products,categories}.js used to
// provide (camelCase, `category` as a plain slug string, etc). Rather than
// touch every component, these mappers normalize API responses into that
// exact same shape — most components need zero changes, they just now
// receive data from the network instead of a local file.

export function mapProduct(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category_slug,
    categoryName: row.category_name,
    categoryIcon: row.category_icon,
    categoryAccent: row.category_accent,
    // The more specific subcategory slug/name (null when filed directly on `category`).
    subcategory: row.subcategory_slug ?? null,
    subcategoryName: row.subcategory_name ?? null,
    price: Number(row.price),
    salePrice: row.sale_price != null ? Number(row.sale_price) : null,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    isNew: Boolean(row.is_new),
    isBestSeller: Boolean(row.is_best_seller),
    stock: row.stock,
    hasOptions: Boolean(row.has_options),
    image: row.image,
    images: row.images,
    imageOptionValues: row.imageOptionValues,
    description: row.description,
    specs: row.specs,
    options: row.options,
    createdAt: row.created_at,
  };
}

export function mapCategory(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    icon: row.icon,
    accent: row.accent_color,
    image: row.image_url,
    banner: row.banner_url,
    parentId: row.parent_id ?? null,
    parentSlug: row.parent_slug ?? null,
    // Nested subcategories (GET /categories returns top-level categories with
    // `children`; GET /categories/:slug returns direct children + `ancestors`).
    children: (row.children || []).map(mapCategory),
    ancestors: row.ancestors || [],
  };
}

function mapReview(row) {
  const initials = (row.user_name || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const daysAgo = Math.max(0, Math.floor((Date.now() - new Date(row.created_at)) / 86400000));

  return {
    id: row.id,
    name: row.user_name,
    initials,
    rating: row.rating,
    comment: row.comment,
    daysAgo,
  };
}

// --- Requests ------------------------------------------------------------

export async function fetchCategories() {
  const res = await api.get("/categories", { auth: false });
  return res.data.map(mapCategory);
}

export async function fetchCategoryBySlug(slug) {
  const res = await api.get(`/categories/${slug}`, { auth: false });
  return mapCategory(res.data);
}

/**
 * @param {object} filters - same vocabulary as the old filterAndSortProducts():
 *   categorySlugs, query, minPrice, maxPrice, saleOnly, newOnly,
 *   bestSellersOnly, sort, page, limit
 */
export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.categorySlugs?.length) params.set("category", filters.categorySlugs.join(","));
  if (filters.query) params.set("q", filters.query);
  if (typeof filters.minPrice === "number") params.set("minPrice", filters.minPrice);
  if (typeof filters.maxPrice === "number") params.set("maxPrice", filters.maxPrice);
  if (filters.saleOnly) params.set("saleOnly", "true");
  if (filters.newOnly) params.set("newOnly", "true");
  if (filters.bestSellersOnly) params.set("bestSellersOnly", "true");
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page) params.set("page", filters.page);
  if (filters.limit) params.set("limit", filters.limit);

  const res = await api.get(`/products?${params.toString()}`, { auth: false });
  return { products: res.data.map(mapProduct), meta: res.meta };
}

export async function fetchProductBySlug(slug) {
  const res = await api.get(`/products/${slug}`, { auth: false });
  return {
    ...mapProduct(res.data),
    related: res.data.related.map(mapProduct),
    reviews: res.data.reviews.map(mapReview),
  };
}
