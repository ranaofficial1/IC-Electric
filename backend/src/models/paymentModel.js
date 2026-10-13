const pool = require("../config/db");

/** Most recent payment row for an order (createFromCart inserts exactly one
 *  at order-creation time; a retried Razorpay attempt updates that same row
 *  rather than inserting a second one — see attachProviderOrder). */
async function findByOrderId(orderId) {
  const [rows] = await pool.query(
    "SELECT * FROM payments WHERE order_id = ? ORDER BY id DESC LIMIT 1",
    [orderId]
  );
  return rows[0] || null;
}

/** Records that a Razorpay order was created for this payment (before the
 *  shopper has actually paid) — raw_response holds the provider order id/
 *  amount/currency so verify() and the webhook can both refer back to it. */
async function attachProviderOrder(paymentId, { providerOrderId, amount, currency }) {
  await pool.query(
    `UPDATE payments SET provider = 'razorpay', raw_response = ?
     WHERE id = ?`,
    [JSON.stringify({ step: "order_created", providerOrderId, amount, currency }), paymentId]
  );
  return findById(paymentId);
}

async function findById(id) {
  const [rows] = await pool.query("SELECT * FROM payments WHERE id = ?", [id]);
  return rows[0] || null;
}

async function findByProviderOrderId(providerOrderId) {
  // raw_response is a JSON column; MySQL's JSON_EXTRACT lets us look a
  // payment back up by the Razorpay order id the webhook reports, without
  // a dedicated indexed column for it.
  const [rows] = await pool.query(
    `SELECT * FROM payments
     WHERE JSON_UNQUOTE(JSON_EXTRACT(raw_response, '$.providerOrderId')) = ?
     ORDER BY id DESC LIMIT 1`,
    [providerOrderId]
  );
  return rows[0] || null;
}

async function markSucceeded(paymentId, { providerPaymentId, rawResponse }) {
  await pool.query(
    `UPDATE payments SET status = 'succeeded', provider_payment_id = ?, raw_response = ?
     WHERE id = ?`,
    [providerPaymentId, JSON.stringify(rawResponse), paymentId]
  );
}

async function markFailed(paymentId, { rawResponse } = {}) {
  await pool.query(`UPDATE payments SET status = 'failed', raw_response = ? WHERE id = ?`, [
    JSON.stringify(rawResponse || { step: "failed" }),
    paymentId,
  ]);
}

module.exports = {
  findByOrderId,
  findById,
  findByProviderOrderId,
  attachProviderOrder,
  markSucceeded,
  markFailed,
};
