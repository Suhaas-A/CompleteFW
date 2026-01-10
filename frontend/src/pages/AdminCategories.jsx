import { useEffect, useState } from "react";

/* ===================== API ===================== */
import {
  addCategory,
  addSize,
  addCoupon,
  addDiscount,
  addPattern,
  addColor,
  addMaterial,
  addPack,
} from "../api/adminApi";

import axiosInstance from "../api/axiosInstance";

/* ====================================================
   ADMIN CATEGORIES COMPONENT
==================================================== */
export default function AdminCategories() {

  /* ====================================================
     INPUT STATE
  ==================================================== */
  const [inputs, setInputs] = useState({
    category: "",
    color: "",
    size: "",
    material: "",
    packName: "",
    packNumber: "",
    pattern: "",
    discountName: "",
    discountProp: "",
    couponName: "",
    couponOffer: "",
  });

  /* ====================================================
     STATUS + DATA
  ==================================================== */
  const [msg, setMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  /* ====================================================
     INPUT HANDLER
  ==================================================== */
  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  /* ====================================================
     ADD HANDLER (GENERIC)
  ==================================================== */
  const handleAdd = async (fn, ...args) => {
    try {
      await fn(...args);
      setMsg("✅ Added Successfully");

      setTimeout(() => setMsg(""), 2500);

      setInputs((prev) =>
        Object.fromEntries(
          Object.keys(prev).map((k) => [k, ""])
        )
      );

      fetchCategories();
    } catch (err) {
      console.error(err);
      setMsg("❌ Failed to Add");
      setTimeout(() => setMsg(""), 2500);
    }
  };

  /* ====================================================
     FETCH CATEGORIES
  ==================================================== */
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const res = await axiosInstance.get("/api/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  /* ====================================================
     DELETE CATEGORY
  ==================================================== */
  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?\nThis action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(
        `/api/delete_category/${categoryId}`
      );

      setMsg("🗑️ Category deleted successfully");
      setTimeout(() => setMsg(""), 2500);

      fetchCategories();
    } catch (err) {
      console.error(err);
      alert(
        err?.response?.data?.detail ||
          "Failed to delete category"
      );
    }
  };

  /* ====================================================
     INITIAL LOAD
  ==================================================== */
  useEffect(() => {
    fetchCategories();
  }, []);

  /* ====================================================
     UI
  ==================================================== */
  return (
    <div className="min-h-screen bg-[#0F1012] text-white px-6 py-12">

      {/* ====================================================
          HEADER
      ==================================================== */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#D4AF37]">
          Manage Product Metadata
        </h1>
        <p className="text-[#A1A1AA] mt-2">
          Categories, colors, sizes, discounts & more
        </p>
      </div>

      {/* ====================================================
          GRID – ADD FORMS
      ==================================================== */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {/* CATEGORY */}
        <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">
            Add Category
          </h3>

          <input
            value={inputs.category}
            onChange={(e) =>
              handleChange("category", e.target.value)
            }
            placeholder="Eg. Jackets"
            className="w-full bg-[#0F1012] border border-[#262626]
                       rounded-xl px-4 py-3 mb-5"
          />

          <button
            onClick={() =>
              handleAdd(addCategory, inputs.category)
            }
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                       text-black py-3 rounded-full font-semibold"
          >
            Add Category
          </button>
        </div>

        {/* COLOR */}
        <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">
            Add Color
          </h3>

          <input
            value={inputs.color}
            onChange={(e) =>
              handleChange("color", e.target.value)
            }
            placeholder="Eg. Black"
            className="w-full bg-[#0F1012] border border-[#262626]
                       rounded-xl px-4 py-3 mb-5"
          />

          <button
            onClick={() =>
              handleAdd(addColor, inputs.color)
            }
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                       text-black py-3 rounded-full font-semibold"
          >
            Add Color
          </button>
        </div>

        {/* SIZE */}
        <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">
            Add Size
          </h3>

          <input
            value={inputs.size}
            onChange={(e) =>
              handleChange("size", e.target.value)
            }
            placeholder="Eg. S, M, L"
            className="w-full bg-[#0F1012] border border-[#262626]
                       rounded-xl px-4 py-3 mb-5"
          />

          <button
            onClick={() =>
              handleAdd(addSize, inputs.size)
            }
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                       text-black py-3 rounded-full font-semibold"
          >
            Add Size
          </button>
        </div>

        {/* MATERIAL */}
        <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">
            Add Material
          </h3>

          <input
            value={inputs.material}
            onChange={(e) =>
              handleChange("material", e.target.value)
            }
            placeholder="Eg. Cotton"
            className="w-full bg-[#0F1012] border border-[#262626]
                       rounded-xl px-4 py-3 mb-5"
          />

          <button
            onClick={() =>
              handleAdd(addMaterial, inputs.material)
            }
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                       text-black py-3 rounded-full font-semibold"
          >
            Add Material
          </button>
        </div>

        {/* PATTERN */}
        <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">
            Add Pattern
          </h3>

          <input
            value={inputs.pattern}
            onChange={(e) =>
              handleChange("pattern", e.target.value)
            }
            placeholder="Eg. Checked"
            className="w-full bg-[#0F1012] border border-[#262626]
                       rounded-xl px-4 py-3 mb-5"
          />

          <button
            onClick={() =>
              handleAdd(addPattern, inputs.pattern)
            }
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                       text-black py-3 rounded-full font-semibold"
          >
            Add Pattern
          </button>
        </div>
      </div>

      {/* ====================================================
          CATEGORY LIST + DELETE
      ==================================================== */}
      <div className="mt-16 bg-[#14161A] border border-[#262626] rounded-3xl p-6">
        <h3 className="text-2xl font-semibold text-[#D4AF37] mb-6">
          Existing Categories
        </h3>

        {loadingCategories ? (
          <p className="text-[#A1A1AA]">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-[#A1A1AA]">No categories found.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex justify-between items-center
                           bg-[#0F1012] border border-[#262626]
                           rounded-xl px-5 py-3"
              >
                <span>{cat.name}</span>

                <button
                  onClick={() =>
                    handleDeleteCategory(cat.id)
                  }
                  className="text-red-400 text-sm font-semibold
                             hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ====================================================
          STATUS MESSAGE
      ==================================================== */}
      {msg && (
        <div
          className={`mt-10 text-center py-3 rounded-xl text-sm font-semibold
            ${
              msg.includes("✅") || msg.includes("🗑️")
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
        >
          {msg}
        </div>
      )}
    </div>
  );
}
