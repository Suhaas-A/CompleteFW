// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Profile() {
  const { user, loadingAuth } = useAuthContext();
  const { dark } = useTheme();

  const [form, setForm] = useState({
    username: "",
    email: "",
    address: "",
    phone_number: "",
  });

  const [msg, setMsg] = useState("");

  // ⭐ Load form once user is available
  useEffect(() => {
    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        address: user.address || "",
        phone_number: user.phone_number || "",
      });
    }
  }, [user]);

  /* ================= STATES ================= */

  if (loadingAuth) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          dark ? "text-[#A1A1AA]" : "text-gray-500"
        }`}
      >
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        You must login to view your profile.
      </div>
    );
  }

  const handleUpdate = async () => {
    try {
      console.log("Update profile payload:", form);
      setMsg("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      setMsg("Update failed.");
    }
  };

  /* ================= UI ================= */

  return (
    <div
      className={`min-h-screen px-6 py-12 ${
        dark ? "bg-[#0F1012] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8962E] flex items-center justify-center text-black text-4xl font-bold shadow-lg">
            {form.username?.[0]?.toUpperCase()}
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold text-[#D4AF37]">
              {form.username}
            </h1>
            <p className={dark ? "text-[#A1A1AA] mt-1" : "text-gray-500 mt-1"}>
              Account Profile
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — PROFILE FORM */}
          <div className="lg:col-span-2 space-y-8">
            <div
              className={`rounded-3xl p-6 border ${
                dark
                  ? "bg-[#14161A] border-[#262626]"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <h2 className="text-xl font-semibold mb-6">
                Profile Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  className={`input ${
                    dark ? "input-dark" : "input-light"
                  }`}
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                />

                <input
                  className={`input ${
                    dark ? "input-dark" : "input-light"
                  }`}
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />

                <input
                  className={`input sm:col-span-2 ${
                    dark ? "input-dark" : "input-light"
                  }`}
                  placeholder="Phone Number"
                  value={form.phone_number}
                  onChange={(e) =>
                    setForm({ ...form, phone_number: e.target.value })
                  }
                />
              </div>
            </div>

            <div
              className={`rounded-3xl p-6 border ${
                dark
                  ? "bg-[#14161A] border-[#262626]"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <h2 className="text-xl font-semibold mb-6">
                Delivery Address
              </h2>

              <textarea
                rows={4}
                className={`w-full rounded-xl p-4 outline-none ${
                  dark
                    ? "bg-[#0F1012] border border-[#262626] text-white"
                    : "bg-gray-100 border border-gray-300 text-gray-900"
                }`}
                placeholder="Enter your address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>

            <button
              onClick={handleUpdate}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black py-3 rounded-full font-semibold hover:brightness-110 transition"
            >
              Update Profile
            </button>

            {msg && (
              <p className="text-center text-green-400 font-medium mt-4">
                {msg}
              </p>
            )}
          </div>

          {/* RIGHT — QUICK ACTIONS */}
          <div className="space-y-6">
            <div
              className={`rounded-3xl p-6 border ${
                dark
                  ? "bg-[#14161A] border-[#262626]"
                  : "bg-white border-gray-200 shadow-sm"
              }`}
            >
              <h2 className="text-xl font-semibold mb-4">
                Quick Links
              </h2>

              <ul
                className={`space-y-3 ${
                  dark ? "text-[#A1A1AA]" : "text-gray-600"
                }`}
              >
                <li className="hover:text-[#D4AF37] cursor-pointer">
                  My Orders
                </li>
                <li className="hover:text-[#D4AF37] cursor-pointer">
                  Wishlist
                </li>
                <li className="hover:text-red-400 cursor-pointer">
                  Logout
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* INPUT STYLES — 1:1 */}
      <style jsx>{`
        .input {
          border-radius: 12px;
          padding: 12px 14px;
          outline: none;
        }

        .input-dark {
          background: #0F1012;
          border: 1px solid #262626;
          color: white;
        }

        .input-dark::placeholder {
          color: #A1A1AA;
        }

        .input-light {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          color: #111827;
        }

        .input-light::placeholder {
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
