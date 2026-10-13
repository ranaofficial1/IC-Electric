import { Link } from "react-router-dom";

/**
 * Small toast for add-to-cart / buy-now results (see hooks/useShopActions).
 * Renders nothing when there's no feedback.
 */
export default function ActionFeedback({ feedback }) {
  if (!feedback) return null;
  const isError = feedback.type === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`fixed bottom-6 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 rounded-xl px-4 py-3 text-body-sm font-medium shadow-lg ${
        isError ? "bg-error text-on-error" : "bg-primary text-on-primary"
      }`}
    >
      <span>{feedback.text}</span>
      {!isError && (
        <Link to="/cart" className="shrink-0 font-bold underline underline-offset-2">
          View cart
        </Link>
      )}
    </div>
  );
}
