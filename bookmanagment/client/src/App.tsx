import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import LibrarianDashboard from "./pages/LibrarianDashboard";
import UserDashboard from "./pages/UserDashboard";
import BooksPage from "./pages/BooksPage";
import Otp from "./pages/Otp";

interface ProtectedRouteProps {
  element: React.ReactElement;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  allowedRoles,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

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

        {/*  Protected Dashboards */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              element={<AdminDashboard />}
              allowedRoles={["admin"]}
            />
          }
        />
        <Route
          path="/librarian"
          element={
            <ProtectedRoute
              element={<LibrarianDashboard />}
              allowedRoles={["librarian"]}
            />
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute
              element={<UserDashboard />}
              allowedRoles={["user"]}
            />
          }
        />

        {/* Books page → accessible to all logged-in users */}
        <Route
          path="/books"
          element={
            <ProtectedRoute
              element={<BooksPage />}
              allowedRoles={["admin", "librarian", "user"]}
            />
          }
        />

        {/* Unauthorized fallback */}
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
