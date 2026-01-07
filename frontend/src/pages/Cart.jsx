import { useState, useEffect } from "react";
import { useCartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import axiosInstance from "../api/axiosInstance";
import { getAllProducts } from "../api/productApi";

export default function Cart() {
  const {
    cartItems,
    totalPrice,
    handleRemoveFromCart,
    handleUpdateQuantity,
    fetchCart,
  } = useCartContext();

  const { dark } = useTheme();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState("none");
  const [filterBy, setFilterBy] = useState("all");

  /* 🔥 ADDED STATES */
  const [discounts, setDiscounts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetchCart();

    axiosInstance.get("/discounts").then((res) => {
      setDiscounts(res.data || []);
    });

    getAllProducts().then((res) => {
      setAllProducts(res.data || []);
    });
  }, [fetchCart]);

  /* ============================================================
     🔥 ENRICH CART ITEMS WITH FULL PRODUCT DATA
     ============================================================ */
  const enrichedCart = cartItems.map((item) => {
    const fullProduct = allProducts.find((p) => p.id === item.id);
    return fullProduct ? { ...item, ...fullProduct } : item;
  });

  /* ============================================================
     FINAL PRICE HELPER
     ============================================================ */
  const getFinalPrice = (item) => {
    if (!item.discount_id) return item.price;
    const d = discounts.find((x) => x.id === item.discount_id);
    if (!d) return item.price;
    return Math.round(item.price - (d.prop / 100) * item.price);
  };

  /* ============================================================
     EMPTY STATE
     ============================================================ */
  if (cartItems.length === 0)
    return (
      <div
        className={`min-h-screen flex flex-col justify-center items-center text-center ${
          dark
            ? "bg-[#0F1012] text-[#A1A1AA]"
            : "bg-gray-50 text-gray-500"
        }`}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Shopping_cart_icon.svg"
          alt="Empty cart"
          className="w-24 h-24 opacity-40 mb-6"
        />
        <p className="text-lg">Your cart is empty</p>
      </div>
    );

  /* ============================================================
     FILTER + SORT (FINAL PRICE)
     ============================================================ */
  const filtered = enrichedCart.filter((item) => {
    const price = getFinalPrice(item);
    if (filterBy === "low") return price < 500;
    if (filterBy === "mid") return price >= 500 && price <= 1000;
    if (filterBy === "high") return price > 1000;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const pa = getFinalPrice(a);
    const pb = getFinalPrice(b);
    if (sortBy === "price-asc") return pa - pb;
    if (sortBy === "price-desc") return pb - pa;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  /* ============================================================
     DISCOUNT-AWARE TOTAL
     ============================================================ */
  const discountedTotal = sorted.reduce(
    (sum, item) => sum + getFinalPrice(item) * item.quantity,
    0
  );

  const changeQty = (id, qty) => {
    if (qty < 1) return;
    handleUpdateQuantity(id, qty);
  };

  return (
    <div
      className={`min-h-screen px-6 py-12 ${
        dark ? "bg-[#0F1012] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#D4AF37] mb-10">
          Your Cart
        </h1>

        {/* FILTER + SORT */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className={`rounded-lg px-4 py-2 text-sm border ${
              dark
                ? "bg-[#14161A] border-[#262626]"
                : "bg-white border-gray-300"
            }`}
          >
            <option value="all">All Prices</option>
            <option value="low">Below ₹500</option>
            <option value="mid">₹500 – ₹1000</option>
            <option value="high">Above ₹1000</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`rounded-lg px-4 py-2 text-sm border ${
              dark
                ? "bg-[#14161A] border-[#262626]"
                : "bg-white border-gray-300"
            }`}
          >
            <option value="none">Sort By</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="name-asc">Name A–Z</option>
            <option value="name-desc">Name Z–A</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {sorted.map((item) => {
              const finalPrice = getFinalPrice(item);
              const discount = discounts.find(
                (d) => d.id === item.discount_id
              );

              return (
                <div
                  key={item.id}
                  className={`rounded-3xl p-6 flex gap-6 items-center border ${
                    dark
                      ? "bg-[#14161A] border-[#262626]"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  <img
                    src={
                      item.photo_link ||
                      "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                    }
                    alt={item.name}
                    className="w-28 h-28 rounded-2xl object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold truncate">
                      {item.name}
                    </h3>

                    {discount ? (
                      <>
                        <p className="text-xs line-through text-gray-400">
                          ₹{item.price}
                        </p>
                        <p className="text-sm text-green-600">
                          {discount.prop}% OFF
                        </p>
                        <p className="text-sm font-semibold text-[#D4AF37]">
                          ₹{finalPrice}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm mt-1 text-[#D4AF37]">
                        ₹{item.price}
                      </p>
                    )}

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          changeQty(item.id, item.quantity - 1)
                        }
                        className={`w-8 h-8 rounded-lg ${
                          dark ? "bg-[#262626]" : "bg-gray-200"
                        }`}
                      >
                        –
                      </button>

                      <span className="px-4 py-1 border border-[#D4AF37] rounded-lg">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          changeQty(item.id, item.quantity + 1)
                        }
                        className={`w-8 h-8 rounded-lg ${
                          dark ? "bg-[#262626]" : "bg-gray-200"
                        }`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-[#D4AF37]">
                      ₹{finalPrice * item.quantity}
                    </p>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-sm text-red-400 hover:text-red-500 mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SUMMARY */}
          <div
            className={`rounded-3xl p-6 h-fit border ${
              dark
                ? "bg-[#14161A] border-[#262626]"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6">
              Order Summary
            </h2>

            <div
              className={`space-y-3 text-sm ${
                dark ? "text-[#A1A1AA]" : "text-gray-600"
              }`}
            >
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{discountedTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-500">Free</span>
              </div>
              <div
                className={`border-t pt-3 flex justify-between font-semibold ${
                  dark
                    ? "border-[#262626] text-white"
                    : "border-gray-200"
                }`}
              >
                <span>Total</span>
                <span className="text-[#D4AF37]">
                  ₹{discountedTotal}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                         text-black py-3 rounded-full font-semibold
                         hover:brightness-110 transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
