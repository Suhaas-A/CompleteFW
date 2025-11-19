// src/pages/admin/AdminReports.jsx
import { useEffect, useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import { getSalesSummary } from "../api/adminApi";
import Loader from "../components/common/Loader";

export default function AdminReports() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await getSalesSummary();
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Sales Summary</h2>
        <div className="mb-4">
          <strong>Total revenue:</strong> ₹{Number(report?.total_revenue || 0).toLocaleString()}
        </div>

        <h3 className="font-semibold mb-2">Top products</h3>
        <div className="grid gap-2">
          {report?.top_products?.map((p) => (
            <div key={p.product_id} className="p-3 border rounded flex justify-between">
              <div>Product #{p.product_id}</div>
              <div>{p.quantity_sold} sold</div>
            </div>
          ))}
          {!report?.top_products?.length && <div className="text-gray-500">No data</div>}
        </div>
      </div>
    </AdminLayout>
  );
}
