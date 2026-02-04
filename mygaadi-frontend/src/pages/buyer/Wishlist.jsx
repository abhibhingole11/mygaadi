import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/app";
import { useAuth } from "../../utils/AuthContext";
import { toast } from "react-toastify";

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = async () => {
    try {
      if (!user?.userId) return;
      const res = await api.get(`/api/buyer/wishlist/${user.userId}`);
      setWishlist(res.data);
    } catch (err) {
      console.error("Failed to load wishlist", err);
    }
  };

  useEffect(() => {
    if (user && user.userId) {
      loadWishlist();
    }
  }, [user]);

  const removeFromWishlist = async (wishlistId) => {
    try {
      await api.delete(`/api/buyer/wishlist/${wishlistId}`);
      toast.success("Removed from wishlist");
      loadWishlist();
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleBuy = async (car) => {
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
            loadWishlist();
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
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Unable to initiate purchase");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold text-premium">My Wishlist ❤️</h2>

      {wishlist.length === 0 && (
        <div className="card p-5 text-center shadow-sm border-0" style={{ borderRadius: "15px" }}>
          <p className="text-muted mb-0">Your wishlist is empty. Start exploring cars!</p>
        </div>
      )}

      <div className="row g-4">
        {wishlist.map((item) => (
          <div className="col-md-6 col-lg-4" key={item.wishlistId}>
            <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-2">
                  {item.make} {item.model}
                </h5>
                <h6 className="text-primary fw-bold mb-3">₹ {item.price.toLocaleString()}</h6>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-premium"
                    onClick={() => handleBuy(item)}
                  >
                    Buy Now 🚗
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => removeFromWishlist(item.wishlistId)}
                  >
                    Remove from Wishlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
