import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [dashboard, setDashboard] = useState(null);

  const { user } = useAuthContext();
  const { dark } = useTheme();

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
     🚀 ADMIN DASHBOARD — EXACT UI (UNCHANGED)
     ========================================================= */
  if (isAdmin) {
    window.location.href = '/admin'
  }

  /* ================= USER HOME ================= */
  return (
    <div className={`${dark ? "bg-[#0F1012] text-white" : "bg-white text-gray-900"} overflow-x-hidden`}>

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
          <p className={`${dark ? "text-[#A1A1AA]" : "text-gray-600"} text-lg max-w-2xl mx-auto mb-10`}>
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

      {/* CATEGORY SHOWCASE */}
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
                className={`${dark ? "text-[#A1A1AA]" : "text-gray-500"} hover:text-[#D4AF37] transition`}
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {catProducts.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className={`${dark ? "bg-[#14161A] border-[#262626]" : "bg-white border-gray-200 shadow-sm"} border rounded-3xl overflow-hidden group`}
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
      <section className={`py-28 px-8 border-t ${dark ? "bg-[#0F1012] border-[#262626]" : "bg-gray-50 border-gray-200"}`}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-[#D4AF37] mb-6">
            About Eleganza
          </h2>
          <p className={`${dark ? "text-[#A1A1AA]" : "text-gray-600"} text-lg leading-relaxed mb-12`}>
            Eleganza is a contemporary clothing brand focused on timeless design,
            premium materials, and effortless style. Every piece is crafted to
            balance comfort with confidence.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              ["Our Vision", "To create refined everyday clothing that transcends trends."],
              ["Our Craft", "Thoughtfully sourced fabrics and attention to detail in every stitch."],
              ["Our Promise", "Clothing designed to make you feel confident, comfortable, and authentic."],
            ].map(([title, text], i) => (
              <div
                key={i}
                className={`${dark ? "bg-[#14161A] border-[#262626]" : "bg-white border-gray-200 shadow-sm"} border rounded-2xl p-6`}
              >
                <h3 className="text-xl font-semibold mb-3">{title}</h3>
                <p className={`${dark ? "text-[#A1A1AA]" : "text-gray-600"} text-sm`}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

