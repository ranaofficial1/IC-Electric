const pool = require("../config/db");

async function create({ name, email, passwordHash, phone = null, role = "customer" }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)",
    [name, email, passwordHash, phone, role]
  );
  return result.insertId;
}

async function findByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(
    "SELECT id, name, email, phone, role, status, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

// Internal use only (e.g. verifying current password before a change) —
// includes password_hash, unlike findById. Never return this row directly
// from an API response.
async function findByIdWithHash(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
}

async function updateProfile(id, { name, phone }) {
  await pool.query("UPDATE users SET name = ?, phone = ? WHERE id = ?", [name, phone, id]);
  return findById(id);
}

async function updatePassword(id, passwordHash) {
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, id]);
}

async function list({ page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    "SELECT id, name, email, phone, role, status, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?",
    [limit, offset]
  );
  const [[{ count }]] = await pool.query("SELECT COUNT(*) AS count FROM users");
  return { rows, total: count };
}

async function setStatus(id, status) {
  await pool.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);
}

module.exports = {
  create,
  findByEmail,
  findById,
  findByIdWithHash,
  updateProfile,
  updatePassword,
  list,
  setStatus,
};
