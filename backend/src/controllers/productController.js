const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const reviewModel = require("../models/reviewModel");

function parseListQuery(query, { isAdmin = false } = {}) {
  const categorySlugs = query.category
    ? String(query.category).split(",").filter(Boolean)
    : undefined;

  return {
    categorySlugs,
    query: query.q,
    minPrice: query.minPrice !== undefined ? Number(query.minPrice) : undefined,
    maxPrice: query.maxPrice !== undefined ? Number(query.maxPrice) : undefined,
    saleOnly: query.saleOnly === "true",
    newOnly: query.newOnly === "true",
    bestSellersOnly: query.bestSellersOnly === "true",
    // Only an authenticated admin may ever see unpublished products
    // (Phase 10 admin product list) — everyone else always gets the
    // published-only storefront view, regardless of what's passed.
    publishedOnly: isAdmin ? query.publishedOnly !== "false" : true,
    sort: query.sort || "newest",
    page: query.page ? Number(query.page) : 1,
    limit: query.limit ? Math.min(Number(query.limit), 100) : 12,
  };
}

const list = asyncHandler(async (req, res) => {
  const filters = parseListQuery(req.query, { isAdmin: req.user?.role === "admin" });
  const { rows, total, page, limit } = await productModel.list(filters);
  res.json({
    success: true,
    data: rows,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  });
});

const getBySlug = asyncHandler(async (req, res) => {
  const product = await productModel.findBySlug(req.params.slug);
  if (!product) throw new ApiError(404, "Product not found.");

  const [related, reviews] = await Promise.all([
    productModel.getRelated(product),
    reviewModel.listForProduct(product.id),
  ]);

  res.json({ success: true, data: { ...product, related, reviews } });
});

const create = asyncHandler(async (req, res) => {
  // categoryId is stored as the top-level category, subcategoryId as the
  // specific node; either (or both) may be sent — see resolveProductAssignment.
  const assignment = await categoryModel.resolveProductAssignment(
    req.body.categoryId,
    req.body.subcategoryId
  );

  const product = await productModel.create({ ...req.body, ...assignment });
  await Promise.all([
    productModel.replaceImages(product.id, req.body.images),
    productModel.replaceSpecs(product.id, req.body.specs),
    productModel.replaceOptions(product.id, req.body.options),
  ]);

  res.status(201).json({ success: true, data: await productModel.findById(product.id) });
});

const update = asyncHandler(async (req, res) => {
  const existing = await productModel.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Product not found.");

  // Keep the current filing unless the request changes it. If only categoryId
  // is sent: same top-level category → keep the subcategory; a different one →
  // clear it (the old subcategory can't belong to the new category).
  let assignment = { categoryId: existing.category_id, subcategoryId: existing.subcategory_id };
  const { categoryId, subcategoryId } = req.body;
  if (categoryId != null || subcategoryId !== undefined) {
    let nextSub = subcategoryId;
    if (nextSub === undefined) {
      nextSub = Number(categoryId) === existing.category_id ? existing.subcategory_id : null;
    }
    assignment = await categoryModel.resolveProductAssignment(
      categoryId ?? (nextSub == null ? existing.category_id : null),
      nextSub
    );
  }

  await productModel.update(req.params.id, { ...existing, ...req.body, ...assignment });

  if (req.body.images) await productModel.replaceImages(req.params.id, req.body.images);
  if (req.body.specs) await productModel.replaceSpecs(req.params.id, req.body.specs);
  if (req.body.options) await productModel.replaceOptions(req.params.id, req.body.options);

  res.json({ success: true, data: await productModel.findById(req.params.id) });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await productModel.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Product not found.");
  await productModel.remove(req.params.id);
  res.json({ success: true, message: "Product deleted." });
});

const adjustStock = asyncHandler(async (req, res) => {
  const { changeQty, reason } = req.body;
  const existing = await productModel.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Product not found.");

  const product = await productModel.adjustStock(req.params.id, changeQty, reason, req.user.id);
  res.json({ success: true, data: product });
});

module.exports = { list, getBySlug, create, update, remove, adjustStock };
