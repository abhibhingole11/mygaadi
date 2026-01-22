import { useEffect, useState } from "react";
import api from "../../api/app";
import { useAuth } from "../../utils/AuthContext";
import CarCard from "../../components/CarCard";

const BuyerHome = () => {
  const { user } = useAuth();

  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");

  // 🔹 LOAD APPROVED CARS FROM BACKEND
  const loadCars = async () => {
    try {
      const res = await api.get("/api/buyer/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Failed to load cars");
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  // 🔹 BUY CAR HANDLER
  const handleBuy = async (carId) => {
    try {
      await api.post("/api/buyer/buy", {
        buyerId: user.userId,
        carId: carId,
      });

      alert("Car purchased successfully");

      // reload list → SOLD car disappears
      loadCars();
    } catch (err) {
      alert("Unable to purchase car");
    }
  };
  const handleWishlist = async (carId) => {
  try {
    console.log("Adding to wishlist:", user.userId, carId);

    await api.post("/api/buyer/wishlist", {
      buyerId: user.userId,
      carId: carId,
    });

    alert("Added to wishlist");
  } catch (err) {
    console.error(err);
    alert("Already in wishlist or error");
  }
};



  // 🔹 FILTER LOGIC (CLIENT SIDE)
  const filteredCars = cars.filter((car) => {
    return (
      `${car.make} ${car.model}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (maxPrice === "" || car.price <= maxPrice) &&
      (minYear === "" || car.year >= minYear)
    );
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Find Your Car</h2>

      {/* 🔍 SEARCH & FILTERS */}
      <div className="card p-3 mb-4 shadow">
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search by make or model"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-4 mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Max Price (₹)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="col-md-4 mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Min Year"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 🚗 CAR LIST */}
      <div className="row">
        {filteredCars.length === 0 && (
          <p className="text-center">No cars found</p>
        )}

        {filteredCars.map((car) => (
          <div className="col-md-4 mb-3" key={car.carId}>
           <CarCard
  car={car}
  onBuy={handleBuy}
  onWishlist={handleWishlist}
/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyerHome;
