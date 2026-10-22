import MasterDetailMenu from "./MasterDetailMenu.jsx";
import { productsIn, useMenuCategory, useMenuProducts } from "../../../hooks/useMenuData.js";
import { ROUTES } from "../../../config/navRoutes.js";

const ROOT = "appliances";
const SLUG = "fabric-care"; // what "Home Appliances" points at (see navRoutes.js)
const ICONS = { "food-preparation": "blender", cooking: "skillet", brewing: "coffee_maker", "fabric-care": "iron" };

// Home Appliances: Kitchen's master–detail layout. The Home Appliances range
// comes first (and is shown by default); the other appliance ranges that used
// to be "Also explore" chips are rail entries beneath it.
export default function HomeAppliancesMenu() {
  const { node: sub } = useMenuCategory(SLUG);
  const { node: root } = useMenuCategory(ROOT);
  const { products, loading } = useMenuProducts(ROOT);
  const others = (root?.children || []).filter((c) => c.slug !== SLUG);

  const items = [
    ...(sub
      ? [
          {
            key: sub.slug,
            name: sub.name || "Home Appliances",
            to: ROUTES["home-appliances"],
            icon: ICONS[sub.slug],
            subtitle: sub.description || "Everyday helpers for a well-kept home — irons and garment care.",
            products: productsIn(products, SLUG),
          },
        ]
      : []),
    ...others.map((c) => ({
      key: c.slug,
      name: c.name,
      to: `/category/${c.slug}`,
      icon: ICONS[c.slug],
      products: productsIn(products, c.slug),
    })),
  ];

  return (
    <MasterDetailMenu
      railLabel="Home appliances"
      items={items}
      ready={Boolean(sub)}
      loading={loading}
      viewAll={{ to: ROUTES["home-appliances"], label: "Shop now" }}
      tileIcon="iron"
      accent="#D97706"
    />
  );
}
