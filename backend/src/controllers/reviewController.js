const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const reviewModel = require("../models/reviewModel");
const productModel = require("../models/productModel");

const listForProduct = asyncHandler(async (req, res) => {
  const product = await productModel.findBySlug(req.params.slug);
  if (!product) throw new ApiError(404, "Product not found.");
  const reviews = await reviewModel.listForProduct(product.id);
  res.json({ success: true, data: reviews });
});

const create = asyncHandler(async (req, res) => {
  const product = await productModel.findBySlug(req.params.slug);
  if (!product) throw new ApiError(404, "Product not found.");

  const { rating, comment } = req.body;
  const review = await reviewModel.create({ productId: product.id, userId: req.user.id, rating, comment });

  res.status(201).json({
    success: true,
    data: review,
    message: "Thanks! Your review is awaiting moderation.",
  });
});

// --- Admin ---

const listAll = asyncHandler(async (req, res) => {
  const reviews = await reviewModel.listAll({ status: req.query.status });
  res.json({ success: true, data: reviews });
});

const setStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    throw new ApiError(422, "status must be pending, approved or rejected.");
  }

  const existing = await reviewModel.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Review not found.");

  const review = await reviewModel.setStatus(req.params.id, status);
  await productModel.updateRatingAggregate(existing.product_id);

  res.json({ success: true, data: review });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await reviewModel.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Review not found.");

  await reviewModel.remove(req.params.id);
  await productModel.updateRatingAggregate(existing.product_id);

  res.json({ success: true, message: "Review deleted." });
});

module.exports = { listForProduct, create, listAll, setStatus, remove };
