import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/authController.js";

const router = express.Router();

// Login route

router.post("/login", loginAdmin);

// (Optional) Register route
router.post("/register", registerAdmin);

export default router;
