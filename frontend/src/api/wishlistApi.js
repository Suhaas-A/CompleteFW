// src/api/wishlistApi.js
import axiosInstance from "./axiosInstance";

export const getWishlist = () => axiosInstance.get("/wishlist");

export const addToWishlist = (product_id) =>
  axiosInstance.post("/wishlist/add", { product_id });

export const removeFromWishlist = (product_id) =>
  axiosInstance.delete(`/wishlist/remove/${product_id}`);
