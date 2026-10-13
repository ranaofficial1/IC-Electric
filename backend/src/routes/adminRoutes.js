const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const adminController = require("../controllers/adminController");
const orderController = require("../controllers/orderController");
const customerController = require("../controllers/customerController");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

// Every route below requires an authenticated admin.
router.use(requireAuth, requireAdmin);

router.get("/dashboard", adminController.dashboard);

// Orders
router.get("/orders", orderController.listAll);
router.get("/orders/:id", orderController.getById);
router.patch(
  "/orders/:id/status",
  [body("status").notEmpty().withMessage("status is required."), validate],
  orderController.updateStatus
);
router.patch(
  "/orders/:id/payment-status",
  [body("paymentStatus").notEmpty().withMessage("paymentStatus is required."), validate],
  orderController.updatePaymentStatus
);
router.patch("/orders/:id/shipment", orderController.updateShipment);

// Customers
router.get("/customers", customerController.adminList);
router.get("/customers/:id", customerController.adminGetById);
router.patch(
  "/customers/:id/status",
  [body("status").notEmpty().withMessage("status is required."), validate],
  customerController.adminSetStatus
);

// Reviews (moderation)
router.get("/reviews", reviewController.listAll);
router.patch(
  "/reviews/:id/status",
  [body("status").notEmpty().withMessage("status is required."), validate],
  reviewController.setStatus
);
router.delete("/reviews/:id", reviewController.remove);

module.exports = router;
