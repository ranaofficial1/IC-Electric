import { createRazorpayOrder, verifyRazorpayPayment } from "../services/paymentApi.js";

const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise = null;

/** Injects Razorpay's Checkout script exactly once per page load, however
 *  many times payWithRazorpay() is called (e.g. a failed attempt retried). */
function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => {
      scriptPromise = null; // allow a later retry to try loading again
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
}

/**
 * Opens Razorpay's Checkout modal for an existing local order and verifies
 * the result. Used both for a fresh Checkout payment and for a "Complete
 * Payment" retry on an order that's still payment_status: 'pending' —
 * createRazorpayOrder() on the backend is safe to call again either way.
 *
 * @param {object} order - the local order (needs id, order_number, total)
 * @param {object} [prefill] - { name, email, contact } for the widget's prefill fields
 * @param {(order: object) => void} onSuccess - called with the freshly-verified order
 * @param {(message: string) => void} onError
 * @param {() => void} [onDismiss] - called if the shopper closes the widget without paying
 */
export async function payWithRazorpay(order, prefill, { onSuccess, onError, onDismiss }) {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onError("Couldn't load the payment widget. Check your connection and try again.");
    return;
  }

  let providerOrder;
  try {
    providerOrder = await createRazorpayOrder(order.id);
  } catch (err) {
    onError(err.message || "Couldn't start the payment. Please try again.");
    return;
  }

  const rzp = new window.Razorpay({
    key: providerOrder.keyId,
    amount: providerOrder.amount,
    currency: providerOrder.currency,
    order_id: providerOrder.razorpayOrderId,
    name: "Hale",
    description: `Order ${providerOrder.orderNumber}`,
    prefill: {
      name: prefill?.name || "",
      email: prefill?.email || "",
      contact: prefill?.contact || "",
    },
    theme: { color: "#ff5520" },
    handler: async (response) => {
      try {
        const updatedOrder = await verifyRazorpayPayment({
          orderId: order.id,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
        onSuccess(updatedOrder);
      } catch (err) {
        onError(err.message || "We couldn't verify that payment. Please contact support if you were charged.");
      }
    },
    modal: {
      ondismiss: () => onDismiss && onDismiss(),
    },
  });

  rzp.on("payment.failed", (response) => {
    onError(response?.error?.description || "Payment failed. Please try again.");
  });

  rzp.open();
}
