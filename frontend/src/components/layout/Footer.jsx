// src/components/layout/Footer.jsx
import { useTheme } from "../../contexts/ThemeContext";

export default function Footer() {
  const { dark } = useTheme();

  return (
    <footer
      className={`py-10 border-t ${
        dark
          ? "bg-[#0F1012] text-white"
          : "bg-[#F0F2F5] text-[#111827]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-serif font-bold mb-3 tracking-wide text-[#D4AF37]">
            Eleganza
          </h2>
          <p
            className={`text-sm leading-relaxed ${
              dark ? "text-[#A1A1AA]" : "text-gray-600"
            }`}
          >
            Eleganza brings timeless style and effortless sophistication to your
            wardrobe — because fashion should always feel like luxury.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#D4AF37]">
            Quick Links
          </h3>
          <ul
            className={`space-y-2 text-sm ${
              dark ? "text-[#A1A1AA]" : "text-gray-600"
            }`}
          >
            <li>
              <a href="/" className="hover:text-[#D4AF37] transition">
                Home
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-[#D4AF37] transition">
                Shop
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-[#D4AF37] transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-[#D4AF37] transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#D4AF37]">
            Get in Touch
          </h3>
          <p className={dark ? "text-[#A1A1AA]" : "text-gray-600"}>
            📍 Hyderabad, India
          </p>
          <p className={dark ? "text-[#A1A1AA]" : "text-gray-600"}>
            ✉️ support@eleganza.com
          </p>
          <p className={dark ? "text-[#A1A1AA]" : "text-gray-600"}>
            ☎️ +91 98765 43210
          </p>
        </div>
      </div>

      {/* BOTTOM */}
      <div
        className={`mt-10 pt-4 text-center border-t ${
          dark
            ? "border-[rgba(212,175,55,0.25)]"
            : "border-gray-200"
        }`}
      >
        <p
          className={`text-sm ${
            dark ? "text-[#A1A1AA]" : "text-gray-600"
          }`}
        >
          © {new Date().getFullYear()}{" "}
          <span
            className={`font-semibold ${
              dark ? "text-white" : "text-gray-900"
            }`}
          >
            Eleganza
          </span>
          . All rights reserved.
        </p>

        <p
          className={`text-xs mt-1 ${
            dark ? "text-[#71717A]" : "text-gray-500"
          }`}
        >
          Crafted with ✨ by{" "}
          <span className="font-semibold text-[#D4AF37]">
            Suhaas A 👑
          </span>
        </p>
      </div>
    </footer>
  );
}

