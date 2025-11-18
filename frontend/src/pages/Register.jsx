import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";

export default function Register() {
  const { handleRegister, error } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    address: "",
    phone_number: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await handleRegister(form);
    setLoading(false);
    if (success) window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F9F9F7]">
      {/* Left - Brand Section */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#C9A227] to-[#8C6B1F] text-white items-center justify-center relative overflow-hidden">
        <div className="text-center px-10">
          <h1 className="text-5xl font-serif font-bold mb-4 tracking-wide drop-shadow-lg">
            Join <span className="text-[#FFF5D1]">Eleganza</span>
          </h1>
          <p className="text-lg text-white/90 max-w-md mx-auto leading-relaxed">
            Step into a world where elegance meets individuality. Create your
            <span className="font-semibold"> Eleganza </span> account and begin
            your exclusive fashion journey today.
          </p>
          <div className="mt-8 flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2920/2920256.png"
              alt="Eleganza fashion signup"
              className="w-44 opacity-90 drop-shadow-xl"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C9A227]/10 to-[#8C6B1F]/40"></div>
      </div>

      {/* Right - Register Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E8D9A6] p-8 relative overflow-hidden">
          {/* Accent Bar */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#C9A227] to-[#8C6B1F]" />

          <h2 className="text-3xl font-serif font-bold text-center text-[#8C6B1F] mt-3">
            Create Your Account ✨
          </h2>
          <p className="text-center text-gray-500 text-sm mt-1 mb-8">
            Become a part of <span className="font-semibold text-[#C9A227]">Eleganza</span> today
          </p>

          <form onSubmit={submit} className="flex flex-col gap-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-[#3A3A3A] mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter username"
                className="w-full border border-[#E8D9A6] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#3A3A3A] mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full border border-[#E8D9A6] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#3A3A3A] mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full border border-[#E8D9A6] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-[#3A3A3A] mb-1">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter address"
                className="w-full border border-[#E8D9A6] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-[#3A3A3A] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="w-full border border-[#E8D9A6] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all"
                onChange={(e) =>
                  setForm({ ...form, phone_number: e.target.value })
                }
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-md border border-red-200">
                {error}
              </p>
            )}

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-2 text-white font-semibold rounded-lg transition-all duration-300 shadow-md ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] hover:from-[#D4AF37] hover:to-[#B8871F] hover:shadow-[0_0_12px_rgba(201,162,39,0.4)]"
              }`}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-500 mt-6">
            <p>
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#8C6B1F] font-semibold hover:text-[#C9A227] transition-colors"
              >
                Login here
              </a>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            © {new Date().getFullYear()} Eleganza — Designed by{" "}
            <span className="text-[#8C6B1F] font-semibold">Suhaas A 👑</span>
          </p>
        </div>
      </div>
    </div>
  );
}
