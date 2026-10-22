import MasterDetailMenu from "./MasterDetailMenu.jsx";
import { productsIn, useMenuCategory, useMenuProducts } from "../../../hooks/useMenuData.js";
import { collectionContent } from "../../../config/collectionContent.js";

const SLUG = "fans";

// Premium Fans: Kitchen's master–detail layout — one rail entry per fan type,
// plus "Top picks" (the best sellers across all fans).
export default function FansMenu() {
  const { node } = useMenuCategory(SLUG);
  const { products, loading } = useMenuProducts(SLUG);
  const picks = [...products].sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));

  const items = [
    ...(node?.children || []).map((sub) => {
      const c = collectionContent(sub.slug);
      return {
        key: sub.slug,
        name: sub.name,
        to: `/category/${sub.slug}`,
        icon: c.icon || "mode_fan",
        badge: c.badge,
        subtitle: c.series,
        products: productsIn(products, sub.slug),
      };
    }),
    ...(node ? [{ key: "top-picks", name: "Top picks", to: `/category/${SLUG}`, icon: "star", products: picks }] : []),
  ];

  return (
    <MasterDetailMenu
      railLabel="Premium fans"
      items={items}
      ready={Boolean(node)}
      loading={loading}
      viewAll={{ to: `/category/${SLUG}`, label: "View all fans" }}
      fallbackIcon="mode_fan"
      tileIcon="gauge"
      accent={node?.accent}
    />
  );
}
