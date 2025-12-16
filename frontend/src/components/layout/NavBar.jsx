// src/components/layout/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useCartContext } from "../../contexts/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { user, handleLogout } = useAuthContext();
  const { cartItems } = useCartContext();
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
     🚀 ADMIN NAVBAR — UI ONLY UPDATED
     ============================================================ */
  if (isAdmin) {
    return (
      <nav className="bg-[#0F1012] text-white border-b border-[rgba(212,175,55,0.25)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">

          {/* Brand */}
          <Link
            to="/admin"
            className="text-3xl font-serif font-bold tracking-wide text-[#D4AF37] hover:opacity-90 transition"
          >
            Eleganza Admin
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

          {/* Auth */}
          <div className="flex items-center gap-3 md:gap-5 text-sm font-medium">
            <span className="hidden sm:block text-[#A1A1AA]">
              Hi, <span className="text-white font-semibold">{user?.username}</span>
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
        <div className="flex justify-center gap-6 py-3 border-t border-[rgba(212,175,55,0.25)] md:hidden text-sm font-medium bg-[#0F1012]">

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
     🌟 USER NAVBAR — UI ONLY UPDATED
     ============================================================ */

  return (
    <nav className="bg-[#0F1012] text-white border-b border-[rgba(212,175,55,0.25)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">

        {/* --- Brand Logo --- */}
        <Link
          to="/"
          className="text-3xl font-serif font-bold tracking-wide text-[#D4AF37] hover:opacity-90 transition"
        >
          Eleganza
        </Link>

        {/* --- Search Bar (desktop) --- */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden md:flex items-center bg-[#14161A] rounded-full px-4 py-1.5 border border-[rgba(212,175,55,0.25)] w-64"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder:text-[#71717A] outline-none"
          />
          <button type="submit" className="text-[#D4AF37] font-bold px-2">
            🔍
          </button>
        </form>

        {/* --- Center Navigation Links --- */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#A1A1AA]">
          <Link to="/products" className="hover:text-[#D4AF37] transition">
            View Products
          </Link>
          <Link to="/orders" className="hover:text-[#D4AF37] transition">
            My Orders
          </Link>
          <Link to="/wishlist" className="relative hover:text-[#D4AF37] transition flex items-center">
            ❤️
            <span className="ml-1 hidden sm:inline">Wishlist</span>
          </Link>
          <Link to="/cart" className="relative hover:text-[#D4AF37] transition flex items-center">
            🛒
            <span className="ml-1 hidden sm:inline">Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#D4AF37] text-black text-xs px-2 rounded-full font-semibold">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>

        {/* --- Right Side Auth Section --- */}
        <div className="flex items-center gap-3 md:gap-5 text-sm font-medium">
          {user ? (
            <>
              <span className="hidden sm:block text-[#A1A1AA]">
                Hi, <span className="text-white font-semibold">{user.username}</span>
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

      {/* --- Mobile Navigation (User) --- */}
      <div className="flex justify-center gap-6 py-3 border-t border-[rgba(212,175,55,0.25)] md:hidden text-sm font-medium bg-[#0F1012]">

        <button
          onClick={() => {
            const term = prompt("Search products:");
            if (term?.trim()) navigate(`/products?search=${encodeURIComponent(term.trim())}`);
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
        <Link to="/cart" className="hover:text-[#D4AF37] transition relative">
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
