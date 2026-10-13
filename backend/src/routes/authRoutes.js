const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { requireAuth } = require("../middleware/auth");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    body("phone").optional({ values: "falsy" }).isString(),
    validate,
  ],
  authController.register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required."),
    validate,
  ],
  authController.login
);

router.post("/logout", requireAuth, authController.logout);
router.get("/me", requireAuth, authController.me);

router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(), validate],
  authController.forgotPassword
);

router.post(
  "/reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required."),
    body("newPassword").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    validate,
  ],
  authController.resetPassword
);

router.post(
  "/change-password",
  requireAuth,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required."),
    body("newPassword").isLength({ min: 8 }).withMessage("Password must be at least 8 characters."),
    validate,
  ],
  authController.changePassword
);

module.exports = router;
