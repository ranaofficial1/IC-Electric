import MasterDetailMenu from "./MasterDetailMenu.jsx";
import { productsIn, summarize, useMenuCategory, useMenuProducts } from "../../../hooks/useMenuData.js";
import { collectionContent } from "../../../config/collectionContent.js";

const SLUG = "water-heaters";

// Water Heaters: Kitchen's master–detail layout — one rail entry per heater
// type, showing its headline feature and the live starting price.
export default function WaterHeatersMenu() {
  const { node } = useMenuCategory(SLUG);
  const { products, loading } = useMenuProducts(SLUG);
  const stats = summarize(products);

  const items = (node?.children || []).map((sub) => {
    const c = collectionContent(sub.slug);
    const stat = stats[sub.slug];
    return {
      key: sub.slug,
      name: sub.name,
      to: `/category/${sub.slug}`,
      icon: "water_heater",
      badge: c.badge,
      subtitle: c.highlight,
      from: stat?.minPrice,
      products: productsIn(products, sub.slug),
    };
  });

  return (
    <MasterDetailMenu
      railLabel="Water Heaters"
      items={items}
      ready={Boolean(node)}
      loading={loading}
      note="Thermal engineering"
      viewAll={{ to: `/category/${SLUG}`, label: "Explore complete range" }}
      fallbackIcon="water_heater"
      tileIcon="droplet"
      accent={node?.accent}
    />
  );
}
