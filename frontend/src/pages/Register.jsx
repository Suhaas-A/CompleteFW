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
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white font-sans">

      {/* LEFT PANEL — SAME AS LOGIN */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1400&auto=format&fit=crop"
          alt="Fashion"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* gold grading */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8A5600]/60 via-[#B67A1E]/35 to-transparent" />

        {/* hard edge fade */}
        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-black to-transparent" />

        <div className="relative text-center px-10">
          <h1 className="text-5xl font-bold tracking-[0.3em] text-[#D4AF37] mb-4 uppercase">
            Eleganza
          </h1>
          <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
            Begin your journey into refined fashion. Create your exclusive
            Eleganza account today.
          </p>
        </div>
      </div>

      {/* REGISTER FORM — MATCHES LOGIN CARD */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-3xl px-8 py-10 bg-[#0F1012]
          border border-[rgba(212,175,55,0.30)]
          shadow-[0_0_40px_rgba(212,175,55,0.18)]
          relative overflow-hidden">

          {/* gold top bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8962E]" />

          <h2 className="text-2xl font-semibold text-[#D4AF37]
            tracking-[0.25em] uppercase text-center mt-4">
            New Member
          </h2>

          <p className="text-center text-xs text-[#A1A1AA] mt-1 mb-8 tracking-wide">
            Create your Eleganza account
          </p>

          <form onSubmit={submit} className="flex flex-col gap-5">

            {/* USERNAME */}
            <div>
              <label className="text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                className="mt-2 w-full px-4 py-2.5 rounded-full
                  bg-[#14161A]
                  border border-[rgba(212,175,55,0.30)]
                  placeholder:text-[#71717A]
                  text-sm text-white
                  focus:outline-none focus:border-[#D4AF37]"
                value={form.username}
                onChange={(e) =>
                  setForm({ ...form, username: e.target.value })
                }
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="mt-2 w-full px-4 py-2.5 rounded-full
                  bg-[#14161A]
                  border border-[rgba(212,175,55,0.30)]
                  placeholder:text-[#71717A]
                  text-sm text-white
                  focus:outline-none focus:border-[#D4AF37]"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="mt-2 w-full px-4 py-2.5 rounded-full
                  bg-[#14161A]
                  border border-[rgba(212,175,55,0.30)]
                  placeholder:text-[#71717A]
                  text-sm text-white
                  focus:outline-none focus:border-[#D4AF37]"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter your address"
                className="mt-2 w-full px-4 py-2.5 rounded-full
                  bg-[#14161A]
                  border border-[rgba(212,175,55,0.30)]
                  placeholder:text-[#71717A]
                  text-sm text-white
                  focus:outline-none focus:border-[#D4AF37]"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                required
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-[11px] uppercase tracking-[0.25em] text-[#A1A1AA]">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                className="mt-2 w-full px-4 py-2.5 rounded-full
                  bg-[#14161A]
                  border border-[rgba(212,175,55,0.30)]
                  placeholder:text-[#71717A]
                  text-sm text-white
                  focus:outline-none focus:border-[#D4AF37]"
                value={form.phone_number}
                onChange={(e) =>
                  setForm({ ...form, phone_number: e.target.value })
                }
                required
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-400 text-sm text-center
                bg-red-900/20 py-2 rounded-md
                border border-red-600/40">
                {error}
              </p>
            )}

            {/* REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-2 text-black font-semibold
                rounded-full tracking-[0.25em] uppercase transition-all
                shadow-[0_0_25px_rgba(212,175,55,0.45)]
                ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:brightness-110"
                }`}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          {/* LINKS */}
          <div className="text-center text-xs text-[#A1A1AA] mt-6">
            <p>
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#D4AF37] hover:text-[#E6C86E] font-medium"
              >
                Login here
              </a>
            </p>
          </div>

          <p className="text-center text-[10px] text-zinc-500 mt-8 tracking-wide">
            © {new Date().getFullYear()} Eleganza — Designed by{" "}
            <span className="text-[#D4AF37] font-semibold">
              Suhaas A
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
