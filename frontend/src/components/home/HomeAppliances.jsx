import { useMemo } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../ui/ActionFeedback.jsx";
import HomeProductTile from "./HomeProductTile.jsx";
import { useCategories } from "../../context/CategoriesContext.jsx";
import { useProductList } from "../../hooks/useCatalog.js";
import { useShopActions } from "../../hooks/useShopActions.js";

// "Home Appliances" = the "home-appliances" category if the store has one,
// otherwise the Fabric Care subcategory (irons) under Kitchen Appliances.
const PREFERRED_SLUG = "home-appliances";
const FALLBACK_SLUG = "fabric-care";
const PRODUCT_LIMIT = 6;

export default function HomeAppliances() {
  const { findCategory, loading: categoriesLoading } = useCategories();
  const actions = useShopActions();

  const homeSlug = findCategory(PREFERRED_SLUG) ? PREFERRED_SLUG : FALLBACK_SLUG;
  const filters = useMemo(
    () => ({ categorySlugs: [homeSlug], sort: "newest", limit: PRODUCT_LIMIT }),
    [homeSlug]
  );
  const { products, loading } = useProductList(filters, { enabled: !categoriesLoading });

  return (
    <>
      <section className="w-full px-gutter py-space-xl bg-surface" id="home-appliances">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          {/* Split Hero Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-surface-container-low p-8 rounded-2xl shadow-sm">
            <div className="lg:col-span-7 flex flex-col gap-space-sm">
              <span className="text-secondary font-label-sm text-label-sm uppercase font-bold tracking-wider">
                {"Fabric Care "}
                &amp;
                {" Winter Comfort"}
              </span>
              <h2 className="font-headline-lg text-[28px] font-bold leading-[1.3] tracking-tight text-primary sm:text-[28px] sm:leading-[1.25] lg:text-headline-lg">
                Home Applications
              </h2>
              <p className="font-body-lg text-body-lg text-text-secondary">
                Each product is meticulously crafted to provide long-lasting reliability that blends in harmoniously with putting the 'Home' in home appliances. From instant warmth convector heaters to anti-drip heavy dry irons.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Link className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-6 py-2.5 rounded-full font-label-md text-label-md font-bold hover:bg-on-secondary-container transition-all shadow-md" to={`/category/${homeSlug}`}>
                  {"Explore Collection "}
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
                {" "}
                <span className="text-text-muted font-body-sm text-body-sm">
                  Guwahati Showroom Warranty Assured
                </span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden">
                <img alt="Crompton Brio Dry Iron & Home Care Application" className="w-full h-64 object-cover" src="https://anuragtraders.com/wp-content/uploads/Home-Applications-Slide-Banner.webp" />
              </div>
            </div>
          </div>
          {/* Real products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface-card rounded-2xl h-[400px] shadow-sm animate-pulse" aria-hidden="true" />
              ))}
            {!loading && products.length === 0 && (
              <p className="col-span-full py-6 font-body-md text-body-md text-text-muted">No home appliances available yet.</p>
            )}
            {!loading &&
              products.map((product) => (
                <HomeProductTile key={product.id} product={product} variant="home" actions={actions} />
              ))}
          </div>
        </div>
      </section>
      <ActionFeedback feedback={actions.feedback} />
    </>
  );
}
