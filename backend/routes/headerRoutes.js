import express from "express";
import {
  createHeader,
  getHeaders,
  updateHeader,
  deleteHeader,
} from "../controllers/HeaderController.js";

const router = express.Router();

// ================= ROUTES =================
router.post("/", createHeader); // Create Header
router.get("/", getHeaders); // Get all Headers
router.put("/:oldName", updateHeader); // Update Header (cascade update in posts)
router.delete("/:name", deleteHeader); // Delete Header (cascade delete posts)

export default router;
