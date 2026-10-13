const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const couponModel = require("../models/couponModel");

const validate = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.query;
  const coupon = await couponModel.findByCode(code || "");
  const result = couponModel.checkValidity(coupon, Number(subtotal) || 0);

  if (!result.valid) throw new ApiError(400, result.reason || "Invalid coupon.");

  const discount =
    coupon.type === "percent"
      ? Math.round((Number(subtotal) || 0) * (coupon.value / 100))
      : Number(coupon.value);

  res.json({ success: true, data: { code: coupon.code, type: coupon.type, value: coupon.value, discount } });
});

// --- Admin ---

const list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await couponModel.list() });
});

const create = asyncHandler(async (req, res) => {
  const coupon = await couponModel.create(req.body);
  res.status(201).json({ success: true, data: coupon });
});

const update = asyncHandler(async (req, res) => {
  const coupon = await couponModel.update(req.params.id, req.body);
  if (!coupon) throw new ApiError(404, "Coupon not found.");
  res.json({ success: true, data: coupon });
});

const remove = asyncHandler(async (req, res) => {
  await couponModel.remove(req.params.id);
  res.json({ success: true, message: "Coupon deleted." });
});

module.exports = { validate, list, create, update, remove };
