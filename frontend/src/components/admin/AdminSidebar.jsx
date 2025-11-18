// src/components/admin/AdminSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const items = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/reports", label: "Reports" },
];

export default function AdminSidebar() {
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 📱 Eleganza Admin Header (Mobile only) */}
      <div className="md:hidden bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-4 py-3 shadow flex justify-between items-center sticky top-[64px] z-30">
        <h3 className="text-lg font-semibold tracking-wide">Eleganza Admin</h3>

        {/* Hamburger Button */}
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 flex flex-col justify-center items-center space-y-1.5 rounded-md bg-white/10 hover:bg-white/20 transition"
        >
          <div
            className={`h-0.5 w-5 bg-white rounded transition-transform ${
              open ? "rotate-45 translate-y-[6px]" : ""
            }`}
          ></div>
          <div
            className={`h-0.5 w-5 bg-white rounded ${
              open ? "opacity-0" : "opacity-100"
            }`}
          ></div>
          <div
            className={`h-0.5 w-5 bg-white rounded transition-transform ${
              open ? "-rotate-45 -translate-y-[6px]" : ""
            }`}
          ></div>
        </button>
      </div>

      {/* 🧭 Sidebar Drawer (mobile fixed, desktop static full-height) */}
      <aside
        className={`${
          open
            ? "fixed top-0 left-0 translate-x-0"
            : "fixed top-0 left-0 -translate-x-full"
        } md:translate-x-0 md:static
        transform transition-transform duration-300 ease-in-out
        bg-white md:bg-gradient-to-b md:from-[#fffdf8] md:to-[#f9f6e8]
        border-r border-[#E8D9A6]
        z-50 md:z-0
        w-64 md:w-72 flex-shrink-0 h-full md:h-[calc(100vh-64px)]
        md:mt-[64px] shadow-2xl md:shadow-sm`}
      >
        <div className="flex flex-col h-full p-5">
          {/* Desktop Header */}
          <div className="hidden md:flex flex-col items-center mb-6 border-b pb-3 border-[#E8D9A6]">
            <h3 className="text-xl font-bold text-[#8C6B1F] tracking-wide">
              Eleganza Admin
            </h3>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-2 flex-grow overflow-y-auto">
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  loc.pathname === it.to
                    ? "bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white shadow-md"
                    : "text-gray-700 hover:bg-[#F3EBD0]/60 hover:text-[#8C6B1F]"
                }`}
              >
                {it.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-4 border-t pt-3 hidden md:block">
            <p className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} Eleganza
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              Crafted by Suhaas A 👑
            </p>
          </div>
        </div>
      </aside>

      {/* 🔳 Overlay (mobile only) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        ></div>
      )}
    </>
  );
}
