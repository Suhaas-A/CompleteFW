// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";

export default function Profile() {
  const { user, loadingAuth } = useAuthContext();

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

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#A1A1AA]">
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

  return (
    <div className="min-h-screen bg-[#0F1012] text-white px-6 py-12">
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
            <p className="text-[#A1A1AA] mt-1">Account Profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT — PROFILE FORM */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-6">Profile Information</h2>

              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  className="input"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  className="input sm:col-span-2"
                  placeholder="Phone Number"
                  value={form.phone_number}
                  onChange={(e) =>
                    setForm({ ...form, phone_number: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-6">Delivery Address</h2>
              <textarea
                rows={4}
                className="w-full bg-[#0F1012] border border-[#262626] rounded-xl p-4 text-white outline-none"
                placeholder="Enter your address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
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
            <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
              <ul className="space-y-3 text-[#A1A1AA]">
                <li className="hover:text-[#D4AF37] cursor-pointer">My Orders</li>
                <li className="hover:text-[#D4AF37] cursor-pointer">Wishlist</li>
                <li className="hover:text-red-400 cursor-pointer">Logout</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input {
          background: #0F1012;
          border: 1px solid #262626;
          border-radius: 12px;
          padding: 12px 14px;
          color: white;
          outline: none;
        }
        .input::placeholder {
          color: #A1A1AA;
        }
      `}</style>
    </div>
  );
}
