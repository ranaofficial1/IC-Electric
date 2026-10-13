const pool = require("../config/db");

async function listForUser(userId) {
  const [rows] = await pool.query(
    "SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC",
    [userId]
  );
  return rows;
}

async function findById(id, userId) {
  const [rows] = await pool.query("SELECT * FROM addresses WHERE id = ? AND user_id = ? LIMIT 1", [
    id,
    userId,
  ]);
  return rows[0] || null;
}

async function create(userId, data) {
  if (data.isDefault) await clearDefault(userId);

  const [result] = await pool.query(
    `INSERT INTO addresses
      (user_id, label, full_name, phone, line1, line2, city, state, postal_code, country, is_default)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      data.label || "Home",
      data.fullName,
      data.phone,
      data.line1,
      data.line2 || null,
      data.city,
      data.state,
      data.postalCode,
      data.country || "India",
      data.isDefault ? 1 : 0,
    ]
  );
  return findById(result.insertId, userId);
}

async function update(id, userId, data) {
  if (data.isDefault) await clearDefault(userId);

  await pool.query(
    `UPDATE addresses SET
      label = ?, full_name = ?, phone = ?, line1 = ?, line2 = ?,
      city = ?, state = ?, postal_code = ?, country = ?, is_default = ?
     WHERE id = ? AND user_id = ?`,
    [
      data.label || "Home",
      data.fullName,
      data.phone,
      data.line1,
      data.line2 || null,
      data.city,
      data.state,
      data.postalCode,
      data.country || "India",
      data.isDefault ? 1 : 0,
      id,
      userId,
    ]
  );
  return findById(id, userId);
}

async function remove(id, userId) {
  await pool.query("DELETE FROM addresses WHERE id = ? AND user_id = ?", [id, userId]);
}

async function clearDefault(userId) {
  await pool.query("UPDATE addresses SET is_default = 0 WHERE user_id = ?", [userId]);
}

module.exports = { listForUser, findById, create, update, remove };
