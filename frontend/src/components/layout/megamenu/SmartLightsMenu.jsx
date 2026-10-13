import { Link } from "react-router-dom";
import { MenuSkeleton, Price, ViewAll, productCountLabel } from "./shared.jsx";
import MediaTile from "../../ui/MediaTile.jsx";
import { imageFor, productsIn, useMenuCategory, useMenuProducts } from "../../../hooks/useMenuData.js";

const SLUG = "smart-lights";
const ICONS = { "ceiling-lights": "light", "tube-lights": "tungsten", "extension-board": "power" };

// Smart Lights: a "directory" — one column per subcategory, each with its
// thumbnail header and a short product list.
export default function SmartLightsMenu() {
  const { node } = useMenuCategory(SLUG);
  const { products, loading } = useMenuProducts(SLUG);
  const kids = node?.children || [];

  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_200px] gap-6">
      {!node && [0, 1, 2].map((i) => <MenuSkeleton key={i} className="h-[240px]" />)}
      {kids.map((sub, i) => (
        <section key={sub.id} style={{ animationDelay: `${i * 50}ms` }} className="menu-stagger">
          <Link to={`/category/${sub.slug}`} className="group flex items-center gap-3 border-b-2 border-energy-amber/70 pb-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-surface-container-low ring-2 ring-white">
              <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
                <MediaTile src={imageFor(sub, products)} alt="" icon="bolt" accent="#D97706" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 font-title-md text-title-md text-primary group-hover:text-secondary">
                <span className="material-symbols-outlined text-[18px] text-energy-amber">{ICONS[sub.slug] || "lightbulb"}</span>
                {sub.name}
              </div>
              <div className="font-body-sm text-body-sm text-text-muted">{productCountLabel(productsIn(products, sub.slug).length)}</div>
            </div>
          </Link>
          <ul className="mt-2 space-y-1">
            {loading && [0, 1].map((k) => <li key={k}><MenuSkeleton className="h-10" /></li>)}
            {productsIn(products, sub.slug).slice(0, 3).map((p) => (
              <li key={p.id}>
                <Link to={`/product/${p.slug}`} className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-container-low">
                  <span className="line-clamp-1 font-body-md text-body-md text-text-secondary">{p.name}</span>
                  <Price product={p} className="flex-shrink-0 text-body-sm text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <div className="flex flex-col justify-between rounded-2xl bg-primary-container p-5 text-on-primary">
        <div>
          <span className="material-symbols-outlined text-[28px] text-energy-amber" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          <div className="mt-2 font-title-lg text-title-lg">Light up smarter</div>
          <p className="mt-1 font-body-sm text-body-sm text-on-primary-container">Energy-saving LEDs and safe power strips.</p>
        </div>
        <ViewAll to={`/category/${SLUG}`} className="mt-4 text-secondary-container hover:text-white">Shop all</ViewAll>
      </div>
    </div>
  );
}
