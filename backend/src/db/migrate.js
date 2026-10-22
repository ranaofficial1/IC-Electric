// Idempotent, incremental migrations for databases created BEFORE a schema
// change (schema.sql is CREATE TABLE IF NOT EXISTS, so it never alters an
// existing table). Safe to run any number of times, on fresh or old DBs.
//
// Usage: npm run db:migrate
require("dotenv").config();
const mysql = require("mysql2/promise");

const DB_NAME = process.env.DB_NAME || "hale_ecommerce";

async function columnExists(conn, table, column) {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`,
    [DB_NAME, table, column]
  );
  return rows.length > 0;
}

async function indexExists(conn, table, index) {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1`,
    [DB_NAME, table, index]
  );
  return rows.length > 0;
}

async function constraintExists(conn, table, name) {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND CONSTRAINT_NAME = ? LIMIT 1`,
    [DB_NAME, table, name]
  );
  return rows.length > 0;
}

// 001 — subcategories: categories.parent_id (tree) + products.subcategory_id.
// Existing rows are untouched: every current category stays top-level
// (parent_id NULL) and every current product keeps its category_id with
// subcategory_id NULL, so the storefront looks exactly as before.
async function m001Subcategories(conn) {
  if (!(await columnExists(conn, "categories", "parent_id"))) {
    await conn.query("ALTER TABLE categories ADD COLUMN parent_id INT UNSIGNED NULL AFTER id");
    console.log("  + categories.parent_id");
  }
  if (!(await indexExists(conn, "categories", "idx_categories_parent"))) {
    await conn.query("ALTER TABLE categories ADD INDEX idx_categories_parent (parent_id)");
  }
  if (!(await constraintExists(conn, "categories", "fk_categories_parent"))) {
    await conn.query(
      `ALTER TABLE categories ADD CONSTRAINT fk_categories_parent
       FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE RESTRICT`
    );
    console.log("  + categories.parent_id foreign key");
  }

  if (!(await columnExists(conn, "products", "subcategory_id"))) {
    await conn.query(
      "ALTER TABLE products ADD COLUMN subcategory_id INT UNSIGNED NULL AFTER category_id"
    );
    console.log("  + products.subcategory_id");
  }
  if (!(await indexExists(conn, "products", "idx_products_subcategory"))) {
    await conn.query("ALTER TABLE products ADD INDEX idx_products_subcategory (subcategory_id)");
  }
  if (!(await constraintExists(conn, "products", "fk_products_subcategory"))) {
    await conn.query(
      `ALTER TABLE products ADD CONSTRAINT fk_products_subcategory
       FOREIGN KEY (subcategory_id) REFERENCES categories(id)`
    );
    console.log("  + products.subcategory_id foreign key");
  }
}

// 002 — color-variant images: product_images.option_value (nullable).
// Existing rows get NULL = "shared image", so every current product keeps
// showing exactly the same gallery until images are tagged with a color.
async function m002ImageOptionValue(conn) {
  if (!(await columnExists(conn, "product_images", "option_value"))) {
    await conn.query(
      "ALTER TABLE product_images ADD COLUMN option_value VARCHAR(50) NULL AFTER url"
    );
    console.log("  + product_images.option_value");
  }
}

const MIGRATIONS = [
  ["001_subcategories", m001Subcategories],
  ["002_image_option_value", m002ImageOptionValue],
];

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: DB_NAME,
  });

  console.log(`Migrating database "${DB_NAME}"...`);
  for (const [name, fn] of MIGRATIONS) {
    console.log(`- ${name}`);
    await fn(conn);
  }
  console.log("Migrations complete.");
  await conn.end();
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
