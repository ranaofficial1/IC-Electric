import { useMemo } from "react";
import { Link } from "react-router-dom";
import ActionFeedback from "../ui/ActionFeedback.jsx";
import HomeProductTile from "./HomeProductTile.jsx";
import { useCategories } from "../../context/CategoriesContext.jsx";
import { useProductList } from "../../hooks/useCatalog.js";
import { useShopActions } from "../../hooks/useShopActions.js";

const KITCHEN_SLUG = "appliances";
// Irons live in the Home Appliances section, so they are not repeated here.
const EXCLUDED_SUBCATEGORIES = ["fabric-care"];
const PRODUCT_LIMIT = 6;

// Kitchen products grid: real products from the "appliances" (Kitchen Appliances)
// category and its subcategories, with working Add to Cart / Buy Now.
export default function KitchenGrid() {
  const { findCategory } = useCategories();
  const actions = useShopActions();

  const subs = (findCategory(KITCHEN_SLUG)?.children || []).filter(
    (c) => !EXCLUDED_SUBCATEGORIES.includes(c.slug)
  );
  const slugKey = subs.map((c) => c.slug).join(",");
  const filters = useMemo(
    () => ({ categorySlugs: slugKey ? slugKey.split(",") : [], sort: "newest", limit: PRODUCT_LIMIT }),
    [slugKey]
  );
  const { products, loading } = useProductList(filters, { enabled: slugKey !== "" });

  return (
    <>
      <section className="w-full px-gutter py-space-xl bg-surface-canvas" id="kitchen-grid">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-secondary font-label-sm text-label-sm uppercase font-bold tracking-wider">
                Culinary Engineering
              </span>
                <h2 className="font-headline-lg text-[28px] font-bold leading-[1.3] tracking-tight text-primary sm:text-[28px] sm:leading-[1.25] lg:text-headline-lg">
                Kitchen Applications
              </h2>
              <p className="font-body-lg text-body-lg text-text-secondary max-w-2xl mt-1">
                Crompton premium kitchen appliances blend into your lifestyle with ease to offer unparalleled, long-lasting, state-of-the-art comfort. From high-torque Ameo Pro mixers to smart Instaserve induction cooktops.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {subs.map((sub, index) => (
                <Link
                  key={sub.id}
                  to={`/category/${sub.slug}`}
                  className={
                    index === 0
                      ? "px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold"
                      : "px-3 py-1 rounded-full bg-surface-card text-text-secondary hover:text-secondary font-label-sm text-label-sm"
                  }
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
          {/* Real catalog products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface-card rounded-2xl h-[420px] shadow-sm animate-pulse" aria-hidden="true" />
              ))}
            {!loading && products.length === 0 && (
              <p className="col-span-full py-6 font-body-md text-body-md text-text-muted">No kitchen products available yet.</p>
            )}
            {!loading &&
              products.map((product) => (
                <HomeProductTile key={product.id} product={product} variant="kitchen" actions={actions} />
              ))}
          </div>
        </div>
      </section>
      <ActionFeedback feedback={actions.feedback} />
    </>
  );
}
