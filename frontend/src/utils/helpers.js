// src/utils/helpers.js
import { CURRENCIES } from "./constants";

export const formatPrice = (price, currency = "INR") =>
  `${CURRENCIES[currency] || ""}${price.toLocaleString()}`;

export const truncateText = (text, max = 100) =>
  text.length > max ? text.substring(0, max) + "..." : text;

export const handleError = (err) =>
  err.response?.data?.detail || "An unexpected error occurred.";

export const calculateTotal = (cartItems) =>
  cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
