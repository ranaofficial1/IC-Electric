import { api } from "./api.js";

function mapCartItem(row) {
  return {
    lineId: `server-${row.id}`,
    serverId: row.id,
    productId: row.product_id,
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
    selectedOptions: row.selected_options || {},
    quantity: row.quantity,
  };
}

function mapItems(res) {
  return res.data.items.map(mapCartItem);
}

export async function getCart() {
  const res = await api.get("/cart");
  return mapItems(res);
}

export async function addCartItem(productId, quantity, selectedOptions) {
  const res = await api.post("/cart/items", { productId, quantity, selectedOptions });
  return mapItems(res);
}

export async function updateCartItem(serverId, quantity) {
  const res = await api.put(`/cart/items/${serverId}`, { quantity });
  return mapItems(res);
}

export async function removeCartItem(serverId) {
  const res = await api.delete(`/cart/items/${serverId}`);
  return mapItems(res);
}

export async function clearServerCart() {
  const res = await api.delete("/cart");
  return mapItems(res);
}
