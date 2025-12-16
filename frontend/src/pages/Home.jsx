import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../contexts/AuthContext";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  const { user } = useAuthContext();

  // Detect admin
  const isAdmin =
    user?.admin ||
    user?.is_admin ||
    user?.isAdmin ||
    user?.role === "admin" ||
    user?.is_superuser ||
    user?.is_staff;

  const header = {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
    },
  };

  /* ================= USER HOME (UNCHANGED) ================= */
  useEffect(() => {
    if (isAdmin) return;

    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("https://complete-fw.vercel.app/api/categories", header),
          axios.get("https://complete-fw.vercel.app/api/all_products", header),
        ]);
        setCategories(catRes.data);
        setFeatured(prodRes.data.slice(0, 12));
      } catch (err) {
        console.error(err);
      }
    }

    loadData();
  }, [isAdmin]);

  /* ================= ADMIN DASHBOARD DATA ================= */
  useEffect(() => {
    if (!isAdmin) return;

    async function loadAdminDashboard() {
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8000/api/admin/sales-summary",
          header
        );
        setDashboard(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadAdminDashboard();
  }, [isAdmin]);

  /* =========================================================
     🚀 ADMIN DASHBOARD — EXACT PREVIEW UI
     ========================================================= */
  if (isAdmin) {
    const topProducts = dashboard?.top_products || [];
    const totalRevenue = dashboard?.total_revenue || 0;
    const totalSold = topProducts.reduce(
      (sum, p) => sum + p.quantity_sold,
      0
    );
    const maxQty = Math.max(...topProducts.map(p => p.quantity_sold), 1);

    return (
      <div className="min-h-screen bg-[#0F1012] text-white p-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* SIDEBAR */}
          <aside className="lg:col-span-1 bg-[#14161A] border border-[#262626] rounded-3xl p-6">
            <h1 className="text-xl font-bold text-[#D4AF37] mb-10">
              Eleganza Admin
            </h1>

            <ul className="space-y-4 text-sm">
              {[
                "Dashboard",
                "Products",
                "Categories",
                "Orders",
                "Customers",
                "Reviews",
              ].map((item, i) => (
                <li
                  key={i}
                  onClick={function() {window.location = '/admin/' + item}}
                  className={`px-4 py-2 rounded-xl ${
                    i === 0
                      ? "bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black font-semibold"
                      : "text-[#A1A1AA] hover:bg-[#1F2126]"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          </aside>

          {/* MAIN */}
          <main className="lg:col-span-4 space-y-6">

            {/* TOP BAR */}
            <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#D4AF37]">
                Welcome back, Admin 👑
              </h2>
              <input
                placeholder="Search dashboard"
                className="bg-[#0F1012] border border-[#262626] rounded-full px-4 py-2 text-sm"
              />
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6">
                <p className="text-sm text-[#A1A1AA]">Total Revenue</p>
                <h3 className="text-3xl font-bold text-[#D4AF37] mt-2">
                  ₹{totalRevenue.toLocaleString()}
                </h3>
              </div>

              <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6">
                <p className="text-sm text-[#A1A1AA]">Total Orders</p>
                <h3 className="text-3xl font-bold text-[#D4AF37] mt-2">
                  {topProducts.length}
                </h3>
              </div>

              <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6">
                <p className="text-sm text-[#A1A1AA]">Items Sold</p>
                <h3 className="text-3xl font-bold text-[#D4AF37] mt-2">
                  {totalSold}
                </h3>
              </div>
            </div>

            {/* ANALYTICS */}
            <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6">
              <h3 className="font-semibold mb-6 text-[#D4AF37]">
                Sales Analytics
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* PIE */}
                <div className="bg-[#0F1012] border border-[#262626] rounded-2xl p-4 flex flex-col items-center">
                  <p className="text-sm text-[#A1A1AA] mb-4">
                    Product Share
                  </p>
                  <div
                    className="w-40 h-40 rounded-full"
                    style={{
                      background: `conic-gradient(
                        #D4AF37 0% ${Math.min(100, (topProducts[0]?.quantity_sold / totalSold) * 100 || 0)}%,
                        #B8962E ${Math.min(100, (topProducts[0]?.quantity_sold / totalSold) * 100 || 0)}% 100%
                      )`,
                    }}
                  />
                </div>

                {/* BAR */}
                <div className="lg:col-span-2 bg-[#0F1012] border border-[#262626] rounded-2xl p-4">
                  <p className="text-sm text-[#A1A1AA] mb-4">
                    Top Products
                  </p>

                  <div className="flex items-end gap-4 h-40">
                    {topProducts.map((p) => (
                      <div key={p.product_id} className="flex-1">
                        <div
                          style={{
                            height: `${(p.quantity_sold / maxQty) * 100}%`,
                          }}
                          className="w-full bg-gradient-to-t from-[#B8962E] to-[#D4AF37] rounded-t-lg"
                        />
                        <p className="text-xs text-center text-[#A1A1AA] mt-2">
                          #{p.product_id}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* RECENT ORDERS */}
            <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6">
              <h3 className="font-semibold mb-4 text-[#D4AF37]">
                Top Selling Products
              </h3>

              <div className="space-y-3 text-sm">
                {topProducts.slice(0, 5).map((p) => (
                  <div
                    key={p.product_id}
                    className="flex justify-between items-center bg-[#0F1012] border border-[#262626] rounded-xl px-4 py-3"
                  >
                    <span className="text-[#A1A1AA]">
                      Product #{p.product_id}
                    </span>
                    <span className="text-[#D4AF37] font-semibold">
                      {p.quantity_sold} sold
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </main>
        </div>
      </div>
    );
  }

  /* ================= USER HOME (AS IS) ================= */
  return (
    <div className="bg-[#0F1012] text-white">
      <div className="bg-[#0F1012] text-white overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 text-center max-w-4xl">
          <p className="text-sm tracking-widest text-[#D4AF37] mb-4">
            CONTEMPORARY FASHION
          </p>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6">
            Elevate Your <span className="text-[#D4AF37]">Style</span>
          </h1>
          <p className="text-[#A1A1AA] text-lg max-w-2xl mx-auto mb-10">
            Eleganza creates refined everyday wear with premium fabrics,
            timeless silhouettes, and confident design.
          </p>
          <Link
            to="/products"
            className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black px-10 py-4 rounded-full font-semibold hover:brightness-110 transition"
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* CATEGORY-WISE PRODUCT SHOWCASE */}
      {categories.map((cat) => {
        const catProducts = featured
          .filter((p) => p.category_id === cat.id)
          .slice(0, 4);

        if (catProducts.length === 0) return null;

        return (
          <section key={cat.id} className="py-24 max-w-7xl mx-auto px-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-[#D4AF37]">
                {cat.name}
              </h2>
              <Link
                to={`/category/${cat.id}`}
                className="text-[#A1A1AA] hover:text-[#D4AF37] transition"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {catProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="bg-[#14161A] border border-[#262626] rounded-3xl overflow-hidden group"
                >
                  <img
                    src={p.photo_link}
                    alt={p.name}
                    className="h-72 w-full object-cover group-hover:scale-105 transition"
                  />
                  <div className="p-4 text-center">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-[#D4AF37] mt-1">
                      ₹{p.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* ABOUT US */}
      <section className="py-28 px-8 bg-[#0F1012] border-t border-[#262626]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#D4AF37] mb-6">
            About Eleganza
          </h2>
          <p className="text-[#A1A1AA] text-lg leading-relaxed mb-12">
            Eleganza is a contemporary clothing brand focused on timeless design,
            premium materials, and effortless style. Every piece is crafted to
            balance comfort with confidence.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#14161A] border border-[#262626] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
              <p className="text-[#A1A1AA] text-sm">
                To create refined everyday clothing that transcends trends.
              </p>
            </div>
            <div className="bg-[#14161A] border border-[#262626] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-3">Our Craft</h3>
              <p className="text-[#A1A1AA] text-sm">
                Thoughtfully sourced fabrics and attention to detail in every stitch.
              </p>
            </div>
            <div className="bg-[#14161A] border border-[#262626] rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-3">Our Promise</h3>
              <p className="text-[#A1A1AA] text-sm">
                Clothing designed to make you feel confident, comfortable, and authentic.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
