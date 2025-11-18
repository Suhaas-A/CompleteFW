import { useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
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

export default function AdminCategories() {
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

  const [msg, setMsg] = useState("");

  const handleChange = (key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleAdd = async (fn, ...args) => {
    try {
      await fn(...args);
      setMsg("✅ Added Successfully");
      setTimeout(() => setMsg(""), 2500);
      setInputs((prev) =>
        Object.fromEntries(Object.keys(prev).map((k) => [k, ""]))
      );
    } catch {
      setMsg("❌ Failed to Add");
      setTimeout(() => setMsg(""), 2500);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-[#F9F9F7] p-8 rounded-2xl shadow-xl border border-[#EDE6D8]">
        {/* Header */}
        <h2 className="text-3xl font-serif font-semibold text-[#3A3A3A] mb-8 border-b-4 border-[#C9A227] inline-block pb-2">
          Manage Product Metadata
        </h2>

        {/* Input Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Helper function: card */}
          {[
            {
              title: "Add Category",
              placeholder: "Category name",
              key: "category",
              action: () => handleAdd(addCategory, inputs.category),
            },
            {
              title: "Add Color",
              placeholder: "Color name",
              key: "color",
              action: () => handleAdd(addColor, inputs.color),
            },
            {
              title: "Add Size",
              placeholder: "Size (e.g. S, M, L)",
              key: "size",
              action: () => handleAdd(addSize, inputs.size),
            },
            {
              title: "Add Material",
              placeholder: "Material (e.g. Cotton, Silk)",
              key: "material",
              action: () => handleAdd(addMaterial, inputs.material),
            },
            {
              title: "Add Pattern",
              placeholder: "Pattern (e.g. Checked, Plain)",
              key: "pattern",
              action: () => handleAdd(addPattern, inputs.pattern),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl border border-[#EDE6D8] transition-all duration-300 hover:-translate-y-1"
            >
              <h4 className="font-semibold text-[#3A3A3A] mb-3">
                {item.title}
              </h4>
              <input
                value={inputs[item.key]}
                onChange={(e) => handleChange(item.key, e.target.value)}
                placeholder={item.placeholder}
                className="border border-[#E0D8C3] focus:ring-2 focus:ring-[#C9A227] p-2 rounded-lg w-full outline-none"
              />
              <button
                onClick={item.action}
                className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-4 py-2 mt-4 w-full rounded-lg font-semibold hover:shadow-[0_0_10px_rgba(201,162,39,0.4)] transition-all duration-300"
              >
                Add
              </button>
            </div>
          ))}

          {/* Pack */}
          <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl border border-[#EDE6D8] transition-all duration-300 hover:-translate-y-1">
            <h4 className="font-semibold text-[#3A3A3A] mb-3">Add Pack</h4>
            <input
              value={inputs.packName}
              onChange={(e) => handleChange("packName", e.target.value)}
              placeholder="Pack Name (e.g. Combo Set)"
              className="border border-[#E0D8C3] focus:ring-2 focus:ring-[#C9A227] p-2 rounded-lg w-full mb-2 outline-none"
            />
            <input
              value={inputs.packNumber}
              onChange={(e) => handleChange("packNumber", e.target.value)}
              placeholder="Number of items"
              type="number"
              className="border border-[#E0D8C3] focus:ring-2 focus:ring-[#C9A227] p-2 rounded-lg w-full outline-none"
            />
            <button
              onClick={() =>
                handleAdd(addPack, inputs.packName, Number(inputs.packNumber))
              }
              className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-4 py-2 mt-4 w-full rounded-lg font-semibold hover:shadow-[0_0_10px_rgba(201,162,39,0.4)] transition-all duration-300"
            >
              Add
            </button>
          </div>

          {/* Discount */}
          <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl border border-[#EDE6D8] transition-all duration-300 hover:-translate-y-1">
            <h4 className="font-semibold text-[#3A3A3A] mb-3">Add Discount</h4>
            <input
              value={inputs.discountName}
              onChange={(e) => handleChange("discountName", e.target.value)}
              placeholder="Discount name"
              className="border border-[#E0D8C3] focus:ring-2 focus:ring-[#C9A227] p-2 rounded-lg w-full mb-2 outline-none"
            />
            <input
              value={inputs.discountProp}
              onChange={(e) => handleChange("discountProp", e.target.value)}
              placeholder="Discount % or Value"
              className="border border-[#E0D8C3] focus:ring-2 focus:ring-[#C9A227] p-2 rounded-lg w-full outline-none"
            />
            <button
              onClick={() =>
                handleAdd(addDiscount, inputs.discountName, inputs.discountProp)
              }
              className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-4 py-2 mt-4 w-full rounded-lg font-semibold hover:shadow-[0_0_10px_rgba(201,162,39,0.4)] transition-all duration-300"
            >
              Add
            </button>
          </div>

          {/* Coupon */}
          <div className="p-6 rounded-xl bg-white shadow-md hover:shadow-xl border border-[#EDE6D8] transition-all duration-300 hover:-translate-y-1">
            <h4 className="font-semibold text-[#3A3A3A] mb-3">Add Coupon</h4>
            <input
              value={inputs.couponName}
              onChange={(e) => handleChange("couponName", e.target.value)}
              placeholder="Coupon code"
              className="border border-[#E0D8C3] focus:ring-2 focus:ring-[#C9A227] p-2 rounded-lg w-full mb-2 outline-none"
            />
            <input
              value={inputs.couponOffer}
              onChange={(e) => handleChange("couponOffer", e.target.value)}
              placeholder="Offer value (%)"
              className="border border-[#E0D8C3] focus:ring-2 focus:ring-[#C9A227] p-2 rounded-lg w-full outline-none"
            />
            <button
              onClick={() =>
                handleAdd(addCoupon, inputs.couponName, inputs.couponOffer)
              }
              className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-4 py-2 mt-4 w-full rounded-lg font-semibold hover:shadow-[0_0_10px_rgba(201,162,39,0.4)] transition-all duration-300"
            >
              Add
            </button>
          </div>
        </div>

        {/* Message */}
        {msg && (
          <div
            className={`text-center text-sm font-medium mt-6 ${
              msg.includes("✅")
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            } py-2 rounded-md`}
          >
            {msg}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
