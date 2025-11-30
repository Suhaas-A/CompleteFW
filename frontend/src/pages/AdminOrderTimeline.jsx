import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import AdminLayout from "../components/admin/AdminLayout";

export default function AdminOrderTimeline() {
  const { id } = useParams();
  const [timeline, setTimeline] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get(
          `/order/${id}/status-history`
        );
        setTimeline(res.data);
      } catch (err) {
        console.error("Failed to load timeline", err);
      }
    })();
  }, [id]);

  if (!timeline)
    return (
      <AdminLayout>
        <p>Loading timeline...</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <h1 className="text-3xl font-semibold mb-6">
        Order #{id} — Status Timeline
      </h1>

      <div className="space-y-6">
        {timeline.history.map((entry) => (
          <div
            key={entry.id}
            className="bg-white border rounded-xl p-5 shadow"
          >
            <p className="font-semibold text-lg">{entry.status}</p>
            {entry.note && (
              <p className="text-gray-600 italic">“{entry.note}”</p>
            )}
            <p className="text-gray-500 text-sm mt-2">
              Changed at: {new Date(entry.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
