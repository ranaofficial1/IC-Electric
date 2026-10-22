import MasterDetailMenu from "./MasterDetailMenu.jsx";
import { productsIn, useMenuCategory, useMenuProducts } from "../../../hooks/useMenuData.js";

const SLUG = "smart-lights";
const ICONS = { "ceiling-lights": "light", "tube-lights": "tungsten", "extension-board": "power" };

// Smart Lights: Kitchen's master–detail layout — one rail entry per subcategory.
export default function SmartLightsMenu() {
  const { node } = useMenuCategory(SLUG);
  const { products, loading } = useMenuProducts(SLUG);

  const items = (node?.children || []).map((sub) => ({
    key: sub.slug,
    name: sub.name,
    to: `/category/${sub.slug}`,
    icon: ICONS[sub.slug] || "lightbulb",
    products: productsIn(products, sub.slug),
  }));

  return (
    <MasterDetailMenu
      railLabel="Light up smarter"
      items={items}
      ready={Boolean(node)}
      loading={loading}
      note="Energy-saving LEDs and safe power strips."
      viewAll={{ to: `/category/${SLUG}`, label: "Shop all" }}
      fallbackIcon="lightbulb"
      tileIcon="bolt"
      accent="#D97706"
    />
  );
}
