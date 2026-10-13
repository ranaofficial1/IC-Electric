// Real catalog data for Anurag Traders, recreated from the admin-panel
// screenshots (Admin → Categories and Admin → Products, page 1 of 2).
//
// This file is the single source of truth for the seeded catalog. The
// storefront no longer carries any hardcoded catalog data — everything it
// shows comes from the API, which reads what this seeds.
//
// What the screenshots showed (and this file mirrors exactly):
//   - 6 top-level categories, 18 subcategories (names, slugs, sort order)
//   - 20 products: name, category › subcategory, selling price, MRP (struck
//     through), stock, Published status
//
// What the screenshots did NOT show, so is deliberately left empty rather
// than invented: product images, long descriptions, spec tables, ratings and
// reviews, best-seller / new flags, and the 9 products on page 2 (the admin
// list said "29 products", only 20 were visible). Add those from the admin
// panel, or send page 2 and extend PRODUCTS below.

// `price` below is the MRP (the struck-through figure); `salePrice` is the
// price the shopper pays (the bold figure). That is how the store models it:
// products.price = MRP, products.sale_price = selling price.

const CATEGORY_TREE = [
  {
    slug: "air-coolers",
    name: "Air Coolers",
    description: "Desert, personal and tower air coolers for every room size.",
    icon: "droplet",
    accent: "#0b5cad",
    sort: 0,
    children: [
      { slug: "desert-cooler", name: "Desert Cooler", sort: 1, description: "High-capacity coolers for large rooms and dry heat." },
      { slug: "personal-cooler", name: "Personal Cooler", sort: 2, description: "Compact coolers for desks, bedrooms and small spaces." },
      { slug: "tower-cooler", name: "Tower Cooler", sort: 3, description: "Slim, space-saving tower coolers." },
    ],
  },
  {
    slug: "coolers",
    name: "Coolers",
    description: "Desert, tower and personal air coolers.",
    icon: "droplet",
    accent: "#0b5cad",
    sort: 0,
    children: [
      { slug: "desert-coolers", name: "Desert Coolers", sort: 1 },
      { slug: "tower-coolers", name: "Tower Coolers", sort: 2 },
      { slug: "personal-air-coolers", name: "Personal Air Coolers", sort: 3 },
    ],
  },
  {
    slug: "fans",
    name: "Fans",
    description: "Ceiling and table fans for every room.",
    icon: "gauge",
    accent: "#1f6f5c",
    sort: 0,
    children: [
      { slug: "ceiling-fans", name: "Ceiling Fans", sort: 1 },
      { slug: "table-fans", name: "Table Fans", sort: 2 },
    ],
  },
  {
    // Slug is "appliances" (not "kitchen-appliances") — exactly as in the admin panel.
    slug: "appliances",
    name: "Kitchen Appliances",
    description: "Mixers, blenders, kettles, cooktops, sandwich makers and irons.",
    icon: "home",
    accent: "#a45a12",
    sort: 0,
    children: [
      { slug: "food-preparation", name: "Food Preparation", sort: 1 },
      { slug: "cooking", name: "Cooking", sort: 2 },
      { slug: "brewing", name: "Brewing", sort: 3 },
      { slug: "fabric-care", name: "Fabric Care", sort: 4 },
    ],
  },
  {
    slug: "smart-lights",
    name: "Smart Lights",
    description: "LED ceiling lights, tube lights and extension boards.",
    icon: "bolt",
    accent: "#7a4bb5",
    sort: 0,
    children: [
      { slug: "ceiling-lights", name: "Ceiling Lights", sort: 1 },
      { slug: "tube-lights", name: "Tube Lights", sort: 2 },
      { slug: "extension-board", name: "Extension Board", sort: 3 },
    ],
  },
  {
    slug: "water-heaters",
    name: "Water Heaters",
    description: "Storage and instant geysers, and immersion rods.",
    icon: "fire",
    accent: "#b3361f",
    sort: 0,
    children: [
      { slug: "storage-heaters", name: "Storage Heaters", sort: 1 },
      { slug: "instant-heaters", name: "Instant Heaters", sort: 2 },
      { slug: "immersion-rod", name: "Immersion Rod", sort: 3 },
    ],
  },
];

// Listed in the same order as the admin Products screen (newest first).
// `category` is the TOP-LEVEL category slug, `subcategory` the subcategory slug.
const PRODUCTS = [
  { name: "Alpha C Powerbox Extension Board", category: "smart-lights", subcategory: "extension-board", salePrice: 999, price: 1200, stock: 229 },
  { name: "Alpha BX Powerbox Extension Board", category: "smart-lights", subcategory: "extension-board", salePrice: 699, price: 1000, stock: 50 },
  { name: "Crompton 22W TRIO Batten Tube Light", category: "smart-lights", subcategory: "tube-lights", salePrice: 1500, price: 2000, stock: 30, specs: { Power: "22 W" } },
  { name: "Crompton 20W Slim Shakti Led Batten", category: "smart-lights", subcategory: "tube-lights", salePrice: 600, price: 1000, stock: 200, specs: { Power: "20 W" } },
  { name: "Star Aura Round Ceiling Led Spotlight", category: "smart-lights", subcategory: "ceiling-lights", salePrice: 1200, price: 1500, stock: 200 },
  { name: "Spot Eco Round Ceiling Led Spotlight", category: "smart-lights", subcategory: "ceiling-lights", salePrice: 149, price: 200, stock: 200 },
  { name: "Crompton InstaGlide 1000 W Dry Iron", category: "appliances", subcategory: "fabric-care", salePrice: 1200, price: 2100, stock: 100, specs: { Power: "1000 W" } },
  { name: "Crompton Brio 1000 W Dry Iron", category: "appliances", subcategory: "fabric-care", salePrice: 1100, price: 1500, stock: 130, specs: { Power: "1000 W" } },
  { name: "Crompton InstaHot Electric Kettle 1.8L", category: "appliances", subcategory: "brewing", salePrice: 1500, price: 2000, stock: 30, specs: { Capacity: "1.8 L" } },
  { name: "ActivHot Cool Touch Electric Kettle", category: "appliances", subcategory: "brewing", salePrice: 2300, price: 2350, stock: 201 },
  { name: "InstaServe Grill Sandwich Maker", category: "appliances", subcategory: "cooking", salePrice: 2100, price: 2500, stock: 200 },
  { name: "Instaserve Slim 1500 W Induction", category: "appliances", subcategory: "cooking", salePrice: 3500, price: 7000, stock: 100, specs: { Power: "1500 W" } },
  { name: "Crompton Ameo Neo 3 Jar Mixer", category: "appliances", subcategory: "food-preparation", salePrice: 6100, price: 6500, stock: 20, specs: { Jars: "3" } },
  { name: "Blendserve Plastic Stem Blender", category: "appliances", subcategory: "food-preparation", salePrice: 1930, price: 2100, stock: 50 },
  { name: "Crompton IHL Immersion Heater2", category: "water-heaters", subcategory: "immersion-rod", salePrice: 740, price: 900, stock: 100 },
  { name: "Crompton IHL Immersion Heater", category: "water-heaters", subcategory: "immersion-rod", salePrice: 920, price: 1000, stock: 90 },
  { name: "Rapid Jet Instant Heater", category: "water-heaters", subcategory: "instant-heaters", salePrice: 4900, price: 5200, stock: 80 },
  { name: "Crompton Rapid Jet 1L Heater", category: "water-heaters", subcategory: "instant-heaters", salePrice: 4400, price: 5600, stock: 100, specs: { Capacity: "1 L" } },
  { name: "Crompton Arno Neo", category: "water-heaters", subcategory: "storage-heaters", salePrice: 8100, price: 8500, stock: 90 },
  { name: "Crompton Amica Classic", category: "water-heaters", subcategory: "storage-heaters", salePrice: 9500, price: 10000, stock: 70 },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = { CATEGORY_TREE, PRODUCTS, slugify };
