import { Link } from "react-router-dom";
import MediaTile from "../ui/MediaTile.jsx";
import { useCategories } from "../../context/CategoriesContext.jsx";
import { useCollectionStats } from "../../hooks/useCatalog.js";
import { collectionContent } from "../../config/collectionContent.js";
import { formatPrice } from "../../utils/formatPrice.js";

const FANS_SLUG = "fans";
const GRID_COLS = { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3" };

// Fans collection: the tiles are the real subcategories of the "fans" category
// (with live product counts and "from" prices); each links to its listing page.
export default function FansShowcase() {
  const { findCategory } = useCategories();
  const root = findCategory(FANS_SLUG);
  const tiles = root?.children || [];
  const { stats } = useCollectionStats(FANS_SLUG, { enabled: Boolean(root) });

  return (
    <>
      <section className="w-full px-gutter-mobile sm:px-gutter py-16 sm:py-20 lg:py-24 bg-surface" id="fans-showcase">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-12 lg:gap-16">
          {/* Fan Header Split Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center bg-surface-container-low p-6 sm:p-10 lg:p-14 rounded-2xl shadow-sm border border-border-subtle">
            <div className="lg:col-span-6 min-w-0 flex flex-col gap-4 sm:gap-5">
              <span className="text-secondary font-label-sm text-label-sm uppercase font-bold tracking-wider mb-1">
                {"Crompton Ventilation "}
                &amp;
                {" Aerodynamics"}
              </span>
              <h2 className="font-headline-lg text-[28px] font-bold leading-[1.3] tracking-tight text-primary sm:text-[28px] sm:leading-[1.25] lg:text-headline-lg">
                Premium Designed and Impart Grandeur Fans Collections
              </h2>
              <p className="font-body-lg text-body-lg text-text-secondary leading-relaxed max-w-xl">
                Enjoy the serene quiet of our noiseless fans, embrace the efficiency of our energy-saving BLDC fans, or enhance your décor with our premium designer fans.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-3 sm:pt-4">
                <Link className="inline-flex items-center gap-2 bg-secondary hover:bg-on-secondary-container text-on-secondary px-8 py-3 rounded-full font-label-md text-label-md font-bold transition-all shadow-md" to={`/category/${FANS_SLUG}`}>
                  {"Explore Collection "}
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </Link>
                {" "}
                <span className="text-discount-emerald font-label-md text-label-md font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">
                    eco
                  </span>
                  {" Saves Up To ₹1,500/yr On Power"}
                </span>
              </div>
            </div>
            <div className="lg:col-span-6 min-w-0">
              <div className="relative rounded-2xl overflow-hidden shadow-md">
                <img alt="Impart Grandeu" className="w-full h-56 sm:h-72 lg:h-[22rem] object-cover object-top" src="https://anuragtraders.com/wp-content/uploads/Crompton-Silent-Pro-Blossom-Smart-Fan-DB-7-1.webp" />
              </div>
            </div>
          </div>
          {/* Fans collection tiles — real subcategories */}
          {tiles.length > 0 && (
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${GRID_COLS[tiles.length] || "lg:grid-cols-4"} gap-6 lg:gap-8`}>
              {tiles.map((tile) => {
                const content = collectionContent(tile.slug);
                const stat = stats[tile.slug];
                const image = content.image || tile.image;
                return (
                  <Link
                    key={tile.id}
                    to={`/category/${tile.slug}`}
                    className="bg-surface-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-border-subtle transition-all group flex flex-col"
                  >
                    <div className="relative overflow-hidden bg-surface-container-low h-56 sm:h-60 lg:h-64">
                      <div className="h-full w-full group-hover:scale-105 transition-transform duration-500">
                        <MediaTile src={image} alt={tile.name} icon={tile.icon || "fan"} accent={tile.accent || undefined} fit="contain" />
                      </div>
                      {content.badge && (
                        <span className="absolute top-3 left-3 bg-surface-card/90 text-on-surface text-label-sm font-label-sm px-2.5 py-1 rounded-md font-bold">
                          {content.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      {content.series && (
                        <span className="font-body-sm text-body-sm text-text-muted uppercase">{content.series}</span>
                      )}
                      <h3 className="font-title-lg text-title-lg text-on-surface mt-2">{tile.name}</h3>
                      {(content.blurb || tile.description) && (
                        <p className="font-body-sm text-body-sm text-text-secondary mt-2 leading-relaxed">
                          {content.blurb || tile.description}
                        </p>
                      )}
                      {stat && (
                        <p className="font-label-sm text-label-sm text-discount-emerald font-bold mt-3">
                          {`From ${formatPrice(stat.minPrice)} • ${stat.count} ${stat.count === 1 ? "product" : "products"}`}
                        </p>
                      )}
                      <div className="mt-auto pt-5 flex items-center justify-between">
                        <span className="text-secondary font-label-md text-label-md font-bold group-hover:underline flex items-center gap-1">
                          {"Shop Now "}
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </span>
                        <span className="material-symbols-outlined text-outline-variant">{content.icon || "mode_fan"}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
