import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useCartContext } from "../contexts/CartContext";

export default function PaymentResult() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCartContext();

  const orderId = params.get("order_id");

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    let attempts = 0;

    const verifyPayment = async () => {
      try {
        const res = await axiosInstance.get(
          `/payments/status/${orderId}`
        );

        const paymentStatus = res.data.status;
        setStatus(paymentStatus);

        if (paymentStatus === "succeeded") {
          clearCart();
          setLoading(false);
          return;
        }

        if (paymentStatus === "failed") {
          setLoading(false);
          return;
        }

        // ⏳ still pending → retry (webhook delay)
        attempts++;
        if (attempts < 5) {
          setTimeout(verifyPayment, 2000);
        } else {
          setStatus("failed");
          setLoading(false);
        }

      } catch (err) {
        console.error(err);
        setStatus("failed");
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderId, clearCart, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1012] text-white">
        Verifying payment...
      </div>
    );
  }

  // ❌ FAILED
  if (status === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1012] text-white">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Payment Failed
        </h1>
        <p className="text-[#A1A1AA] mb-6">
          Your payment was not completed. You can retry.
        </p>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-[#D4AF37] text-black px-6 py-3 rounded-full font-semibold"
        >
          Retry Payment
        </button>
      </div>
    );
  }

  // ✅ SUCCESS
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1012] text-white">
      <h1 className="text-4xl font-bold text-[#D4AF37] mb-4">
        Payment Successful 🎉
      </h1>
      <p className="text-[#A1A1AA] mb-6">
        Your order has been placed successfully.
      </p>
      <button
        onClick={() => navigate("/orders")}
        className="bg-[#D4AF37] text-black px-6 py-3 rounded-full font-semibold"
      >
        View My Orders
      </button>
    </div>
  );
}
