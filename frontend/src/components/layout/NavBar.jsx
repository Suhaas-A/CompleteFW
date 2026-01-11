import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useCartContext } from "../../contexts/CartContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useState } from "react";

export default function Navbar() {
  const { user, handleLogout } = useAuthContext();
  const { cartItems } = useCartContext();
  const { dark, setDark } = useTheme();

  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const isAdmin =
    user?.admin ||
    user?.is_admin ||
    user?.isAdmin ||
    user?.role === "admin" ||
    user?.is_superuser ||
    user?.is_staff;

  // search submit handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  /* ============================================================
     🚀 ADMIN NAVBAR — ORIGINAL + THEME TOGGLE
     ============================================================ */
  if (isAdmin) {
    return (
      <nav
        className={`sticky top-0 z-50 border-b ${
          dark
            ? "bg-[#0F1012] text-white"
            : "bg-[#F0F2F5] text-[#111827]"
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">

          {/* Brand */}
          <Link
            to="/admin"
            className="text-3xl font-serif font-bold tracking-wide text-[#D4AF37] hover:opacity-90 transition"
          >
            ELEGANZA Admin
          </Link>

          {/* Admin Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#A1A1AA]">
            <Link to="/admin" className="hover:text-[#D4AF37] transition">
              Dashboard
            </Link>
            <Link to="/admin/products" className="hover:text-[#D4AF37] transition">
              Products
            </Link>
            <Link to="/admin/categories" className="hover:text-[#D4AF37] transition">
              Categories
            </Link>
            <Link to="/admin/orders" className="hover:text-[#D4AF37] transition">
              Orders
            </Link>
            <Link to="/admin/reports" className="hover:text-[#D4AF37] transition">
              Reports
            </Link>
          </div>

          {/* Auth + Theme */}
          <div className="flex items-center gap-3 md:gap-5 text-sm font-medium">
            <button
              onClick={() => setDark(!dark)}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black px-3 py-1.5 rounded-full font-semibold"
            >
              {dark ? "☀ Light" : "🌙 Dark"}
            </button>

            <span className="hidden sm:block text-[#A1A1AA]">
              Hi,{" "}
              <span className="text-white font-semibold">
                {user?.username}
              </span>
            </span>

            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black px-4 py-1.5 rounded-full font-semibold hover:brightness-110 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Admin Nav */}
        <div
          className={`flex justify-center gap-6 py-3 border-t md:hidden text-sm font-medium ${
            dark
              ? "bg-[#0F1012] border-[rgba(212,175,55,0.25)]"
              : "bg-white border-gray-200"
          }`}
        >
          <Link to="/admin" className="hover:text-[#D4AF37] transition">
            Dashboard
          </Link>
          <Link to="/admin/products" className="hover:text-[#D4AF37] transition">
            Products
          </Link>
          <Link to="/admin/orders" className="hover:text-[#D4AF37] transition">
            Orders
          </Link>
        </div>
      </nav>
    );
  }

  /* ============================================================
     🌟 USER NAVBAR — USERNAME RESTORED
     ============================================================ */

  return (
    <nav
      className={`sticky top-0 z-50 border-b ${
        dark
          ? "bg-[#0F1012] text-white border-[rgba(212,175,55,0.25)]"
          : "bg-[#F0F2F5] text-gray-900 border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">

        {/* Brand */}
        <Link
          to="/"
          className="text-3xl font-serif font-bold tracking-wide text-[#D4AF37] hover:opacity-90 transition"
        >
          ELEGANZA
        </Link>

        {/* Search */}
        <form
          onSubmit={handleSearchSubmit}
          className={`hidden md:flex items-center rounded-full px-4 py-1.5 border w-64 ${
            dark
              ? "bg-[#14161A] border-[rgba(212,175,55,0.25)]"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`w-full bg-transparent text-sm outline-none ${
              dark
                ? "text-white placeholder:text-[#71717A]"
                : "text-gray-900"
            }`}
          />
          <button type="submit" className="text-[#D4AF37] font-bold px-2">
            🔍
          </button>
        </form>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#A1A1AA]">
          <Link to="/products" className="hover:text-[#D4AF37] transition">
            View Products
          </Link>
          <Link to="/orders" className="hover:text-[#D4AF37] transition">
            My Orders
          </Link>
          <Link to="/wishlist" className="hover:text-[#D4AF37] transition">
            ❤️ Wishlist
          </Link>
          <Link to="/cart" className="relative hover:text-[#D4AF37] transition">
            🛒 Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#D4AF37] text-black text-xs px-2 rounded-full font-semibold">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>

        {/* Right Auth + Toggle */}
        <div className="flex items-center gap-3 md:gap-5 text-sm font-medium">
          <button
            onClick={() => setDark(!dark)}
            className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black px-3 py-1.5 rounded-full font-semibold"
          >
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>

          {user ? (
            <>
              <span onClick={function() {window.location = '/profile'}} className="hidden sm:block text-[#A1A1AA]">
                Hi,{" "}
                <span
                  className={`font-semibold ${
                    dark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user.username}
                </span>
              </span>

              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black px-4 py-1.5 rounded-full font-semibold hover:brightness-110 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-[#D4AF37] transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black px-4 py-1.5 rounded-full font-semibold hover:brightness-110 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile User Nav */}
      <div
        className={`flex justify-center gap-6 py-3 border-t md:hidden text-sm font-medium ${
          dark
            ? "bg-[#0F1012] border-[rgba(212,175,55,0.25)]"
            : "bg-[#F0F2F5] border-gray-200"
        }`}
      >
        <button
          onClick={() => {
            const term = prompt("Search products:");
            if (term?.trim())
              navigate(`/products?search=${encodeURIComponent(term.trim())}`);
          }}
          className="hover:text-[#D4AF37]"
        >
          🔍
        </button>

        <Link to="/products" className="hover:text-[#D4AF37] transition">
          Products
        </Link>
        <Link to="/orders" className="hover:text-[#D4AF37] transition">
          Orders
        </Link>
        <Link to="/wishlist" className="hover:text-[#D4AF37] transition">
          ❤️
        </Link>
        <Link to="/cart" className="relative hover:text-[#D4AF37] transition">
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-[#D4AF37] text-black text-xs px-1.5 rounded-full font-semibold">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}



