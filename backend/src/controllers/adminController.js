const asyncHandler = require("../utils/asyncHandler");
const pool = require("../config/db");

const LOW_STOCK_THRESHOLD = 10;

const dashboard = asyncHandler(async (req, res) => {
  const [[productStats]] = await pool.query(
    "SELECT COUNT(*) AS totalProducts FROM products WHERE is_published = 1"
  );
  const [[customerStats]] = await pool.query(
    "SELECT COUNT(*) AS totalCustomers FROM users WHERE role = 'customer'"
  );
  const [[orderStats]] = await pool.query("SELECT COUNT(*) AS totalOrders FROM orders");
  const [[revenueStats]] = await pool.query(
    "SELECT COALESCE(SUM(total), 0) AS totalRevenue FROM orders WHERE payment_status = 'paid'"
  );

  const [recentOrders] = await pool.query(
    `SELECT o.id, o.order_number, o.status, o.payment_status, o.total, o.created_at, u.name AS customer_name
     FROM orders o JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC LIMIT 5`
  );

  const [lowStockProducts] = await pool.query(
    "SELECT id, slug, name, stock FROM products WHERE stock <= ? AND is_published = 1 ORDER BY stock ASC LIMIT 10",
    [LOW_STOCK_THRESHOLD]
  );

  const [ordersByStatus] = await pool.query(
    "SELECT status, COUNT(*) AS count FROM orders GROUP BY status"
  );

  res.json({
    success: true,
    data: {
      totalProducts: productStats.totalProducts,
      totalCustomers: customerStats.totalCustomers,
      totalOrders: orderStats.totalOrders,
      totalRevenue: revenueStats.totalRevenue,
      ordersByStatus,
      recentOrders,
      lowStockProducts,
    },
  });
});

module.exports = { dashboard };
