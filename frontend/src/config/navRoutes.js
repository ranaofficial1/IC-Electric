/**
 * Where the reference design's links (its `data-path` values) point in this app.
 * Edit here to re-point any header/footer/home link.
 *
 * Catalog links go to the real category pages (`/category/<slug>`), where the
 * slug is the category's slug in the database (see backend/src/db/catalogData.js).
 * "/#id" = a section on the home page (Home scrolls to it).
 */
export const ROUTES = {
  "premium-fans": "/category/fans",
  "water-heaters": "/category/water-heaters",
  "kitchen-appliances": "/category/kitchen-appliances",
  // No standalone "Home Appliances" category exists yet: irons live under
  // Kitchen Appliances > Fabric Care. If you create a "home-appliances"
  // category in the admin panel, change this to "/category/home-appliances".
  "home-appliances": "/category/home-appliances",
  "smart-lights": "/category/smart-lights",
  "air-coolers": "/category/air-coolers",
  "about-us": "/about",
  "contact-us": "/contact",
  "bulk-orders": "/contact",
  "wishlist": "/wishlist",
  "cart": "/cart",
  "warranty-claims": "/contact",
  "dealership-network": "/about",
  "shipping-returns": "/shipping-policy",
  "privacy-policy": "/privacy-policy",
  "terms-conditions": "/terms",
  "shop": "/shop",
  "home": "/",
};
