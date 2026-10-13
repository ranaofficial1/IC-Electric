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
      <section className="w-full px-gutter py-space-xl bg-surface-canvas" id="featured-bestsellers-section">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          {/* Header & Category Badges & Navigation Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2 overflow-x-auto max-w-full">
              <h2 className="font-headline-md text-headline-md text-primary">
                Best Selling Products
              </h2>
              
              {/* <button className={tabClasses(category === "all")} data-category="all" onClick={() => filterBestsellers("all")}>
                All
              </button> */}
              {/* {categories.map((c) => (
                <button key={c.id} className={tabClasses(category === c.slug)} data-category={c.slug} onClick={() => filterBestsellers(c.slug)}>
                  {c.name}
                </button>
              ))} */}
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button aria-label="Previous Items" className="w-10 h-10 rounded-full bg-surface-card hover:bg-surface-container border border-border-subtle text-on-surface flex items-center justify-center shadow-sm hover:shadow transition-all" onClick={() => scrollTrack(-320)}>
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>
              <button aria-label="Next Items" className="w-10 h-10 rounded-full bg-surface-card hover:bg-surface-container border border-border-subtle text-on-surface flex items-center justify-center shadow-sm hover:shadow transition-all" onClick={() => scrollTrack(320)}>
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
          {/* Horizontal Multi-Item Product Carousel Track */}
          <div className="flex gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x" id="bestseller-carousel-track" ref={trackRef}>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bestseller-item w-80 h-[420px] flex-shrink-0 snap-start rounded-2xl bg-surface-card border border-border-subtle animate-pulse" aria-hidden="true" />
              ))}
            {!loading && products.length === 0 && (
              <p className="py-10 font-body-md text-body-md text-text-muted">No products in this category yet.</p>
            )}
            {!loading &&
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="bestseller-item w-80 flex-shrink-0 snap-start border border-border-subtle"
                />
              ))}
          </div>
          {/* Carousel Indicator Strip */}
          <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
            <div className="flex items-center gap-2">
              <span className="w-7 h-2 rounded-full bg-secondary"></span>
              {" "}
              <span className="w-2.5 h-2 rounded-full bg-surface-container-highest"></span>
              {" "}
              <span className="w-2.5 h-2 rounded-full bg-surface-container-highest"></span>
            </div>
            <span className="font-body-sm text-body-sm text-text-muted">
              {`Showing ${products.length} Authorized Crompton ${needsFallback ? "Products" : "Bestsellers"} • Direct Guwahati Dispatch`}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
