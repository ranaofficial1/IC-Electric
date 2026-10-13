import { Link } from "react-router-dom";
import { ImageCard, MenuSkeleton, ViewAll, productCountLabel } from "./shared.jsx";
import { imageFor, summarize, useMenuProducts, useMenuCategory } from "../../../hooks/useMenuData.js";
import { formatPrice } from "../../../utils/formatPrice.js";

// "All Collections": intro rail + a grid of medium image cards, one per
// top-level category, each with its subcategories as quick links.
export default function CollectionsMenu() {
  const { categories, loading: catLoading } = useMenuCategory();
  const { products, loading, failed } = useMenuProducts(null);
  const stats = summarize(products);
  // Hide categories that exist but hold nothing yet (once we know), so the grid stays meaningful.
  const roots = categories.filter((c) => failed || loading || stats[c.slug]?.count || c.children.length === 0);

  return (
    <div className="grid grid-cols-[240px_1fr] gap-8">
      <div className="flex flex-col justify-between rounded-2xl bg-primary-container p-6 text-on-primary">
        <div>
          <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary-container">
            Shop by category
          </span>
          <h3 className="mt-2 font-headline-sm text-headline-sm">All Collections</h3>
          <p className="mt-2 font-body-sm text-body-sm text-on-primary-container">
            Every Crompton range from one place — fans, heaters, kitchen, lighting and more.
          </p>
        </div>
        <div className="mt-6 space-y-3">
          {!loading && (
            <div className="font-label-md text-label-md text-primary-fixed-dim">
              {productCountLabel(products.length)} across {roots.length} collections
            </div>
          )}
          <ViewAll to="/shop" className="text-secondary-container hover:text-white">
            Browse all products
          </ViewAll>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {catLoading &&
          Array.from({ length: 6 }).map((_, i) => <MenuSkeleton key={i} className="h-[190px]" />)}
        {roots.map((cat, i) => {
          const stat = stats[cat.slug];
          return (
            <div
              key={cat.id}
              className="menu-stagger flex flex-col"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <ImageCard
                to={`/category/${cat.slug}`}
                src={imageFor(cat, products)}
                alt={cat.name}
                icon={cat.icon}
                accent={cat.accent}
                className="h-[150px]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-3 text-on-primary">
                  <span className="font-title-md text-title-md leading-tight">{cat.name}</span>
                  {stat && (
                    <span className="rounded-full bg-white/20 px-2 py-0.5 font-label-sm text-label-sm backdrop-blur">
                      from {formatPrice(stat.minPrice)}
                    </span>
                  )}
                </div>
              </ImageCard>
              {cat.children.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                  {cat.children.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        to={`/category/${sub.slug}`}
                        className="font-body-sm text-body-sm text-text-secondary transition-colors hover:text-secondary"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
