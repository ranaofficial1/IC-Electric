import { useMemo } from "react";
import ActionFeedback from "../ui/ActionFeedback.jsx";
import HomeProductTile from "./HomeProductTile.jsx";
import { useCategories } from "../../context/CategoriesContext.jsx";
import { useProductList } from "../../hooks/useCatalog.js";
import { useShopActions } from "../../hooks/useShopActions.js";

const KITCHEN_SLUG = "kitchen-appliances";
// Irons live in the Home Appliances section, so they are not repeated here.
const EXCLUDED_SUBCATEGORIES = ["fabric-care"];

// Ek subcategory ka sirf 1 (newest) product dikhata hai.
function SubcategoryProduct({ slug, actions }) {
  const filters = useMemo(
    () => ({ categorySlugs: [slug], sort: "newest", limit: 1 }),
    [slug]
  );
  const { products, loading } = useProductList(filters);

  if (loading) {
    return (
      <div
        className="bg-surface-card rounded-2xl h-[420px] shadow-sm animate-pulse"
        aria-hidden="true"
      />
    );
  }

  // Is subcategory mein koi product nahi hai to kuch render mat karo
  if (!products.length) return null;

  return (
    <HomeProductTile product={products[0]} variant="kitchen" actions={actions} />
  );
}

export default function KitchenGrid() {
  const { findCategory } = useCategories();
  const actions = useShopActions();

  const subs = (findCategory(KITCHEN_SLUG)?.children || []).filter(
    (c) => !EXCLUDED_SUBCATEGORIES.includes(c.slug)
  );

  return (
    <>
      <section className="w-full px-gutter-mobile sm:px-gutter py-16 sm:py-20 lg:py-24 bg-surface-canvas" id="kitchen-grid">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-12 lg:gap-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-secondary font-label-sm text-label-sm uppercase font-bold tracking-wider">
                Culinary Engineering
              </span>
              <h2 className="font-headline-lg text-[28px] font-bold leading-[1.3] tracking-tight text-primary sm:text-[28px] sm:leading-[1.25] lg:text-headline-lg">
                Kitchen Applications
              </h2>
              <p className="font-body-lg text-body-lg text-text-secondary max-w-2xl mt-1">
                Crompton premium kitchen appliances blend into your lifestyle with ease to offer unparalleled, long-lasting, state of the art comfort.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subs.length === 0 && (
              <p className="col-span-full py-6 font-body-md text-body-md text-text-muted">
                No kitchen products available yet.
              </p>
            )}
            {subs.map((sub) => (
              <SubcategoryProduct key={sub.slug} slug={sub.slug} actions={actions} />
            ))}
          </div>
        </div>
      </section>
      <ActionFeedback feedback={actions.feedback} />
    </>
  );
}