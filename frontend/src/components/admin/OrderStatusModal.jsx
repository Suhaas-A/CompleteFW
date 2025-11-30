import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const VALID_STATUSES = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Returned",
  "Refunded",
];

export default function OrderStatusModal({ order, onClose, onUpdated }) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    try {
      setLoading(true);
      await axiosInstance.post(`/order/${order.id}/status`, {
        status,
        note,
      });
      onUpdated();
    } catch (err) {
      alert("Failed to update");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-2xl font-semibold mb-4">
          Update Status — Order #{order.id}
        </h2>

        <label className="block font-medium">New Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded w-full my-2"
        >
          {VALID_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <label className="block font-medium mt-2">Note (optional)</label>
        <textarea
          className="border p-2 rounded w-full"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={updateStatus}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
