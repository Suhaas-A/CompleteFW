// src/hooks/useWishlist.js
import { useState, useEffect } from "react";
import { getWishlist, addToWishlist, removeFromWishlist } from "../api/wishlistApi";

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    const { data } = await getWishlist();
    setWishlist(data);
    setLoading(false);
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

  const isInWishlist = (product_id) => wishlist.some((item) => item.product_id === product_id);

  return { wishlist, loading, handleAddToWishlist, handleRemoveFromWishlist, isInWishlist };
}
