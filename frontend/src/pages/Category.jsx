import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "../components/shop/Breadcrumbs.jsx";
import FilterSidebar from "../components/shop/FilterSidebar.jsx";
import SortBar from "../components/shop/SortBar.jsx";
import ProductGrid from "../components/shop/ProductGrid.jsx";
import Button from "../components/ui/Button.jsx";
import Icon from "../components/ui/Icon.jsx";
import { useProductFilters } from "../hooks/useProductFilters.js";
import { fetchCategoryBySlug } from "../services/catalogApi.js";
import { useCategories } from "../context/CategoriesContext.jsx";

export default function Category() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const filters = useProductFilters({ lockedCategory: slug });
  const { findCategory } = useCategories();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetchCategoryBySlug(slug)
      .then((data) => {
        if (!cancelled) setCategory(data);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Icon name="spinner" className="animate-spin text-[28px] text-neutral-300" />
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="mx-auto max-w-[1360px] px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-bold text-neutral-900">Category not found</h1>
        <p className="mt-2 text-sm text-neutral-500">This category doesn&apos;t exist yet.</p>
        <Button to="/shop" variant="secondary" className="mt-6">
          Browse all products
        </Button>
      </div>
    );
  }

  // Subcategories (e.g. Desert Cooler) usually have no banner of their own —
  // fall back to the top-level category's. The "type" chips list this
  // category's subcategories, or its siblings when viewing a subcategory.
  const rootBanner = category.ancestors[0] ? findCategory(category.ancestors[0].slug)?.banner : null;
  const chipParent = category.children.length > 0 ? category : findCategory(category.parentSlug);
  const chips = chipParent?.children || [];

  return (
    <div>
      <div className="relative overflow-hidden">
        {category.banner || rootBanner ? (
          <img
            src={category.banner || rootBanner}
            alt=""
            className="h-52 w-full object-cover sm:h-64"
            loading="lazy"
          />
        ) : (
          <div className="h-52 w-full bg-gradient-to-br from-primary to-secondary sm:h-64" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-[1360px] px-4 pb-8 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Home", to: "/" },
                { label: "Shop", to: "/shop" },
                ...category.ancestors.map((a) => ({ label: a.name, to: `/category/${a.slug}` })),
                { label: category.name },
              ]}
            />
            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/80">{category.description}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <FilterSidebar
            {...filters}
            lockedCategory={slug}
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
            {chips.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {[{ id: "all", slug: chipParent.slug, name: `All ${chipParent.name}` }, ...chips].map((chip) => {
                  const active = chip.slug === category.slug;
                  return (
                    <Link
                      key={chip.id}
                      to={`/category/${chip.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                        active
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300 hover:text-brand-600"
                      }`}
                    >
                      {chip.name}
                    </Link>
                  );
                })}
              </div>
            )}
            <ProductGrid
              results={filters.results}
              totalCount={filters.totalCount}
              hasMore={filters.hasMore}
              loadMore={filters.loadMore}
              loading={filters.loading}
              emptyTitle="No products in this category yet"
              emptyCopy="Try adjusting the price range or availability filters."
              onClearFilters={filters.clearFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
