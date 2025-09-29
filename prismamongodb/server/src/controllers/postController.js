import {
  createPost as createPostModel,
  getAllPosts as getAllPostsModel,
  getPostsByUser,
  getPostById,
  updatePostById,
  deletePostById,
} from "../models/postModel.js";

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  try {
    const post = await createPostModel({
      title,
      content,
      authorId: req.user.id,
    });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await getAllPostsModel();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await getPostsByUser(req.user.id);
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const post = await getPostById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.authorId !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    const updated = await updatePostById(id, { title, content });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await getPostById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    if (post.authorId !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    await deletePostById(id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
