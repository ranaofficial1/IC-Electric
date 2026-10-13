// Applies schema.sql to the database configured in .env.
// Usage: npm run db:schema
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function main() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "hale_ecommerce",
    multipleStatements: true,
  });

  console.log(`Applying schema to database "${process.env.DB_NAME || "hale_ecommerce"}"...`);
  await connection.query(sql);
  console.log("Schema applied successfully.");
  await connection.end();
}

main().catch((err) => {
  console.error("Failed to apply schema:", err.message);
  process.exit(1);
});
