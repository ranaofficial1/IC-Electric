import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumbs from "../components/shop/Breadcrumbs.jsx";
import FilterSidebar from "../components/shop/FilterSidebar.jsx";
import SortBar from "../components/shop/SortBar.jsx";
import ProductGrid from "../components/shop/ProductGrid.jsx";
import { useProductFilters } from "../hooks/useProductFilters.js";

const FILTER_TITLES = {
  sale: "On Sale",
  new: "New Arrivals",
  "best-sellers": "Best Sellers",
};

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const filterShortcut = searchParams.get("filter");
  const filters = useProductFilters();

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: FILTER_TITLES[filterShortcut] || "Shop" }]} />

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          {FILTER_TITLES[filterShortcut] || "All Products"}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Browse the full Hale catalog — filter by category, price or availability.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar
          {...filters}
          mobileOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <SortBar
            totalCount={filters.totalCount}
            sort={filters.sort}
            setSort={filters.setSort}
            activeFilterCount={filters.activeFilterCount}
            onOpenFilters={() => setMobileFiltersOpen(true)}
          />
          <ProductGrid
            results={filters.results}
            totalCount={filters.totalCount}
            hasMore={filters.hasMore}
            loadMore={filters.loadMore}
            loading={filters.loading}
            onClearFilters={filters.clearFilters}
          />
        </div>
      </div>
    </div>
  );
}
