import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">MyGaadi</Link>

        <ul className="navbar-nav ms-auto">

          {/* ❌ NOT logged in */}
          {!user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}

          {/* ✅ Logged in */}
          {user && (
  <>
    {/* BUYER ONLY */}
    {user.role === "BUYER" && (
      <li className="nav-item">
        <Link className="nav-link" to="/wishlist">
          Wishlist ❤️
        </Link>
      </li>
    )}

    <li className="nav-item">
      <span className="nav-link text-white">
        Hi, {user.firstName}
      </span>
    </li>

    <li className="nav-item">
      <button
        className="btn btn-sm btn-danger ms-2"
        onClick={handleLogout}
      >
        Logout
      </button>
    </li>
  </>
)}


        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
