import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const addToWishlist = (car) => {
    const exists = wishlist.find((c) => c.id === car.id);
    if (!exists) {
      setWishlist([...wishlist, car]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((c) => c.id !== id));
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
