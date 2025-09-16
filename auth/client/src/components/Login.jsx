import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice.js";
import { useNavigate, Link, Navigate } from "react-router-dom";
import "./forms.scss";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token, status, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  if (token) return <Navigate to="/dashboard" replace />;

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form))
      .unwrap()
      .then(() => navigate("/dashboard"))
      .catch(() => {});
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {error && <div className="error">{error}</div>}

        <button disabled={status === "loading"}>
          {status === "loading" ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="muted">
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
