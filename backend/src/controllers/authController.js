const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { signToken } = require("../utils/token");
const userModel = require("../models/userModel");
const pool = require("../config/db");

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await userModel.findByEmail(email);
  if (existing) throw new ApiError(409, "An account with this email already exists.");

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const userId = await userModel.create({ name, email, passwordHash, phone });
  const user = await userModel.findById(userId);
  const token = signToken(user);

  res.status(201).json({ success: true, data: { user, token } });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findByEmail(email);
  if (!user) throw new ApiError(401, "Invalid email or password.");
  if (user.status === "disabled") throw new ApiError(403, "This account has been disabled.");

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) throw new ApiError(401, "Invalid email or password.");

  const token = signToken(user);
  const { password_hash, ...safeUser } = user;

  res.json({ success: true, data: { user: safeUser, token } });
});

// Stateless JWTs can't be server-invalidated without a blocklist; the
// frontend just discards the token. This endpoint exists so the API shape
// matches the spec and gives a clean place to add token revocation later.
const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: "Logged out." });
});

const me = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found.");
  res.json({ success: true, data: user });
});

// Issues a reset token (stored hashed, 1 hour expiry). There's no email
// service wired up yet, so the raw token is returned in the response for
// local/dev testing only — swap this for a real email send before
// production and stop returning the token in the API response.
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findByEmail(email);

  // Always respond success (don't reveal whether the email exists).
  if (!user) {
    return res.json({
      success: true,
      message: "If an account exists for that email, a reset link has been sent.",
    });
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await pool.query(
    "INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)",
    [user.id, tokenHash, expiresAt]
  );

  res.json({
    success: true,
    message: "If an account exists for that email, a reset link has been sent.",
    // DEV ONLY — remove once real email sending is wired up (see note above).
    devResetToken: process.env.NODE_ENV !== "production" ? rawToken : undefined,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const [rows] = await pool.query(
    "SELECT * FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW() LIMIT 1",
    [tokenHash]
  );
  const resetRow = rows[0];
  if (!resetRow) throw new ApiError(400, "This reset link is invalid or has expired.");

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await userModel.updatePassword(resetRow.user_id, passwordHash);
  await pool.query("UPDATE password_resets SET used_at = NOW() WHERE id = ?", [resetRow.id]);

  res.json({ success: true, message: "Password updated. You can now log in." });
});

// For an already-logged-in user changing their password from Account
// Settings (as opposed to resetPassword, which is for the "forgot
// password" email-link flow and doesn't require knowing the old password).
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await userModel.findByIdWithHash(req.user.id);
  if (!user) throw new ApiError(404, "User not found.");

  const matches = await bcrypt.compare(currentPassword, user.password_hash);
  if (!matches) throw new ApiError(401, "Current password is incorrect.");

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await userModel.updatePassword(user.id, passwordHash);

  res.json({ success: true, message: "Password updated." });
});

module.exports = { register, login, logout, me, forgotPassword, resetPassword, changePassword };
