const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const wishlistModel = require("../models/wishlistModel");
const productModel = require("../models/productModel");

const getWishlist = asyncHandler(async (req, res) => {
  const items = await wishlistModel.getForUser(req.user.id);
  res.json({ success: true, data: items });
});

const addItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await productModel.findById(productId);
  if (!product) throw new ApiError(404, "Product not found.");

  const items = await wishlistModel.addItem(req.user.id, productId);
  res.status(201).json({ success: true, data: items });
});

const removeItem = asyncHandler(async (req, res) => {
  const items = await wishlistModel.removeItem(req.user.id, req.params.productId);
  res.json({ success: true, data: items });
});

module.exports = { getWishlist, addItem, removeItem };
