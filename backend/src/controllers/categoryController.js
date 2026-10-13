const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const categoryModel = require("../models/categoryModel");

const isAdmin = (req) => req.user?.role === "admin";

// GET /categories
//   (default)      → top-level categories, each with nested `children` (storefront)
//   ?flat=true     → every category as a flat, tree-ordered list with `depth` and
//                    `parent_id` (admin screens / pickers)
const list = asyncHandler(async (req, res) => {
  const opts = { includeInactive: isAdmin(req) };
  const categories =
    req.query.flat === "true" ? await categoryModel.list(opts) : await categoryModel.listTree(opts);
  res.json({ success: true, data: categories });
});

const getBySlug = asyncHandler(async (req, res) => {
  const category = await categoryModel.findDetailBySlug(req.params.slug, {
    includeInactive: isAdmin(req),
  });
  if (!category) throw new ApiError(404, "Category not found.");
  res.json({ success: true, data: category });
});

const create = asyncHandler(async (req, res) => {
  const category = await categoryModel.create(req.body);
  res.status(201).json({ success: true, data: category });
});

const update = asyncHandler(async (req, res) => {
  const existing = await categoryModel.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Category not found.");
  // PUT replaces the record, but a client that doesn't know about nesting
  // (omits parentId) must not silently flatten a subcategory to top level.
  const parentId = req.body.parentId === undefined ? existing.parent_id : req.body.parentId;
  const category = await categoryModel.update(req.params.id, { ...req.body, parentId });
  res.json({ success: true, data: category });
});

const remove = asyncHandler(async (req, res) => {
  const existing = await categoryModel.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Category not found.");

  const { children, products } = await categoryModel.usage(req.params.id);
  if (children > 0) {
    throw new ApiError(
      409,
      `Can't delete "${existing.name}" — it has ${children} subcategor${children === 1 ? "y" : "ies"}. Delete or move them first.`
    );
  }
  if (products > 0) {
    throw new ApiError(
      409,
      `Can't delete "${existing.name}" — ${products} product${products === 1 ? " is" : "s are"} filed under it. Reassign them first.`
    );
  }

  await categoryModel.remove(req.params.id);
  res.json({ success: true, message: "Category deleted." });
});

module.exports = { list, getBySlug, create, update, remove };
