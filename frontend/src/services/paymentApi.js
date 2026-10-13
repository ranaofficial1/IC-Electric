import { api } from "./api.js";

/** Asks the backend to create a Razorpay order for an existing local order
 *  (or re-create one, on retry). Returns what's needed to open Checkout. */
export async function createRazorpayOrder(orderId) {
  const res = await api.post("/payments/razorpay/order", { orderId });
  return res.data; // { keyId, razorpayOrderId, amount, currency, orderNumber }
}

/** Sends Razorpay Checkout's success callback payload to the backend for
 *  signature verification. Returns the now-updated order. */
export async function verifyRazorpayPayment({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) {
  const res = await api.post("/payments/razorpay/verify", {
    orderId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });
  return res.data; // the order
}
