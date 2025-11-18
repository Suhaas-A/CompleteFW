import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orderApi";
import Loader from "../components/common/Loader";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  if (!orders.length)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-600">
        <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
        <p className="text-sm text-gray-500">
          Your orders will appear here once you make a purchase.
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-serif font-bold mb-8 text-[#8C6B1F] text-center">
        My Orders
      </h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => navigate(`/orders/${order.id}`)}
            className="bg-white rounded-2xl shadow-md border border-[#E8D9A6] p-6 cursor-pointer
                       hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-[#3A3A3A]">
                Order #{order.id}
              </h3>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium
                  ${
                    order.status?.toLowerCase() === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status?.toLowerCase() === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status?.toLowerCase() === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {order.status}
              </span>
            </div>

            {/* Body */}
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <span className="font-medium text-[#C9A227]">
                  Delivery Address:
                </span>{" "}
                {order.delivery_address}
              </p>
              <p>
                <span className="font-medium text-[#C9A227]">Order Date:</span>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-4 text-right">
              <span className="text-[#8C6B1F] font-medium text-sm hover:underline">
                View Details →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
