// Variant pricing helpers. An option value may have its OWN price, which
// replaces the product price (it is never added to it):
//   product.options = [{ name: "Size", values: ["1200mm", "1400mm"],
//                        prices: [2999, 3299], salePrices: [null, 2999] }]
// If several selected values have a price, the option listed last wins. Values
// without a price (e.g. Color) leave the price untouched. The backend resolves
// the same way for logged-in carts and orders, so the price shown always matches checkout.

export function applyVariantPrice(product, selectedOptions = {}) {
  let price = product.price;
  let salePrice = product.salePrice ?? null;

  for (const option of product?.options || []) {
    const chosen = selectedOptions?.[option.name];
    if (chosen == null) continue;
    const index = (option.values || []).indexOf(chosen);
    const own = index >= 0 ? option.prices?.[index] : null;
    if (own != null) {
      price = Number(own);
      const sale = option.salePrices?.[index];
      salePrice = sale != null && Number(sale) > 0 ? Number(sale) : null;
    }
  }

  return { price, salePrice };
}
