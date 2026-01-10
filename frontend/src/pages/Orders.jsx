import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orderApi";
import Loader from "../components/common/Loader";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTimeline, setOpenTimeline] = useState(null);
  const navigate = useNavigate();
  const { dark } = useTheme();

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  // ✅ FILTER OUT "Payment Pending" ORDERS
  const visibleOrders = orders.filter(
    (order) => order.status?.toLowerCase() !== "payment pending"
  );

  if (loading) return <Loader />;

  if (!visibleOrders.length)
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          dark ? "bg-[#0F1012] text-[#A1A1AA]" : "bg-gray-50 text-gray-600"
        }`}
      >
        <h2
          className={`text-2xl font-semibold mb-2 ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          No Orders Yet
        </h2>
        <p className="text-sm text-center max-w-md">
          Your Eleganza orders will appear here once you complete a purchase.
        </p>
      </div>
    );

  const timelineStages = ["Pending", "Packed", "Shipped", "Delivered"];

  return (
    <div
      className={`min-h-screen px-6 py-12 ${
        dark ? "bg-[#0F1012] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <h2 className="text-4xl font-bold text-[#D4AF37] mb-12 text-center">
          My Orders
        </h2>

        <div className="space-y-8">
          {visibleOrders.map((order) => {
            const currentIndex = timelineStages.indexOf(order.status);

            return (
              <div
                key={order.id}
                className={`rounded-3xl p-6 border transition ${
                  dark
                    ? "bg-[#14161A] border-[#262626] hover:shadow-xl"
                    : "bg-white border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                {/* HEADER */}
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">
                      Order #{order.id}
                    </h3>

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold
                        ${
                          order.status?.toLowerCase() === "delivered"
                            ? "bg-green-500/20 text-green-400"
                            : order.status?.toLowerCase() === "pending"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : order.status?.toLowerCase() === "cancelled"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div
                    className={`text-sm space-y-1 ${
                      dark ? "text-[#A1A1AA]" : "text-gray-600"
                    }`}
                  >
                    <p>
                      <span className="text-[#D4AF37] font-medium">
                        Delivery Address:
                      </span>{" "}
                      {order.delivery_address}
                    </p>
                    <p>
                      <span className="text-[#D4AF37] font-medium">
                        Order Date:
                      </span>{" "}
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* TIMELINE TOGGLE */}
                <button
                  onClick={() =>
                    setOpenTimeline((prev) =>
                      prev === order.id ? null : order.id
                    )
                  }
                  className="mt-5 w-full text-sm text-[#D4AF37] font-medium underline"
                >
                  {openTimeline === order.id
                    ? "Hide Order Timeline ▲"
                    : "View Order Timeline ▼"}
                </button>

                {/* TIMELINE */}
                {openTimeline === order.id && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between relative">
                      {timelineStages.map((stage, index) => (
                        <div
                          key={stage}
                          className="flex flex-col items-center w-full"
                        >
                          {index !== 0 && (
                            <div
                              className={`h-1 w-full -ml-2 -mr-2 ${
                                index <= currentIndex
                                  ? "bg-green-500"
                                  : dark
                                  ? "bg-[#262626]"
                                  : "bg-gray-300"
                              }`}
                            />
                          )}

                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold
                              ${
                                index <= currentIndex
                                  ? "bg-green-500 text-white"
                                  : dark
                                  ? "bg-[#262626] text-[#A1A1AA]"
                                  : "bg-gray-300 text-gray-600"
                              }`}
                          >
                            {index + 1}
                          </div>

                          <p
                            className={`mt-2 text-xs font-medium ${
                              index <= currentIndex
                                ? "text-green-400"
                                : dark
                                ? "text-[#A1A1AA]"
                                : "text-gray-500"
                            }`}
                          >
                            {stage}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div
                  className="mt-6 text-right cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <span className="text-[#D4AF37] font-medium text-sm hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
