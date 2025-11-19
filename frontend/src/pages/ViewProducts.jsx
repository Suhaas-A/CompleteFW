// src/pages/ViewProducts.jsx
import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { useNavigate } from "react-router-dom";
import SideFilterBar from "../components/filters/SideFilterBar";

// ⭐ USE WISHLIST CONTEXT — FIXED
import { useWishlistContext } from "../contexts/Wishlist";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // price + sort filters
  const [priceFilter, setPriceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("none");

  // metadata filters coming from sidebar
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

  // mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  // ⭐ Wishlist context
  const { handleAddToWishlist } = useWishlistContext();

  // fetch products
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProducts();
        const data = res.data || [];
        setProducts(data);
        setFiltered(data);
      } catch (err) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // function to receive metadata filters from sidebar
  const applyMetaFilters = (f) => {
    setMetaFilters(f);
  };

  // ⭐ MASTER FILTER + SORT
  useEffect(() => {
    let temp = [...products];

    // PRICE FILTER
    if (priceFilter === "low") temp = temp.filter((p) => p.price < 500);
    else if (priceFilter === "mid") temp = temp.filter((p) => p.price >= 500 && p.price <= 1000);
    else if (priceFilter === "high") temp = temp.filter((p) => p.price > 1000);

    // universal match (ID-based)
    const match = (productVal, selectedList) => {
      if (!selectedList.length) return true;
      if (productVal == null) return false;
      return selectedList.includes(Number(productVal));
    };

    temp = temp.filter((p) => {
      return (
        match(p.category_id, metaFilters.categories) &&
        match(p.color_id, metaFilters.colors) &&
        match(p.size_id, metaFilters.sizes) &&
        match(p.material_id, metaFilters.materials) &&
        match(p.pattern_id, metaFilters.patterns) &&
        match(p.pack_id, metaFilters.packs) &&
        match(p.discount_id, metaFilters.discounts) &&
        match(p.coupon_id, metaFilters.coupons)
      );
    });

    // SORT
    if (sortBy === "price-asc") temp.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") temp.sort((a, b) => b.price - a.price);
    else if (sortBy === "name-asc") temp.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "name-desc") temp.sort((a, b) => b.name.localeCompare(a.name));

    setFiltered(temp);
  }, [products, metaFilters, priceFilter, sortBy]);

  // ⭐ FIXED WISHLIST BUTTON
  const handleWishlist = async (id) => {
    try {
      await handleAddToWishlist(id);
      alert("❤️ Added to wishlist!");
    } catch {
      alert("Failed to add to wishlist");
      console.log(error);
    }
  };

  // ⭐ ADD TO CART
  const handleCart = async (id) => {
    try {
      await addToCart(id, 1);
      alert("🛒 Added to cart!");
    } catch {
      alert("Failed to add to cart");
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#FFFDF5] px-6 py-10">

      {/* HEADER */}
      <h2 className="text-4xl font-serif font-bold text-center text-[#8C6B1F] mb-10">
        Explore Our Collection ✨
      </h2>

      {/* MOBILE FILTER BUTTON */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-4 py-2 rounded-lg font-semibold shadow"
        >
          Filters
        </button>
      </div>

      {/* LAYOUT: SIDEBAR + PRODUCTS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* SIDEBAR */}
        <SideFilterBar
          onChangeFilters={applyMetaFilters}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-3">

          {/* SORT / PRICE BAR */}
          <div className="bg-white p-4 rounded-xl shadow border border-[#E8D9A6] flex flex-wrap gap-4 justify-between mb-8">

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="border border-[#C9A227] rounded-lg px-4 py-2 bg-[#FFFDF5]"
            >
              <option value="all">Price: All</option>
              <option value="low">Below ₹500</option>
              <option value="mid">₹500 – ₹1000</option>
              <option value="high">Above ₹1000</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-[#C9A227] rounded-lg px-4 py-2 bg-[#FFFDF5]"
            >
              <option value="none">Sort By</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
            </select>

          </div>

          {/* PRODUCT GRID */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-[#E8D9A6] rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div onClick={() => navigate(`/product/${p.id}`)}>
                  <img
                    src={
                      p.photo_link && p.photo_link !== "no photo"
                        ? p.photo_link
                        : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                    }
                    alt={p.name}
                    className="w-full h-64 object-cover rounded-t-2xl"
                  />
                </div>

                <div className="p-4 flex flex-col justify-between h-[180px]">
                  <div onClick={() => navigate(`/product/${p.id}`)}>
                    <h3 className="text-xl font-semibold text-[#2E2E2E] truncate">
                      {p.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#C9A227] font-bold text-lg block mb-2">
                      ₹{p.price}
                    </span>

                    <div className="flex justify-between items-center">

                      {/* ❤️ ADD TO WISHLIST — FIXED */}
                      <button
                        onClick={() => handleWishlist(p.id)}
                        className="text-pink-500 hover:text-pink-700 text-xl transition"
                      >
                        ❤️
                      </button>

                      {/* 🛒 ADD TO CART */}
                      <button
                        onClick={() => handleCart(p.id)}
                        className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-md hover:scale-105 transition"
                      >
                        Add to Cart
                      </button>

                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-gray-600 mt-12 text-center">
              No products match your filters.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
