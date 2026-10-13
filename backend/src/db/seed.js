// Seeds the database with the real Anurag Traders catalog (see catalogData.js)
// plus the demo admin/customer accounts and demo coupons.
//
// SAFE TO RE-RUN. Every row is "insert if missing" keyed by its natural unique
// column (category slug / product slug / user email / coupon code). A row that
// already exists is left exactly as it is — so re-running never overwrites
// prices, stock, images or descriptions you've since edited in the admin panel,
// and never creates duplicates.
//
// Usage: npm run db:seed
require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const productModel = require("../models/productModel");
const { CATEGORY_TREE, PRODUCTS, slugify } = require("./catalogData");

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

const DEMO_ADMIN = { name: "Hale Admin", email: "admin@hale.test", password: "AdminPass123!" };
const DEMO_CUSTOMERS = [
  { name: "Priya Sharma", email: "priya@example.com", password: "CustomerPass123!" },
  { name: "Rohan Mehta", email: "rohan@example.com", password: "CustomerPass123!" },
  { name: "Ananya Iyer", email: "ananya@example.com", password: "CustomerPass123!" },
];
const DEMO_COUPONS = [
  { code: "HALE10", type: "percent", value: 10, minOrderAmount: null },
  { code: "WELCOME50", type: "percent", value: 5, minOrderAmount: null },
];

const stats = { created: 0, kept: 0 };

async function seedUsers() {
  const accounts = [
    { ...DEMO_ADMIN, role: "admin" },
    ...DEMO_CUSTOMERS.map((c) => ({ ...c, role: "customer" })),
  ];
  let created = 0;
  for (const account of accounts) {
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [account.email]);
    if (existing[0]) continue;
    const hash = await bcrypt.hash(account.password, SALT_ROUNDS);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [account.name, account.email, hash, account.role]
    );
    created += 1;
  }
  console.log(`Users: ${created} created, ${accounts.length - created} already existed.`);
}

// Returns the category's id, inserting it first only if the slug is new.
async function ensureCategory(node, parentId) {
  const [existing] = await pool.query("SELECT id FROM categories WHERE slug = ?", [node.slug]);
  if (existing[0]) {
    stats.kept += 1;
    return existing[0].id;
  }
  const [result] = await pool.query(
    `INSERT INTO categories
       (parent_id, slug, name, description, icon, accent_color, image_url, banner_url, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      parentId,
      node.slug,
      node.name,
      node.description ?? null,
      node.icon ?? null,
      node.accent ?? null,
      node.image ?? null,
      node.banner ?? null,
      node.sort ?? 0,
    ]
  );
  stats.created += 1;
  return result.insertId;
}

// Seeds the tree; returns Map(slug -> { id, rootSlug }) for every category and subcategory.
async function seedCategories() {
  const index = new Map();
  stats.created = 0;
  stats.kept = 0;

  for (const root of CATEGORY_TREE) {
    const rootId = await ensureCategory(root, null);
    index.set(root.slug, { id: rootId, rootSlug: root.slug });
    for (const child of root.children || []) {
      const childId = await ensureCategory(child, rootId);
      index.set(child.slug, { id: childId, rootSlug: root.slug });
    }
  }

  const total = [...index.keys()].length;
  console.log(
    `Categories: ${total} in catalog (${CATEGORY_TREE.length} top-level + ${total - CATEGORY_TREE.length} subcategories) — ` +
      `${stats.created} created, ${stats.kept} already existed.`
  );
  return index;
}

async function seedProducts(categoryIndex) {
  let created = 0;
  let kept = 0;
  const now = Date.now();

  for (const [position, product] of PRODUCTS.entries()) {
    const slug = product.slug || slugify(product.name);
    const root = categoryIndex.get(product.category);
    const sub = product.subcategory ? categoryIndex.get(product.subcategory) : null;

    if (!root) throw new Error(`Product "${product.name}": unknown category "${product.category}".`);
    if (product.subcategory && (!sub || sub.rootSlug !== product.category)) {
      throw new Error(
        `Product "${product.name}": subcategory "${product.subcategory}" is not under "${product.category}".`
      );
    }

    const [existing] = await pool.query("SELECT id FROM products WHERE slug = ?", [slug]);
    if (existing[0]) {
      kept += 1;
      continue;
    }

    // The admin list is newest-first, so earlier entries get later timestamps
    // (1 hour apart) and "newest" sorting on the storefront matches the admin.
    const createdAt = new Date(now - position * 60 * 60 * 1000);

    const [result] = await pool.query(
      `INSERT INTO products
         (slug, name, description, category_id, subcategory_id, price, sale_price, stock, is_published, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [
        slug,
        product.name,
        product.description ?? null,
        root.id, // products.category_id is always the TOP-LEVEL category
        sub ? sub.id : null,
        product.price, // MRP
        product.salePrice ?? null, // selling price
        product.stock ?? 0,
        createdAt,
      ]
    );

    await productModel.replaceImages(result.insertId, product.images || []);
    await productModel.replaceSpecs(result.insertId, product.specs || {});
    await productModel.replaceOptions(result.insertId, product.options || []);
    created += 1;
  }

  console.log(`Products: ${PRODUCTS.length} in catalog — ${created} created, ${kept} already existed.`);
}

async function seedCoupons() {
  let created = 0;
  for (const coupon of DEMO_COUPONS) {
    const [existing] = await pool.query("SELECT id FROM coupons WHERE code = ?", [coupon.code]);
    if (existing[0]) continue;
    await pool.query(
      `INSERT INTO coupons (code, type, value, min_order_amount, is_active) VALUES (?, ?, ?, ?, 1)`,
      [coupon.code, coupon.type, coupon.value, coupon.minOrderAmount]
    );
    created += 1;
  }
  console.log(`Coupons: ${created} created, ${DEMO_COUPONS.length - created} already existed.`);
}

async function main() {
  await seedUsers();
  const categoryIndex = await seedCategories();
  await seedProducts(categoryIndex);
  await seedCoupons();

  console.log("\nDone. Demo logins:");
  console.log(`  Admin:    ${DEMO_ADMIN.email} / ${DEMO_ADMIN.password}`);
  DEMO_CUSTOMERS.forEach((c) => console.log(`  Customer: ${c.email} / ${c.password}`));

  await pool.end();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
