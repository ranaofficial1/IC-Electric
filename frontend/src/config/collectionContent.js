// Marketing copy + imagery for the home-page "collection" tiles, keyed by the
// category/subcategory slug the tile links to. This is presentation only — the
// tiles themselves (which ones exist, their names, where they link, product
// counts and "from" prices) come from the API. A subcategory with no entry here
// (for example one added later in the admin panel) still renders, falling back
// to its own name/description and a gradient tile.
export const COLLECTION_CONTENT = {
  "table-fans": {
    series: "Portable Series",
    badge: "High RPM",
    blurb: "Experience refreshing breeze with compact high-thrust oscillating table fans.",
    icon: "desk",
    image: "https://anuragtraders.com/wp-content/uploads/Table-Fans-Main.webp",
  },
  "ceiling-fans": {
    series: "Designer Series",
    badge: "Energy Saving",
    blurb: "Serene quietness, aerodynamically designed sweeps and high air delivery for every room.",
    icon: "mode_fan",
    image: "https://anuragtraders.com/wp-content/uploads/Category-Brochure-Download.webp",
  },
  "storage-heaters": {
    badge: "5-Star BEE Rated",
    blurb: "High-capacity tanks equipped with custom temperature presets, magnesium anode rod for anti-corrosion, and 8-bar pressure compatibility.",
    highlight: "7-Year Tank Manufacturer Warranty",
    highlightIcon: "verified",
    image: "https://anuragtraders.com/wp-content/uploads/Water-Heater-Mobile.webp",
  },
  "instant-heaters": {
    badge: "Instant Hot Water",
    blurb: "Fast copper heating element delivering steaming water in seconds. Compact aerodynamic body tailored for contemporary bathroom aesthetics.",
    highlight: "Rapid Pure Copper Coil",
    highlightIcon: "bolt",
    image: "https://anuragtraders.com/wp-content/uploads/Instant-Water-Heaters-Collections.webp",
  },
  "immersion-rod": {
    badge: "Heavy Duty",
    blurb: "Experience efficient heating with anti-corrosive nickel-plated heating coils, water level indicator, and shock-proof safety handle.",
    highlight: "Water-proof Shock Resistant Head",
    highlightIcon: "shield",
    image: "https://anuragtraders.com/wp-content/uploads/Immersion-Rod-Banner.webp",
  },
  "ceiling-lights": {
    image: "https://anuragtraders.com/wp-content/uploads/Ceiling-Light-Banner.webp",
    
  },
  "tube-lights": {
    image: "https://anuragtraders.com/wp-content/uploads/Tube-Light-Banner.webp",
  },
  "extension-board": {
    image: "https://anuragtraders.com/wp-content/uploads/Extension-Board-Banner.webp",
  },
};

export function collectionContent(slug) {
  return COLLECTION_CONTENT[slug] || {};
}
