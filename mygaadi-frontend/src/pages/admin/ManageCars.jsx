import { useEffect, useState } from "react";
import api from "../../api/app";

const ManageCars = () => {
  const [cars, setCars] = useState([]);

  const loadPendingCars = async () => {
    const res = await api.get("/api/admin/cars/pending");
    setCars(res.data);
  };

  useEffect(() => {
    loadPendingCars();
  }, []);

  const approveCar = async (carId) => {
    await api.put(`/api/admin/cars/${carId}/approve`);
    alert("Car approved");
    loadPendingCars();
  };

  const rejectCar = async (carId) => {
    await api.put(`/api/admin/cars/${carId}/reject`);
    alert("Car rejected");
    loadPendingCars();
  };

  return (
    <div className="container mt-4">
      <h3>Pending Car Approvals</h3>

      {cars.length === 0 && (
        <p className="text-muted mt-3">No pending cars</p>
      )}

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Image</th>
            <th>Car</th>
            <th>Price</th>
            <th>Seller</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {cars.map((car) => (
            <tr key={car.carId}>
              <td>
                <img
                  src={car.imageUrl}
                  alt="car"
                  style={{ width: "120px", borderRadius: "6px" }}
                />
              </td>
              <td>
                {car.make} {car.model} ({car.year})
              </td>
              <td>₹{car.price}</td>
              <td>{car.seller.email}</td>
              <td>
                <button
                  className="btn btn-success btn-sm me-2"
                  onClick={() => approveCar(car.carId)}
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => rejectCar(car.carId)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCars;
