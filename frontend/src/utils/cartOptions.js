// Normalizes a variant-selection object (e.g. { Size: "M", Color: "Black" })
// into a stable string key so two option sets can be compared regardless of
// key insertion order. Used to build guest-cart line ids and to check
// whether a given variant is already in the cart.
export function serializeOptions(selectedOptions = {}) {
  return Object.entries(selectedOptions || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
}

export function optionsMatch(a, b) {
  return serializeOptions(a) === serializeOptions(b);
}
