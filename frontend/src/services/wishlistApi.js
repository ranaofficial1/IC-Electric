import { api } from "./api.js";

function mapWishlistItem(row) {
  return {
    id: row.product_id,
    slug: row.slug,
    name: row.name,
    image: row.image,
    category: row.category_slug,
    categoryName: row.category_name,
    categoryIcon: row.category_icon,
    categoryAccent: row.category_accent,
    price: Number(row.price),
    salePrice: row.sale_price != null ? Number(row.sale_price) : null,
    stock: row.stock,
    hasOptions: Boolean(row.has_options),
  };
}

export async function getWishlist() {
  const res = await api.get("/wishlist");
  return res.data.map(mapWishlistItem);
}

export async function addWishlistItem(productId) {
  const res = await api.post("/wishlist/items", { productId });
  return res.data.map(mapWishlistItem);
}

export async function removeWishlistItem(productId) {
  const res = await api.delete(`/wishlist/items/${productId}`);
  return res.data.map(mapWishlistItem);
}
