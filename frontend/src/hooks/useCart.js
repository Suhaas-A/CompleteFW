// src/hooks/useCart.js
import { useState, useEffect } from "react";
import { getCart, addToCart, updateCartQuantity, removeFromCart } from "../api/cartApi";

export function useCart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      setCart(data.items || []);
    } catch (err) {
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleAddToCart = async (product_id, quantity = 1) => {
    await addToCart(product_id, quantity);
    await fetchCart();
  };

  const handleUpdateQuantity = async (product_id, quantity) => {
    await updateCartQuantity(product_id, quantity);
    await fetchCart();
  };

  const handleRemoveFromCart = async (product_id) => {
    await removeFromCart(product_id);
    await fetchCart();
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    cart,
    totalPrice,
    loading,
    error,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveFromCart,
  };
}
