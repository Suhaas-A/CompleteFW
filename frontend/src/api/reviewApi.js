// src/api/reviewApi.js
import axiosInstance from "./axiosInstance";

export const addReview = (product_id, rating, comment) =>
  axiosInstance.post("/reviews", { product_id, rating, comment });

export const getReviewsForProduct = (product_id) =>
  axiosInstance.get(`/reviews/product/${product_id}`);
