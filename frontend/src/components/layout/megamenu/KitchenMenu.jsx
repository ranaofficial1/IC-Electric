import { useState } from "react";
import { Link } from "react-router-dom";
import { MenuSkeleton, Price, ViewAll, productCountLabel } from "./shared.jsx";
import MediaTile from "../../ui/MediaTile.jsx";
import { productsIn, useMenuCategory, useMenuProducts } from "../../../hooks/useMenuData.js";

const SLUG = "appliances";
const ICONS = { "food-preparation": "blender", cooking: "skillet", brewing: "coffee_maker", "fabric-care": "iron" };

// Kitchen Appliances: master–detail. Hover a subcategory on the left and the
// product grid on the right switches to that range.
export default function KitchenMenu() {
  const { node } = useMenuCategory(SLUG);
  const { products, loading } = useMenuProducts(SLUG);
  const [picked, setPicked] = useState(null);
  const kids = node?.children || [];
  const active = kids.find((k) => k.slug === picked) || kids[0];
  const shown = active ? productsIn(products, active.slug).slice(0, 4) : [];

  return (
    <div className="grid grid-cols-[260px_1fr] overflow-hidden rounded-2xl border border-border-subtle">
      <div className="bg-surface-container-low p-3">
        <div className="px-3 pb-2 pt-1 font-label-sm text-label-sm font-bold uppercase tracking-wider text-text-muted">
          Kitchen range
        </div>
        {!node && [0, 1, 2, 3].map((i) => <MenuSkeleton key={i} className="mb-2 h-11" />)}
        {kids.map((sub) => {
          const on = sub.slug === active?.slug;
          return (
            <Link
              key={sub.id}
              to={`/category/${sub.slug}`}
              onMouseEnter={() => setPicked(sub.slug)}
              onFocus={() => setPicked(sub.slug)}
              className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                on ? "bg-white text-secondary shadow-sm" : "text-text-secondary hover:bg-white/60"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{ICONS[sub.slug] || "kitchen"}</span>
              <span className="flex-1 font-label-lg text-label-lg">{sub.name}</span>
              <span className="font-label-sm text-label-sm text-text-muted">{productsIn(products, sub.slug).length || ""}</span>
              <span className={`material-symbols-outlined text-[16px] transition-transform ${on ? "translate-x-0.5" : "opacity-0"}`}>chevron_right</span>
            </Link>
          );
        })}
        <div className="mt-2 px-3"><ViewAll to={`/category/${SLUG}`} className="text-secondary">All kitchen appliances</ViewAll></div>
      </div>

      <div className="bg-white p-5">
        {active && (
          <div key={active.slug} className="menu-fade">
            <div className="mb-3 flex items-baseline justify-between">
              <div className="font-title-lg text-title-lg text-primary">{active.name}</div>
              <span className="font-body-sm text-body-sm text-text-muted">{productCountLabel(productsIn(products, active.slug).length)}</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {loading && [0, 1, 2, 3].map((i) => <MenuSkeleton key={i} className="h-[200px]" />)}
              {shown.map((p) => (
                <Link key={p.id} to={`/product/${p.slug}`} className="group">
                  <div className="aspect-square overflow-hidden rounded-xl bg-surface-container-low">
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                      <MediaTile src={p.image} alt={p.name} icon="kitchen" accent={node?.accent} />
                    </div>
                  </div>
                  <div className="mt-2 line-clamp-2 font-label-lg text-label-lg text-primary group-hover:text-secondary">{p.name}</div>
                  <Price product={p} className="text-body-sm text-secondary" />
                </Link>
              ))}
              {!loading && shown.length === 0 && (
                <p className="col-span-4 py-10 text-center font-body-md text-body-md text-text-muted">Products coming soon to {active.name}.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
