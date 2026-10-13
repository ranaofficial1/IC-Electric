import { ImageCard, MenuSkeleton, ViewAll, productCountLabel } from "./shared.jsx";
import { imageFor, summarize, useMenuCategory, useMenuProducts } from "../../../hooks/useMenuData.js";
import { collectionContent } from "../../../config/collectionContent.js";
import { formatPrice } from "../../../utils/formatPrice.js";

const SLUG = "water-heaters";

// Water Heaters: dark, tall "spec sheet" cards — one per heater type, showing
// the headline feature and the live starting price.
export default function WaterHeatersMenu() {
  const { node } = useMenuCategory(SLUG);
  const { products } = useMenuProducts(SLUG);
  const stats = summarize(products);
  const kids = node?.children || [];

  return (
    <div className="rounded-2xl bg-primary p-6 text-on-primary">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-secondary-container">
            Thermal engineering
          </span>
          <h3 className="font-headline-sm text-headline-sm">Water Heaters</h3>
        </div>
        <ViewAll to={`/category/${SLUG}`} className="text-secondary-container hover:text-white">Explore complete range</ViewAll>
      </div>
      <div className="grid grid-cols-3 gap-5">
        {!node && [0, 1, 2].map((i) => <MenuSkeleton key={i} dark className="h-[250px]" />)}
        {kids.map((sub, i) => {
          const c = collectionContent(sub.slug);
          const stat = stats[sub.slug];
          return (
            <ImageCard
              key={sub.id}
              to={`/category/${sub.slug}`}
              src={imageFor(sub, products)}
              alt={sub.name}
              icon={node.icon}
              accent={node.accent}
              style={{ animationDelay: `${i * 50}ms` }}
              className="menu-stagger h-[250px] ring-1 ring-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/70 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex w-[62%] flex-col justify-between p-5">
                <div>
                  {c.badge && (
                    <span className="rounded-full bg-discount-emerald px-2.5 py-0.5 font-label-sm text-label-sm font-bold">{c.badge}</span>
                  )}
                  <div className="mt-3 font-title-lg text-title-lg">{sub.name}</div>
                  {c.highlight && (
                    <div className="mt-2 flex items-start gap-1.5 font-label-md text-label-md text-secondary-container">
                      <span className="material-symbols-outlined text-[16px]">{c.highlightIcon || "verified"}</span>
                      {c.highlight}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-body-sm text-body-sm text-on-primary-container">
                    {stat ? `${productCountLabel(stat.count)} · from` : "Browse the range"}
                  </div>
                  {stat && <div className="font-headline-sm text-headline-sm">{formatPrice(stat.minPrice)}</div>}
                </div>
              </div>
            </ImageCard>
          );
        })}
      </div>
    </div>
  );
}
