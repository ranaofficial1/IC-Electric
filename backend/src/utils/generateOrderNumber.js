// Generates a human-friendly, reasonably-unique order number like
// "HALE-20260911-4F7K". Not a strict uniqueness guarantee on its own — the
// `orders.order_number` column has a UNIQUE constraint as the real backstop,
// and orderModel retries once on a rare collision.
function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `HALE-${y}${m}${d}-${random}`;
}

module.exports = generateOrderNumber;
