import { useState } from "react";
import { useCartContext } from "../contexts/CartContext";
import { createOrder } from "../api/orderApi";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCartContext();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod | online
  const [loading, setLoading] = useState(false);

  if (!cartItems.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#A1A1AA]">
        Your cart is empty.
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert("Please enter delivery address");
      return;
    }

    setLoading(true);

    const products = cartItems.map((i) => [i.id, i.quantity]);

    try {
      // 🔹 ONLINE PAYMENT (mock – safe)
      if (paymentMethod === "online") {
        // simulate payment success
        await new Promise((res) => setTimeout(res, 1200));
      }

      await createOrder({
        deliver_address: address,
        products,
        delivery_link: paymentMethod === "online" ? "paid" : "pending",
        status: "Pending",
      });

      clearCart();
      navigate("/orders");
    } catch (err) {
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1012] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-[#D4AF37] mb-10 text-center">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — ADDRESS + PAYMENT */}
          <div className="lg:col-span-2 space-y-8">

            {/* ADDRESS */}
            <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-6">
                Shipping Address
              </h2>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full delivery address"
                rows={4}
                className="w-full bg-[#0F1012] border border-[#262626] rounded-xl p-4 text-white placeholder-[#A1A1AA] outline-none"
              />
            </div>

            {/* PAYMENT */}
            <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <span>Cash on Delivery</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                  />
                  <span>Online Payment</span>
                  <span className="text-xs text-[#A1A1AA]">
                    (UPI / Card – simulated)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 h-fit">
            <h2 className="text-xl font-semibold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm text-[#A1A1AA]">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="truncate">
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-400">Free</span>
              </div>

              <div className="border-t border-[#262626] pt-4 flex justify-between text-white font-semibold text-lg">
                <span>Total</span>
                <span className="text-[#D4AF37]">₹{totalPrice}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="mt-8 w-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                         text-black py-3 rounded-full font-semibold
                         hover:brightness-110 transition disabled:opacity-60"
            >
              {loading
                ? paymentMethod === "online"
                  ? "Processing Payment..."
                  : "Placing Order..."
                : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
