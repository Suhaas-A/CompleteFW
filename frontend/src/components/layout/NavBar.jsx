// src/components/layout/Navbar.jsx
import { Link } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useCartContext } from "../../contexts/CartContext";

export default function Navbar() {
  const { user, handleLogout } = useAuthContext();
  const { cartItems } = useCartContext();

  return (
    <nav className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 md:px-10 py-4">
        {/* --- Brand Logo --- */}
        <Link
          to="/"
          className="text-3xl font-serif font-bold tracking-wide hover:scale-105 transition-transform duration-200"
        >
          Eleganza
        </Link>

        {/* --- Center Navigation Links --- */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/products"
            className="hover:text-[#FDF6E3] hover:underline underline-offset-4 transition duration-200"
          >
            View Products
          </Link>
          <Link
            to="/orders"
            className="hover:text-[#FDF6E3] hover:underline underline-offset-4 transition duration-200"
          >
            My Orders
          </Link>
          <Link
            to="/wishlist"
            className="relative hover:text-[#FDF6E3] transition duration-200 flex items-center"
          >
            ❤️
            <span className="ml-1 hidden sm:inline">Wishlist</span>
          </Link>
          <Link
            to="/cart"
            className="relative hover:text-[#FDF6E3] transition duration-200 flex items-center"
          >
            🛒
            <span className="ml-1 hidden sm:inline">Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-xs px-2 rounded-full font-semibold shadow-sm">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>

        {/* --- Right Side Auth Section --- */}
        <div className="flex items-center gap-3 md:gap-5 text-sm font-medium">
          {user ? (
            <>
              <span className="hidden sm:block text-[#FDF6E3]">
                Hi, <span className="font-semibold">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-[#C9A227] px-3 py-1 rounded-lg font-semibold hover:bg-[#F9F9F7] transition duration-200 shadow-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-[#FDF6E3] transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-[#C9A227] px-3 py-1 rounded-lg font-semibold hover:bg-[#F9F9F7] transition duration-200 shadow-sm"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      {/* --- Mobile Navigation (Collapsible for small screens) --- */}
      <div className="flex justify-center gap-6 py-3 border-t border-[#EEDC82]/30 md:hidden text-sm font-medium bg-[#C9A227]/95 backdrop-blur-md">
        <Link
          to="/products"
          className="hover:text-[#FDF6E3] transition duration-200"
        >
          Products
        </Link>
        <Link
          to="/orders"
          className="hover:text-[#FDF6E3] transition duration-200"
        >
          Orders
        </Link>
        <Link
          to="/wishlist"
          className="hover:text-[#FDF6E3] transition duration-200"
        >
          ❤️
        </Link>
        <Link
          to="/cart"
          className="hover:text-[#FDF6E3] transition duration-200 relative"
        >
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-600 text-xs px-1.5 rounded-full font-semibold">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
