import { useEffect, useMemo, useState } from "react";
import { getAllProducts } from "../api/productApi";
import { getSalesSummary } from "../api/adminApi";
import Loader from "../components/common/Loader";

export default function AdminDashboard() {
  /* =====================================================
     STATE
  ===================================================== */
  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenue, setRevenue] = useState(0);

  /* =====================================================
     FETCH DATA
  ===================================================== */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [prodRes, reportRes] = await Promise.all([
          getAllProducts(),
          getSalesSummary().catch(() => ({ data: null })),
        ]);

        const productList = prodRes.data || [];
        setProducts(productList);
        setProductCount(productList.length);

        if (reportRes?.data) {
          setTopProducts(reportRes.data.top_products || []);
          setRevenue(reportRes.data.total_revenue || 0);
        }
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* =====================================================
     PRODUCT LOOKUP MAP (id → product)
  ===================================================== */
  const productMap = useMemo(() => {
    const map = {};
    for (const p of products) {
      map[p.id] = p;
    }
    return map;
  }, [products]);

  /* =====================================================
     LOADING
  ===================================================== */
  if (loading) return <Loader />;

  /* =====================================================
     TOTAL SOLD
  ===================================================== */
  const totalSold = topProducts.reduce(
    (sum, p) => sum + p.quantity_sold,
    0
  );

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="min-h-screen bg-[#0F1012] text-white px-8 py-14">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <h1 className="text-4xl font-bold text-[#D4AF37] mb-12">
        Admin Dashboard Overview
      </h1>

      {/* =====================================================
          STATS
      ===================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">

        {/* TOTAL REVENUE */}
        <div className="bg-[#14161A] border border-[#262626] rounded-2xl p-6">
          <p className="text-sm text-[#A1A1AA] uppercase">
            Total Revenue
          </p>
          <h3 className="text-4xl font-bold text-[#D4AF37] mt-2">
            ₹{Number(revenue).toLocaleString()}
          </h3>
        </div>

        {/* TOTAL PRODUCTS */}
        <div className="bg-[#14161A] border border-[#262626] rounded-2xl p-6">
          <p className="text-sm text-[#A1A1AA] uppercase">
            Total Products
          </p>
          <h3 className="text-4xl font-bold mt-2">
            {productCount}
          </h3>
        </div>

        {/* ITEMS SOLD */}
        <div className="bg-[#14161A] border border-[#262626] rounded-2xl p-6">
          <p className="text-sm text-[#A1A1AA] uppercase">
            Items Sold
          </p>
          <h3 className="text-4xl font-bold mt-2">
            {totalSold}
          </h3>
        </div>
      </div>

      {/* =====================================================
          ANALYTICS
      ===================================================== */}
      <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 mb-12">
        <h3 className="text-xl font-semibold text-[#D4AF37] mb-8">
          Sales Analytics
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* PIE CHART */}
          <div className="bg-[#0F1012] border border-[#262626] rounded-2xl p-6 flex flex-col items-center">
            <p className="text-sm text-[#A1A1AA] mb-4">
              Product Contribution
            </p>

            <div
              className="w-40 h-40 rounded-full"
              style={{
                background: `conic-gradient(
                  #D4AF37 0% ${
                    totalSold
                      ? (topProducts[0]?.quantity_sold / totalSold) * 100
                      : 0
                  }%,
                  #B8962E ${
                    totalSold
                      ? (topProducts[0]?.quantity_sold / totalSold) * 100
                      : 0
                  }% 70%,
                  #262626 70% 100%
                )`,
              }}
            />

            <div className="mt-5 text-xs text-[#A1A1AA] space-y-1">
              <p>
                <span className="text-[#D4AF37]">●</span> Top Product
              </p>
              <p>
                <span className="text-[#B8962E]">●</span> Other Products
              </p>
              <p>
                <span className="text-[#262626]">●</span> Remaining
              </p>
            </div>
          </div>

          {/* BAR CHART */}
          <div className="lg:col-span-2 bg-[#0F1012] border border-[#262626] rounded-2xl p-6">
            <p className="text-sm text-[#A1A1AA] mb-6">
              Top Products by Quantity
            </p>

            <div className="flex items-end gap-4 h-40">
              {topProducts.slice(0, 6).map((p) => {
                const height = totalSold
                  ? (p.quantity_sold / totalSold) * 100
                  : 0;

                const product = productMap[p.product_id];

                return (
                  <div
                    key={p.product_id}
                    className="flex-1 text-center"
                  >
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full rounded-t-lg
                                 bg-gradient-to-t
                                 from-[#B8962E]
                                 to-[#D4AF37]"
                    />
                    <p className="text-xs text-[#A1A1AA] mt-2 truncate">
                      {product?.name || `#${p.product_id}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          TOP SELLING PRODUCTS LIST
      ===================================================== */}
      <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6">
        <h3 className="text-xl font-semibold text-[#D4AF37] mb-6">
          Top Selling Products
        </h3>

        {topProducts.length > 0 ? (
          <div className="space-y-4">
            {topProducts.slice(0, 5).map((p, i) => {
              const product = productMap[p.product_id];

              return (
                <div
                  key={p.product_id}
                  className="flex items-center justify-between
                             bg-[#0F1012]
                             border border-[#262626]
                             rounded-xl px-5 py-4"
                >
                  {/* PRODUCT INFO */}
                  <div className="flex items-center gap-4">
                    {product?.photo_link ? (
                      <img
                        src={product.photo_link}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#262626] rounded-lg" />
                    )}

                    <div>
                      <p className="font-semibold">
                        {product?.name || "Unknown Product"}
                      </p>
                      <p className="text-xs text-[#A1A1AA]">
                        Product ID: {p.product_id}
                      </p>
                    </div>
                  </div>

                  {/* SOLD */}
                  <span className="text-[#D4AF37] font-semibold">
                    {p.quantity_sold} sold
                  </span>

                  {/* TAG */}
                  <span className="text-xs text-green-500">
                    {i === 0 ? "Best Seller" : "Trending"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-[#A1A1AA] text-center py-6">
            No sales data available yet.
          </p>
        )}
      </div>
    </div>
  );
}
