import { useEffect, useState } from "react";
import { getAllProducts } from "../api/productApi";
import { useNavigate } from "react-router-dom";
import SideFilterBar from "../components/filters/SideFilterBar";

import { useWishlistContext } from "../contexts/Wishlist";
import { useCartContext } from "../contexts/CartContext";

export default function ViewProducts() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
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
  const { handleAddToWishlist } = useWishlistContext();
  const { handleAddToCart } = useCartContext();

  // FETCH PRODUCTS (UNCHANGED)
  useEffect(() => {
    (async () => {
      try {
        const res = await getAllProducts();
        const data = res.data || [];
        setProducts(data);
        setFiltered(data);
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const applyMetaFilters = (f) => setMetaFilters(f);

  // FILTER + SORT (UNCHANGED)
  useEffect(() => {
    let temp = [...products];

    if (priceFilter === "low") temp = temp.filter((p) => p.price < 500);
    else if (priceFilter === "mid")
      temp = temp.filter((p) => p.price >= 500 && p.price <= 1000);
    else if (priceFilter === "high") temp = temp.filter((p) => p.price > 1000);

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

    if (sortBy === "price-asc") temp.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") temp.sort((a, b) => b.price - a.price);
    else if (sortBy === "name-asc")
      temp.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "name-desc")
      temp.sort((a, b) => b.name.localeCompare(a.name));

    setFiltered(temp);
  }, [products, metaFilters, priceFilter, sortBy]);

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

  if (loading)
    return <div className="text-center py-20 text-[#A1A1AA]">Loading…</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#0F1012] text-white px-6 py-12">
      <h2 className="text-4xl font-bold text-center text-[#D4AF37] mb-12">
        Shop Collection
      </h2>

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
          <div className="bg-[#14161A] border border-[#262626] rounded-2xl p-4 flex flex-wrap gap-4 justify-between mb-10">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="bg-[#0F1012] border border-[#262626] rounded-lg px-4 py-2 text-sm"
            >
              <option value="all">Price: All</option>
              <option value="low">Below ₹500</option>
              <option value="mid">₹500 – ₹1000</option>
              <option value="high">Above ₹1000</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0F1012] border border-[#262626] rounded-lg px-4 py-2 text-sm"
            >
              <option value="none">Sort By</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
            </select>
          </div>

          {/* PRODUCT GRID */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="
                  bg-[#14161A]
                  border border-[#262626]
                  rounded-3xl
                  overflow-hidden
                  shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                  hover:shadow-[0_25px_60px_rgba(212,175,55,0.15)]
                  hover:-translate-y-1
                  transition-all
                "
              >
                {/* IMAGE */}
                <div
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="relative group cursor-pointer"
                >
                  <img
                    src={
                      p.photo_link && p.photo_link !== "no photo"
                        ? p.photo_link
                        : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                    }
                    alt={p.name}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition" />
                </div>

                {/* INFO */}
                <div className="p-4 flex flex-col justify-between h-[170px]">
                  <h3 className="text-lg font-semibold truncate">
                    {p.name}
                  </h3>

                  <div>
                    <span className="text-[#D4AF37] font-bold text-lg block mb-3">
                      ₹{p.price}
                    </span>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleWishlist(p.id)}
                        className="text-xl hover:scale-110 transition"
                      >
                        ❤️
                      </button>

                      <button
                        onClick={() => handleCart(p.id)}
                        className="
                          bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                          text-black px-4 py-2 rounded-full
                          text-sm font-semibold
                          hover:brightness-110 transition
                        "
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
            <div className="text-[#A1A1AA] mt-16 text-center">
              No products match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
