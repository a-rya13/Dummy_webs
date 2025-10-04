import express from "express";
import {
  registerAdmin,
  loginAdmin,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Register
router.post("/register", registerAdmin);

// Login
router.post("/login", loginAdmin);

// Change Password
router.post("/change-password", changePassword);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password (with token)
router.post("/reset-password/:token", resetPassword);

export default router;
