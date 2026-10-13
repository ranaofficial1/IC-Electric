import { Link } from "react-router-dom";
import { MenuSkeleton, Price, ViewAll } from "./shared.jsx";
import MediaTile from "../../ui/MediaTile.jsx";
import { productsIn, useMenuCategory, useMenuProducts } from "../../../hooks/useMenuData.js";
import { ROUTES } from "../../../config/navRoutes.js";

const ROOT = "appliances";
const SLUG = "fabric-care"; // what "Home Appliances" points at (see navRoutes.js)

// Home Appliances: a slim horizontal showcase — headline on the left, a row of
// product cards, and cross-links to the other appliance ranges underneath.
export default function HomeAppliancesMenu() {
  const { node: sub } = useMenuCategory(SLUG);
  const { node: root } = useMenuCategory(ROOT);
  const { products, loading } = useMenuProducts(ROOT);
  const items = productsIn(products, SLUG).slice(0, 4);
  const others = (root?.children || []).filter((c) => c.slug !== SLUG);

  return (
    <div>
      <div className="flex gap-6">
        <div className="w-[230px] flex-shrink-0 rounded-2xl bg-gradient-to-br from-energy-amber/15 to-surface-container-low p-5">
          <span className="material-symbols-outlined text-[30px] text-energy-amber">iron</span>
          <h3 className="mt-2 font-headline-sm text-headline-sm text-primary">{sub?.name || "Home Appliances"}</h3>
          <p className="mt-1 font-body-sm text-body-sm text-text-secondary">
            {sub?.description || "Everyday helpers for a well-kept home — irons and garment care."}
          </p>
          <ViewAll to={ROUTES["home-appliances"]} className="mt-4 text-secondary">Shop now</ViewAll>
        </div>
        <div className="grid flex-1 grid-cols-4 gap-4">
          {loading && [0, 1, 2, 3].map((i) => <MenuSkeleton key={i} className="h-[170px]" />)}
          {items.map((p, i) => (
            <Link
              key={p.id}
              to={`/product/${p.slug}`}
              style={{ animationDelay: `${i * 45}ms` }}
              className="menu-stagger group flex flex-col rounded-2xl border border-border-subtle bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-secondary-container hover:shadow-md"
            >
              <div className="h-[110px] overflow-hidden rounded-xl bg-surface-container-low">
                <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                  <MediaTile src={p.image} alt={p.name} icon="iron" accent="#D97706" />
                </div>
              </div>
              <div className="mt-2 line-clamp-2 font-label-lg text-label-lg text-primary">{p.name}</div>
              <Price product={p} className="mt-auto pt-1 text-body-sm text-secondary" />
            </Link>
          ))}
          {!loading && items.length === 0 && <p className="col-span-4 self-center font-body-md text-body-md text-text-muted">New home appliances coming soon.</p>}
        </div>
      </div>
      {others.length > 0 && (
        <div className="mt-4 flex items-center gap-2 border-t border-border-subtle pt-3">
          <span className="font-label-md text-label-md text-text-muted">Also explore:</span>
          {others.map((c) => (
            <Link key={c.id} to={`/category/${c.slug}`} className="rounded-full bg-surface-container-low px-3 py-1 font-label-md text-label-md text-text-secondary transition-colors hover:bg-secondary hover:text-on-secondary">
              {c.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
