const pool = require("../config/db");
const categoryModel = require("./categoryModel");

// category_* = the product's top-level category; subcategory_* = the more
// specific node it is filed under (NULL when filed directly on the category).
const FROM_SQL = `
  FROM products p
  JOIN categories c ON c.id = p.category_id
  LEFT JOIN categories sc ON sc.id = p.subcategory_id
`;

const BASE_SELECT = `
  SELECT p.*, c.slug AS category_slug, c.name AS category_name,
    c.icon AS category_icon, c.accent_color AS category_accent,
    sc.slug AS subcategory_slug, sc.name AS subcategory_name,
    (SELECT pi.url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order ASC LIMIT 1) AS image,
    EXISTS(SELECT 1 FROM product_options po WHERE po.product_id = p.id) AS has_options
  ${FROM_SQL}
`;

/**
 * Lists products with the same filter/sort vocabulary the frontend already
 * uses in filterAndSortProducts() (data/products.js), so query params can
 * map 1:1 once the frontend is wired to this API.
 */
async function list({
  categorySlugs,
  query,
  minPrice,
  maxPrice,
  saleOnly,
  newOnly,
  bestSellersOnly,
  publishedOnly = true,
  sort = "newest",
  page = 1,
  limit = 12,
} = {}) {
  const where = [];
  const params = [];

  if (publishedOnly) where.push("p.is_published = 1");

  // Each slug may be a top-level category OR a subcategory; a category also
  // matches everything filed beneath it (e.g. "cooler" → Desert + Personal Cooler).
  if (categorySlugs && categorySlugs.length > 0) {
    const ids = await categoryModel.expandSlugsToIds(categorySlugs);
    if (ids.length === 0) {
      where.push("1 = 0"); // only unknown slugs → no results (same as before)
    } else {
      const marks = ids.map(() => "?").join(",");
      where.push(`(p.category_id IN (${marks}) OR p.subcategory_id IN (${marks}))`);
      params.push(...ids, ...ids);
    }
  }

  if (query && query.trim()) {
    where.push("(p.name LIKE ? OR c.name LIKE ? OR sc.name LIKE ?)");
    const like = `%${query.trim()}%`;
    params.push(like, like, like);
  }

  if (typeof minPrice === "number") {
    where.push("COALESCE(p.sale_price, p.price) >= ?");
    params.push(minPrice);
  }

  if (typeof maxPrice === "number") {
    where.push("COALESCE(p.sale_price, p.price) <= ?");
    params.push(maxPrice);
  }

  if (saleOnly) where.push("p.sale_price IS NOT NULL");
  if (newOnly) where.push("p.is_new = 1");
  if (bestSellersOnly) where.push("p.is_best_seller = 1");

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const sortMap = {
    "price-asc": "COALESCE(p.sale_price, p.price) ASC",
    "price-desc": "COALESCE(p.sale_price, p.price) DESC",
    popularity: "p.review_count DESC",
    newest: "p.created_at DESC",
  };
  const orderSql = sortMap[sort] || sortMap.newest;

  const offset = (page - 1) * limit;

  const [rows] = await pool.query(
    `${BASE_SELECT} ${whereSql} ORDER BY ${orderSql} LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ count }]] = await pool.query(
    `SELECT COUNT(*) AS count ${FROM_SQL} ${whereSql}`,
    params
  );

  return { rows, total: count, page, limit };
}

async function findBySlug(slug, { publishedOnly = true } = {}) {
  const where = publishedOnly ? "AND p.is_published = 1" : "";
  const [rows] = await pool.query(`${BASE_SELECT} WHERE p.slug = ? ${where} LIMIT 1`, [slug]);
  const product = rows[0];
  if (!product) return null;
  return attachRelations(product);
}

async function findById(id) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE p.id = ? LIMIT 1`, [id]);
  const product = rows[0];
  if (!product) return null;
  return attachRelations(product);
}

async function attachRelations(product) {
  const [images] = await pool.query(
    "SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC",
    [product.id]
  );
  const [specs] = await pool.query(
    "SELECT spec_key, spec_value FROM product_specs WHERE product_id = ? ORDER BY sort_order ASC",
    [product.id]
  );
  const [optionRows] = await pool.query(
    `SELECT po.id, po.name, pov.value
     FROM product_options po
     LEFT JOIN product_option_values pov ON pov.option_id = po.id
     WHERE po.product_id = ?
     ORDER BY po.sort_order ASC, pov.sort_order ASC`,
    [product.id]
  );

  const optionsMap = new Map();
  for (const row of optionRows) {
    if (!optionsMap.has(row.id)) optionsMap.set(row.id, { name: row.name, values: [] });
    if (row.value) optionsMap.get(row.id).values.push(row.value);
  }

  return {
    ...product,
    images: images.map((i) => i.url),
    specs: Object.fromEntries(specs.map((s) => [s.spec_key, s.spec_value])),
    options: Array.from(optionsMap.values()),
  };
}

async function getRelated(product, limit = 4) {
  const [rows] = await pool.query(
    `${BASE_SELECT} WHERE p.category_id = ? AND p.id != ? AND p.is_published = 1
     ORDER BY CASE WHEN p.subcategory_id = ? THEN 0 ELSE 1 END, p.id ASC LIMIT ?`,
    [product.category_id, product.id, product.subcategory_id ?? 0, limit]
  );
  return rows;
}

async function create(data) {
  const [result] = await pool.query(
    `INSERT INTO products
      (slug, name, description, category_id, subcategory_id, sku, price, sale_price, stock,
       is_new, is_best_seller, is_featured, is_published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.slug,
      data.name,
      data.description || null,
      data.categoryId,
      data.subcategoryId ?? null,
      data.sku || null,
      data.price,
      data.salePrice ?? null,
      data.stock ?? 0,
      data.isNew ? 1 : 0,
      data.isBestSeller ? 1 : 0,
      data.isFeatured ? 1 : 0,
      data.isPublished === false ? 0 : 1,
    ]
  );
  return findById(result.insertId);
}

async function update(id, data) {
  await pool.query(
    `UPDATE products SET
      slug = ?, name = ?, description = ?, category_id = ?, subcategory_id = ?, sku = ?,
      price = ?, sale_price = ?, stock = ?, is_new = ?, is_best_seller = ?,
      is_featured = ?, is_published = ?
     WHERE id = ?`,
    [
      data.slug,
      data.name,
      data.description || null,
      data.categoryId,
      data.subcategoryId ?? null,
      data.sku || null,
      data.price,
      data.salePrice ?? null,
      data.stock ?? 0,
      data.isNew ? 1 : 0,
      data.isBestSeller ? 1 : 0,
      data.isFeatured ? 1 : 0,
      data.isPublished === false ? 0 : 1,
      id,
    ]
  );
  return findById(id);
}

async function remove(id) {
  await pool.query("DELETE FROM products WHERE id = ?", [id]);
}

async function adjustStock(id, changeQty, reason = null, adminUserId = null) {
  await pool.query("UPDATE products SET stock = GREATEST(0, stock + ?) WHERE id = ?", [
    changeQty,
    id,
  ]);
  await pool.query(
    "INSERT INTO inventory_logs (product_id, change_qty, reason, created_by) VALUES (?, ?, ?, ?)",
    [id, changeQty, reason, adminUserId]
  );
  return findById(id);
}

async function updateRatingAggregate(productId) {
  const [[agg]] = await pool.query(
    "SELECT AVG(rating) AS avgRating, COUNT(*) AS count FROM reviews WHERE product_id = ? AND status = 'approved'",
    [productId]
  );
  await pool.query("UPDATE products SET rating = ?, review_count = ? WHERE id = ?", [
    agg.count > 0 ? Number(agg.avgRating).toFixed(1) : 0,
    agg.count,
    productId,
  ]);
}

async function replaceImages(productId, images = []) {
  await pool.query("DELETE FROM product_images WHERE product_id = ?", [productId]);
  if (images.length === 0) return;
  const values = images.map((url, i) => [productId, url, i]);
  await pool.query("INSERT INTO product_images (product_id, url, sort_order) VALUES ?", [values]);
}

async function replaceSpecs(productId, specs = {}) {
  await pool.query("DELETE FROM product_specs WHERE product_id = ?", [productId]);
  const entries = Object.entries(specs);
  if (entries.length === 0) return;
  const values = entries.map(([key, value], i) => [productId, key, value, i]);
  await pool.query(
    "INSERT INTO product_specs (product_id, spec_key, spec_value, sort_order) VALUES ?",
    [values]
  );
}

async function replaceOptions(productId, options = []) {
  const [existingOptions] = await pool.query(
    "SELECT id FROM product_options WHERE product_id = ?",
    [productId]
  );
  for (const opt of existingOptions) {
    await pool.query("DELETE FROM product_option_values WHERE option_id = ?", [opt.id]);
  }
  await pool.query("DELETE FROM product_options WHERE product_id = ?", [productId]);

  for (let i = 0; i < options.length; i += 1) {
    const { name, values } = options[i];
    const [result] = await pool.query(
      "INSERT INTO product_options (product_id, name, sort_order) VALUES (?, ?, ?)",
      [productId, name, i]
    );
    if (values && values.length > 0) {
      const rows = values.map((value, j) => [result.insertId, value, j]);
      await pool.query("INSERT INTO product_option_values (option_id, value, sort_order) VALUES ?", [
        rows,
      ]);
    }
  }
}

module.exports = {
  list,
  findBySlug,
  findById,
  getRelated,
  create,
  update,
  remove,
  adjustStock,
  updateRatingAggregate,
  replaceImages,
  replaceSpecs,
  replaceOptions,
};
