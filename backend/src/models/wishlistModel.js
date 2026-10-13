const pool = require("../config/db");

const SELECT_WISHLIST = `
  SELECT wi.id, wi.product_id, wi.created_at,
    p.slug, p.name, p.price, p.sale_price, p.stock,
    c.slug AS category_slug, c.name AS category_name,
    c.icon AS category_icon, c.accent_color AS category_accent,
    (SELECT pi.url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order ASC LIMIT 1) AS image,
    EXISTS(SELECT 1 FROM product_options po WHERE po.product_id = p.id) AS has_options
  FROM wishlist_items wi
  JOIN products p ON p.id = wi.product_id
  JOIN categories c ON c.id = p.category_id
  WHERE wi.user_id = ?
  ORDER BY wi.created_at DESC
`;

async function getForUser(userId) {
  const [rows] = await pool.query(SELECT_WISHLIST, [userId]);
  return rows;
}

async function addItem(userId, productId) {
  await pool.query(
    "INSERT IGNORE INTO wishlist_items (user_id, product_id) VALUES (?, ?)",
    [userId, productId]
  );
  return getForUser(userId);
}

async function removeItem(userId, productId) {
  await pool.query("DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?", [
    userId,
    productId,
  ]);
  return getForUser(userId);
}

module.exports = { getForUser, addItem, removeItem };
