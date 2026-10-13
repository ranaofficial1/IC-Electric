const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const couponController = require("../controllers/couponController");

const router = express.Router();

router.get("/validate", couponController.validate);

const couponValidation = [
  body("code").trim().notEmpty().withMessage("code is required."),
  body("type").isIn(["percent", "fixed"]).withMessage("type must be percent or fixed."),
  body("value").isFloat({ min: 0 }).withMessage("value must be a positive number."),
  validate,
];

router.get("/", requireAuth, requireAdmin, couponController.list);
router.post("/", requireAuth, requireAdmin, couponValidation, couponController.create);
router.put("/:id", requireAuth, requireAdmin, couponValidation, couponController.update);
router.delete("/:id", requireAuth, requireAdmin, couponController.remove);

module.exports = router;
