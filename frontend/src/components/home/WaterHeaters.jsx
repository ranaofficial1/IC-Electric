import { Link } from "react-router-dom";
import MediaTile from "../ui/MediaTile.jsx";
import { useCategories } from "../../context/CategoriesContext.jsx";
import { useCollectionStats } from "../../hooks/useCatalog.js";
import { collectionContent } from "../../config/collectionContent.js";
import { formatPrice } from "../../utils/formatPrice.js";

const HEATERS_SLUG = "water-heaters";
const GRID_COLS = { 1: "md:grid-cols-1", 2: "md:grid-cols-2" };

// Water heaters collection: tiles are the real subcategories of "water-heaters"
// (live product counts + "from" prices); each links to its listing page.
export default function WaterHeaters() {
  const { findCategory } = useCategories();
  const root = findCategory(HEATERS_SLUG);
  const tiles = root?.children || [];
  const { stats } = useCollectionStats(HEATERS_SLUG, { enabled: Boolean(root) });

  return (
    <>
      <section className="w-full px-gutter pt-10 pb-14 bg-primary text-on-primary" id="water-heaters">
        <div className="max-w-[1360px] mx-auto flex flex-col gap-space-lg">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <span className="text-secondary-container font-label-sm text-label-sm uppercase font-bold tracking-wider">
                Thermal Engineering Excellence
              </span>
              <h2 className="font-headline-lg text-headline-lg text-surface-bright mt-1">
                Driving With Innovation — Water Heaters
              </h2>
              <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl mt-1">
                Enjoy instant access to perfectly heated water with Crompton's advanced water heater range. Smart heating modes, 5-star energy ratings, and rust-proof glassline tanks saving power daily.
              </p>
            </div>
            <Link className="inline-flex items-center gap-2 bg-secondary-container hover:bg-secondary text-primary font-bold px-6 py-2.5 rounded-full font-label-md text-label-md transition-all shadow-md" to={`/category/${HEATERS_SLUG}`}>
              {"Explore Complete Range "}
              <span className="material-symbols-outlined text-[18px]">
                arrow_forward
              </span>
            </Link>
          </div>
          {/* Water heater collection tiles — real subcategories */}
          {tiles.length > 0 && (
            <div className={`grid grid-cols-1 ${GRID_COLS[tiles.length] || "md:grid-cols-3"} gap-6`}>
              {tiles.map((tile) => {
                const content = collectionContent(tile.slug);
                const stat = stats[tile.slug];
                const image = content.image || tile.image;
                return (
                  <div key={tile.id} className="bg-surface-card text-on-surface rounded-2xl overflow-hidden shadow-lg flex flex-col group">
                    <Link to={`/category/${tile.slug}`} className="relative overflow-hidden bg-surface-container-low h-72 block">
                      <div className="h-full w-full group-hover:scale-105 transition-transform duration-500">
                        <MediaTile src={image} alt={tile.name} icon={tile.icon || "fire"} accent={tile.accent || undefined} />
                      </div>
                      {content.badge && (
                        <div className="absolute top-3 left-3 bg-discount-emerald text-on-primary text-label-sm font-label-sm px-3 py-1 rounded-full font-bold">
                          {content.badge}
                        </div>
                      )}
                    </Link>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-title-lg text-title-lg text-primary">{tile.name}</h3>
                      {(content.blurb || tile.description) && (
                        <p className="font-body-sm text-body-sm text-text-secondary mt-2">
                          {content.blurb || tile.description}
                        </p>
                      )}
                      {content.highlight && (
                        <div className="flex items-center gap-2 mt-4 text-discount-emerald font-label-sm text-label-sm font-bold">
                          <span className="material-symbols-outlined text-[16px]">{content.highlightIcon || "verified"}</span>
                          {` ${content.highlight}`}
                        </div>
                      )}
                      <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between">
                        <span className="font-label-sm text-label-sm text-text-muted">
                          {stat
                            ? `From ${formatPrice(stat.minPrice)} • ${stat.count} ${stat.count === 1 ? "product" : "products"}`
                            : "Browse the range"}
                        </span>
                        <Link
                          to={`/category/${tile.slug}`}
                          className="inline-flex items-center gap-1 bg-secondary text-on-secondary px-4 py-1.5 rounded-full font-label-sm text-label-sm font-bold hover:bg-on-secondary-container transition-colors"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
