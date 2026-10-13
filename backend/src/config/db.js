require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "hale_ecommerce",
  waitForConnections: true,
  // Configurable via DB_CONNECTION_LIMIT, defaulting to the same 10 as
  // before, on a traditional always-on host (Render/Railway/a VPS) one
  // process holds one pool for its whole lifetime, so 10 is a reasonable
  // ceiling. On Vercel serverless, many function instances can run
  // concurrently and *each* gets its own pool (created once per cold
  // start, then reused for that instance's warm invocations) — so the
  // real ceiling is (concurrent instances × connectionLimit), which can
  // exhaust a small hosted MySQL plan's max_connections fast. If
  // deploying to Vercel, set DB_CONNECTION_LIMIT to something small
  // (e.g. 2) in that environment's variables.
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  queueLimit: 0,
  decimalNumbers: true, // return DECIMAL columns as JS numbers, not strings
});

module.exports = pool;
