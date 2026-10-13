const pool = require("../config/db");
const ApiError = require("../utils/ApiError");

// Categories form a tree via categories.parent_id (NULL = top-level).
// products.category_id always points at the TOP-LEVEL ancestor, and
// products.subcategory_id at the more specific node (NULL = filed directly
// on the top-level category). The helpers below keep that invariant.
//
// The whole table is small (tens of rows), so the tree is computed in JS
// from one flat query instead of recursive CTEs — works on any MySQL/MariaDB.
const MAX_DEPTH = 3; // top-level = depth 1, e.g. Cooler(1) > Desert Cooler(2) > Tower(3)

const BASE_SELECT = `
  SELECT c.*, pc.slug AS parent_slug, pc.name AS parent_name
  FROM categories c
  LEFT JOIN categories pc ON pc.id = c.parent_id
`;

async function fetchAllRows() {
  const [rows] = await pool.query(`${BASE_SELECT} ORDER BY c.sort_order ASC, c.name ASC`);
  return rows;
}

function indexRows(rows) {
  const byId = new Map(rows.map((r) => [r.id, r]));
  const childrenOf = new Map();
  for (const r of rows) {
    const key = r.parent_id ?? null;
    if (!childrenOf.has(key)) childrenOf.set(key, []);
    childrenOf.get(key).push(r);
  }
  return { byId, childrenOf };
}

// Root-first chain of ancestors (excluding the node itself).
function ancestorsOf(node, byId) {
  const chain = [];
  const seen = new Set([node.id]);
  let cursor = node.parent_id != null ? byId.get(node.parent_id) : null;
  while (cursor && !seen.has(cursor.id)) {
    chain.unshift(cursor);
    seen.add(cursor.id);
    cursor = cursor.parent_id != null ? byId.get(cursor.parent_id) : null;
  }
  return chain;
}

function descendantsOf(id, childrenOf) {
  const out = [];
  const stack = [...(childrenOf.get(id) || [])];
  while (stack.length) {
    const node = stack.shift();
    out.push(node);
    stack.push(...(childrenOf.get(node.id) || []));
  }
  return out;
}

function subtreeHeight(id, childrenOf) {
  const kids = childrenOf.get(id) || [];
  return 1 + (kids.length ? Math.max(...kids.map((k) => subtreeHeight(k.id, childrenOf))) : 0);
}

// A category is publicly visible only if it and every ancestor are active.
function isVisible(node, byId) {
  if (!node.is_active) return false;
  return ancestorsOf(node, byId).every((a) => a.is_active);
}

// Depth-first, siblings in sort_order — each row annotated with `depth` (1 = top level).
function flattenTree(rows, { includeInactive }) {
  const { byId, childrenOf } = indexRows(rows);
  const out = [];
  const walk = (parentId, depth) => {
    for (const node of childrenOf.get(parentId) || []) {
      if (!includeInactive && !isVisible(node, byId)) continue;
      out.push({ ...node, depth });
      walk(node.id, depth + 1);
    }
  };
  walk(null, 1);
  return out;
}

// Nested form: top-level categories, each with a `children` array (recursive).
function nestFlat(flat) {
  const nodes = new Map(flat.map((r) => [r.id, { ...r, children: [] }]));
  const roots = [];
  for (const r of flat) {
    const node = nodes.get(r.id);
    const parent = r.parent_id != null ? nodes.get(r.parent_id) : null;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  return roots;
}

/** Flat, tree-ordered list (each row has `depth`, `parent_id`, `parent_slug`). */
async function list({ includeInactive = false } = {}) {
  return flattenTree(await fetchAllRows(), { includeInactive });
}

/** Top-level categories with nested `children`. */
async function listTree({ includeInactive = false } = {}) {
  return nestFlat(await list({ includeInactive }));
}

async function findBySlug(slug) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE c.slug = ? LIMIT 1`, [slug]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query(`${BASE_SELECT} WHERE c.id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

/** Category + `children` (direct) + `ancestors` (root-first, for breadcrumbs). */
async function findDetailBySlug(slug, { includeInactive = false } = {}) {
  const rows = await fetchAllRows();
  const { byId, childrenOf } = indexRows(rows);
  const node = rows.find((r) => r.slug === slug);
  if (!node) return null;

  const children = (childrenOf.get(node.id) || []).filter(
    (c) => includeInactive || isVisible(c, byId)
  );
  return {
    ...node,
    children,
    ancestors: ancestorsOf(node, byId).map((a) => ({ id: a.id, slug: a.slug, name: a.name })),
  };
}

/** The node plus all of its descendants' ids (used for product filtering). */
async function expandSlugsToIds(slugs) {
  const rows = await fetchAllRows();
  const { childrenOf } = indexRows(rows);
  const ids = new Set();
  for (const slug of slugs) {
    const node = rows.find((r) => r.slug === slug);
    if (!node) continue;
    ids.add(node.id);
    descendantsOf(node.id, childrenOf).forEach((d) => ids.add(d.id));
  }
  return Array.from(ids);
}

/**
 * Validates a (re)parenting. Throws ApiError(422) on: unknown parent, parent
 * === self, parent inside own subtree (cycle), or exceeding MAX_DEPTH.
 * `id` is null when creating.
 */
async function assertValidParent(id, parentId) {
  if (parentId == null) return;
  const rows = await fetchAllRows();
  const { byId, childrenOf } = indexRows(rows);

  const parent = byId.get(Number(parentId));
  if (!parent) throw new ApiError(422, "parentId does not match an existing category.", [
    { field: "parentId", message: "Parent category not found." },
  ]);

  if (id != null) {
    if (Number(id) === parent.id) {
      throw new ApiError(422, "A category can't be its own parent.", [
        { field: "parentId", message: "A category can't be its own parent." },
      ]);
    }
    const subtreeIds = new Set(descendantsOf(Number(id), childrenOf).map((d) => d.id));
    if (subtreeIds.has(parent.id)) {
      throw new ApiError(422, "A category can't be moved under one of its own subcategories.", [
        { field: "parentId", message: "Can't move a category under its own subcategory." },
      ]);
    }
  }

  const parentDepth = ancestorsOf(parent, byId).length + 1;
  const ownHeight = id != null ? subtreeHeight(Number(id), childrenOf) : 1;
  if (parentDepth + ownHeight > MAX_DEPTH) {
    throw new ApiError(422, `Categories can be nested at most ${MAX_DEPTH} levels deep.`, [
      { field: "parentId", message: `Maximum nesting depth is ${MAX_DEPTH} levels.` },
    ]);
  }
}

/**
 * Turns an admin/API product assignment into the pair stored on the product:
 * { categoryId: <top-level ancestor>, subcategoryId: <specific node | null> }.
 * Accepts the legacy `categoryId`-only form, a `subcategoryId`, or both (in
 * which case categoryId must be the subcategory itself or one of its ancestors).
 */
async function resolveProductAssignment(categoryId, subcategoryId) {
  const rows = await fetchAllRows();
  const { byId } = indexRows(rows);

  const pick = (value, field) => {
    const node = byId.get(Number(value));
    if (!node) {
      throw new ApiError(422, `${field} does not match an existing category.`, [
        { field, message: "Category not found." },
      ]);
    }
    return node;
  };

  const chosen = subcategoryId != null ? pick(subcategoryId, "subcategoryId") : null;
  const given = categoryId != null ? pick(categoryId, "categoryId") : null;
  const node = chosen || given;
  if (!node) {
    throw new ApiError(422, "categoryId is required.", [
      { field: "categoryId", message: "Select a category." },
    ]);
  }

  const chain = [...ancestorsOf(node, byId), node];
  if (chosen && given && !chain.some((n) => n.id === given.id)) {
    throw new ApiError(422, "subcategoryId does not belong to the selected category.", [
      { field: "subcategoryId", message: "This subcategory doesn't belong to the selected category." },
    ]);
  }

  const root = chain[0];
  return { categoryId: root.id, subcategoryId: node.id === root.id ? null : node.id };
}

function categoryParams(data) {
  return [
    data.parentId ?? null,
    data.slug,
    data.name,
    data.description || null,
    data.icon || null,
    data.accentColor || null,
    data.imageUrl || null,
    data.bannerUrl || null,
    data.isActive === false ? 0 : 1,
    data.sortOrder || 0,
  ];
}

async function create(data) {
  await assertValidParent(null, data.parentId);
  const [result] = await pool.query(
    `INSERT INTO categories
      (parent_id, slug, name, description, icon, accent_color, image_url, banner_url, is_active, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    categoryParams(data)
  );
  return findById(result.insertId);
}

/**
 * Re-derives products.category_id / subcategory_id for every product filed
 * anywhere inside the subtree rooted at `id`. Needed after a category is
 * moved (re-parented) because the top-level ancestor of its products changes.
 */
async function resyncProductsInSubtree(conn, id) {
  const rows = await fetchAllRows();
  const { byId, childrenOf } = indexRows(rows);
  const subtree = [id, ...descendantsOf(id, childrenOf).map((d) => d.id)];
  const marks = subtree.map(() => "?").join(",");

  const [products] = await conn.query(
    `SELECT id, category_id, subcategory_id FROM products
     WHERE category_id IN (${marks}) OR subcategory_id IN (${marks})`,
    [...subtree, ...subtree]
  );

  for (const p of products) {
    const node = byId.get(p.subcategory_id ?? p.category_id);
    if (!node) continue;
    const root = [...ancestorsOf(node, byId), node][0];
    const nextSub = node.id === root.id ? null : node.id;
    if (root.id !== p.category_id || nextSub !== p.subcategory_id) {
      await conn.query("UPDATE products SET category_id = ?, subcategory_id = ? WHERE id = ?", [
        root.id,
        nextSub,
        p.id,
      ]);
    }
  }
}

async function update(id, data) {
  await assertValidParent(id, data.parentId);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      `UPDATE categories SET
        parent_id = ?, slug = ?, name = ?, description = ?, icon = ?, accent_color = ?,
        image_url = ?, banner_url = ?, is_active = ?, sort_order = ?
       WHERE id = ?`,
      [...categoryParams(data), id]
    );
    await resyncProductsInSubtree(conn, Number(id));
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
  return findById(id);
}

/** How many subcategories and products block deleting this category. */
async function usage(id) {
  const [[{ children }]] = await pool.query(
    "SELECT COUNT(*) AS children FROM categories WHERE parent_id = ?",
    [id]
  );
  const [[{ products }]] = await pool.query(
    "SELECT COUNT(*) AS products FROM products WHERE category_id = ? OR subcategory_id = ?",
    [id, id]
  );
  return { children, products };
}

async function remove(id) {
  await pool.query("DELETE FROM categories WHERE id = ?", [id]);
}

module.exports = {
  MAX_DEPTH,
  list,
  listTree,
  findBySlug,
  findById,
  findDetailBySlug,
  expandSlugsToIds,
  resolveProductAssignment,
  assertValidParent,
  usage,
  create,
  update,
  remove,
};
