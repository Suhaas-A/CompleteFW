// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useAuthContext } from "../contexts/AuthContext";
// import { updateProfile } from "../api/authApi";  // You will add this API later

export default function Profile() {
  const { user, loadingAuth } = useAuthContext();

  const [form, setForm] = useState({
    username: "",
    email: "",
    address: "",
    phone_number: "",
  });

  const [msg, setMsg] = useState("");

  // ⭐ Load form only after user is ready
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

  // ⭐ Fix redirect issue
  if (loadingAuth) {
    return <p className="text-center mt-10">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10 text-red-600">
      You must login to view your profile.
    </p>;
  }

  const handleUpdate = async () => {
    try {
      // ❌ WRONG: await register(form)
      // ✔ Replace with proper update endpoint when ready:

      // const res = await updateProfile(form);

      console.log("Send update request here:", form);
      setMsg("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      setMsg("Update failed.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-yellow-500">My Profile</h2>

      {["username", "email", "address", "phone_number"].map((field) => (
        <input
          key={field}
          value={form[field]}
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
