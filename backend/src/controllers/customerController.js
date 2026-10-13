const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const userModel = require("../models/userModel");
const addressModel = require("../models/addressModel");
const orderModel = require("../models/orderModel");

const getProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);
  res.json({ success: true, data: user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await userModel.updateProfile(req.user.id, { name, phone });
  res.json({ success: true, data: user });
});

const listAddresses = asyncHandler(async (req, res) => {
  const addresses = await addressModel.listForUser(req.user.id);
  res.json({ success: true, data: addresses });
});

const createAddress = asyncHandler(async (req, res) => {
  const address = await addressModel.create(req.user.id, req.body);
  res.status(201).json({ success: true, data: address });
});

const updateAddress = asyncHandler(async (req, res) => {
  const existing = await addressModel.findById(req.params.id, req.user.id);
  if (!existing) throw new ApiError(404, "Address not found.");
  const address = await addressModel.update(req.params.id, req.user.id, req.body);
  res.json({ success: true, data: address });
});

const removeAddress = asyncHandler(async (req, res) => {
  const existing = await addressModel.findById(req.params.id, req.user.id);
  if (!existing) throw new ApiError(404, "Address not found.");
  await addressModel.remove(req.params.id, req.user.id);
  res.json({ success: true, message: "Address deleted." });
});

const orderHistory = asyncHandler(async (req, res) => {
  const orders = await orderModel.listForUser(req.user.id);
  res.json({ success: true, data: orders });
});

// --- Admin ---

const adminList = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await userModel.list({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
  });
  res.json({ success: true, data: result.rows, meta: { total: result.total } });
});

const adminGetById = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) throw new ApiError(404, "Customer not found.");
  const orders = await orderModel.listForUser(req.params.id);
  res.json({ success: true, data: { ...user, orders } });
});

const adminSetStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["active", "disabled"].includes(status)) {
    throw new ApiError(422, "status must be active or disabled.");
  }
  const existing = await userModel.findById(req.params.id);
  if (!existing) throw new ApiError(404, "Customer not found.");

  await userModel.setStatus(req.params.id, status);
  res.json({ success: true, data: await userModel.findById(req.params.id) });
});

module.exports = {
  getProfile,
  updateProfile,
  listAddresses,
  createAddress,
  updateAddress,
  removeAddress,
  orderHistory,
  adminList,
  adminGetById,
  adminSetStatus,
};
