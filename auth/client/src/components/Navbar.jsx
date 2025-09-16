import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice.js";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="brand">
        <Link to="/">Authentication</Link>
      </div>
      <div className="spacer" />
      <div className="nav-links">
        {user ? (
          <>
            <span className="hello">Hi, {user.name}</span>
            <Link to="/dashboard">Dashboard</Link>
            <button
              className="link-btn"
              onClick={() => {
                dispatch(logout());
                navigate("/");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
