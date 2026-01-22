import { useLocation } from "react-router-dom";
import { useWishlist } from "../../utils/WishlistContext";


const CarDetails = () => {
  const { state } = useLocation();
  const { addToWishlist } = useWishlist();

  const car = state?.car;

  if (!car) {
    return <p>Car details not found</p>;
  }

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
        <p><b>Seller:</b> Ganesh (Seller)</p>
      </div>

      <button
  style={{ marginTop: "15px" }}
  onClick={() => addToWishlist(car)}
>
  Add to Wishlist ♥
</button>

    </div>
  );
};

export default CarDetails;
