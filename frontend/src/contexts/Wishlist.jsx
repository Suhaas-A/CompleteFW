// src/contexts/WishlistContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    const token = sessionStorage.getItem("access_token");  // KEEPING IT AS YOU WANT
    if (!token) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await getWishlist();

      // backend might return { wishlist: [...] }
      setWishlist(data.wishlist || data || []);
    } catch (err) {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddToWishlist = async (product_id) => {
    await addToWishlist(product_id);
    await fetchWishlist();
  };

  const handleRemoveFromWishlist = async (product_id) => {
    await removeFromWishlist(product_id);
    await fetchWishlist();
  };

  const isInWishlist = (product_id) =>
    wishlist.some((item) => item.id === product_id); // FIXED

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        handleAddToWishlist,
        handleRemoveFromWishlist,
        isInWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => useContext(WishlistContext);
