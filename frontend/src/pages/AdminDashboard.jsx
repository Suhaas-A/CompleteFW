import { useEffect, useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import { getAllProducts } from "../api/productApi";
import { getSalesSummary } from "../api/adminApi";
import Loader from "../components/common/Loader";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [topProducts, setTopProducts] = useState([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prodRes, reportRes] = await Promise.all([
          getAllProducts(),
          getSalesSummary().catch(() => ({ data: null })),
        ]);
        setProductCount(prodRes.data.length || 0);
        if (reportRes?.data) {
          setTopProducts(reportRes.data.top_products || []);
          setRevenue(reportRes.data.total_revenue || 0);
        }
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
      <div className="min-h-screen bg-[#F9F9F7] p-6 sm:p-10 rounded-2xl">
        {/* Header */}
        <h2 className="text-3xl font-serif font-semibold text-[#3A3A3A] mb-8 border-b-4 border-[#C9A227] inline-block pb-2">
          Dashboard Overview
        </h2>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {/* Total Products */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <p className="text-sm uppercase tracking-wider opacity-90">Total Products</p>
            <h3 className="text-4xl font-bold mt-2">{productCount}</h3>
            <p className="text-xs mt-1 opacity-80">Active products in catalog</p>
          </div>

          {/* Revenue */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-[#EEDC82] to-[#C9A227] text-[#3A3A3A] shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <p className="text-sm uppercase tracking-wider opacity-80">Total Revenue</p>
            <h3 className="text-4xl font-bold mt-2">
              ₹{Number(revenue).toLocaleString()}
            </h3>
            <p className="text-xs mt-1 opacity-70">Cumulative sales to date</p>
          </div>

          {/* Top Product */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-[#F7F4E1] to-[#EAD38B] shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <p className="text-sm uppercase tracking-wider text-[#8C6B1F] opacity-80">Top Product</p>
            <h3 className="text-lg font-semibold text-[#3A3A3A] mt-2">
              {topProducts[0]
                ? `#${topProducts[0].product_id}`
                : "—"}
            </h3>
            <p className="text-sm text-[#6B6B6B]">
              Sold: {topProducts[0]?.quantity_sold || 0}
            </p>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-[#EDE6D8] p-6 transition-all duration-300">
          <h3 className="text-xl font-semibold text-[#3A3A3A] mb-6 border-b border-[#EDE6D8] pb-2">
            Top Products (By Quantity Sold)
          </h3>

          {topProducts.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[#555] border-b border-[#EEE]">
                  <th className="py-3 px-2">Product ID</th>
                  <th className="py-3 px-2">Quantity Sold</th>
                  <th className="py-3 px-2">Performance</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, index) => (
                  <tr
                    key={p.product_id}
                    className={`border-b border-[#F1F1F1] hover:bg-[#FAF9F5] transition-all ${
                      index === 0 ? "font-semibold text-[#8C6B1F]" : "text-[#3A3A3A]"
                    }`}
                  >
                    <td className="py-3 px-2">#{p.product_id}</td>
                    <td className="py-3 px-2">{p.quantity_sold}</td>
                    <td className="py-3 px-2">
                      {index === 0
                        ? "🏆 Best Seller"
                        : index < 3
                        ? "🔥 Trending"
                        : "⭐ Good"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-6">
              No sales data available yet.
            </p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
