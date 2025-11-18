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

  // Load wishlist ONLY when called manually
  const fetchWishlist = useCallback(async () => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      setWishlist([]); // not logged in
      return;
    }

    try {
      setLoading(true);
      const { data } = await getWishlist();
      setWishlist(data || []);
    } catch (err) {
      setWishlist([]); // prevents errors on 401
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddToWishlist = async (product_id) => {
    await addToWishlist(product_id);
    await fetchWishlist(); // reload wishlist after adding
  };

  const handleRemoveFromWishlist = async (product_id) => {
    await removeFromWishlist(product_id);
    await fetchWishlist(); // reload wishlist after removing
  };

  const isInWishlist = (product_id) =>
    wishlist.some((item) => item.product_id === product_id);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        handleAddToWishlist,
        handleRemoveFromWishlist,
        isInWishlist,
        fetchWishlist, // exposed for manual loading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => useContext(WishlistContext);
