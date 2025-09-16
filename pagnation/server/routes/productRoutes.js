import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  seedProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.post("/create", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.post("/seed/data", seedProducts);

export default router;
