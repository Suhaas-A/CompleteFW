// src/contexts/WishlistContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const { data } = await getWishlist();
      setWishlist(data);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
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
    wishlist.some((item) => item.product_id === product_id);

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
