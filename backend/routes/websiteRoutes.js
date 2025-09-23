import express from "express";
import {
  setWebsiteTitle,
  getWebsiteTitle,
} from "../controllers/websiteController.js";

const router = express.Router();

router.get("/", getWebsiteTitle); // GET current title
router.post("/", setWebsiteTitle); // Update title (deletes old one, sets new)

export default router;
