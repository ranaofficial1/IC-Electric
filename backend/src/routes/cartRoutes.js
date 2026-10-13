const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.use(requireAuth);

router.get("/", cartController.getCart);

router.post(
  "/items",
  [
    body("productId").isInt().withMessage("productId is required."),
    body("quantity").optional().isInt({ min: 1 }),
    validate,
  ],
  cartController.addItem
);

router.put(
  "/items/:itemId",
  [body("quantity").isInt({ min: 1 }).withMessage("quantity must be at least 1."), validate],
  cartController.updateItem
);

router.delete("/items/:itemId", cartController.removeItem);
router.delete("/", cartController.clearCart);

module.exports = router;
