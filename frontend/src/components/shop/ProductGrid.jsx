import ProductCard from "../ui/ProductCard.jsx";
import Button from "../ui/Button.jsx";
import Icon from "../ui/Icon.jsx";

export default function ProductGrid({
  results,
  totalCount,
  hasMore,
  loadMore,
  loading = false,
  emptyTitle = "No products found",
  emptyCopy = "Try adjusting your filters or search terms.",
  onClearFilters,
}) {
  if (loading && results.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-[420px] animate-pulse rounded-2xl bg-surface-container" />
        ))}
      </div>
    );
  }

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-20 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-50 text-2xl text-neutral-300">
          <Icon name="search" />
        </span>
        <h3 className="font-display text-lg font-bold text-neutral-900">{emptyTitle}</h3>
        <p className="mt-1 max-w-sm text-sm text-neutral-500">{emptyCopy}</p>
        {onClearFilters && (
          <Button variant="secondary" size="sm" className="mt-5" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {results.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <Button variant="secondary" onClick={loadMore} disabled={loading}>
            {loading && <Icon name="spinner" className="animate-spin" />}
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
