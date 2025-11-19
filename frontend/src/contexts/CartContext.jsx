// src/contexts/CartContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "../api/cartApi";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart ONLY when manually called (not on mount)
  const fetchCart = useCallback(async () => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      setCartItems([]); // user not logged in → cart empty
      return;
    }

    try {
      setLoading(true);
      const { data } = await getCart();
      setCartItems(data.items || []);
    } catch (err) {
      setCartItems([]); // prevents crashes on 401
    } finally {
      setLoading(false);
    }
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

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        loading,
        handleAddToCart,
        handleUpdateQuantity,
        handleRemoveFromCart,
        clearCart,
        fetchCart, // manual fetch now
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
