import { useEffect, useState } from "react";
import { useWishlistContext } from "../contexts/Wishlist";
import { useCartContext } from "../contexts/CartContext";
import { addToCart } from "../api/cartApi";
import { useTheme } from "../contexts/ThemeContext";

export default function Wishlist() {
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("none");

  const { dark } = useTheme();

  const token =
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("access_token");

  const {
    wishlist,
    loading,
    fetchWishlist,
    handleRemoveFromWishlist,
  } = useWishlistContext();

  const { cartItems } = useCartContext();

  useEffect(() => {
    if (token) fetchWishlist();
  }, [token, fetchWishlist]);

  /* ------------------ STATES ------------------ */

  if (!token)
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          dark ? "bg-[#0F1012] text-[#A1A1AA]" : "bg-gray-50 text-gray-600"
        }`}
      >
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-2">
          Login Required
        </h2>
        <p className="text-sm text-center max-w-md">
          Please login to view your wishlist.
        </p>
      </div>
    );

  if (loading)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          dark ? "bg-[#0F1012] text-[#A1A1AA]" : "bg-gray-50 text-gray-600"
        }`}
      >
        Loading your wishlist...
      </div>
    );

  if (!wishlist.length)
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center ${
          dark ? "bg-[#0F1012] text-[#A1A1AA]" : "bg-gray-50 text-gray-600"
        }`}
      >
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-2">
          Your Wishlist is Empty ❤️
        </h2>
        <p className="text-sm max-w-md text-center">
          Save your favorite Eleganza styles here.
        </p>
      </div>
    );

  /* ------------------ FILTER + SORT ------------------ */

  const filteredWishlist = wishlist.filter((item) => {
    if (filterBy === "low") return item.price < 500;
    if (filterBy === "mid") return item.price >= 500 && item.price <= 1000;
    if (filterBy === "high") return item.price > 1000;
    return true;
  });

  const sortedWishlist = [...filteredWishlist].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  /* ------------------ UI ------------------ */

  return (
    <div
      className={`min-h-screen px-6 py-14 ${
        dark ? "bg-[#0F1012] text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-bold text-[#D4AF37]">
            My Wishlist
          </h1>
          <span className="text-[#D4AF37] text-3xl">❤️</span>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedWishlist.map((p) => {
            const inCart = cartItems.some((c) => c.id === p.id);

            return (
              <div
                key={p.id}
                className={`rounded-3xl overflow-hidden transition ${
                  dark
                    ? "bg-[#14161A] border border-[#262626] hover:shadow-xl"
                    : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                {/* IMAGE */}
                <img
                  src={
                    p.photo_link && p.photo_link !== "no photo"
                      ? p.photo_link
                      : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                  }
                  alt={p.name}
                  className="w-full h-72 object-cover"
                />

                {/* CONTENT */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold truncate">
                    {p.name}
                  </h3>

                  <p className="text-xl font-bold text-[#D4AF37]">
                    ₹{p.price}
                  </p>

                  <div className="flex items-center justify-between pt-3">
                    {/* ADD TO CART */}
                    <button
                      disabled={inCart}
                      onClick={() => addToCart(p.id, 1)}
                      className={`flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-full font-semibold transition
                        ${
                          inCart
                            ? dark
                              ? "bg-[#262626] text-[#A1A1AA] cursor-not-allowed"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black hover:brightness-110"
                        }`}
                    >
                      🛒 {inCart ? "In Cart" : "Add to Cart"}
                    </button>

                    {/* REMOVE */}
                    <button
                      onClick={() => handleRemoveFromWishlist(p.id)}
                      className="text-red-400 hover:text-red-500 text-lg transition"
                      title="Remove from wishlist"
                    >
                      🗑️
                    </button>
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
