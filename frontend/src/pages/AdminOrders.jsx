import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import AdminLayout from "../components/admin/AdminLayout";
import OrderStatusModal from "../components/admin/OrderStatusModal";
import { useNavigate } from "react-router-dom";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/admin/all_orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <AdminLayout>Loading orders...</AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="text-3xl font-serif font-semibold mb-6">Manage Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border rounded-xl shadow p-5 flex justify-between"
          >
            <div>
              <p className="font-semibold text-lg">
                Order #{order.id} — {order.status}
              </p>
              <p className="text-gray-600">User ID: {order.user_id}</p>
              <p className="text-gray-600">
                Created: {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedOrder(order)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
              >
                Update Status
              </button>

              <button
                onClick={() => navigate(`/admin/order/${order.id}/timeline`)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-800"
              >
                View Timeline
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <OrderStatusModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={() => window.location.reload()}
        />
      )}
    </AdminLayout>
  );
}
