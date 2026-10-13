const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router.use(requireAuth);

router.post(
  "/razorpay/order",
  [body("orderId").isInt().withMessage("orderId is required."), validate],
  paymentController.createRazorpayOrder
);

router.post(
  "/razorpay/verify",
  [
    body("orderId").isInt().withMessage("orderId is required."),
    body("razorpayOrderId").isString().notEmpty(),
    body("razorpayPaymentId").isString().notEmpty(),
    body("razorpaySignature").isString().notEmpty(),
    validate,
  ],
  paymentController.verifyRazorpayPayment
);

module.exports = router;
