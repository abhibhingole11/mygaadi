import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "Buyer"
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("All fields are required");
      return;
    }

    // 🔴 TEMPORARY REGISTER LOGIC (Dummy)
    // Later replaced with backend API
    alert(
      `Registered successfully as ${formData.role}\nPlease login now`
    );

    navigate("/login");
  };

  return (
    <div style={{ padding: "30px", maxWidth: "450px", margin: "auto" }}>
      <h2>Register</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="Buyer">Buyer</option>
          <option value="Seller">Seller</option>
        </select>

        <button type="submit" style={btnStyle}>
          Register
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px"
};

const btnStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#198754",
  color: "white",
  border: "none",
  cursor: "pointer"
};

export default Register;
