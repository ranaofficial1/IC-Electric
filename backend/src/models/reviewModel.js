const pool = require("../config/db");

async function listForProduct(productId, { status = "approved" } = {}) {
  const [rows] = await pool.query(
    `SELECT r.id, r.rating, r.comment, r.status, r.created_at, u.name AS user_name
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.product_id = ? AND r.status = ?
     ORDER BY r.created_at DESC`,
    [productId, status]
  );
  return rows;
}

async function listAll({ status } = {}) {
  const where = status ? "WHERE r.status = ?" : "";
  const params = status ? [status] : [];
  const [rows] = await pool.query(
    `SELECT r.*, u.name AS user_name, p.name AS product_name, p.slug AS product_slug
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     JOIN products p ON p.id = r.product_id
     ${where}
     ORDER BY r.created_at DESC`,
    params
  );
  return rows;
}

async function create({ productId, userId, rating, comment }) {
  const [result] = await pool.query(
    "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
    [productId, userId, rating, comment || null]
  );
  const [rows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [result.insertId]);
  return rows[0];
}

async function setStatus(id, status) {
  await pool.query("UPDATE reviews SET status = ? WHERE id = ?", [status, id]);
  const [rows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [id]);
  return rows[0];
}

async function remove(id) {
  await pool.query("DELETE FROM reviews WHERE id = ?", [id]);
}

async function findById(id) {
  const [rows] = await pool.query("SELECT * FROM reviews WHERE id = ?", [id]);
  return rows[0] || null;
}

module.exports = { listForProduct, listAll, create, setStatus, remove, findById };
