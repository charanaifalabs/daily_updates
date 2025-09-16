import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ProductForm from "./ProductForm";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const limit = 4;

  // Fetch products from backend
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit };

      if (filters.category.trim()) params.category = filters.category.trim();
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = await axios.get("http://localhost:5000/api/products", {
        params,
      });
      setProducts(res.data.data);
      setTotalPages(res.data.pages);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch products"
      );
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filters change
  };

  // Reset all filters
  const handleResetFilters = () => {
    setFilters({ category: "", minPrice: "", maxPrice: "" });
    setPage(1);
  };

  return (
    <div className="container">
      <div className="product-section">
        {/* Header */}
        <div className="header">
          <h2>
            <center>Products</center>
          </h2>
          <button
            onClick={() => {
              setEditProduct(null);
              setShowForm(true);
            }}
          >
            + Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="filters">
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={filters.category}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <button onClick={handleResetFilters}>Reset Filters</button>
        </div>

        {/* Loading/Error */}
        {loading && <p>Loading products...</p>}
        {error && <p className="error">{error}</p>}

        {/* Products Grid */}
        <div className="product-list">
          {products.length > 0 ? (
            products.map((p) => (
              <div className="product-card" key={p._id}>
                <h3>{p.name}</h3>
                <p>Category: {p.category}</p>
                <p>Price: ₹{p.price}</p>
                <div className="actions">
                  <button
                    onClick={() => {
                      setEditProduct(p);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </div>
              </div>
            ))
          ) : !loading ? (
            <p>No products found.</p>
          ) : null}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                className={page === num + 1 ? "active" : ""}
                onClick={() => setPage(num + 1)}
              >
                {num + 1}
              </button>
            ))}
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="modal">
            <ProductForm
              editProduct={editProduct}
              onClose={() => setShowForm(false)}
              refresh={fetchProducts}
            />
          </div>
        )}
      </div>
    </div>
  );
}
