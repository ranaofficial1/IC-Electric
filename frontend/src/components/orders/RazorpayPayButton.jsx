import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { payWithRazorpay } from "../../utils/razorpay.js";
import { formatPrice } from "../../utils/formatPrice.js";
import Button from "../ui/Button.jsx";
import Icon from "../ui/Icon.jsx";

/**
 * Self-hiding: renders nothing unless this order was placed with Razorpay
 * and payment hasn't succeeded yet (covers both a first attempt the
 * shopper dismissed, and any later retry visit to this page).
 */
export default function RazorpayPayButton({ order, onPaid, className = "" }) {
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  if (!order?.payment || order.payment.provider !== "razorpay" || order.payment.status === "succeeded") {
    return null;
  }

  function handlePay() {
    setPaying(true);
    setError("");
    payWithRazorpay(
      order,
      { name: user?.name, email: user?.email, contact: user?.phone },
      {
        onSuccess: (updatedOrder) => {
          setPaying(false);
          onPaid?.(updatedOrder);
        },
        onError: (message) => {
          setPaying(false);
          setError(message);
        },
        onDismiss: () => {
          setPaying(false);
        },
      }
    ).catch((err) => {
      setPaying(false);
      setError(err.message || "Something went wrong opening the payment window.");
    });
  }

  return (
    <div className={`rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon name="circleExclamation" className="mt-0.5 text-amber-500" />
        <div className="flex-1">
          <p className="font-semibold text-neutral-900">Payment not completed</p>
          <p className="mt-1 text-sm text-neutral-600">
            This order is saved, but payment of {formatPrice(Number(order.total))} hasn&apos;t gone
            through yet.
          </p>
          {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
          <Button variant="primary" size="sm" className="mt-4" onClick={handlePay} disabled={paying}>
            {paying && <Icon name="spinner" className="animate-spin" />}
            {paying ? "Opening payment..." : "Complete Payment"}
          </Button>
        </div>
      </div>
    </div>
  );
}
