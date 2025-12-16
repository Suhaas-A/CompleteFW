// 🕒 ADMIN ORDER TIMELINE — FULL PAGE
// ✅ Logic unchanged
// ❌ AdminLayout removed
// 🎨 Gold & Black Eleganza Admin UI

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function AdminOrderTimeline() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  if (!timeline) {
    return (
      <div className="min-h-screen bg-[#0F1012] flex items-center justify-center text-[#A1A1AA]">
        Loading timeline...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1012] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#D4AF37]">
            Order #{id}
          </h1>
          <p className="text-[#A1A1AA] mt-2">
            Status timeline & order progress
          </p>
        </div>

        {/* TIMELINE */}
        <div className="relative border-l border-[#262626] ml-6 space-y-10">
          {timeline.history.map((entry, index) => (
            <div key={entry.id} className="relative flex gap-6">

              {/* DOT */}
              <div
                className={`w-4 h-4 rounded-full mt-1.5 -ml-[9px] border-2 ${
                  index === timeline.history.length - 1
                    ? "bg-[#D4AF37] border-[#D4AF37]"
                    : "bg-[#0F1012] border-[#444]"
                }`}
              />

              {/* CARD */}
              <div className="bg-[#14161A] border border-[#262626] rounded-2xl p-5 w-full shadow-md hover:shadow-xl transition">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {entry.status}
                    </h3>

                    {entry.note && (
                      <p className="text-sm text-[#A1A1AA] italic mt-1">
                        “{entry.note}”
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-[#6B6B6B] whitespace-nowrap">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BACK BUTTON */}
        <div className="mt-14 text-center">
          <button
            onClick={() => navigate("/admin/orders")}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black font-semibold hover:brightness-110 transition"
          >
            ← Back to Orders
          </button>
        </div>

        <p className="text-center text-xs text-[#6B6B6B] mt-10">
          Eleganza Admin • Order Timeline
        </p>
      </div>
    </div>
  );
}
