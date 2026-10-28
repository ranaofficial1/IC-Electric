import MasterDetailMenu from "./MasterDetailMenu.jsx";
import { productsIn, useMenuCategory, useMenuProducts } from "../../../hooks/useMenuData.js";

const SLUG = "kitchen-appliances";
const ICONS = { "food-preparation": "blender", cooking: "skillet", brewing: "coffee_maker", "fabric-care": "iron" };

// Kitchen Appliances: master–detail. Hover a subcategory on the left and the
// product grid on the right switches to that range. This is the reference
// layout (see MasterDetailMenu.jsx) every other mega menu now shares.
export default function KitchenMenu() {
  const { node } = useMenuCategory(SLUG);
  const { products, loading } = useMenuProducts(SLUG);

  const items = (node?.children || []).map((sub) => ({
    key: sub.slug,
    name: sub.name,
    to: `/category/${sub.slug}`,
    icon: ICONS[sub.slug],
    products: productsIn(products, sub.slug),
  }));

  return (
    <MasterDetailMenu
      railLabel="Kitchen range"
      items={items}
      ready={Boolean(node)}
      loading={loading}
      viewAll={{ to: `/category/${SLUG}`, label: "All kitchen appliances" }}
      accent={node?.accent}
    />
  );
}
