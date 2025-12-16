// 🧾 ADMIN ORDERS — FULL PAGE (SINGLE FILE)
// Gold & Black Theme | Modal Included | Errorless

import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

/* ============================================================
   🔁 STATUS OPTIONS
   ============================================================ */
const STATUSES = [
  "Placed",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

/* ============================================================
   🧾 MAIN PAGE
   ============================================================ */
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/admin/all_orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1012] text-[#A1A1AA] flex items-center justify-center">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1012] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#D4AF37]">
            Manage Orders
          </h1>
          <p className="text-[#A1A1AA] mt-2">
            Track, update and monitor customer orders
          </p>
        </div>

        {/* ORDERS LIST */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 shadow-xl"
            >
              <div className="grid md:grid-cols-3 gap-6">

                {/* LEFT */}
                <div>
                  <p className="text-sm text-[#A1A1AA]">Order</p>
                  <h3 className="text-xl font-semibold">
                    #ORDER-{order.id}
                  </h3>

                  <p className="text-sm text-[#A1A1AA] mt-2">
                    User ID
                  </p>
                  <p className="font-medium">{order.user_id}</p>
                </div>

                {/* CENTER */}
                <div>
                  <p className="text-sm text-[#A1A1AA]">Status</p>
                  <span className="inline-block mt-1 px-4 py-1 rounded-full text-sm font-semibold bg-yellow-500/20 text-yellow-400">
                    {order.status}
                  </span>

                  <p className="text-sm text-[#A1A1AA] mt-3">
                    Created
                  </p>
                  <p className="text-sm">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-3 md:items-end">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-5 py-2 rounded-full text-sm font-semibold
                      bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                      text-black hover:brightness-110"
                  >
                    Update Status
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/admin/order/${order.id}/timeline`)
                    }
                    className="px-5 py-2 rounded-full text-sm
                      bg-[#0F1012] border border-[#262626]
                      text-[#A1A1AA] hover:bg-[#1F2126]"
                  >
                    View Timeline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center text-[#A1A1AA] mt-20">
            No orders found.
          </div>
        )}

        {/* MODAL */}
        {selectedOrder && (
          <OrderStatusModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onSuccess={(updatedOrder) => {
              setOrders((prev) =>
                prev.map((o) =>
                  o.id === updatedOrder.id ? updatedOrder : o
                )
              );
              setSelectedOrder(null);
            }}
          />
        )}

        <p className="text-center text-xs text-[#6B6B6B] mt-14">
          Eleganza Admin • Orders Management
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   🪟 MODAL — SAME FILE
   ============================================================ */
function OrderStatusModal({ order, onClose, onSuccess }) {
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateStatus = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.put(
        `/admin/order/${order.id}/update_status`,
        { status }
      );

      onSuccess(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-[#14161A]
          border border-[#262626] rounded-3xl p-8 shadow-2xl">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#D4AF37]">
              Update Order Status
            </h2>
            <button
              onClick={onClose}
              className="text-[#A1A1AA] hover:text-white text-xl"
            >
              ✕
            </button>
          </div>

          {/* ORDER INFO */}
          <div className="space-y-2 text-sm mb-6">
            <p className="text-[#A1A1AA]">
              Order ID:
              <span className="text-white ml-2 font-medium">
                #ORDER-{order.id}
              </span>
            </p>
            <p className="text-[#A1A1AA]">
              User ID:
              <span className="text-white ml-2 font-medium">
                {order.user_id}
              </span>
            </p>

            {order.delivery_address && (
              <p className="text-[#A1A1AA]">
                Address:
                <span className="text-white ml-2 font-medium">
                  {order.delivery_address}
                </span>
              </p>
            )}
          </div>

          {/* STATUS SELECT */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full mb-4 bg-[#0F1012]
              border border-[#262626] rounded-xl
              px-4 py-3 text-sm
              focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {error && (
            <p className="text-red-400 text-sm mb-4">{error}</p>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full
                bg-[#0F1012] border border-[#262626]
                text-[#A1A1AA] hover:bg-[#1F2126]"
            >
              Cancel
            </button>

            <button
              onClick={updateStatus}
              disabled={loading}
              className="px-6 py-2 rounded-full font-semibold
                bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                text-black hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
