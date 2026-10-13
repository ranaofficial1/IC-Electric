const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const wishlistController = require("../controllers/wishlistController");

const router = express.Router();

router.use(requireAuth);

router.get("/", wishlistController.getWishlist);
router.post(
  "/items",
  [body("productId").isInt().withMessage("productId is required."), validate],
  wishlistController.addItem
);
router.delete("/items/:productId", wishlistController.removeItem);

module.exports = router;
