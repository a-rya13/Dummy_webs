import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getExpiredPosts,
  getActivePosts,
  getHeaders,
} from "../controllers/PostController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// ----------------- Routes ------------------

//
router.post("/", upload.single("attachments"), createPost);

//
router.get("/", getPosts);

//
router.get("/:id", getPostById);

//
router.put("/:id", updatePost);

//
router.delete("/:id", deletePost);

//
router.get("/expired/list", getExpiredPosts);

router.get("/headers/all", getHeaders);
router.get("/filter/active", getActivePosts);

export default router;
