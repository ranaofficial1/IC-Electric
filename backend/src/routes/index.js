const express = require("express");

const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const productRoutes = require("./productRoutes");
const cartRoutes = require("./cartRoutes");
const wishlistRoutes = require("./wishlistRoutes");
const customerRoutes = require("./customerRoutes");
const orderRoutes = require("./orderRoutes");
const couponRoutes = require("./couponRoutes");
const adminRoutes = require("./adminRoutes");
const paymentRoutes = require("./paymentRoutes");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, message: "Hale API — see PROJECT_PROGRESS.md / backend/README.md for endpoints." });
});

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes); // also exposes /products/:slug/reviews
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/customers", customerRoutes);
router.use("/orders", orderRoutes);
router.use("/coupons", couponRoutes);
router.use("/payments", paymentRoutes); // /razorpay/order, /razorpay/verify — webhook is mounted directly in app.js (needs raw body)
router.use("/admin", adminRoutes);

module.exports = router;
