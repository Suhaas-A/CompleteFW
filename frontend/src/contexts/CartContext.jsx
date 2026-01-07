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

  // Load cart ONLY when manually called
  const fetchCart = useCallback(async () => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await getCart();
      setCartItems(data.items || []);
    } catch {
      setCartItems([]);
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

  // 🟢 TOTAL PRICE
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 🟢 ADD THIS FUNCTION (FIX)
  const getItemFinalPrice = (item) => {
    // If later you add discounts, handle here
    return item.price;
  };

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
        getItemFinalPrice, // ✅ EXPORTED
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
