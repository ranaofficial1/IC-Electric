const express = require("express");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const ApiError = require("../utils/ApiError");
const uploadController = require("../controllers/uploadController");

const router = express.Router();

// The photo is sent as the raw request body (Content-Type: image/*) — no
// multipart library needed. 4 MB keeps it under serverless body limits.
const MAX_BYTES = 4 * 1024 * 1024;
const rawImage = express.raw({
  type: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  limit: MAX_BYTES,
});

function parseImageBody(req, res, next) {
  rawImage(req, res, (err) => {
    if (!err) return next();
    if (err.type === "entity.too.large") return next(new ApiError(413, "Photo is too large (max 4 MB)."));
    return next(new ApiError(400, "Couldn't read the uploaded photo."));
  });
}

// Clean-up of photos nothing uses any more (admin only). Declared before "/:id".
router.get("/unused", requireAuth, requireAdmin, uploadController.unusedSummary);
router.delete("/unused", requireAuth, requireAdmin, uploadController.deleteUnused);

router.get("/:id", uploadController.serve);
router.post("/", requireAuth, requireAdmin, parseImageBody, uploadController.upload);

module.exports = router;
