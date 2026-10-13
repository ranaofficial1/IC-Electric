const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { requireAuth, requireAdmin, optionalAuth } = require("../middleware/auth");
const productController = require("../controllers/productController");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

// optionalAuth so an admin's list request (Phase 10 admin product screen)
// can request unpublished products too, same pattern already used by
// categoryRoutes' GET "/" — guests/customers are unaffected.
router.get("/", optionalAuth, productController.list);
router.get("/:slug", productController.getBySlug);

router.get("/:slug/reviews", reviewController.listForProduct);
router.post(
  "/:slug/reviews",
  requireAuth,
  [
    body("rating").isInt({ min: 1, max: 5 }).withMessage("rating must be between 1 and 5."),
    body("comment").optional({ values: "falsy" }).isString().isLength({ max: 2000 }),
    validate,
  ],
  reviewController.create
);

const productValidation = [
  body("slug").trim().notEmpty().withMessage("slug is required."),
  body("name").trim().notEmpty().withMessage("name is required."),
  // Either field alone is enough: the API stores the top-level category in
  // category_id and the specific subcategory (if any) in subcategory_id.
  body("categoryId").custom((value, { req }) => {
    if (value == null && req.body.subcategoryId == null) throw new Error("categoryId is required.");
    if (value != null && !Number.isInteger(Number(value))) throw new Error("categoryId must be an integer.");
    return true;
  }),
  body("subcategoryId").optional({ values: "null" }).isInt().withMessage("subcategoryId must be an integer."),
  body("price").isFloat({ min: 0 }).withMessage("price must be a positive number."),
  body("salePrice").optional({ values: "null" }).isFloat({ min: 0 }),
  body("stock").optional().isInt({ min: 0 }),
  validate,
];

router.post("/", requireAuth, requireAdmin, productValidation, productController.create);
router.put("/:id", requireAuth, requireAdmin, productController.update);
router.delete("/:id", requireAuth, requireAdmin, productController.remove);

router.patch(
  "/:id/stock",
  requireAuth,
  requireAdmin,
  [body("changeQty").isInt().withMessage("changeQty must be an integer (positive or negative)."), validate],
  productController.adjustStock
);

module.exports = router;
