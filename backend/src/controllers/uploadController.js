const crypto = require("crypto");
const pool = require("../config/db");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

// The file type is decided from the file's own first bytes, never from the
// request header or file name, so only real JPEG/PNG/WebP/GIF images get stored.
// (SVG is deliberately not allowed — it can carry scripts.)
function detectImageType(buf) {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  const head6 = buf.slice(0, 6).toString("latin1");
  if (head6 === "GIF87a" || head6 === "GIF89a") return "image/gif";
  if (buf.slice(0, 4).toString("latin1") === "RIFF" && buf.slice(8, 12).toString("latin1") === "WEBP") {
    return "image/webp";
  }
  return null;
}

// Absolute URL, because the storefront runs on a different origin than the API.
// Set PUBLIC_API_URL (e.g. https://api.yourshop.com) to pin it; otherwise it is
// derived from the request.
function publicBaseUrl(req) {
  if (process.env.PUBLIC_API_URL) return process.env.PUBLIC_API_URL.replace(/\/+$/, "");
  const proto = String(req.get("x-forwarded-proto") || req.protocol).split(",")[0].trim();
  return `${proto}://${req.get("host")}`;
}

const upload = asyncHandler(async (req, res) => {
  const buf = req.body;
  if (!Buffer.isBuffer(buf) || buf.length === 0) {
    throw new ApiError(415, "Send the photo as a JPEG, PNG, WebP or GIF file.");
  }
  const mimeType = detectImageType(buf);
  if (!mimeType) {
    throw new ApiError(415, "That file isn't a valid JPEG, PNG, WebP or GIF image.");
  }

  const id = crypto.randomBytes(16).toString("hex");
  await pool.query("INSERT INTO uploaded_images (id, mime_type, size_bytes, data) VALUES (?, ?, ?, ?)", [
    id,
    mimeType,
    buf.length,
    buf,
  ]);

  res.status(201).json({
    success: true,
    data: { id, url: `${publicBaseUrl(req)}/api/uploads/${id}` },
  });
});

const serve = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!/^[a-f0-9]{32}$/.test(id)) throw new ApiError(404, "Image not found.");

  const [rows] = await pool.query("SELECT mime_type, data FROM uploaded_images WHERE id = ?", [id]);
  if (rows.length === 0) throw new ApiError(404, "Image not found.");

  res.set({
    "Content-Type": rows[0].mime_type,
    // The id is random and never reused, so the bytes behind it never change.
    "Cache-Control": "public, max-age=31536000, immutable",
    // helmet() defaults this to same-origin, which would stop the storefront
    // (a different origin) from displaying the photo.
    "Cross-Origin-Resource-Policy": "cross-origin",
  });
  res.send(rows[0].data);
});

// "Unused" = not referenced by any product photo or category image/banner.
// Photos from the last hour are never counted, so one that was just uploaded
// for a product that hasn't been saved yet can't be cleaned up by mistake.
const UNUSED_WHERE = `
  ui.created_at < (NOW() - INTERVAL 1 HOUR)
  AND NOT EXISTS (SELECT 1 FROM product_images pi WHERE pi.url LIKE CONCAT('%/api/uploads/', ui.id))
  AND NOT EXISTS (
    SELECT 1 FROM categories c
    WHERE c.image_url LIKE CONCAT('%/api/uploads/', ui.id)
       OR c.banner_url LIKE CONCAT('%/api/uploads/', ui.id)
  )`;

const unusedSummary = asyncHandler(async (req, res) => {
  const [[row]] = await pool.query(
    `SELECT COUNT(*) AS count, COALESCE(SUM(ui.size_bytes), 0) AS bytes
     FROM uploaded_images ui WHERE ${UNUSED_WHERE}`
  );
  res.json({ success: true, data: { count: Number(row.count), bytes: Number(row.bytes) } });
});

const deleteUnused = asyncHandler(async (req, res) => {
  const [result] = await pool.query(`DELETE ui FROM uploaded_images ui WHERE ${UNUSED_WHERE}`);
  res.json({ success: true, data: { deleted: result.affectedRows } });
});

module.exports = { upload, serve, unusedSummary, deleteUnused };
