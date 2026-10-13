import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../components/ui/Icon.jsx";
import Breadcrumbs from "../components/shop/Breadcrumbs.jsx";
import FilterSidebar from "../components/shop/FilterSidebar.jsx";
import SortBar from "../components/shop/SortBar.jsx";
import ProductGrid from "../components/shop/ProductGrid.jsx";
import { useProductFilters } from "../hooks/useProductFilters.js";
import { useCategories } from "../context/CategoriesContext.jsx";

const POPULAR_SEARCHES = ["Headphones", "Running shoes", "Face serum", "Backpack", "Smart watch"];

export default function Search() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const filters = useProductFilters();
  const { categories } = useCategories();

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Search" }]} />

      <div className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
          Search Products
        </h1>
        <div className="relative mt-5">
          <Icon name="search" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            autoFocus
            value={filters.query}
            onChange={(e) => filters.setQuery(e.target.value)}
            placeholder="Search for products, categories..."
            className="w-full rounded-2xl border border-neutral-200 bg-white py-3.5 pl-12 pr-4 text-sm shadow-sm focus:border-brand-500 focus:outline-none"
          />
        </div>

        {!filters.query && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-neutral-400">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => filters.setQuery(term)}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 transition-colors hover:border-brand-300 hover:text-brand-600"
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      {!filters.query ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white px-6 py-16 text-center">
          <p className="text-sm text-neutral-500">
            Start typing to search, or browse a category below.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="rounded-full bg-neutral-50 px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      ) : (
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
              emptyTitle={`No results for "${filters.query}"`}
              emptyCopy="Try a different search term or clear your filters."
              onClearFilters={filters.clearFilters}
            />
          </div>
        </div>
      )}
    </div>
  );
}
