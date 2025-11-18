// src/api/paymentApi.js
import axiosInstance from "./axiosInstance";

export const createPaymentIntent = (order_id, amount, currency = "INR") =>
  axiosInstance.post("/payments/create-intent", { order_id, amount, currency });

export const confirmPayment = (order_id, provider_payment_id, status) =>
  axiosInstance.post("/payments/confirm", {
    order_id,
    provider_payment_id,
    status,
  });
