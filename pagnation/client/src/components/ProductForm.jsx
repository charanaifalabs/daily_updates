import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  createProduct,
  updateProduct,
} from "../features/products/productSlice";
import "../styles/_productForm.scss";

export default function ProductForm({ editProduct, onClose }) {
  const [form, setForm] = useState({ name: "", category: "", price: "" });
  const dispatch = useDispatch();

  useEffect(() => {
    if (editProduct) setForm(editProduct);
  }, [editProduct]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (editProduct) {
      dispatch(updateProduct({ id: editProduct._id, payload: form }));
    } else {
      dispatch(createProduct(form));
    }
    onClose();
  };

  return (
    <div className="modal">
      <div className="form-card">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h3>{editProduct ? "Edit Product" : "Add Product"}</h3>
        <form onSubmit={onSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <button type="submit">{editProduct ? "Update" : "Add"}</button>
        </form>
      </div>
    </div>
  );
}
