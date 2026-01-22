import { useEffect, useState } from "react";
import api from "../../api/app";
import { useAuth } from "../../utils/AuthContext";

const Wishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = async () => {
    try {
      console.log("USER:", user);

      const res = await api.get(`/api/buyer/wishlist/${user.userId}`);
      console.log("WISHLIST DATA:", res.data);

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
    await api.delete(`/api/buyer/wishlist/${wishlistId}`);
    loadWishlist();
  };

  return (
    <div className="container mt-4">
      <h2>My Wishlist</h2>

      {wishlist.length === 0 && <p>No items in wishlist</p>}

      <div className="row">
        {wishlist.map((item) => (
          <div className="col-md-4 mb-3" key={item.wishlistId}>
            <div className="card shadow">
              <div className="card-body">
                <h5>
                  {item.make} {item.model}
                </h5>
                <p>Price: ₹{item.price}</p>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromWishlist(item.wishlistId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
