import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/app";
import CarCard from "../../components/CarCard";
import { useAuth } from "../../utils/AuthContext";

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
      setCars(res.data);
    } catch (err) {
      console.error("Failed to load cars", err);
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
    navigate("/login");
    return;
  }
  navigate(`/car/${car.carId}`, { state: { car } });
};


  // 🛒 Buy car
const handleBuy = async (car) => {
  if (!user) {
    navigate("/login");
    return;
  }

  try {
    await api.post("/api/buyer/buy", {
      buyerId: user.userId,
      carId: car.carId,
    });

    alert("Car purchased successfully");
    loadCars();
    loadWishlist();
  } catch (err) {
    alert("Unable to buy car");
  }
};


  // ❤️ Add to wishlist
 const handleWishlist = async (car) => {
  if (!user) {
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
<div className="card p-3 mb-4 shadow-sm">
  <h5 className="mb-3">Filter Cars</h5>

  <div className="row g-3">
    <div className="col-md-4">
      <input
        type="text"
        className="form-control"
        placeholder="Search by make or model"
        value={filters.keyword}
        onChange={(e) =>
          setFilters({ ...filters, keyword: e.target.value })
        }
      />
    </div>

    <div className="col-md-4">
      <input
        type="number"
        className="form-control"
        placeholder="Max Price"
        value={filters.maxPrice}
        onChange={(e) =>
          setFilters({ ...filters, maxPrice: e.target.value })
        }
      />
    </div>

    <div className="col-md-4">
      <input
        type="number"
        className="form-control"
        placeholder="Min Year"
        value={filters.minYear}
        onChange={(e) =>
          setFilters({ ...filters, minYear: e.target.value })
        }
      />
    </div>
    <div className="mt-3 text-end">
  <button
    className="btn btn-primary"
    onClick={handleSearch}
  >
    Search
  </button>
</div>

  </div>
</div>





  return (
    <div className="container my-4">
      <h2 className="mb-4 fw-bold">Available Cars</h2>

      <div className="row">
        {cars.length === 0 && (
          <p className="text-muted">No cars available</p>
        )}

        {cars.map((car) => (
          <div className="col-md-4 mb-4" key={car.carId}>
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
  );
};

export default BuyerHome;
