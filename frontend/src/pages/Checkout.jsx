// src/pages/Checkout.jsx
import { useState } from "react";
import { useCartContext } from "../contexts/CartContext";
import { createOrder } from "../api/orderApi";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCartContext();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (!address) return alert("Please enter your delivery address.");

    setLoading(true);
    const products = cartItems.map((i) => [i.id, i.quantity]);

    try {
      await createOrder({
        deliver_address: address,
        products,
        delivery_link: "pending",
        status: "Pending",
      });

      clearCart();
      alert("Order placed successfully!");
      navigate("/orders");
    } catch {
      alert("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0)
    return <p className="text-center mt-10 text-gray-500">Your cart is empty.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-yellow-500">Checkout</h2>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Delivery Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border p-2 w-full rounded-md"
          placeholder="Enter full address"
        />
      </div>

      <div className="border-t pt-3 mb-4">
        <h3 className="font-semibold mb-2">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="text-right font-bold text-lg mt-2">
          Total: ₹{totalPrice}
        </div>
      </div>

      <button
        disabled={loading}
        onClick={handleOrder}
        className="bg-yellow-400 hover:bg-yellow-500 text-white w-full py-2 rounded-lg font-semibold"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
