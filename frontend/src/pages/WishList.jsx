import { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../api/wishlistApi";
import { addToCart } from "../api/cartApi";
import { useCartContext } from "../contexts/CartContext";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("none");

  const token =
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("access_token");

  // 🛒 Cart
  const { cartItems } = useCartContext();

  // Fetch wishlist
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchWishlist = async () => {
      try {
        const res = await getWishlist();
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.wishlist || [];
        setWishlist(data);
      } catch (err) {
        console.error("❌ Wishlist load failed:", err);
        setError("Unable to fetch wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1);
      alert("✅ Added to cart!");
    } catch (err) {
      console.error("❌ Add to cart failed:", err);
      alert("Failed to add to cart");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    } catch (err) {
      console.error("❌ Remove failed:", err);
    }
  };

  // FILTER LOGIC
  const filteredWishlist = wishlist.filter((item) => {
    if (filterBy === "low") return item.price < 500;
    if (filterBy === "mid") return item.price >= 500 && item.price <= 1000;
    if (filterBy === "high") return item.price > 1000;
    return true;
  });

  // SORT LOGIC
  const sortedWishlist = [...filteredWishlist].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-700">
        <h2 className="text-3xl font-bold text-[#C9A227] mb-3">Login Required</h2>
        <p className="text-gray-500 text-center max-w-md">
          Please login to view your wishlist.
        </p>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-gray-500">
        Loading your wishlist...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center py-20 text-red-600">
        {error}
      </div>
    );

  if (!wishlist.length)
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-700">
        <h2 className="text-3xl font-bold text-[#8C6B1F] mb-2">
          Your Wishlist is Empty ❤️
        </h2>
        <p className="text-gray-500 max-w-md text-center">
          Browse products and click the heart icon to add items here.
        </p>
      </div>
    );

  return (
    <div className="bg-[#FFFDF5] min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">

        {/* PAGE TITLE */}
        <h2 className="text-4xl font-serif font-bold text-center text-[#8C6B1F] mb-10">
          Your Wishlist ❤️
        </h2>

        {/* 🔥 FILTER + SORT BAR */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8 bg-white p-4 rounded-xl shadow border border-[#E8D9A6]">
          {/* FILTER */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="border border-[#C9A227] rounded-lg px-4 py-2 bg-[#FFFDF5] text-[#3A3A3A]"
          >
            <option value="all">All Prices</option>
            <option value="low">Below ₹500</option>
            <option value="mid">₹500 – ₹1000</option>
            <option value="high">Above ₹1000</option>
          </select>

          {/* SORT */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-[#C9A227] rounded-lg px-4 py-2 bg-[#FFFDF5] text-[#3A3A3A]"
          >
            <option value="none">Sort By</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="name-desc">Name: Z → A</option>
          </select>
        </div>

        {/* WISHLIST GRID */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sortedWishlist.map((p) => {
            const inCart = cartItems.some((c) => c.id === p.id);

            return (
              <div
                key={p.id}
                className="bg-white border border-[#E8D9A6] rounded-2xl shadow hover:shadow-lg transition overflow-hidden hover:-translate-y-1"
              >
                <img
                  src={
                    p.photo_link && p.photo_link !== "no photo"
                      ? p.photo_link
                      : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                  }
                  alt={p.name}
                  className="w-full h-56 object-cover"
                />

                <div className="p-4 flex flex-col justify-between h-[180px]">

                  <div>
                    <h3 className="text-lg font-semibold text-[#2E2E2E] truncate">
                      {p.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-[#C9A227] font-bold text-lg block mb-3">
                      ₹{p.price}
                    </span>

                    <div className="flex items-center justify-between gap-2">

                      {/* Add to Cart */}
                      <button
                        disabled={inCart}
                        onClick={() => handleAddToCart(p.id)}
                        className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition
                          ${
                            inCart
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white hover:scale-105"
                          }
                        `}
                      >
                        {inCart ? "Already in Cart" : "Add to Cart"}
                      </button>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(p.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>

                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
