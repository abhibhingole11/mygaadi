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

  const renderTable = (cars, showActions, statusColor) => (
    <div className="premium-table-container mb-5">
      {cars.length === 0 ? (
        <p className="text-muted p-3 mb-0 text-center italic">No cars in this category</p>
      ) : (
        <table className="premium-table">
          <thead>
            <tr>
              <th>Vehicle Preview</th>
              <th>Vehicle Details</th>
              <th>Market Price</th>
              <th>Seller Contact</th>
              {showActions && <th className="text-end">Management Actions</th>}
            </tr>
          </thead>

          <tbody>
            {cars.map((car) => (
              <tr key={car.carId}>
                <td>
                  <img
                    src={car.imageUrl}
                    alt="car"
                    className="shadow-sm"
                    style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "12px" }}
                  />
                </td>

                <td>
                  <div className="fw-bold">{car.make} {car.model}</div>
                  <small className="text-muted">Manufacturing Year: {car.year}</small>
                </td>

                <td className="fw-bold text-primary">₹{car.price?.toLocaleString()}</td>

                <td>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-light text-dark border me-2">Seller</span>
                    {car.seller.email}
                  </div>
                </td>

                {showActions && (
                  <td className="text-end">
                    <button
                      className="btn btn-success btn-sm me-2 px-3 rounded-pill"
                      onClick={() => approveCar(car)}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger btn-sm px-3 rounded-pill"
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
    </div>
  );

  return (
    <div className="container mt-4 pb-5">
      <div className="admin-page-header">
        <h2 className="fw-bold mb-2">Inventory Management</h2>
        <p className="mb-0 opacity-75">Review new car listings from sellers. Approve them to make them live on the platform.</p>
      </div>

      <div className="d-flex align-items-center mb-3">
        <div className="p-2 bg-warning rounded-circle me-3" style={{ width: "12px", height: "12px" }}></div>
        <h4 className="fw-bold mb-0 text-warning">Pending Review</h4>
      </div>
      {renderTable(pendingCars, true)}

      <div className="d-flex align-items-center mb-3">
        <div className="p-2 bg-success rounded-circle me-3" style={{ width: "12px", height: "12px" }}></div>
        <h4 className="fw-bold mb-0 text-success">Approved Inventory</h4>
      </div>
      {renderTable(approvedCars, false)}

      <div className="d-flex align-items-center mb-3">
        <div className="p-2 bg-danger rounded-circle me-3" style={{ width: "12px", height: "12px" }}></div>
        <h4 className="fw-bold mb-0 text-danger">Rejected Listings</h4>
      </div>
      {renderTable(rejectedCars, false)}
    </div>
  );
};

export default ManageCars;
