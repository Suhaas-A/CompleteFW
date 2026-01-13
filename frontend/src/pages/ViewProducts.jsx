import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import SideFilterBar from "../components/filters/SideFilterBar";

import { useWishlistContext } from "../contexts/Wishlist";
import { useCartContext } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";
import axiosInstance from "../api/axiosInstance";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [discounts, setDiscounts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");

  const [metaFilters, setMetaFilters] = useState({
    categories: [],
    colors: [],
    sizes: [],
    materials: [],
    packs: [],
    patterns: [],
    discounts: [],
    coupons: [],
  });

  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const { handleAddToWishlist } = useWishlistContext();
  const { handleAddToCart } = useCartContext();
  const { dark } = useTheme();

  /* ============================================================
     FETCH PRODUCTS + DISCOUNTS (BACKEND UNCHANGED)
     ============================================================ */
  useEffect(() => {
    (async () => {
      try {
        const [prodRes, discountRes] = await Promise.all([
          getAllProducts(),
          axiosInstance.get("/discounts"),
        ]);

        setProducts(prodRes.data || []);
        setDiscounts(discountRes.data || []);
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const applyMetaFilters = (f) => setMetaFilters(f);

  /* ============================================================
     HELPER → FINAL PRICE
     ============================================================ */
  const getFinalPrice = (p) => {
    if (!p.discount_id) return p.price;
    const d = discounts.find((x) => x.id === p.discount_id);
    if (!d) return p.price;
    return Math.round(p.price - (d.prop / 100) * p.price);
  };

  /* ============================================================
     SEARCH + FILTER + SORT (USES FINAL PRICE)
     ============================================================ */
  useEffect(() => {
    let temp = [...products];

    // 🔍 SEARCH
    if (searchQuery.trim()) {
      temp = temp.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 💰 PRICE FILTER
    if (priceFilter === "low")
      temp = temp.filter((p) => getFinalPrice(p) < 500);
    else if (priceFilter === "mid")
      temp = temp.filter(
        (p) => getFinalPrice(p) >= 500 && getFinalPrice(p) <= 1000
      );
    else if (priceFilter === "high")
      temp = temp.filter((p) => getFinalPrice(p) > 1000);

    // 🧩 META FILTERS
    const match = (val, list) =>
      !list.length ? true : val != null && list.includes(Number(val));

    temp = temp.filter(
      (p) =>
        match(p.category_id, metaFilters.categories) &&
        match(p.color_id, metaFilters.colors) &&
        match(p.size_id, metaFilters.sizes) &&
        match(p.material_id, metaFilters.materials) &&
        match(p.pattern_id, metaFilters.patterns) &&
        match(p.pack_id, metaFilters.packs) &&
        match(p.discount_id, metaFilters.discounts) &&
        match(p.coupon_id, metaFilters.coupons)
    );

    // ↕️ SORT
    if (sortBy === "price-asc")
      temp.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
    else if (sortBy === "price-desc")
      temp.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
    else if (sortBy === "name-asc")
      temp.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "name-desc")
      temp.sort((a, b) => b.name.localeCompare(a.name));

    setFiltered(temp);
  }, [products, discounts, metaFilters, priceFilter, sortBy, searchQuery]);

  /* ============================================================
     ACTIONS
     ============================================================ */
  const handleWishlist = async (id) => {
    try {
      await handleAddToWishlist(id);
      alert("❤️ Added to wishlist!");
    } catch {
      alert("Failed to add to wishlist");
    }
  };

  const handleCart = async (id) => {
    try {
      await handleAddToCart(id, 1);
      alert("🛒 Added to cart!");
    } catch {
      alert("Failed to add to cart");
    }
  };

  /* ============================================================
     STATES
     ============================================================ */
  if (loading)
    return (
      <div
        className={`text-center py-20 ${
          dark ? "text-[#A1A1AA]" : "text-gray-500"
        }`}
      >
        Loading…
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        {error}
      </div>
    );

  /* ============================================================
     UI
     ============================================================ */
  return (
    <div
      className={`min-h-screen px-6 py-12 ${
        dark ? "bg-[#0F1012] text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-4xl font-bold text-center text-[#D4AF37] mb-3">
        Shop Collection
      </h2>

      {searchQuery && (
        <p
          className={`text-center mb-10 ${
            dark ? "text-[#A1A1AA]" : "text-gray-500"
          }`}
        >
          Showing results for{" "}
          <span className="font-semibold">“{searchQuery}”</span>
        </p>
      )}

      {/* MOBILE FILTER BUTTON */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileOpen(true)}
          className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black px-5 py-2 rounded-full font-semibold"
        >
          Filters
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
        <SideFilterBar
          onChangeFilters={applyMetaFilters}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* PRODUCTS */}
        <div className="lg:col-span-3">

          {/* TOP CONTROLS (UNCHANGED) */}
          <div
            className={`rounded-2xl p-4 flex flex-wrap gap-4 justify-between mb-10 border ${
              dark
                ? "bg-[#14161A] border-[#262626]"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className={`rounded-lg px-4 py-2 text-sm border outline-none ${
                dark
                  ? "bg-[#0F1012] border-[#262626] text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="all" className={dark ? "bg-[#0F1012] text-white" : ""}>
                Price: All
              </option>
              <option value="low" className={dark ? "bg-[#0F1012] text-white" : ""}>
                Below ₹500
              </option>
              <option value="mid" className={dark ? "bg-[#0F1012] text-white" : ""}>
                ₹500 – ₹1000
              </option>
              <option value="high" className={dark ? "bg-[#0F1012] text-white" : ""}>
                Above ₹1000
              </option>
            </select>


            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`rounded-lg px-4 py-2 text-sm border outline-none ${
                dark
                  ? "bg-[#0F1012] border-[#262626] text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="none" className={dark ? "bg-[#0F1012] text-white" : ""}>
                Sort By
              </option>
              <option value="price-asc" className={dark ? "bg-[#0F1012] text-white" : ""}>
                Price ↑
              </option>
              <option value="price-desc" className={dark ? "bg-[#0F1012] text-white" : ""}>
                Price ↓
              </option>
              <option value="name-asc" className={dark ? "bg-[#0F1012] text-white" : ""}>
                Name A–Z
              </option>
              <option value="name-desc" className={dark ? "bg-[#0F1012] text-white" : ""}>
                Name Z–A
              </option>
            </select>

          </div>

          {/* GRID */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filtered.map((p) => {
              const finalPrice = getFinalPrice(p);
              const discount = discounts.find(
                (d) => d.id === p.discount_id
              );

              return (
                <div
                  key={p.id}
                  className={`rounded-3xl overflow-hidden border ${
                    dark
                      ? "bg-[#14161A] border-[#262626]"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="cursor-pointer"
                  >
                    <img
                      src={
                        p.photo_link && p.photo_link !== "no photo"
                          ? p.photo_link
                          : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                      }
                      alt={p.name}
                      className="w-full h-64 object-cover"
                    />
                  </div>

                  <div className="p-4 h-[170px] flex flex-col justify-between">
                    <h3 className="text-lg font-semibold leading-tight">
                      {p.name}
                      {discount && (
                        <span className="ml-2 text-sm line-through text-gray-400">
                          ₹{p.price}
                        </span>
                      )}
                    </h3>

                    <div>
                      {discount ? (
                        <>
                          <p className="text-sm line-through text-gray-400">
                            ₹{p.price}
                          </p>
                          <p className="text-[#D4AF37] font-bold text-lg">
                            ₹{finalPrice}
                          </p>
                          <span className="text-xs text-green-600">
                            {discount.prop}% OFF
                          </span>
                        </>
                      ) : (
                        <p className="text-[#D4AF37] font-bold text-lg">
                          ₹{p.price}
                        </p>
                      )}

                      <div className="flex justify-between items-center mt-3">
                        <button
                          onClick={() => handleWishlist(p.id)}
                          className="text-xl"
                        >
                          ❤️
                        </button>

                        <button
                          onClick={() => handleCart(p.id)}
                          className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black px-4 py-2 rounded-full text-sm font-semibold"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="mt-16 text-center text-gray-500">
              No products match your search or filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


