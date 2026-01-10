import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderDetails } from "../api/orderApi";
import { useAuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const TIMELINE = ["Pending", "Packed", "Shipped", "Delivered"];

export default function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuthContext();
  const { dark } = useTheme();

  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await getOrderDetails(id, token);
        setOrder(res.data.order);
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, token]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          dark ? "bg-[#0F1012] text-[#A1A1AA]" : "bg-gray-50 text-gray-600"
        }`}
      >
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          dark ? "bg-[#0F1012] text-[#A1A1AA]" : "bg-gray-50 text-gray-600"
        }`}
      >
        <p className="mb-4">Order not found.</p>
        <Link
          to="/orders"
          className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black px-6 py-2 rounded-full font-semibold"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const currentStep = TIMELINE.indexOf(order.status);

  return (
    <div
      className={`min-h-screen px-6 py-14 ${
        dark ? "bg-[#0F1012] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto space-y-12">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-[#D4AF37]">
              Order #{order.id}
            </h1>
            <p
              className={`mt-2 ${
                dark ? "text-[#A1A1AA]" : "text-gray-600"
              }`}
            >
              Placed on{" "}
              {new Date(order.ordered_at || order.created_at).toLocaleString()}
            </p>
          </div>

          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-400">
            {order.status}
          </span>
        </div>

        {/* TIMELINE */}
        <div
          className={`rounded-3xl p-6 border ${
            dark
              ? "bg-[#14161A] border-[#262626]"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div className="flex justify-between">
            {TIMELINE.map((step, i) => (
              <div key={step} className="flex-1 text-center">
                <div
                  className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                    ${
                      i <= currentStep
                        ? "bg-green-500 text-white"
                        : dark
                        ? "bg-[#262626] text-[#A1A1AA]"
                        : "bg-gray-300 text-gray-600"
                    }`}
                >
                  {i + 1}
                </div>
                <p
                  className={`mt-2 text-xs font-medium
                    ${
                      i <= currentStep
                        ? "text-green-400"
                        : dark
                        ? "text-[#A1A1AA]"
                        : "text-gray-500"
                    }`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ITEMS */}
        <div
          className={`rounded-3xl p-6 space-y-6 border ${
            dark
              ? "bg-[#14161A] border-[#262626]"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <h2 className="text-2xl font-semibold text-[#D4AF37]">
            Ordered Items
          </h2>

          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-5">
              <img
                src={
                  p.photo_link && p.photo_link !== "no photo"
                    ? p.photo_link
                    : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                }
                alt={p.name}
                className="w-24 h-28 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{p.name}</h3>
                <p
                  className={`text-sm line-clamp-2 ${
                    dark ? "text-[#A1A1AA]" : "text-gray-600"
                  }`}
                >
                  {p.description}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    dark ? "text-[#A1A1AA]" : "text-gray-600"
                  }`}
                >
                  Qty: {p.quantity}
                </p>
              </div>

              <p className="font-semibold text-[#D4AF37]">
                ₹{p.price}
              </p>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="grid md:grid-cols-2 gap-8">
          <div
            className={`rounded-3xl p-6 border ${
              dark
                ? "bg-[#14161A] border-[#262626]"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <h3 className="font-semibold text-[#D4AF37] mb-3">
              Delivery Address
            </h3>
            <p
              className={`text-sm leading-relaxed ${
                dark ? "text-[#A1A1AA]" : "text-gray-600"
              }`}
            >
              {order.delivery_address || "Not provided"}
            </p>
          </div>

          <div
            className={`rounded-3xl p-6 border ${
              dark
                ? "bg-[#14161A] border-[#262626]"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <h3 className="font-semibold text-[#D4AF37] mb-3">
              Order Summary
            </h3>
            <p
              className={`text-sm ${
                dark ? "text-[#A1A1AA]" : "text-gray-600"
              }`}
            >
              Total Amount
            </p>
            <p className="text-2xl font-bold text-[#D4AF37] mt-1">
              ₹{order.total_amount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* BACK */}
        <div className="text-center pt-6">
          <Link
            to="/orders"
            className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black font-semibold px-8 py-3 rounded-full hover:brightness-110 transition"
          >
            ← Back to My Orders
          </Link>
        </div>

      </div>
    </div>
  );
}

