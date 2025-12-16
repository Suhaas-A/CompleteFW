// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-[#0F1012] text-white py-10 border-t border-[rgba(212,175,55,0.25)]">
      <div className="max-w-7xl mx-auto px-6 text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-serif font-bold mb-3 tracking-wide text-[#D4AF37]">
            Eleganza
          </h2>
          <p className="text-sm text-[#A1A1AA] leading-relaxed">
            Eleganza brings timeless style and effortless sophistication to your
            wardrobe — because fashion should always feel like luxury.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#D4AF37]">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-[#A1A1AA]">
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

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#D4AF37]">
            Get in Touch
          </h3>
          <p className="text-sm text-[#A1A1AA]">📍 Hyderabad, India</p>
          <p className="text-sm text-[#A1A1AA]">✉️ support@eleganza.com</p>
          <p className="text-sm text-[#A1A1AA]">☎️ +91 98765 43210</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[rgba(212,175,55,0.25)] mt-10 pt-4 text-center">
        <p className="text-sm text-[#A1A1AA]">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">Eleganza</span>. All rights reserved.
        </p>
        <p className="text-xs mt-1 text-[#71717A]">
          Crafted with ✨ by{" "}
          <span className="font-semibold text-[#D4AF37]">Suhaas A 👑</span>
        </p>
      </div>
    </footer>
  );
}
