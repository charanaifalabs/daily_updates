import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/authSlice.js";
import { useNavigate, Link } from "react-router-dom";
import "./forms.scss";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(form))
      .unwrap()
      .then(() => navigate("/login"))
      .catch(() => {});
  };

  return (
    <div className="auth-card">
      <h2>Create account</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <label>Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
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
          {status === "loading" ? "Creating..." : "Register"}
        </button>
      </form>
      <p className="muted">
        Have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
