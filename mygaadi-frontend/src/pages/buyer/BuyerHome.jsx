import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/app";
import CarCard from "../../components/CarCard";
import { useAuth } from "../../utils/AuthContext";

import TestToast from "../../components/TestToast";
import { toast } from "react-toastify";


const BuyerHome = () => {
  const [cars, setCars] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [filters, setFilters] = useState({
    keyword: "",
    maxPrice: "",
    minYear: ""
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!user) {
      toast.info("Please login to search/filter cars");
      navigate("/login");
      return;
    }
    try {
      const params = {};

      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minYear) params.minYear = filters.minYear;

      const response = await api.get("/api/buyer/cars/search", { params });
      setCars(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to filter cars");
    }
  };



  // 🔹 Load available cars
  const loadCars = async () => {
    try {
      const res = await api.get("/api/buyer/cars");
      if (res.data) {
        setCars(res.data);
      }
    } catch (err) {
      console.error("Failed to load cars", err);
      // If unauthorized, it might be because the backend endpoint is protected.
      // However, the user wants visitors to see real data.
      toast.error("Failed to load car listings");
    }
  };


  // 🔹 Load wishlist (only carIds)
  const loadWishlist = async () => {
    try {
      const res = await api.get(`/api/buyer/wishlist/${user.userId}`);
      const ids = new Set(res.data.map((w) => w.carId));
      setWishlistIds(ids);
    } catch (err) {
      console.error("Failed to load wishlist", err);
    }
  };

  useEffect(() => {
    loadCars();

    if (user) {
      loadWishlist();
    }
  }, [user]);


  // 👁 View details
  const handleView = (car) => {
    if (!user) {
      toast.info("Please login to view details");
      navigate("/login");
      return;
    }
    navigate(`/car/${car.carId}`, { state: { car } });
  };


  // 🛒 Buy car (Navigate to Receipt)
  const handleBuy = async (car) => {
    if (!user) {
      toast.info("Please login to buy cars");
      navigate("/login");
      return;
    }
    navigate("/receipt", { state: { car } });
  };


  // ❤️ Add to wishlist
  const handleWishlist = async (car) => {
    if (!user) {
      toast.info("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    try {
      await api.post("/api/buyer/wishlist", {
        buyerId: user.userId,
        carId: car.carId,
      });


      alert("Added to wishlist");
      loadWishlist();
    } catch (err) {
      alert("Already in wishlist");
    }
  };





  return (
    <div className="container-fluid p-0">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Find Your Dream Car</h1>
          <p className="hero-subtitle">
            Explore the world's most luxurious and performance-driven vehicles.
            Experience the thrill of driving with MyGaadi.
          </p>
          <a href="#available-cars" className="btn btn-premium btn-lg">
            Explore Collection
          </a>
        </div>
      </div>

      <div className="container my-5" id="available-cars">

        <div className="card p-4 mb-5 shadow-sm border-0" style={{ borderRadius: "15px" }}>
          <h5 className="mb-3 fw-bold">Filter Cars</h5>

          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search by make or model"
                value={filters.keyword}
                onChange={(e) =>
                  setFilters({ ...filters, keyword: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <input
                type="number"
                className="form-control form-control-lg"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: e.target.value })
                }
              />
            </div>

            <div className="col-md-3">
              <input
                type="number"
                className="form-control form-control-lg"
                placeholder="Min Year"
                value={filters.minYear}
                onChange={(e) =>
                  setFilters({ ...filters, minYear: e.target.value })
                }
              />
            </div>
            <div className="col-md-2 d-grid">
              <button
                className="btn btn-premium btn-lg"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>

          </div>
        </div>
        <TestToast />


        <h2 className="mb-4 fw-bold">Available Cars</h2>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {cars.length === 0 && (
            <p className="text-muted">No cars available</p>
          )}

          {cars.map((car) => (
            <div className="col" key={car.carId}>
              <CarCard
                car={{
                  ...car,
                  name: `${car.make} ${car.model}`,
                  image: car.imageUrl || "/images/default-car.jpg",
                  price: car.price,
                }}
                onView={handleView}
                onBuy={handleBuy}
                onWishlist={handleWishlist}
                isWishlisted={wishlistIds.has(car.carId)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyerHome;
