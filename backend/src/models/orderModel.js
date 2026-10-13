const pool = require("../config/db");
const ApiError = require("../utils/ApiError");
const generateOrderNumber = require("../utils/generateOrderNumber");
const couponModel = require("./couponModel");

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 79;

/**
 * Creates an order from the user's current cart inside a single
 * transaction: validates stock, computes totals (mirroring the frontend's
 * Cart.jsx math — same thresholds), snapshots line items, decrements
 * stock, applies/records the coupon, clears the cart, and creates a
 * matching (pending) payment row for the chosen provider.
 */
async function createFromCart(userId, { shippingAddressId, billingAddressId, couponCode, paymentProvider = "cod", notes }) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [cartRows] = await connection.query(
      `SELECT ci.id, ci.product_id, ci.quantity, ci.selected_options,
              p.name, p.price, p.sale_price, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = ?
       FOR UPDATE`,
      [userId]
    );

    if (cartRows.length === 0) {
      throw new ApiError(400, "Your cart is empty.");
    }

    for (const item of cartRows) {
      if (item.stock < item.quantity) {
        throw new ApiError(409, `${item.name} only has ${item.stock} left in stock.`);
      }
    }

    const subtotal = cartRows.reduce(
      (sum, item) => sum + Number(item.sale_price ?? item.price) * item.quantity,
      0
    );

    let discount = 0;
    let appliedCoupon = null;
    if (couponCode) {
      const coupon = await couponModel.findByCode(couponCode);
      const { valid, reason } = couponModel.checkValidity(coupon, subtotal);
      if (!valid) throw new ApiError(400, reason || "Invalid coupon.");
      discount =
        coupon.type === "percent" ? Math.round(subtotal * (coupon.value / 100)) : Number(coupon.value);
      discount = Math.min(discount, subtotal);
      appliedCoupon = coupon;
    }

    const shippingFee = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal - discount + shippingFee;

    let orderNumber = generateOrderNumber();
    const [orderResult] = await connection.query(
      `INSERT INTO orders
        (order_number, user_id, subtotal, discount, shipping_fee, total, coupon_code,
         shipping_address_id, billing_address_id, customer_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        userId,
        subtotal,
        discount,
        shippingFee,
        total,
        appliedCoupon ? appliedCoupon.code : null,
        shippingAddressId,
        billingAddressId || shippingAddressId,
        notes || null,
      ]
    );
    const orderId = orderResult.insertId;

    for (const item of cartRows) {
  const unitPrice = Number(item.sale_price ?? item.price);

  const selectedOptions =
    item.selected_options == null
      ? null
      : typeof item.selected_options === "string"
        ? item.selected_options
        : JSON.stringify(item.selected_options);

  await connection.query(
    `INSERT INTO order_items
      (order_id, product_id, product_name, unit_price, quantity, selected_options, line_total)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      orderId,
      item.product_id,
      item.name,
      unitPrice,
      item.quantity,
      selectedOptions,
      unitPrice * item.quantity,
    ]
  );

  await connection.query(
    "UPDATE products SET stock = stock - ? WHERE id = ?",
    [item.quantity, item.product_id]
  );
}

    await connection.query(
      "INSERT INTO payments (order_id, provider, amount, status) VALUES (?, ?, ?, 'pending')",
      [orderId, paymentProvider, total]
    );

    if (appliedCoupon) {
      await connection.query("UPDATE coupons SET used_count = used_count + 1 WHERE id = ?", [
        appliedCoupon.id,
      ]);
    }

    await connection.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);

    await connection.commit();
    return findById(orderId);
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function findById(id, userId = null) {
  const where = userId ? "WHERE o.id = ? AND o.user_id = ?" : "WHERE o.id = ?";
  const params = userId ? [id, userId] : [id];

  const [orders] = await pool.query(
    `SELECT o.*, sa.full_name AS shipping_name, sa.line1 AS shipping_line1,
        sa.city AS shipping_city, sa.state AS shipping_state, sa.postal_code AS shipping_postal_code,
        u.name AS customer_name, u.email AS customer_email
     FROM orders o
     LEFT JOIN addresses sa ON sa.id = o.shipping_address_id
     JOIN users u ON u.id = o.user_id
     ${where}`,
    params
  );
  const order = orders[0];
  if (!order) return null;

  const [items] = await pool.query("SELECT * FROM order_items WHERE order_id = ?", [order.id]);
  const [shipmentRows] = await pool.query(
    "SELECT * FROM shipments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1",
    [order.id]
  );
  // Phase 8: expose the latest payment row (provider/status) so the
  // frontend can offer "Complete Payment" for a Razorpay order that's
  // still pending, without a separate round-trip.
  const [paymentRows] = await pool.query(
    "SELECT id, provider, status, provider_payment_id, amount FROM payments WHERE order_id = ? ORDER BY id DESC LIMIT 1",
    [order.id]
  );

  return {
    ...order,
    items: items.map((i) => {
  let selectedOptions = i.selected_options;

  if (!selectedOptions) {
    selectedOptions = null;
  } else if (typeof selectedOptions === "string") {
    try {
      selectedOptions = JSON.parse(selectedOptions);
    } catch (error) {
      console.error(
        "Invalid order item selected_options JSON:",
        selectedOptions
      );
      selectedOptions = null;
    }
  }

  return {
    ...i,
    selected_options: selectedOptions,
  };
}),
    shipment: shipmentRows[0] || null,
    payment: paymentRows[0] || null,
  };
}

async function listForUser(userId) {
  const [rows] = await pool.query(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return rows;
}

async function listAll({ status, page = 1, limit = 20 } = {}) {
  const where = status ? "WHERE status = ?" : "";
  const params = status ? [status] : [];
  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `SELECT o.*, u.name AS customer_name, u.email AS customer_email
     FROM orders o JOIN users u ON u.id = o.user_id
     ${where}
     ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const [[{ count }]] = await pool.query(`SELECT COUNT(*) AS count FROM orders ${where}`, params);
  return { rows, total: count };
}

async function updateStatus(id, status) {
  await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
  return findById(id);
}

async function updatePaymentStatus(id, paymentStatus) {
  await pool.query("UPDATE orders SET payment_status = ? WHERE id = ?", [paymentStatus, id]);
  return findById(id);
}

async function upsertShipment(orderId, { carrier, trackingNumber, status }) {
  const [existing] = await pool.query(
    "SELECT id FROM shipments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1",
    [orderId]
  );

  if (existing[0]) {
    await pool.query(
      "UPDATE shipments SET carrier = ?, tracking_number = ?, status = ? WHERE id = ?",
      [carrier, trackingNumber, status, existing[0].id]
    );
  } else {
    await pool.query(
      "INSERT INTO shipments (order_id, carrier, tracking_number, status) VALUES (?, ?, ?, ?)",
      [orderId, carrier, trackingNumber, status]
    );
  }
  return findById(orderId);
}

module.exports = {
  createFromCart,
  findById,
  listForUser,
  listAll,
  updateStatus,
  updatePaymentStatus,
  upsertShipment,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
};
