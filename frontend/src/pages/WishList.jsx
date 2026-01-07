import { useEffect, useState } from "react";
import { useWishlistContext } from "../contexts/Wishlist";
import { useCartContext } from "../contexts/CartContext";
import { addToCart } from "../api/cartApi";
import { useTheme } from "../contexts/ThemeContext";
import axiosInstance from "../api/axiosInstance";
import { getAllProducts } from "../api/productApi";

export default function Wishlist() {
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("none");

  const [discounts, setDiscounts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

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

  /* ============================================================
     FETCH DATA (NO BACKEND CHANGE)
     ============================================================ */
  useEffect(() => {
    if (!token) return;

    fetchWishlist();

    axiosInstance.get("/discounts").then((res) => {
      setDiscounts(res.data || []);
    });

    getAllProducts().then((res) => {
      setAllProducts(res.data || []);
    });
  }, [token, fetchWishlist]);

  /* ============================================================
     🔥 ENRICH WISHLIST WITH FULL PRODUCT DATA
     ============================================================ */
  const enrichedWishlist = wishlist.map((item) => {
    const fullProduct = allProducts.find((p) => p.id === item.id);
    return fullProduct ? { ...item, ...fullProduct } : item;
  });

  /* ============================================================
     FINAL PRICE HELPER
     ============================================================ */
  const getFinalPrice = (p) => {
    if (!p.discount_id) return p.price;
    const d = discounts.find((x) => x.id === p.discount_id);
    if (!d) return p.price;
    return Math.round(p.price - (d.prop / 100) * p.price);
  };

  /* ------------------ STATES ------------------ */

  if (!token)
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          dark ? "bg-[#0F1012] text-[#A1A1AA]" : "bg-gray-50 text-gray-600"
        }`}
      >
        Login required
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading your wishlist...
      </div>
    );

  if (!wishlist.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Wishlist empty ❤️
      </div>
    );

  /* ------------------ FILTER + SORT ------------------ */

  const filteredWishlist = enrichedWishlist.filter((item) => {
    const price = getFinalPrice(item);
    if (filterBy === "low") return price < 500;
    if (filterBy === "mid") return price >= 500 && price <= 1000;
    if (filterBy === "high") return price > 1000;
    return true;
  });

  const sortedWishlist = [...filteredWishlist].sort((a, b) => {
    const pa = getFinalPrice(a);
    const pb = getFinalPrice(b);
    if (sortBy === "price-asc") return pa - pb;
    if (sortBy === "price-desc") return pb - pa;
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

        <h1 className="text-4xl font-bold text-[#D4AF37] mb-12">
          My Wishlist ❤️
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedWishlist.map((p) => {
            const inCart = cartItems.some((c) => c.id === p.id);
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
                <img
                  src={p.photo_link}
                  alt={p.name}
                  className="w-full h-72 object-cover"
                />

                <div className="p-5 space-y-3">
                  <h3 className="font-semibold truncate">
                    {p.name}
                  </h3>

                  {discount ? (
                    <>
                      <p className="text-sm line-through text-gray-400">
                        ₹{p.price}
                      </p>
                      <p className="text-xl font-bold text-[#D4AF37]">
                        ₹{finalPrice}
                      </p>
                      <span className="text-xs text-green-600">
                        {discount.prop}% OFF
                      </span>
                    </>
                  ) : (
                    <p className="text-xl font-bold text-[#D4AF37]">
                      ₹{p.price}
                    </p>
                  )}

                  <div className="flex justify-between items-center pt-3">
                    <button
                      disabled={inCart}
                      onClick={() => addToCart(p.id, 1)}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] px-4 py-2 rounded-full font-semibold text-black"
                    >
                      🛒 {inCart ? "In Cart" : "Add to Cart"}
                    </button>

                    <button
                      onClick={() => handleRemoveFromWishlist(p.id)}
                      className="text-red-400 text-lg"
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
