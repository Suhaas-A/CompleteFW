// src/api/productApi.js
import axiosInstance from "./axiosInstance";

export const getAllProducts = () => axiosInstance.get("/all_products");

export const getProductById = (id) => axiosInstance.get(`/product/${id}`);

export const createProduct = (data) => axiosInstance.post("/create_product", data);

export const updateProduct = (id, data) =>
  axiosInstance.put(`/edit_product/${id}`, data);

export const deleteProduct = (id) => axiosInstance.delete(`/delete_product/${id}`);
