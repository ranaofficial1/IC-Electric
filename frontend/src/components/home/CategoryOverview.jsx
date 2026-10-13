import { Link } from "react-router-dom";
import { useCategories } from "../../context/CategoriesContext.jsx";

// Material Symbols icon per category slug (presentation only). Any category
// without an entry — e.g. one created later in the admin panel — gets "category".
const CATEGORY_ICONS = {
  "air-coolers": "air",
  coolers: "ac_unit",
  fans: "mode_fan",
  "water-heaters": "shower",
  appliances: "kitchen",
  "smart-lights": "tungsten",
};

const SUBTITLE_LIMIT = 3;

// Category discovery grid. Same card design as the reference, but the cards are
// the real top-level categories from the API and each one links to its page.
export default function CategoryOverview() {
  const { categories, loading } = useCategories();

  return (
    <>
      <section className="w-full px-gutter py-space-lg bg-surface">
        <div className="max-w-[1360px] mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-discount-emerald animate-pulse"></span>
            {" Authorized Crompton Hub Guwahati"}
          </div>
          <h2 className="font-headline-lg text-headline-lg text-primary max-w-full">
            Anurag Traders | Crompton Electrical Distributors
          </h2>
          <p className="font-body-lg text-body-lg text-text-secondary max-w-4xl mt-2">
            Your go-to destination for authentic Crompton Electrical Distributors in Guwahati. Supplying certified, energy-efficient solutions for residential complexes, architects, and commercial projects across Assam.
          </p>
          {/* Category Discovery Grid — real categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full mt-8">
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-surface-card rounded-md p-3 shadow-sm h-[50px] animate-pulse" aria-hidden="true" />
              ))}
            {!loading &&
              categories.map((category) => {
                const subtitle = (category.children || [])
                  .slice(0, SUBTITLE_LIMIT)
                  .map((child) => child.name)
                  .join(", ");
                return (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    id={`category-${category.slug}`}
                    className="bg-surface-card rounded-md p-3 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-all mb-3">
                      <span className="material-symbols-outlined text-[32px]">
                        {CATEGORY_ICONS[category.slug] || "category"}
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface">{category.name}</h3>
                    {subtitle && (
                      <p className="font-body-sm text-body-sm text-text-muted mt-1">{subtitle}</p>
                    )}
                    <span className="mt-3 text-secondary font-label-sm text-label-sm font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      {"Explore "}
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
}
