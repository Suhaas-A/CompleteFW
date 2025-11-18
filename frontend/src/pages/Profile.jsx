// src/pages/Profile.jsx
import { useAuthContext } from "../contexts/AuthContext";
import { useState } from "react";
import { register } from "../api/authApi";

export default function Profile() {
  const { user } = useAuthContext();
  const [form, setForm] = useState({ ...user });
  const [msg, setMsg] = useState("");

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  const handleUpdate = async () => {
    try {
      await register(form); // Using same schema for update
      setMsg("Profile updated successfully!");
    } catch {
      setMsg("Update failed.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-yellow-500">My Profile</h2>
      {["username", "email", "address", "phone_number"].map((field) => (
        <input
          key={field}
          value={form[field] || ""}
          onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          placeholder={field.replace("_", " ")}
          className="border rounded-md p-2 mb-3 w-full"
        />
      ))}
      <button
        onClick={handleUpdate}
        className="bg-yellow-400 hover:bg-yellow-500 text-white w-full py-2 rounded-md font-semibold"
      >
        Update Profile
      </button>
      {msg && <p className="mt-3 text-center text-green-600">{msg}</p>}
    </div>
  );
}
