import { useState } from "react";
import RatingSummary from "./RatingSummary.jsx";
import ReviewCard from "./ReviewCard.jsx";

export default function ProductTabs({ product, reviews }) {
  const [activeTab, setActiveTab] = useState("description");
  const specEntries = Object.entries(product.specs || {});

  const TABS = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "reviews", label: `Reviews (${product.reviewCount})` },
  ];

  return (
    <div>
      <div className="flex gap-6 overflow-x-auto border-b border-neutral-200">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id}
            className={`whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "border-brand-500 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {activeTab === "description" && (
          <p className="max-w-3xl text-sm leading-relaxed text-neutral-600">{product.description}</p>
        )}

        {activeTab === "specifications" && (
          <dl className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {specEntries.map(([key, value]) => (
              <div key={key} className="flex justify-between border-b border-neutral-100 pb-2 text-sm">
                <dt className="text-neutral-500">{key}</dt>
                <dd className="font-medium text-neutral-900">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-3xl">
            <RatingSummary rating={product.rating} reviewCount={product.reviewCount} />
            <div className="mt-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
