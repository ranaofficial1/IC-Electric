import { Link } from "react-router-dom";
import { ImageCard, MenuSkeleton, Price, ViewAll } from "./shared.jsx";
import MediaTile from "../../ui/MediaTile.jsx";
import { imageFor, useMenuCategory, useMenuProducts } from "../../../hooks/useMenuData.js";
import { collectionContent } from "../../../config/collectionContent.js";

const SLUG = "fans";

// Premium Fans: two large editorial tiles (one per fan type) beside a
// "top picks" product list.
export default function FansMenu() {
  const { node } = useMenuCategory(SLUG);
  const { products, loading } = useMenuProducts(SLUG);
  const kids = node?.children || [];
  const picks = [...products].sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller)).slice(0, 4);

  return (
    <div className="grid grid-cols-[1fr_340px] gap-8">
      <div className="grid grid-cols-2 gap-5">
        {!node && <MenuSkeleton className="col-span-2 h-[280px]" />}
        {kids.map((sub, i) => {
          const c = collectionContent(sub.slug);
          return (
            <ImageCard
              key={sub.id}
              to={`/category/${sub.slug}`}
              src={imageFor(sub, products)}
              alt={sub.name}
              icon={node.icon}
              accent={node.accent}
              style={{ animationDelay: `${i * 50}ms` }}
              className="menu-stagger h-[280px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              {c.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-discount-emerald px-3 py-1 font-label-sm text-label-sm font-bold text-on-primary">
                  {c.badge}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-5 text-on-primary">
                {c.series && (
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary-container">
                    {c.series}
                  </span>
                )}
                <div className="font-headline-sm text-headline-sm">{sub.name}</div>
                <p className="mt-1 line-clamp-2 font-body-sm text-body-sm text-on-primary-container">
                  {c.blurb || sub.description || node.description}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 font-label-md text-label-md font-bold">
                  Shop {sub.name}
                  <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </span>
              </div>
            </ImageCard>
          );
        })}
      </div>

      <aside className="flex flex-col rounded-2xl bg-surface-container-low p-5">
        <div className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-text-muted">Top picks</div>
        <ul className="mt-3 flex-1 divide-y divide-border-subtle">
          {loading && Array.from({ length: 4 }).map((_, i) => <li key={i} className="py-2"><MenuSkeleton className="h-14" /></li>)}
          {picks.map((p) => (
            <li key={p.id}>
              <Link to={`/product/${p.slug}`} className="group flex items-center gap-3 py-2.5">
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                  <MediaTile src={p.image} alt={p.name} icon="gauge" />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-label-lg text-label-lg text-primary transition-colors group-hover:text-secondary">{p.name}</div>
                  <Price product={p} className="text-body-sm text-secondary" />
                </div>
              </Link>
            </li>
          ))}
          {!loading && picks.length === 0 && <li className="py-3 font-body-sm text-body-sm text-text-muted">New fans arriving soon.</li>}
        </ul>
        <ViewAll to={`/category/${SLUG}`} className="mt-3 text-secondary">View all fans</ViewAll>
      </aside>
    </div>
  );
}
