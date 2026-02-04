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

    try {
      const orderRes = await api.post(`/api/buyer/buy/create-order/${car.carId}`);
      const orderId = orderRes.data;

      const options = {
        key: "rzp_test_SC1xMbhAbQJNMK",
        amount: car.price * 100,
        currency: "INR",
        name: "MyGaadi",
        description: `Purchase ${car.make} ${car.model}`,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post("/api/buyer/buy/verify", {
              buyerId: user.userId,
              carId: car.carId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.success(verifyRes.data || "Car purchased successfully!");
            navigate("/");
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.firstName + " " + user.lastName,
          email: user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        toast.error("Payment Failed: " + response.error.description);
      });
      rzp.open();

    } catch (err) {
      console.error(err);
      toast.error("Unable to initiate purchase");
    }
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
