import express from "express";
import {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { authenticate } from "../middleware/authMIddleware.js";

const router = express.Router();

router.post("/", authenticate, createPost);
router.get("/", getAllPosts);
router.get("/my-posts", authenticate, getMyPosts);
router.put("/:id", authenticate, updatePost);
router.delete("/:id", authenticate, deletePost);

export default router;
