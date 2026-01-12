// src/api/authApi.js
import axiosInstance from "./axiosInstance";

// -------------------- AUTH -------------------- //

export const login = async (username, password) => {
  const form = new FormData();
  form.append("username", username);
  form.append("password", password);

  return axiosInstance.post("/login", form);
};

export const register = (data) => {
  return axiosInstance.post("/register", data);
};

export const getMyDetails = () => {
  return axiosInstance.get("/my_details");
};

// -------------------- FORGOT PASSWORD (OTP) -------------------- //

export const sendResetOtp = async (email) => {
  try {
    const res = await axiosInstance.post("/forgot-password", {
      email,
    });
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.detail || "Failed to send OTP"
    );
  }
};

export const resetPassword = async (email, otp, newPassword) => {
  try {
    const res = await axiosInstance.post("/reset-password", {
      email,
      otp,
      new_password: newPassword,
    });
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.detail || "Password reset failed"
    );
  }
};
