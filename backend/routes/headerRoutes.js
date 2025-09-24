import express from "express";
import {
  createHeader,
  getHeaders,
  getHeaderById,
  updateHeader,
  deleteHeader,
} from "../controllers/HeaderController.js";

const router = express.Router();

// ================= ROUTES =================
router.post("/", createHeader); // Create Header
router.get("/", getHeaders); // Get all Headers
router.get("/:id", getHeaderById); // ✅ Get a single Header by ID
router.put("/:id", updateHeader); // ✅ Update Header (by ID, cascade update in posts)
router.delete("/:id", deleteHeader); // ✅ Delete Header (by ID, cascade delete posts)

export default router;
