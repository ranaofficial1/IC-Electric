import MasterDetailMenu from "./MasterDetailMenu.jsx";
import { productCountLabel } from "./shared.jsx";
import { productsIn, summarize, useMenuProducts, useMenuCategory } from "../../../hooks/useMenuData.js";

// "All Collections": Kitchen's master–detail layout — one rail entry per
// top-level category; its subcategories are quick-link chips above the products.
export default function CollectionsMenu() {
  const { categories, loading: catLoading } = useMenuCategory();
  const { products, loading, failed } = useMenuProducts(null);
  const stats = summarize(products);
  // Hide categories that exist but hold nothing yet (once we know), so the list stays meaningful.
  const roots = categories.filter((c) => failed || loading || stats[c.slug]?.count || c.children.length === 0);

  const items = roots.map((cat) => ({
    key: cat.slug,
    name: cat.name,
    to: `/category/${cat.slug}`,
    iconKey: cat.icon,
    from: stats[cat.slug]?.minPrice,
    chips: cat.children.map((sub) => ({ key: sub.slug, name: sub.name, to: `/category/${sub.slug}` })),
    products: productsIn(products, cat.slug),
  }));

  return (
    <MasterDetailMenu
      railLabel="Shop by category"
      items={items}
      ready={!catLoading}
      loading={loading}
      // note={
      //   !loading
      //     ? `Every Crompton range from one place — fans, heaters, kitchen, lighting and more. ${productCountLabel(products.length)} across ${roots.length} collections.`
      //     : "Every Crompton range from one place — fans, heaters, kitchen, lighting and more."
      // }
      viewAll={{ to: "/shop", label: "Browse all products" }}
      tileIcon="category"
    />
  );
}
