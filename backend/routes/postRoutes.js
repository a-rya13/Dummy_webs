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
  editPost,
} from "../controllers/PostController.js";
import upload from "../middleware/multer.js";
import uploadFiles from "../middleware/multer2.js";

const router = express.Router();

// ----------------- Routes ------------------

//
router.post("/", uploadFiles, createPost);

//
router.get("/", getPosts);

//
router.get("/:id", getPostById);

//
router.put("/:id", uploadFiles, editPost);

//
router.delete("/:id", deletePost);

//
router.get("/expired/list", getExpiredPosts);

router.get("/headers/all", getHeaders);
router.get("/filter/active", getActivePosts);

export default router;
