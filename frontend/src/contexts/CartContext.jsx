// src/contexts/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
} from "../api/cartApi";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const { data } = await getCart();
      setCartItems(data.items || []);
    } catch {
      setCartItems([]);
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
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
