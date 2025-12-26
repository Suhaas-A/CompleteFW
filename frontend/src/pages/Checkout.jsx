import { useState } from "react";
import { useCartContext } from "../contexts/CartContext";
import { createOrder } from "../api/orderApi";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCartContext();
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod | online
  const [loading, setLoading] = useState(false);

  if (!cartItems.length) {
    return (
      <div
        className={`min-h-[60vh] flex items-center justify-center ${
          dark ? "text-[#A1A1AA] bg-[#0F1012]" : "text-gray-500 bg-gray-50"
        }`}
      >
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
      // 1️⃣ CREATE ORDER
      const orderRes = await createOrder({
        deliver_address: address,
        products,
        delivery_link: paymentMethod === "online" ? "pending" : "cod",
        status: "Pending",
      });

      const orderId = orderRes.data.id;

      // 2️⃣ CASH ON DELIVERY
      if (paymentMethod === "cod") {
        clearCart();
        navigate("/orders");
        return;
      }

      // 3️⃣ ONLINE PAYMENT
      const paymentRes = await axiosInstance.post(
        "/payments/create-intent",
        {
          order_id: orderId,
          amount: totalPrice,
          currency: "INR",
          provider: "cashfree",
        }
      );

      const { payment_session_id } = paymentRes.data;

      // 4️⃣ CASHFREE CHECKOUT
      const cashfree = new window.Cashfree();
      cashfree.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: "_self",
      });

    } catch (err) {
      console.error(err);
      alert("Failed to place order or initiate payment");
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen px-6 py-12 ${
        dark ? "bg-[#0F1012] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-[#D4AF37] mb-10 text-center">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            {/* ADDRESS */}
            <div
              className={`rounded-3xl p-6 border ${
                dark
                  ? "bg-[#14161A] border-[#262626]"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <h2 className="text-xl font-semibold mb-6">
                Shipping Address
              </h2>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter full delivery address"
                rows={4}
                className={`w-full rounded-xl p-4 outline-none ${
                  dark
                    ? "bg-[#0F1012] border border-[#262626] text-white placeholder-[#A1A1AA]"
                    : "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>

            {/* PAYMENT */}
            <div
              className={`rounded-3xl p-6 border ${
                dark
                  ? "bg-[#14161A] border-[#262626]"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
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
                    (UPI / Card via Cashfree)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className={`rounded-3xl p-6 border h-fit ${
              dark
                ? "bg-[#14161A] border-[#262626]"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6">
              Order Summary
            </h2>

            <div
              className={`space-y-4 text-sm ${
                dark ? "text-[#A1A1AA]" : "text-gray-600"
              }`}
            >
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
                <span className="text-green-500">Free</span>
              </div>

              <div
                className={`border-t pt-4 flex justify-between font-semibold text-lg ${
                  dark ? "border-[#262626] text-white" : "border-gray-200"
                }`}
              >
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
                  ? "Redirecting to Payment..."
                  : "Placing Order..."
                : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
