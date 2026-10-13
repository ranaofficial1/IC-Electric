const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const orderModel = require("../models/orderModel");
const addressModel = require("../models/addressModel");

const VALID_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddressId, billingAddressId, couponCode, paymentProvider, notes } = req.body;

  const shippingAddress = await addressModel.findById(shippingAddressId, req.user.id);
  if (!shippingAddress) throw new ApiError(422, "shippingAddressId does not match one of your addresses.");

  if (billingAddressId) {
    const billingAddress = await addressModel.findById(billingAddressId, req.user.id);
    if (!billingAddress) throw new ApiError(422, "billingAddressId does not match one of your addresses.");
  }

  const order = await orderModel.createFromCart(req.user.id, {
    shippingAddressId,
    billingAddressId,
    couponCode,
    paymentProvider,
    notes,
  });

  res.status(201).json({ success: true, data: order });
});

const listMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.listForUser(req.user.id);
  res.json({ success: true, data: orders });
});

const getMyOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id, req.user.id);
  if (!order) throw new ApiError(404, "Order not found.");
  res.json({ success: true, data: order });
});

// --- Admin ---

const listAll = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const result = await orderModel.listAll({
    status,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
  });
  res.json({ success: true, data: result.rows, meta: { total: result.total } });
});

const getById = asyncHandler(async (req, res) => {
  const order = await orderModel.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found.");
  res.json({ success: true, data: order });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    throw new ApiError(422, `status must be one of: ${VALID_STATUSES.join(", ")}`);
  }
  const order = await orderModel.updateStatus(req.params.id, status);
  if (!order) throw new ApiError(404, "Order not found.");
  res.json({ success: true, data: order });
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body;
  const order = await orderModel.updatePaymentStatus(req.params.id, paymentStatus);
  if (!order) throw new ApiError(404, "Order not found.");
  res.json({ success: true, data: order });
});

const updateShipment = asyncHandler(async (req, res) => {
  const { carrier, trackingNumber, status } = req.body;
  const order = await orderModel.upsertShipment(req.params.id, { carrier, trackingNumber, status });
  res.json({ success: true, data: order });
});

module.exports = {
  createOrder,
  listMyOrders,
  getMyOrder,
  listAll,
  getById,
  updateStatus,
  updatePaymentStatus,
  updateShipment,
};
