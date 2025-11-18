// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white py-10 mt-16 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl font-serif font-bold mb-3 tracking-wide">
            Eleganza
          </h2>
          <p className="text-sm text-[#FDF6E3] leading-relaxed">
            Eleganza brings timeless style and effortless sophistication to your
            wardrobe — because fashion should always feel like luxury.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-[#FDF6E3]">
            <li>
              <a href="/" className="hover:underline hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/products" className="hover:underline hover:text-white transition">
                Shop
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline hover:text-white transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Get in Touch</h3>
          <p className="text-sm text-[#FDF6E3]">
            📍 Hyderabad, India
          </p>
          <p className="text-sm text-[#FDF6E3]">
            ✉️ support@eleganza.com
          </p>
          <p className="text-sm text-[#FDF6E3]">
            ☎️ +91 98765 43210
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#EEDC82]/40 mt-10 pt-4 text-center">
        <p className="text-sm text-[#FDF6E3]">
          © {new Date().getFullYear()} <span className="font-semibold">Eleganza</span>. All rights reserved.
        </p>
        <p className="text-xs mt-1 text-[#FDF6E3]/80">
          Crafted with ✨ by <span className="font-semibold text-white">Suhaas A 👑</span>
        </p>
      </div>
    </footer>
  );
}
