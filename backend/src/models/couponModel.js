const pool = require("../config/db");

async function findByCode(code) {
  const [rows] = await pool.query("SELECT * FROM coupons WHERE code = ? LIMIT 1", [
    code.toUpperCase(),
  ]);
  return rows[0] || null;
}

async function list() {
  const [rows] = await pool.query("SELECT * FROM coupons ORDER BY created_at DESC");
  return rows;
}

async function create(data) {
  const [result] = await pool.query(
    `INSERT INTO coupons
      (code, type, value, min_order_amount, usage_limit, starts_at, expires_at, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.code.toUpperCase(),
      data.type,
      data.value,
      data.minOrderAmount ?? null,
      data.usageLimit ?? null,
      data.startsAt ?? null,
      data.expiresAt ?? null,
      data.isActive === false ? 0 : 1,
    ]
  );
  const [rows] = await pool.query("SELECT * FROM coupons WHERE id = ?", [result.insertId]);
  return rows[0];
}

async function update(id, data) {
  await pool.query(
    `UPDATE coupons SET
      code = ?, type = ?, value = ?, min_order_amount = ?, usage_limit = ?,
      starts_at = ?, expires_at = ?, is_active = ?
     WHERE id = ?`,
    [
      data.code.toUpperCase(),
      data.type,
      data.value,
      data.minOrderAmount ?? null,
      data.usageLimit ?? null,
      data.startsAt ?? null,
      data.expiresAt ?? null,
      data.isActive === false ? 0 : 1,
      id,
    ]
  );
  const [rows] = await pool.query("SELECT * FROM coupons WHERE id = ?", [id]);
  return rows[0];
}

async function remove(id) {
  await pool.query("DELETE FROM coupons WHERE id = ?", [id]);
}

async function incrementUsage(id) {
  await pool.query("UPDATE coupons SET used_count = used_count + 1 WHERE id = ?", [id]);
}

/** Validates a coupon against the current date, usage limit and order subtotal. */
function checkValidity(coupon, subtotal) {
  if (!coupon || !coupon.is_active) return { valid: false, reason: "Coupon not found." };

  const now = new Date();
  if (coupon.starts_at && now < new Date(coupon.starts_at)) {
    return { valid: false, reason: "This coupon isn't active yet." };
  }
  if (coupon.expires_at && now > new Date(coupon.expires_at)) {
    return { valid: false, reason: "This coupon has expired." };
  }
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return { valid: false, reason: "This coupon has reached its usage limit." };
  }
  if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
    return {
      valid: false,
      reason: `Minimum order amount for this coupon is ₹${coupon.min_order_amount}.`,
    };
  }
  return { valid: true };
}

module.exports = { findByCode, list, create, update, remove, incrementUsage, checkValidity };
