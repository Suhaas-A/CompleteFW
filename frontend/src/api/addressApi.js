// src/api/addressApi.js
import axiosInstance from "./axiosInstance";

export const getAddresses = () => axiosInstance.get("/addresses");

export const addAddress = (addressData) =>
  axiosInstance.post("/addresses", addressData);

export const deleteAddress = (id) => axiosInstance.delete(`/addresses/${id}`);
