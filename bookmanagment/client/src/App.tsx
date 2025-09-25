import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import LibrarianDashboard from "./pages/LibrarianDashboard";
import UserDashboard from "./pages/UserDashboard";
import BooksPage from "./pages/BooksPage";
import Otp from "./pages/Otp";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default → login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* OTP page */}
        <Route path="/otp" element={<Otp />} />

        {/* Dashboards - no protection */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/librarian" element={<LibrarianDashboard />} />
        <Route path="/user" element={<UserDashboard />} />

        {/* Books page - accessible to all */}
        <Route path="/books" element={<BooksPage />} />

        {/* Unauthorized fallback (can remove if not needed) */}
        <Route
          path="/unauthorized"
          element={<div style={{ padding: 40 }}>Unauthorized</div>}
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
