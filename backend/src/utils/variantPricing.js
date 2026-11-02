const pool = require("../config/db");

// Variant pricing: a product_option_values row may carry its own `price`
// (and optional `sale_price`). When such a value is selected, that price
// REPLACES the product's price — it is never added to it. If several selected
// values have a price, the one from the option listed last wins.
// Always computed on the server so a tampered client can't change prices.

// Lowest price any variant of the product can have; used as the "from" price
// when the product's own price field is left blank.
const MIN_VARIANT_PRICE_SQL = `(SELECT MIN(COALESCE(NULLIF(pov.sale_price, 0), pov.price))
  FROM product_options po
  JOIN product_option_values pov ON pov.option_id = po.id
  WHERE po.product_id = p.id AND pov.price IS NOT NULL)`;

/**
 * Product's own price blank (0) → show the cheapest variant price instead of ₹0.
 * Keeps the stored value as `raw_price` so the admin form can show it as blank.
 */
function withDisplayPrice(row) {
  if (!row) return row;
  const raw = Number(row.price) || 0;
  const out = { ...row, raw_price: raw };
  if (raw <= 0 && row.variant_min_price != null) {
    out.price = Number(row.variant_min_price);
    out.sale_price = null;
  }
  return out;
}

function parseOptions(raw) {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) || {};
    } catch {
      return {};
    }
  }
  return raw;
}

const keyOf = (optionName, value) => `${optionName}\u0000${value}`;

/**
 * Loads the variant prices of the given products.
 * Returns Map<productId, Map<"name\0value", { sort, price, salePrice }>>.
 * Pass a transaction connection as `conn` to read inside it.
 */
async function loadVariantPrices(productIds, conn = pool) {
  const ids = [...new Set(productIds.filter((id) => id != null))];
  const result = new Map();
  if (ids.length === 0) return result;

  const [rows] = await conn.query(
    `SELECT po.product_id, po.name AS option_name, po.sort_order, pov.value, pov.price, pov.sale_price
     FROM product_options po
     JOIN product_option_values pov ON pov.option_id = po.id
     WHERE po.product_id IN (?) AND pov.price IS NOT NULL`,
    [ids]
  );

  for (const row of rows) {
    if (!result.has(row.product_id)) result.set(row.product_id, new Map());
    result.get(row.product_id).set(keyOf(row.option_name, row.value), {
      sort: row.sort_order,
      price: Number(row.price),
      salePrice: row.sale_price != null && Number(row.sale_price) > 0 ? Number(row.sale_price) : null,
    });
  }
  return result;
}

/**
 * Price of one line: the selected variant's own price if it has one,
 * otherwise the product's price. Returns { price, sale_price }.
 */
function resolvePrice(variantPrices, row, selectedOptions) {
  const forProduct = variantPrices.get(row.product_id);
  let best = null;
  if (forProduct) {
    for (const [name, value] of Object.entries(parseOptions(selectedOptions))) {
      const hit = forProduct.get(keyOf(name, value));
      if (hit && (!best || hit.sort >= best.sort)) best = hit;
    }
  }
  if (best) return { price: best.price, sale_price: best.salePrice };
  return {
    price: Number(row.price),
    sale_price: row.sale_price != null ? Number(row.sale_price) : null,
  };
}

module.exports = { MIN_VARIANT_PRICE_SQL, withDisplayPrice, loadVariantPrices, resolvePrice };
