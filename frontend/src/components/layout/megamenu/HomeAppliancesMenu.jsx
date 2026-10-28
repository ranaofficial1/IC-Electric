import MasterDetailMenu from "./MasterDetailMenu.jsx";
import { productsIn, useMenuCategory, useMenuProducts } from "../../../hooks/useMenuData.js";
import { ROUTES } from "../../../config/navRoutes.js";

const SLUG = "home-appliances";
// Apne home-appliances ke subcategory slugs yahan map karo (icon names MasterDetailMenu wale hi).
const ICONS = { "fabric-care": "iron" };

// Home Appliances: Kitchen jaisa master–detail. Left par subcategory hover karo,
// right ka product grid us range par switch ho jata hai.
export default function HomeAppliancesMenu() {
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
      railLabel="Home appliances"
      items={items}
      ready={Boolean(node)}
      loading={loading}
      viewAll={{ to: ROUTES["home-appliances"], label: "All home appliances" }}
      accent={node?.accent}
    />
  );
}