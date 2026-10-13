import CollectionsMenu from "./CollectionsMenu.jsx";
import FansMenu from "./FansMenu.jsx";
import WaterHeatersMenu from "./WaterHeatersMenu.jsx";
import KitchenMenu from "./KitchenMenu.jsx";
import HomeAppliancesMenu from "./HomeAppliancesMenu.jsx";
import SmartLightsMenu from "./SmartLightsMenu.jsx";
import AboutMenu from "./AboutMenu.jsx";
import { ROUTES } from "../../../config/navRoutes.js";

// One entry per navbar heading, in nav order. `route` is the existing
// ROUTES key (so the headings still navigate exactly as before), `Panel` is
// that heading's own mega-menu layout, `prefetch` the product slug to warm on
// hover (null = whole catalog / none) and `mobile` what the mobile accordion
// lists: "roots" (all top-level categories), a category slug (its
// subcategories) or "links" (static links).
export const MENU_ITEMS = [
  { key: "shop", label: "Collections", routeKey: "shop", Panel: CollectionsMenu, prefetch: null, mobile: "roots" },
  { key: "premium-fans", label: "Premium Fans", routeKey: "premium-fans", Panel: FansMenu, prefetch: "fans", mobile: "fans" },
  { key: "water-heaters", label: "Water Heaters", routeKey: "water-heaters", Panel: WaterHeatersMenu, prefetch: "water-heaters", mobile: "water-heaters" },
  { key: "kitchen-appliances", label: "Kitchen Appliances", routeKey: "kitchen-appliances", Panel: KitchenMenu, prefetch: "appliances", mobile: "appliances" },
  { key: "home-appliances", label: "Home Appliances", routeKey: "home-appliances", Panel: HomeAppliancesMenu, prefetch: "appliances", mobile: null },
  { key: "smart-lights", label: "Smart Lights", routeKey: "smart-lights", Panel: SmartLightsMenu, prefetch: "smart-lights", mobile: "smart-lights" },
  { key: "about-us", label: "About Us", routeKey: "about-us", Panel: AboutMenu, prefetch: undefined, mobile: "links" },
];

export const ABOUT_LINKS = [
  { label: "Our Story", to: ROUTES["about-us"] },
  { label: "Dealership Network", to: ROUTES["dealership-network"] },
  { label: "Warranty Claims", to: ROUTES["warranty-claims"] },
  { label: "Bulk Orders", to: ROUTES["bulk-orders"] },
  { label: "Contact Us", to: ROUTES["contact-us"] },
];
