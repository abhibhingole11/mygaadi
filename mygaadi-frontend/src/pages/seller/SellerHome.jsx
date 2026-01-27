import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import sellerService from "../../services/sellerService";
import "bootstrap/dist/css/bootstrap.min.css";

const SellerHome = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cars when component mounts or user changes
  useEffect(() => {
    if (user && user.userId) {
      fetchCars();
    }
  }, [user]);

  const fetchCars = async () => {
    try {
      const data = await sellerService.getSellerCars(user.userId);
      setCars(data);
    } catch (error) {
      console.error("Error fetching seller cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await sellerService.deleteCar(carId);
        // Remove from UI
        setCars(cars.filter((car) => car.id !== carId));
        alert("Car deleted successfully");
      } catch (error) {
        console.error("Error deleting car:", error);
        alert("Failed to delete car");
      }
    }
  };

  if (!user) return <div>Please log in...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Seller Dashboard</h2>
        <Link to="/seller/list-car" className="btn btn-success">
          + List a New Car
        </Link>
      </div>

      {loading ? (
        <div className="text-center">Loading your cars...</div>
      ) : cars.length === 0 ? (
        <div className="alert alert-info text-center">
          You haven't listed any cars yet. Start selling today!
        </div>
      ) : (
        <div className="row">
          {cars.map((car) => (
            <div className="col-md-4 mb-4" key={car.id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={car.imageUrl || car.image || "https://placehold.co/600x400?text=No+Image"}
                  className="card-img-top"
                  alt={`${car.make} ${car.model}`}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Error+Loading"; }}
                />
                <div className="card-body">
                  <h5 className="card-title fw-bold">
                    {car.make} {car.model}
                  </h5>
                  <p className="card-text text-muted mb-1">Year: {car.year}</p>
                  <h6 className="text-primary fw-bold">₹ {car.price.toLocaleString()}</h6>

                  <div className="d-flex gap-2 mt-3">
                    <Link
                      to={`/seller/edit-car/${car.id}`}
                      state={{ car }} // Pass car data to avoid refetching
                      className="btn btn-outline-primary flex-grow-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="btn btn-outline-danger flex-grow-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* For nested routes if any, though likely unused now as we are listing here directly */}
      <Outlet />
    </div>
  );
};

export default SellerHome;
