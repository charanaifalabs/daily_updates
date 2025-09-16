import Product from "../models/Product.js";
import { seedData } from "../seed/seedProducts.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || !price || !category) {
      return res
        .status(400)
        .json({ message: "All fields (name, price, category) are required" });
    }

    const product = new Product({ name, price, category });
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, page = 1, limit = 5 } = req.query;

    let filter = {};

    if (category) filter.category = { $regex: category, $options: "i" };

    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter).skip(skip).limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = await Product.insertMany(seedData);
    res.json({ message: "Seed data added", data: products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
