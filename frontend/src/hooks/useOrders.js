// src/hooks/useOrders.js
import { useState, useEffect } from "react";
import { createOrder, getMyOrders, getOrderDetails } from "../api/orderApi";

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await getMyOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrderDetails = async (orderId) => {
    const { data } = await getOrderDetails(orderId);
    setSelectedOrder(data);
  };

  const handleCreateOrder = async (orderData) => {
    await createOrder(orderData);
    await fetchOrders();
  };

  return { orders, selectedOrder, loading, error, fetchOrderDetails, handleCreateOrder };
}
