require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const routes = require("./routes");
const paymentController = require("./controllers/paymentController");
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/errorHandler");

const app = express();

// =========================
// CORS
// =========================
// const FRONTEND_URL = "https://hale-frontend-seven.vercel.app";
const FRONTEND_URL = "http://localhost:5173"; // For local development


app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =========================
// Security
// =========================
app.use(helmet());

// =========================
// Razorpay Webhook
// IMPORTANT: raw body must come before express.json()
// =========================
app.use(
  "/api/payments/razorpay/webhook",
  express.raw({ type: "application/json" }),
  paymentController.webhook
);

// =========================
// Body Parser
// =========================
app.use(express.json());

// =========================
// Logger
// =========================
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

// =========================
// Health Check
// =========================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "ecommerce API is running",
  });
});

// =========================
// API Routes
// =========================
app.use("/api", routes);

// =========================
// 404 Handler
// =========================
app.use(notFoundHandler);

// =========================
// Error Handler
// =========================
app.use(errorHandler);

module.exports = app;