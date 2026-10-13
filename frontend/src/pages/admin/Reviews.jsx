import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api.js";
import Icon from "../../components/ui/Icon.jsx";

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_TONE = {
  pending: "text-amber-600 bg-amber-50",
  approved: "text-emerald-600 bg-emerald-50",
  rejected: "text-rose-600 bg-rose-50",
};

function Stars({ rating }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          className={`text-[16px] ${i < rating ? "" : "text-neutral-200"}`}
        />
      ))}
    </span>
  );
}

export default function AdminReviews() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  async function loadReviews() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/admin/reviews${statusFilter ? `?status=${statusFilter}` : ""}`);
      setReviews(res.data);
    } catch (err) {
      setError(err.message || "Couldn't load reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function handleSetStatus(review, status) {
    setBusyId(review.id);
    setError("");
    try {
      await api.patch(`/admin/reviews/${review.id}/status`, { status });
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch (err) {
      setError(err.message || "Couldn't update this review.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(review) {
    if (!window.confirm("Delete this review? This can't be undone.")) return;
    setBusyId(review.id);
    setError("");
    try {
      await api.delete(`/admin/reviews/${review.id}`);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch (err) {
      setError(err.message || "Couldn't delete this review.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900">
        Reviews
      </h1>
      <p className="mt-1 text-sm text-neutral-500">
        Approve, reject, or remove customer reviews before they appear on product pages.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === tab.value
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="circleExclamation" className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && <p className="mt-6 text-sm text-neutral-400">Loading reviews...</p>}

      {!loading && reviews.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-12 text-center">
          <Icon name="comment" className="mx-auto mb-3 text-[28px] text-neutral-300" />
          <p className="text-sm text-neutral-500">No reviews here.</p>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-neutral-200/70 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Link
                    to={`/product/${review.product_slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-neutral-900 hover:text-brand-600 hover:underline"
                  >
                    {review.product_name}
                  </Link>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    by {review.user_name} ·{" "}
                    {new Date(review.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <div className="mt-2">
                    <Stars rating={review.rating} />
                  </div>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    STATUS_TONE[review.status] || "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {review.status}
                </span>
              </div>

              {review.comment && (
                <p className="mt-3 text-sm text-neutral-600">{review.comment}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
                {review.status !== "approved" && (
                  <button
                    type="button"
                    disabled={busyId === review.id}
                    onClick={() => handleSetStatus(review, "approved")}
                    className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                  >
                    <Icon name="check" className="text-[14px]" />
                    Approve
                  </button>
                )}
                {review.status !== "rejected" && (
                  <button
                    type="button"
                    disabled={busyId === review.id}
                    onClick={() => handleSetStatus(review, "rejected")}
                    className="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 disabled:opacity-50"
                  >
                    <Icon name="circleX" className="text-[14px]" />
                    Reject
                  </button>
                )}
                <button
                  type="button"
                  disabled={busyId === review.id}
                  onClick={() => handleDelete(review)}
                  className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 disabled:opacity-50"
                >
                  <Icon name="trash" className="text-[14px]" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
