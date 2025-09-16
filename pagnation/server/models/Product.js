import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    category: { type: String, required: [true, "Category is required"] },
    price: { type: Number, required: [true, "Price is required"] },
  },
  { timestamps: true }
);

const Product123 = mongoose.model("Product123", productSchema);
export default Product123;
