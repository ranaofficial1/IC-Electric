const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

const SELECT_CART = `
  SELECT ci.id, ci.product_id, ci.quantity, ci.selected_options, ci.created_at,
    p.slug, p.name, p.price, p.sale_price, p.stock,
    c.slug AS category_slug, c.name AS category_name,
    c.icon AS category_icon, c.accent_color AS category_accent,
    (SELECT pi.url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order ASC LIMIT 1) AS image
  FROM cart_items ci
  JOIN products p ON p.id = ci.product_id
  JOIN categories c ON c.id = p.category_id
  WHERE ci.user_id = ?
  ORDER BY ci.created_at ASC
`;

function normalizeOptions(selectedOptions) {
  if (!selectedOptions || Object.keys(selectedOptions).length === 0) return null;
  // Sort keys so the same variant selection always serializes identically,
  // which is how we detect "same line" for merge-on-add below.
  const sorted = Object.fromEntries(Object.entries(selectedOptions).sort(([a], [b]) => a.localeCompare(b)));
  return JSON.stringify(sorted);
}

async function getForUser(userId) {
  const [rows] = await pool.query(SELECT_CART, [userId]);

  return rows.map((row) => {
    let selectedOptions = row.selected_options;

    if (!selectedOptions) {
      selectedOptions = null;
    } else if (typeof selectedOptions === "string") {
      try {
        selectedOptions = JSON.parse(selectedOptions);
      } catch (error) {
        console.error("Invalid selected_options JSON:", selectedOptions);
        selectedOptions = null;
      }
    }

    return {
      ...row,
      selected_options: selectedOptions,
    };
  });
}

async function addItem(userId, productId, quantity, selectedOptions) {
  const optionsJson = normalizeOptions(selectedOptions);

  const [existing] = await pool.query(
    `SELECT id, quantity FROM cart_items
     WHERE user_id = ? AND product_id = ?
       AND (selected_options <=> CAST(? AS JSON))`,
    [userId, productId, optionsJson]
  );

  const [[stockRow]] = await pool.query("SELECT stock, name FROM products WHERE id = ?", [productId]);
  const alreadyInCart = existing[0] ? existing[0].quantity : 0;
  if (stockRow && alreadyInCart + quantity > stockRow.stock) {
    throw new ApiError(
      409,
      alreadyInCart > 0
        ? `Only ${stockRow.stock} of ${stockRow.name} in stock — you already have ${alreadyInCart} in your cart.`
        : `Only ${stockRow.stock} of ${stockRow.name} left in stock.`
    );
  }

  if (existing[0]) {
    await pool.query("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?", [
      quantity,
      existing[0].id,
    ]);
  } else {
    await pool.query(
      "INSERT INTO cart_items (user_id, product_id, quantity, selected_options) VALUES (?, ?, ?, CAST(? AS JSON))",
      [userId, productId, quantity, optionsJson]
    );
  }

  return getForUser(userId);
}

async function updateQuantity(userId, itemId, quantity) {
  const [[line]] = await pool.query(
    `SELECT p.stock, p.name FROM cart_items ci JOIN products p ON p.id = ci.product_id
     WHERE ci.id = ? AND ci.user_id = ?`,
    [itemId, userId]
  );
  if (line && quantity > line.stock) {
    throw new ApiError(409, `Only ${line.stock} of ${line.name} in stock.`);
  }
  await pool.query("UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?", [
    quantity,
    itemId,
    userId,
  ]);
  return getForUser(userId);
}

async function removeItem(userId, itemId) {
  await pool.query("DELETE FROM cart_items WHERE id = ? AND user_id = ?", [itemId, userId]);
  return getForUser(userId);
}

async function clearCart(userId) {
  await pool.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
}

module.exports = { getForUser, addItem, updateQuantity, removeItem, clearCart };
