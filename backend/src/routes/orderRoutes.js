const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.use(requireAuth);

router.post(
  "/",
  [
    body("shippingAddressId").isInt().withMessage("shippingAddressId is required."),
    body("billingAddressId").optional().isInt(),
    body("couponCode").optional().isString(),
    body("paymentProvider").optional().isString(),
    validate,
  ],
  orderController.createOrder
);

router.get("/", orderController.listMyOrders);
router.get("/:id", orderController.getMyOrder);

module.exports = router;
