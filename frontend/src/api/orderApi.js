// src/api/orderApi.js
import axiosInstance from "./axiosInstance";

export const createOrder = (orderData) =>
  axiosInstance.post("/create_order", orderData);

export const getMyOrders = () => axiosInstance.get("/my_orders");

export const getOrderDetails = (id) => axiosInstance.get(`/order/${id}`);
