const Razorpay = require("razorpay");
const ApiError = require("../utils/ApiError");

// Instantiated lazily (on first use, not at require time) so the server can
// still boot — and every other route can still work — if these env vars
// aren't set yet. Only routes that actually touch Razorpay will fail, with
// a clear message, until RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET are filled in.
let client = null;

function getRazorpayClient() {
  if (client) return client;

  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new ApiError(
      503,
      "Razorpay isn't configured — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env."
    );
  }

  client = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
  return client;
}

module.exports = { getRazorpayClient };
