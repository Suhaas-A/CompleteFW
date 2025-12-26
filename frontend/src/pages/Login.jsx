import { useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Login() {
  const { handleLogin, error } = useAuthContext();
  const { dark } = useTheme();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await handleLogin(form.username, form.password);
    setLoading(false);
    if (success) window.location.href = "/";
  };

  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row font-sans ${
        dark ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* LEFT PANEL */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1400&auto=format&fit=crop"
          alt="Fashion"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* gold grading */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8A5600]/60 via-[#B67A1E]/35 to-transparent" />

        {/* hard edge fade */}
        <div
          className={`absolute top-0 right-0 h-full w-24 bg-gradient-to-l ${
            dark ? "from-black" : "from-gray-50"
          } to-transparent`}
        />

        <div className="relative text-center px-10">
          <h1 className="text-5xl font-bold tracking-[0.3em] text-[#D4AF37] mb-4 uppercase">
            Eleganza
          </h1>
          <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
            Step into a world of refined fashion. Curated silhouettes and timeless
            designs crafted for you.
          </p>
        </div>
      </div>

      {/* LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div
          className={`w-full max-w-md rounded-3xl px-8 py-10 relative overflow-hidden border
            ${
              dark
                ? "bg-[#0F1012] border-[rgba(212,175,55,0.30)] shadow-[0_0_40px_rgba(212,175,55,0.18)]"
                : "bg-white border-gray-200 shadow-xl"
            }`}
        >
          {/* gold top bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8962E]" />

          <h2 className="text-2xl font-semibold text-[#D4AF37] tracking-[0.25em] uppercase text-center mt-4">
            Existing Member
          </h2>

          <p
            className={`text-center text-xs mt-1 mb-8 tracking-wide ${
              dark ? "text-[#A1A1AA]" : "text-gray-500"
            }`}
          >
            Sign in to continue
          </p>

          <form onSubmit={submit} className="flex flex-col gap-6">
            {/* Username */}
            <div>
              <label
                className={`text-[11px] uppercase tracking-[0.25em] ${
                  dark ? "text-[#A1A1AA]" : "text-gray-500"
                }`}
              >
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className={`mt-2 w-full px-4 py-2.5 rounded-full border text-sm outline-none
                  ${
                    dark
                      ? "bg-[#14161A] border-[rgba(212,175,55,0.30)] text-white placeholder:text-[#71717A] focus:border-[#D4AF37]"
                      : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#D4AF37]"
                  }`}
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                className={`text-[11px] uppercase tracking-[0.25em] ${
                  dark ? "text-[#A1A1AA]" : "text-gray-500"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className={`mt-2 w-full px-4 py-2.5 rounded-full border text-sm outline-none
                  ${
                    dark
                      ? "bg-[#14161A] border-[rgba(212,175,55,0.30)] text-white placeholder:text-[#71717A] focus:border-[#D4AF37]"
                      : "bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#D4AF37]"
                  }`}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded-md border border-red-600/40">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-2 text-black font-semibold rounded-full tracking-[0.25em] uppercase transition-all
                shadow-[0_0_25px_rgba(212,175,55,0.45)]
                ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:brightness-110"
                }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Links */}
          <div
            className={`text-center text-xs mt-6 ${
              dark ? "text-[#A1A1AA]" : "text-gray-500"
            }`}
          >
            <p>
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-[#D4AF37] hover:text-[#E6C86E] font-medium"
              >
                Register here
              </a>
            </p>
            <p className="mt-3">
              <a
                href="/forgot-password"
                className="text-[#D4AF37] hover:text-[#E6C86E] font-medium"
              >
                Forgot your password?
              </a>
            </p>
          </div>

          <p className="text-center text-[10px] text-zinc-500 mt-8 tracking-wide">
            © {new Date().getFullYear()} Eleganza — Designed by{" "}
            <span className="text-[#D4AF37] font-semibold">Suhaas A</span>
          </p>
        </div>
      </div>
    </div>
  );
}
