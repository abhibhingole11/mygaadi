import { useLocation, useNavigate } from "react-router-dom";
import { useWishlist } from "../../utils/WishlistContext";
import { useAuth } from "../../utils/AuthContext";
import api from "../../api/app";
import { toast } from "react-toastify";

const CarDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToWishlist } = useWishlist();

  const car = state?.car;

  if (!car) {
    return <p>Car details not found</p>;
  }

  const handleBuy = async () => {
    if (!user) {
      toast.info("Please login to buy cars");
      navigate("/login");
      return;
    }
    navigate("/receipt", { state: { car } });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{car.make} {car.model}</h2>

      <img
        src={car.image}
        alt="Car"
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "350px",
          objectFit: "cover",
          borderRadius: "8px",
          marginTop: "15px"
        }}
      />

      <div style={{ marginTop: "20px" }}>
        <p><b>Year:</b> {car.year}</p>
        <p><b>Price:</b> ₹{car.price}</p>
        <p><b>Mileage:</b> {car.mileage} km</p>
        <p><b>Condition:</b> Excellent</p>
        <p><b>Seller:</b> {car.sellerName || "Seller"}</p>
      </div>

      <div className="d-flex gap-3 mt-4">
        <button
          className="btn btn-premium"
          onClick={() => addToWishlist(car)}
        >
          Add to Wishlist ♥
        </button>

        <button
          className="btn btn-success"
          onClick={handleBuy}
        >
          Buy Now 🚗
        </button>
      </div>

    </div>
  );
};

export default CarDetails;
