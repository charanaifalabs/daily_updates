import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Home from "./pages/Home.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div style={{ padding: "1rem" }}>
                  Welcome to your dashboard ✨
                </div>
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
