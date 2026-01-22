import { useEffect, useState } from "react";
import api from "../../api/app";

const ManageCars = () => {
  const [cars, setCars] = useState([]);

  const loadCars = async () => {
    const res = await api.get("/api/admin/cars");
    setCars(res.data);
  };

  const approveCar = async (carId) => {
    await api.put(`/api/admin/cars/${carId}/approve`);
    loadCars();
  };

  const rejectCar = async (carId) => {
    await api.put(`/api/admin/cars/${carId}/reject`);
    loadCars();
  };

  useEffect(() => {
    loadCars();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Manage Cars</h3>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {cars.map((c) => (
            <tr key={c.carId}>
              <td>{c.make}</td>
              <td>{c.model}</td>
              <td>₹{c.price}</td>
              <td>{c.status}</td>
              <td>
                {c.status === "PENDING" && (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => approveCar(c.carId)}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => rejectCar(c.carId)}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCars;
