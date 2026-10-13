const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const cartModel = require("../models/cartModel");
const productModel = require("../models/productModel");

function summarize(items) {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce(
    (sum, i) => sum + Number(i.sale_price ?? i.price) * i.quantity,
    0
  );
  return { items, itemCount, subtotal };
}

const getCart = asyncHandler(async (req, res) => {
  const items = await cartModel.getForUser(req.user.id);
  res.json({ success: true, data: summarize(items) });
});

const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, selectedOptions } = req.body;

  const product = await productModel.findById(productId);
  if (!product) throw new ApiError(404, "Product not found.");
  if (product.stock < quantity) {
    throw new ApiError(409, `Only ${product.stock} of ${product.name} left in stock.`);
  }

  const items = await cartModel.addItem(req.user.id, productId, quantity, selectedOptions);
  res.status(201).json({ success: true, data: summarize(items) });
});

const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  if (quantity < 1) throw new ApiError(422, "Quantity must be at least 1 — use DELETE to remove an item.");

  const items = await cartModel.updateQuantity(req.user.id, req.params.itemId, quantity);
  res.json({ success: true, data: summarize(items) });
});

const removeItem = asyncHandler(async (req, res) => {
  const items = await cartModel.removeItem(req.user.id, req.params.itemId);
  res.json({ success: true, data: summarize(items) });
});

const clearCart = asyncHandler(async (req, res) => {
  await cartModel.clearCart(req.user.id);
  res.json({ success: true, data: summarize([]) });
});

module.exports = { getCart, addItem, updateItem, removeItem, clearCart };
