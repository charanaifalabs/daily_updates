import { Provider } from "react-redux";
import { store } from "./app/store";
import ProductsPage from "./pages/ProductsPage";
import "./styles/main.scss";

export default function App() {
  return (
    <Provider store={store}>
      <ProductsPage />
    </Provider>
  );
}
