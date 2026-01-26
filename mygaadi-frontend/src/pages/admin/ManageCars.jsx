import { useEffect, useState } from "react";
import api from "../../api/app";

const ManageCars = () => {
  const [pendingCars, setPendingCars] = useState([]);
  const [approvedCars, setApprovedCars] = useState([]);
  const [rejectedCars, setRejectedCars] = useState([]);

  // load ONLY pending cars initially
  const loadPendingCars = async () => {
    const res = await api.get("/api/admin/cars/pending");
    setPendingCars(res.data);
  };

  useEffect(() => {
    loadPendingCars();
  }, []);

  const approveCar = async (car) => {
    await api.put(`/api/admin/cars/${car.carId}/approve`);

    // move car from pending → approved
    setPendingCars(prev =>
      prev.filter(c => c.carId !== car.carId)
    );
    setApprovedCars(prev => [...prev, car]);
  };

  const rejectCar = async (car) => {
    await api.put(`/api/admin/cars/${car.carId}/reject`);

    // move car from pending → rejected
    setPendingCars(prev =>
      prev.filter(c => c.carId !== car.carId)
    );
    setRejectedCars(prev => [...prev, car]);
  };

  const renderTable = (cars, showActions) => (
    <>
      {cars.length === 0 && (
        <p className="text-muted">No cars</p>
      )}

      {cars.length > 0 && (
        <table className="table table-bordered mt-2">
          <thead>
            <tr>
              <th>Image</th>
              <th>Car</th>
              <th>Price</th>
              <th>Seller</th>
              {showActions && <th>Action</th>}
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

                {showActions && (
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => approveCar(car)}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => rejectCar(car)}
                    >
                      Reject
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );

  return (
    <div className="container mt-4">
      <h3>Manage Cars</h3>

      {/* ⏳ Pending */}
      <h5 className="mt-4 text-warning">Pending Cars</h5>
      {renderTable(pendingCars, true)}

      {/* ✅ Approved */}
      <h5 className="mt-5 text-success">Approved Cars</h5>
      {renderTable(approvedCars, false)}

      {/* ❌ Rejected */}
      <h5 className="mt-5 text-danger">Rejected Cars</h5>
      {renderTable(rejectedCars, false)}
    </div>
  );
};

export default ManageCars;
