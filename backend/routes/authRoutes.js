import express from "express";
import {
  registerAdmin,
  loginAdmin,
  changePassword,
} from "../controllers/authController.js";

const router = express.Router();

// Register
router.post("/register", registerAdmin);

// Login
router.post("/login", loginAdmin);

// Change Password
router.post("/change-password", changePassword);

export default router;
