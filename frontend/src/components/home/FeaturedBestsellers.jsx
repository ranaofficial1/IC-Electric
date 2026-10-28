import { useMemo, useRef, useState } from "react";
import ProductCard from "../ui/ProductCard.jsx";
import { useCategories } from "../../context/CategoriesContext.jsx";
import { useProductList } from "../../hooks/useCatalog.js";

const CAROUSEL_LIMIT = 12;

// Featured products carousel. Tabs are the real top-level categories; the cards
// are real products from the API (best sellers first). If no product has been
// flagged "best seller" yet in the admin panel, it shows the newest products
// instead so the section is never empty.
export default function FeaturedBestsellers() {
  const [category, setCategory] = useState("all");
  const trackRef = useRef(null);
  const { categories } = useCategories();

  const filters = useMemo(
    () => ({
      categorySlugs: category === "all" ? undefined : [category],
      bestSellersOnly: true,
      sort: "popularity",
      limit: CAROUSEL_LIMIT,
    }),
    [category]
  );
  const flagged = useProductList(filters);

  // Fallback only matters when nothing is flagged as a best seller.
  const needsFallback = !flagged.loading && flagged.total === 0;
  const fallbackFilters = useMemo(
    () => ({
      categorySlugs: category === "all" ? undefined : [category],
      sort: "newest",
      limit: CAROUSEL_LIMIT,
    }),
    [category]
  );
  const fallback = useProductList(fallbackFilters, { enabled: needsFallback });

  const { products, loading } = needsFallback ? fallback : flagged;

  const filterBestsellers = (next) => {
    setCategory(next);
    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  };
  const scrollTrack = (left) => trackRef.current?.scrollBy({ left, behavior: "smooth" });

  const tabClasses = (active) =>
    `bestseller-filter-btn px-4 py-2 rounded-full font-label-md text-label-md font-semibold transition-all whitespace-nowrap ${
      active
        ? "bg-primary text-on-primary shadow-sm"
        : "text-text-secondary hover:text-on-surface hover:bg-surface-container"
    }`;

  return (
    <>
      <section className="w-full px-gutter-mobile sm:px-gutter py-16 sm:py-20 lg:py-8 bg-surface-canvas" id="featured-bestsellers-section">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-8 lg:gap-8">
          {/* Header & Category Badges & Navigation Buttons */}
              <div className="flex w-full items-center justify-between gap-3">
                <h2 className="min-w-0 flex-1 truncate font-headline-md text-xl font-bold text-primary sm:text-2xl lg:text-headline-md">
                  Best Selling Products
                </h2>

                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    aria-label="Previous Items"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-surface-card text-on-surface shadow-sm transition-all hover:bg-surface-container hover:shadow sm:h-10 sm:w-10"
                    onClick={() => scrollTrack(-320)}
                  >
                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Next Items"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle bg-surface-card text-on-surface shadow-sm transition-all hover:bg-surface-container hover:shadow sm:h-10 sm:w-10"
                    onClick={() => scrollTrack(320)}
                  >
                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
              
              {/* <button className={tabClasses(category === "all")} data-category="all" onClick={() => filterBestsellers("all")}>
                All
              </button> */}
              {/* {categories.map((c) => (
                <button key={c.id} className={tabClasses(category === c.slug)} data-category={c.slug} onClick={() => filterBestsellers(c.slug)}>
                  {c.name}
                </button>
              ))} */}
           
          {/* Horizontal Multi-Item Product Carousel Track */}
          <div
              className="flex items-stretch gap-3 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x sm:gap-6"
              id="bestseller-carousel-track"
              ref={trackRef}
            >
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bestseller-item h-[320px] w-[165px] flex-shrink-0 snap-start animate-pulse rounded-2xl border border-border-subtle bg-surface-card sm:h-[420px] sm:w-80"
                  aria-hidden="true"
                />
              ))}
            {!loading && products.length === 0 && (
              <p className="py-10 font-body-md text-body-md text-text-muted">No products in this category yet.</p>
            )}
            {!loading &&
              products.map((product) => (
                <div
                  key={product.id}
                  className="bestseller-item flex w-[165px] flex-shrink-0 snap-start sm:w-80"
                >
                  <ProductCard product={product} className="w-full" />
                </div>
              ))}
          </div>
          {/* Carousel Indicator Strip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-2 rounded-full bg-secondary"></span>
              {" "}
              <span className="w-2.5 h-2 rounded-full bg-surface-container-highest"></span>
              {" "}
              <span className="w-2.5 h-2 rounded-full bg-surface-container-highest"></span>
            </div>
            {/* <span className="font-body-sm text-body-sm text-text-muted">
              {`Showing ${products.length} Authorized Crompton ${needsFallback ? "Products" : "Bestsellers"} • Direct Guwahati Dispatch`}
            </span> */}
          </div>
        </div>
      </section>
    </>
  );
}
