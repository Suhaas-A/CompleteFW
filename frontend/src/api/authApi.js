// src/api/authApi.js
import axiosInstance from "./axiosInstance";

export const login = async (username, password) => {
  const form = new FormData();
  form.append("username", username);
  form.append("password", password);
  return axiosInstance.post("/login", form);
};

export const register = (data) => axiosInstance.post("/register", data);

export const getMyDetails = () => axiosInstance.get("/my_details");
