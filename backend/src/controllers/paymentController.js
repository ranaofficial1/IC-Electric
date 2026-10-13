const crypto = require("crypto");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const orderModel = require("../models/orderModel");
const paymentModel = require("../models/paymentModel");
const { getRazorpayClient } = require("../config/razorpay");

/**
 * Creates (or re-creates, on retry) a Razorpay order for an existing local
 * order and returns what the frontend needs to open Razorpay's Checkout
 * widget. Called right after POST /orders for a "razorpay" order, or again
 * later from the order detail/success page if the first attempt was
 * abandoned or failed — payments.status stays 'pending' either way, so a
 * retry is always safe.
 */
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) throw new ApiError(422, "orderId is required.");

  const order = await orderModel.findById(orderId, req.user.id);
  if (!order) throw new ApiError(404, "Order not found.");
  if (order.payment_status === "paid") {
    throw new ApiError(400, "This order has already been paid for.");
  }

  const payment = await paymentModel.findByOrderId(orderId);
  if (!payment) {
    // Shouldn't happen — createFromCart always inserts one payment row —
    // but fail loudly rather than silently creating an orphaned Razorpay order.
    throw new ApiError(500, "No payment record exists for this order.");
  }

  const razorpay = getRazorpayClient();
  const rpOrder = await razorpay.orders.create({
    amount: Math.round(Number(order.total) * 100), // paise
    currency: "INR",
    receipt: order.order_number,
    notes: { orderId: String(order.id), userId: String(req.user.id) },
  });

  await paymentModel.attachProviderOrder(payment.id, {
    providerOrderId: rpOrder.id,
    amount: rpOrder.amount,
    currency: rpOrder.currency,
  });

  res.json({
    success: true,
    data: {
      keyId: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      orderNumber: order.order_number,
    },
  });
});

/**
 * Called by the frontend from Razorpay Checkout's own success handler.
 * Verifies the HMAC signature Razorpay returns (proves the payment_id
 * genuinely belongs to the order_id we created, signed with our key
 * secret) before trusting the client's word that payment succeeded — the
 * webhook below is the second, server-to-server confirmation of the same
 * fact and isn't required for this to be safe on its own.
 */
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    throw new ApiError(422, "orderId, razorpayOrderId, razorpayPaymentId and razorpaySignature are all required.");
  }

  const order = await orderModel.findById(orderId, req.user.id);
  if (!order) throw new ApiError(404, "Order not found.");

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new ApiError(400, "Payment verification failed. Please contact support if you were charged.");
  }

  const payment = await paymentModel.findByOrderId(orderId);
  if (payment && payment.status !== "succeeded") {
    await paymentModel.markSucceeded(payment.id, {
      providerPaymentId: razorpayPaymentId,
      rawResponse: { step: "verified", razorpayOrderId, razorpayPaymentId },
    });
  }

  await orderModel.updatePaymentStatus(orderId, "paid");
  if (order.status === "pending") {
    await orderModel.updateStatus(orderId, "confirmed");
  }

  res.json({ success: true, data: await orderModel.findById(orderId, req.user.id) });
});

/**
 * Server-to-server confirmation channel — Razorpay calls this directly
 * (not through the browser), so it can mark a payment as paid even if the
 * shopper closed the tab right after paying and the client-side verify
 * above never ran. Mounted in app.js with express.raw() ahead of the
 * global JSON body parser, since the signature is computed over the exact
 * raw request bytes.
 */
const webhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (secret) {
    const expected = crypto.createHmac("sha256", secret).update(req.body).digest("hex");
    if (expected !== signature) {
      throw new ApiError(400, "Invalid webhook signature.");
    }
  } else {
    console.warn(
      "RAZORPAY_WEBHOOK_SECRET is not set — skipping webhook signature verification. " +
        "Set it before relying on webhooks in production."
    );
  }

  let event;
  try {
    event = JSON.parse(req.body.toString("utf8"));
  } catch {
    throw new ApiError(400, "Invalid webhook payload.");
  }

  const paymentEntity = event?.payload?.payment?.entity;
  if (!paymentEntity) {
    // Some event types (e.g. refund/order events) don't carry a payment
    // entity — nothing for this handler to do, but still acknowledge
    // receipt so Razorpay doesn't keep retrying.
    return res.json({ success: true });
  }

  const payment = await paymentModel.findByProviderOrderId(paymentEntity.order_id);
  if (!payment) {
    // A payment for an order this backend doesn't know about (different
    // environment/test data) — acknowledge and move on.
    return res.json({ success: true });
  }

  if (event.event === "payment.captured" || event.event === "payment.authorized") {
    if (payment.status !== "succeeded") {
      await paymentModel.markSucceeded(payment.id, {
        providerPaymentId: paymentEntity.id,
        rawResponse: { step: "webhook", event: event.event, paymentEntity },
      });
      await orderModel.updatePaymentStatus(payment.order_id, "paid");
      const order = await orderModel.findById(payment.order_id);
      if (order && order.status === "pending") {
        await orderModel.updateStatus(payment.order_id, "confirmed");
      }
    }
  } else if (event.event === "payment.failed") {
    if (payment.status !== "succeeded") {
      await paymentModel.markFailed(payment.id, {
        rawResponse: { step: "webhook", event: event.event, paymentEntity },
      });
      await orderModel.updatePaymentStatus(payment.order_id, "failed");
    }
  }

  res.json({ success: true });
});

module.exports = { createRazorpayOrder, verifyRazorpayPayment, webhook };
