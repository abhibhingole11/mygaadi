import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../../api/app";
import { useAuth } from "../../utils/AuthContext";

const ListCar = () => {
  const { user } = useAuth();

  const [carData, setCarData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
  });

  const handleChange = (e) => {
    setCarData({
      ...carData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/seller/cars", {
        make: carData.make,
        model: carData.model,
        year: carData.year,
        price: carData.price,
        sellerId: user.userId, // 🔴 IMPORTANT
      });

      alert("Car submitted for admin approval");

      // reset form
      setCarData({
        make: "",
        model: "",
        year: "",
        price: "",
      });

    } catch (error) {
      console.error(error);
      alert("Failed to list car");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">List a Car</h2>

      <form className="card p-4 shadow" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Make</label>
          <input
            className="form-control"
            placeholder="Enter car make"
            name="make"
            value={carData.make}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Model</label>
          <input
            className="form-control"
            placeholder="Enter car model"
            name="model"
            value={carData.model}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Year</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter manufacturing year"
            name="year"
            value={carData.year}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (₹)</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter price"
            name="price"
            value={carData.price}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit for Approval
        </button>
      </form>
    </div>
  );
};

export default ListCar;
