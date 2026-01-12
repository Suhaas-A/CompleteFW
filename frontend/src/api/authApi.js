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

export async function sendResetOtp(email) {
  const res = await fetch("/api/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Failed to send OTP");
  }

  return res.json();
}

export async function resetPassword(email, otp, newPassword) {
  const res = await fetch("/api/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      otp,
      new_password: newPassword,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Reset failed");
  }

  return res.json();
}


