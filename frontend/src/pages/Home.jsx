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

  // Load normal user home content
  useEffect(() => {
    if (isAdmin) return;
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/categories", header),
          axios.get("http://127.0.0.1:8000/api/all_products", header),
        ]);
        setCategories(catRes.data);
        setFeatured(prodRes.data.slice(0, 8));
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, [isAdmin]);

  // Load admin dashboard content
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

  /* ============================================================
     🚀 ADMIN HOME PAGE — Admin sees ONLY this section
     ============================================================ */
  if (isAdmin) {
    return (
      <div className="bg-[#F9F9F7] min-h-screen px-6 md:px-12 py-12 text-[#3A3A3A]">
        <h1 className="text-4xl font-serif font-bold text-[#8C6B1F] mb-10">
          Admin Dashboard Overview
        </h1>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {/* Revenue */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white shadow-lg">
            <p className="text-sm uppercase opacity-80">Total Revenue</p>
            <h3 className="text-4xl font-bold mt-1">
              ₹{Number(dashboard?.total_revenue || 0).toLocaleString()}
            </h3>
          </div>

          {/* Top Product */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-[#EEDC82] to-[#C9A227] text-[#3A3A3A] shadow-lg">
            <p className="text-sm uppercase opacity-80">Top Product</p>
            <h3 className="text-xl font-semibold mt-1">
              {dashboard?.top_products?.[0]
                ? `#${dashboard.top_products[0].product_id}`
                : "—"}
            </h3>
          </div>

          {/* Total Items Sold */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-[#FFF7DA] to-[#EAD38B] shadow-lg">
            <p className="text-sm uppercase opacity-80">Items Sold</p>
            <h3 className="text-4xl font-bold mt-1">
              {dashboard?.top_products?.reduce(
                (sum, p) => sum + p.quantity_sold,
                0
              ) || 0}
            </h3>
          </div>
        </div>

        {/* Top-selling table */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">
            Top Selling Products
          </h3>

          {dashboard?.top_products?.length > 0 ? (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="py-2 px-2">Product ID</th>
                  <th className="py-2 px-2">Quantity Sold</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.top_products.map((p) => (
                  <tr key={p.product_id} className="border-t">
                    <td className="py-2 px-2">#{p.product_id}</td>
                    <td className="py-2 px-2">{p.quantity_sold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 py-4 text-center">No sales data</p>
          )}
        </div>

        {/* Button to full admin panel */}
        <div className="text-center mt-10">
          <Link
            to="/admin"
            className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-6 py-3 rounded-lg shadow hover:scale-105 transition"
          >
            Go to Full Dashboard →
          </Link>
        </div>
      </div>
    );
  }

  /* ============================================================
     🌟 USER HOME PAGE — EXACTLY YOUR ORIGINAL CODE (UNCHANGED)
     ============================================================ */
  return (
    <div className="bg-[#F9F9F7] text-[#2E2E2E] font-sans overflow-x-hidden">
      {/* 🔥 Hero Section */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center bg-gradient-to-r from-[#fef7e2] via-[#fffaf0] to-[#faf3da] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center opacity-25"></div>

        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-[#2E2E2E]">
            Redefining Fashion with{" "}
            <span className="text-[#C9A227]">Eleganza</span>
          </h1>
          <p className="text-lg text-gray-700 mt-4">
            Experience clothing that blends luxury, comfort, and timeless design.
            Eleganza brings you premium collections crafted to celebrate your individuality.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all duration-300"
            >
              Shop Now
            </Link>
            <Link
              to="/about"
              className="border-2 border-[#C9A227] text-[#C9A227] font-semibold px-6 py-3 rounded-full hover:bg-[#C9A227] hover:text-white transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* 🧵 Category Showcase */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold font-serif text-center text-[#8C6B1F] mb-12">
          Discover Our Collections
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={
                  cat.photo_link ||
                  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=700&q=80"
                }
                alt={cat.name}
                className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all"></div>
              <h3 className="absolute bottom-4 left-4 text-white text-lg font-semibold tracking-wide">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 👗 Featured Products */}
      <section className="py-20 px-6 bg-[#FFFDF5] border-t border-[#E8D9A6]">
        <h2 className="text-4xl font-serif font-bold text-center text-[#8C6B1F] mb-12">
          Featured Styles
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {featured.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden group transition-all duration-300"
            >
              <Link to={`/product/${p.id}`}>
                <img
                  src={
                    p.photo_link ||
                    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
                  }
                  alt={p.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg text-[#3A3A3A] mb-1">
                  {p.name}
                </h3>
                <p className="text-[#8C6B1F] font-medium mb-3">
                  ₹{p.price.toLocaleString()}
                </p>
                <button className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-5 py-2 rounded-full font-semibold hover:scale-105 transition-transform duration-300">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 💫 About Eleganza */}
      <section className="py-20 bg-gradient-to-r from-[#FDF9EB] to-[#FFFDF5] text-center">
        <div className="max-w-5xl mx-auto px-6 space-y-6">
          <h2 className="text-4xl font-serif font-bold text-[#8C6B1F]">
            About Eleganza
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Eleganza is a premium fashion brand redefining style with comfort and
            creativity. We design timeless apparel that blends elegance with modern
            confidence — perfect for every occasion.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              {
                title: "Our Mission",
                desc: "To empower individuals with sophisticated fashion that inspires confidence and self-expression.",
              },
              {
                title: "Our Craft",
                desc: "We source premium fabrics and materials that ensure durability and unmatched comfort.",
              },
              {
                title: "Our Vision",
                desc: "To make Eleganza a symbol of refined elegance, cherished worldwide.",
              },
            ].map((info, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl p-6 transition-all"
              >
                <h3 className="text-xl font-semibold text-[#C9A227] mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600 text-sm">{info.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🧑‍💼 Meet the Founder */}
      <section className="py-20 bg-[#FFFDF5] text-center border-t border-[#E8D9A6]">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <h2 className="text-4xl font-serif font-bold text-[#8C6B1F] mb-4">
            Meet the Founder
          </h2>
          <h3 className="text-2xl font-bold text-[#3A3A3A]">Suhaas A</h3>
          <p className="text-[#8C6B1F] font-medium mb-4">
            Founder & Creative Director, Eleganza
          </p>
          <p className="text-gray-700 text-base leading-relaxed max-w-2xl mx-auto">
            “Eleganza was born from a passion to redefine fashion — to craft designs that
            make people feel empowered, graceful, and truly themselves. Every collection
            reflects our promise to combine tradition with trend, comfort with confidence,
            and art with attitude.”
          </p>
        </div>
      </section>

      {/* ✨ Final CTA */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white text-center">
        <h2 className="text-4xl font-serif font-bold mb-4">
          Your Style, Our Passion
        </h2>
        <p className="text-white/90 mb-8 max-w-2xl mx-auto">
          Fashion is more than fabric — it’s the reflection of who you are.
          Step into Eleganza and make every day a statement of timeless grace.
        </p>
        <Link
          to="/products"
          className="bg-white text-[#8C6B1F] font-semibold px-8 py-3 rounded-full hover:bg-[#FFF7D0] transition-all"
        >
          Explore Eleganza →
        </Link>
      </section>
    </div>
  );
}
