import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orderApi";
import Loader from "../components/common/Loader";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openTimeline, setOpenTimeline] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  if (!orders.length)
    return (
      <div className="min-h-screen bg-[#0F1012] flex flex-col items-center justify-center text-[#A1A1AA]">
        <h2 className="text-2xl font-semibold text-white mb-2">
          No Orders Yet
        </h2>
        <p className="text-sm">
          Your Eleganza orders will appear here once you make a purchase.
        </p>
      </div>
    );

  const timelineStages = ["Pending", "Packed", "Shipped", "Delivered"];

  return (
    <div className="min-h-screen bg-[#0F1012] px-6 py-12 text-white">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <h2 className="text-4xl font-bold text-[#D4AF37] mb-12 text-center">
          My Orders
        </h2>

        <div className="space-y-8">
          {orders.map((order) => {
            const currentIndex = timelineStages.indexOf(order.status);

            return (
              <div
                key={order.id}
                className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 hover:shadow-xl transition"
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

                  <div className="text-sm text-[#A1A1AA] space-y-1">
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
                                  : "bg-[#262626]"
                              }`}
                            />
                          )}

                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold
                            ${
                              index <= currentIndex
                                ? "bg-green-500 text-white"
                                : "bg-[#262626] text-[#A1A1AA]"
                            }`}
                          >
                            {index + 1}
                          </div>

                          <p
                            className={`mt-2 text-xs font-medium ${
                              index <= currentIndex
                                ? "text-green-400"
                                : "text-[#A1A1AA]"
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
