import { useDispatch } from "react-redux";
import { fetchProducts } from "../features/products/productSlice";

export default function Pagination({ page, pages }) {
  const dispatch = useDispatch();

  if (pages <= 1) return null;

  const changePage = (p) => {
    dispatch(fetchProducts({ page: p }));
  };

  return (
    <div className="pagination">
      {[...Array(pages).keys()].map((x) => (
        <button
          key={x + 1}
          onClick={() => changePage(x + 1)}
          className={page === x + 1 ? "active" : ""}
        >
          {x + 1}
        </button>
      ))}
    </div>
  );
}
