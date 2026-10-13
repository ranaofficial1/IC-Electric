// Thin wrapper around Google's Material Symbols (the icon set used by the
// reference design) so call sites stay simple: <Icon name="cart" />.
// Names are our own short keys; the value is the Material Symbols ligature.
// An entry can be a plain string or [ligature, "filled"] for solid glyphs.
// Size comes from the call site's text-* class (Material Symbols is font-based).

const ICONS = {
  search: "search",
  cart: "shopping_bag",
  heart: "favorite",
  heartFilled: ["favorite", "filled"],
  user: "person",
  menu: "menu",
  close: "close",
  chevronDown: "expand_more",
  chevronRight: "arrow_forward",
  chevronLeft: "chevron_left",
  chevronNext: "chevron_right",
  star: ["star", "filled"],
  starHalf: ["star_half", "filled"],
  truck: "local_shipping",
  shield: "verified_user",
  rotate: "assignment_return",
  headset: "support_agent",
  check: "check_circle",
  smile: "sentiment_satisfied",
  fire: "local_fire_department",
  bolt: ["bolt", "filled"],
  hanger: "checkroom",
  home: "home",
  droplet: "water_drop",
  dumbbell: "fitness_center",
  star_ico: ["star", "filled"],
  plus: "add",
  minus: "remove",
  zoom: "zoom_in",
  circleX: "cancel",
  thumbsUp: "thumb_up",
  spinner: "progress_activity",
  lock: "lock",
  envelope: "mail",
  eye: "visibility",
  eyeSlash: "visibility_off",
  pencil: "edit",
  trash: "delete",
  mapPin: "location_on",
  box: "inventory_2",
  signOut: "logout",
  circleExclamation: "error",
  gauge: "speed",
  tags: "sell",
  users: "group",
  ticket: "confirmation_number",
  comment: "chat_bubble",
  chartLine: "show_chart",
  // Added with the redesign (reference design glyphs)
  call: "call",
  verified: "verified",
  schedule: "schedule",
  map: "map",
  eco: "eco",
  payments: "payments",
  build: "build",
  palette: "palette",
  share: "share",
  globe: "public",
  category: "category",
  send: "send",
  inventory: "inventory",
  flash: "flash_on",
  arrowOutward: "north_east",
  tune: "tune",
};

export default function Icon({ name, className = "", style, ...rest }) {
  // Unknown names (e.g. a category icon key typed in the admin panel) fall
  // back to a generic glyph instead of rendering nothing.
  const entry = ICONS[name] ?? ICONS.category;
  const [glyph, variant] = Array.isArray(entry) ? entry : [entry];
  const filled = variant === "filled";
  // Call sites from earlier phases sometimes pass no text-size class; those inherit the parent size.
  const hasSize = /(^|\s)text-(\[|xs\b|sm\b|base\b|lg\b|xl\b|\dxl\b)/.test(className);
  return (
    <span
      className={`material-symbols-outlined ${hasSize ? "" : "text-[1.25em]"} ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1", ...style } : style}
      aria-hidden="true"
      {...rest}
    >
      {glyph}
    </span>
  );
}
