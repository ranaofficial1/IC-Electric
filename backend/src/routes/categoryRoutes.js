const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { requireAuth, requireAdmin, optionalAuth } = require("../middleware/auth");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.get("/", optionalAuth, categoryController.list);
router.get("/:slug", categoryController.getBySlug);

const categoryValidation = [
  body("slug").trim().notEmpty().withMessage("slug is required."),
  body("name").trim().notEmpty().withMessage("name is required."),
  // null/absent = top-level category; otherwise the id of the parent category.
  body("parentId").optional({ values: "null" }).isInt({ min: 1 }).withMessage("parentId must be a category id or null.").toInt(),
  validate,
];

router.post("/", requireAuth, requireAdmin, categoryValidation, categoryController.create);
router.put("/:id", requireAuth, requireAdmin, categoryValidation, categoryController.update);
router.delete("/:id", requireAuth, requireAdmin, categoryController.remove);

module.exports = router;
