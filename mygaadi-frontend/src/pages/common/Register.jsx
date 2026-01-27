import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/app";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "BUYER",
  });

  const [error, setError] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔐 PASSWORD VALIDATION
    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      await api.post("/api/auth/register", form);
      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      setError("Registration failed. Email may already exist.");
    }
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card auth-card">
              <div className="auth-header">
                <h3 className="mb-0 fw-bold">Sign Up</h3>
                <p className="mb-0 text-white-50">Create your account today</p>
              </div>
              <div className="card-body p-4">

                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <input
                    className="form-control mb-2"
                    placeholder="First Name"
                    name="firstName"
                    onChange={handleChange}
                    required
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Last Name"
                    name="lastName"
                    onChange={handleChange}
                    required
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Email"
                    name="email"
                    type="email"
                    onChange={handleChange}
                    required
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    required
                  />

                  <select
                    className="form-control mb-3"
                    name="role"
                    onChange={handleChange}
                  >
                    <option value="BUYER">Buyer</option>
                    <option value="SELLER">Seller</option>
                  </select>

                  <div className="d-grid mt-4">
                    <button className="btn btn-premium btn-lg">
                      Register
                    </button>
                  </div>
                </form>

                <p className="text-center mt-3 mb-0">
                  Already have an account?{" "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
