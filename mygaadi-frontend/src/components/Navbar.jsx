import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 🔴 Hide navbar on login & register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top px-4 shadow-sm">
      <Link className="navbar-brand" to="/">
        MyGaadi
      </Link>

      <div className="collapse navbar-collapse show">
        <ul className="navbar-nav ms-auto align-items-center">

          {/* 🔵 VISITOR */}
          {!user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            </>
          )}

          {/* 🟢 BUYER */}
          {user && user.role === "BUYER" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/buyer">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/wishlist">
                  Wishlist
                </Link>
              </li>
            </>
          )}

          {/* 🟨 SELLER */}
          {user && user.role === "SELLER" && (
            <li className="nav-item">
              <Link className="nav-link" to="/seller">
                Dashboard
              </Link>
            </li>
          )}


          {/* 👤 USER + LOGOUT */}
          {user && (
            <>
              <li className="nav-item ms-3 text-white">
                Hi, {user.firstName}
              </li>
              <li className="nav-item ms-2">
                <button
                  className="btn btn-sm btn-outline-light"
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
