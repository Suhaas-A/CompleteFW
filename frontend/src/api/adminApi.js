// src/api/adminApi.js
import axiosInstance from "./axiosInstance";

// ---- Category / Size / Coupon / Discount ----
export const addCategory = (name) => axiosInstance.post("/post_category", { name });
export const addSize = (name) => axiosInstance.post("/post_size", { name });
export const addCoupon = (name, offer) =>
  axiosInstance.post("/post_coupon", { name, offer });
export const addDiscount = (name, prop) =>
  axiosInstance.post("/post_discount", { name, prop });
export const addPattern = (name) => axiosInstance.post("/post_pattern", { name });
export const addColor = (name) => axiosInstance.post("/post_color", { name });
export const addMaterial = (name) =>
  axiosInstance.post("/post_material", { name });
export const addPack = (name, number) =>
  axiosInstance.post("/post_pack", { name, number });

// ---- Reports ----
export const getSalesSummary = () => axiosInstance.get("/admin/sales-summary");
