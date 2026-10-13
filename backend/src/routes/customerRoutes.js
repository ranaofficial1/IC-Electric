const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const customerController = require("../controllers/customerController");

const router = express.Router();

router.use(requireAuth);

router.get("/me", customerController.getProfile);
router.put(
  "/me",
  [body("name").trim().notEmpty().withMessage("name is required."), validate],
  customerController.updateProfile
);

router.get("/me/orders", customerController.orderHistory);

const addressValidation = [
  body("fullName").trim().notEmpty().withMessage("fullName is required."),
  body("phone").trim().notEmpty().withMessage("phone is required."),
  body("line1").trim().notEmpty().withMessage("line1 is required."),
  body("city").trim().notEmpty().withMessage("city is required."),
  body("state").trim().notEmpty().withMessage("state is required."),
  body("postalCode").trim().notEmpty().withMessage("postalCode is required."),
  validate,
];

router.get("/me/addresses", customerController.listAddresses);
router.post("/me/addresses", addressValidation, customerController.createAddress);
router.put("/me/addresses/:id", addressValidation, customerController.updateAddress);
router.delete("/me/addresses/:id", customerController.removeAddress);

module.exports = router;
