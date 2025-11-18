import { useState, useEffect } from "react";
import { useCartContext } from "../contexts/CartContext";

export default function Cart() {
  const {
    cartItems,
    totalPrice,
    handleRemoveFromCart,
    handleUpdateQuantity,
    fetchCart,     // ⬅️ ADD THIS
  } = useCartContext();

  // ⬅️ LOAD CART WHEN THIS PAGE OPENS
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const [sortBy, setSortBy] = useState("none");
  const [filterBy, setFilterBy] = useState("all");

  if (cartItems.length === 0)
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center text-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/5a/Shopping_cart_icon.svg"
          alt="Empty cart"
          className="w-24 h-24 opacity-60 mb-4"
        />
        <p className="text-lg text-gray-500">Your cart is empty.</p>
      </div>
    );

  // FILTER LOGIC
  const filtered = cartItems.filter((item) => {
    if (filterBy === "low") return item.price < 500;
    if (filterBy === "mid") return item.price >= 500 && item.price <= 1000;
    if (filterBy === "high") return item.price > 1000;
    return true;
  });

  // SORT LOGIC
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name-asc") return a.name.localeCompare(b.name);
    if (sortBy === "name-desc") return b.name.localeCompare(a.name);
    return 0;
  });

  const changeQty = (id, qty) => {
    if (qty < 1) return;
    handleUpdateQuantity(id, qty);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">

        <h2 className="text-3xl font-serif font-bold text-[#8C6B1F] mb-8 text-center">
          🛍️ Your Shopping Cart
        </h2>

        {/* SORT + FILTER BAR */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="border border-[#C9A227] rounded-lg px-4 py-2 bg-[#FFFDF5] text-[#3A3A3A]"
          >
            <option value="all">All Items</option>
            <option value="low">Below ₹500</option>
            <option value="mid">₹500 – ₹1000</option>
            <option value="high">Above ₹1000</option>
          </select>

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

        <div className="space-y-5">
          {sorted.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFDF5] border border-[#F3EBD0] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row justify-between gap-6"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={
                    item.photo_link ||
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                  }
                  alt={item.name}
                  onError={(e) =>
                    (e.target.src =
                      "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg")
                  }
                  className="w-24 h-24 object-contain rounded-lg border border-[#E8D9A6] bg-white"
                />

                <div>
                  <p className="font-semibold text-lg text-[#3A3A3A] truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col justify-between gap-4 text-right min-w-[140px]">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => changeQty(item.id, item.quantity - 1)}
                    className="w-8 h-8 bg-[#F3EBD0] text-[#8C6B1F] rounded-lg text-lg active:scale-90"
                  >
                    –
                  </button>

                  <span className="px-4 py-1 rounded-lg border border-[#C9A227] bg-white text-[#3A3A3A] font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => changeQty(item.id, item.quantity + 1)}
                    className="w-8 h-8 bg-[#F3EBD0] text-[#8C6B1F] rounded-lg text-lg active:scale-90"
                  >
                    +
                  </button>
                </div>

                <p className="font-bold text-[#8C6B1F] text-lg">
                  ₹{item.price * item.quantity}
                </p>

                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#E8D9A6] my-8"></div>

        <div className="flex justify-between items-center text-xl font-semibold text-[#3A3A3A]">
          <p>Total</p>
          <p className="text-3xl text-[#C9A227]">₹{totalPrice}</p>
        </div>

        <button className="mt-8 w-full bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] hover:from-[#D4AF37] hover:to-[#B8871F] text-white py-4 rounded-2xl font-semibold text-lg shadow-md hover:shadow-[0_0_12px_rgba(201,162,39,0.3)] transition-all duration-300">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
