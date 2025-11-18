// src/api/cartApi.js
import axiosInstance from "./axiosInstance";

export const getCart = () => axiosInstance.get("/my_cart");

export const addToCart = (product_id, quantity = 1) =>
  axiosInstance.post("/add_product_to_cart", { product_id, quantity });

export const updateCartQuantity = (product_id, quantity) =>
  axiosInstance.post("/edit_quantity", { product_id, quantity });

export const removeFromCart = (product_id) =>
  axiosInstance.delete(`/remove_product/${product_id}`);
