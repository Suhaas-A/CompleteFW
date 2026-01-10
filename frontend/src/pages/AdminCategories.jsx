import { useState } from "react";

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
        Object.fromEntries(
          Object.keys(prev).map((k) => [k, ""])
        )
      );
    } catch {
      setMsg("❌ Failed to Add");
      setTimeout(() => setMsg(""), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1012] text-white px-6 py-12">

      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-[#D4AF37]">
          Manage Product Metadata
        </h1>
        <p className="text-[#A1A1AA] mt-2">
          Categories, colors, sizes, discounts & more
        </p>
      </div>

      {/* GRID */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">

        {/* SIMPLE INPUT CARDS */}
        {[
          {
            title: "Add Category",
            key: "category",
            placeholder: "Eg. Jackets",
            fn: addCategory,
          },
          {
            title: "Add Color",
            key: "color",
            placeholder: "Eg. Black",
            fn: addColor,
          },
          {
            title: "Add Size",
            key: "size",
            placeholder: "Eg. S, M, L",
            fn: addSize,
          },
          {
            title: "Add Material",
            key: "material",
            placeholder: "Eg. Cotton",
            fn: addMaterial,
          },
          {
            title: "Add Pattern",
            key: "pattern",
            placeholder: "Eg. Checked",
            fn: addPattern,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 shadow-xl
                       hover:-translate-y-1 transition"
          >
            <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">
              {item.title}
            </h3>

            <input
              value={inputs[item.key]}
              onChange={(e) =>
                handleChange(item.key, e.target.value)
              }
              placeholder={item.placeholder}
              className="w-full bg-[#0F1012] border border-[#262626]
                         rounded-xl px-4 py-3 mb-5
                         focus:outline-none focus:border-[#D4AF37]"
            />

            <button
              onClick={() =>
                handleAdd(item.fn, inputs[item.key])
              }
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                         text-black py-3 rounded-full font-semibold
                         hover:brightness-110 transition"
            >
              Add
            </button>
          </div>
        ))}

        {/* PACK */}
        <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">
            Add Pack
          </h3>

          <input
            value={inputs.packName}
            onChange={(e) =>
              handleChange("packName", e.target.value)
            }
            placeholder="Pack Name"
            className="w-full bg-[#0F1012] border border-[#262626]
                       rounded-xl px-4 py-3 mb-3"
          />

          <input
            value={inputs.packNumber}
            onChange={(e) =>
              handleChange("packNumber", e.target.value)
            }
            placeholder="No. of items"
            type="number"
            className="w-full bg-[#0F1012] border border-[#262626]
                       rounded-xl px-4 py-3"
          />

          <button
            onClick={() =>
              handleAdd(
                addPack,
                inputs.packName,
                Number(inputs.packNumber)
              )
            }
            className="w-full mt-5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                       text-black py-3 rounded-full font-semibold
                       hover:brightness-110 transition"
          >
            Add Pack
          </button>
        </div>

        {/* DISCOUNT */}
        <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">
            Add Discount
          </h3>

          <input
            value={inputs.discountName}
            onChange={(e) =>
              handleChange("discountName", e.target.value)
            }
            placeholder="Discount Name"
            className="w-full bg-[#0F1012] border border-[#262626]
                       rounded-xl px-4 py-3 mb-3"
          />

          <input
            value={inputs.discountProp}
            onChange={(e) =>
              handleChange("discountProp", e.target.value)
            }
            placeholder="Discount %"
            className="w-full bg-[#0F1012] border border-[#262626]
                       rounded-xl px-4 py-3"
          />

          <button
            onClick={() =>
              handleAdd(
                addDiscount,
                inputs.discountName,
                inputs.discountProp
              )
            }
            className="w-full mt-5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                       text-black py-3 rounded-full font-semibold
                       hover:brightness-110 transition"
          >
            Add Discount
          </button>
        </div>

        {/* COUPON */}
        <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">
            Add Coupon
          </h3>

          <input
            value={inputs.couponName}
            onChange={(e) =>
              handleChange("couponName", e.target.value)
            }
            placeholder="Coupon Code"
            className="w-full bg-[#0F1012] border border-[#262626]
                       rounded-xl px-4 py-3 mb-3"
          />

          <input
            value={inputs.couponOffer}
            onChange={(e) =>
              handleChange("couponOffer", e.target.value)
            }
            placeholder="Offer %"
            className="w-full bg-[#0F1012] border border-[#262626]
                       rounded-xl px-4 py-3"
          />

          <button
            onClick={() =>
              handleAdd(
                addCoupon,
                inputs.couponName,
                inputs.couponOffer
              )
            }
            className="w-full mt-5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                       text-black py-3 rounded-full font-semibold
                       hover:brightness-110 transition"
          >
            Add Coupon
          </button>
        </div>
      </div>

      {/* STATUS MESSAGE */}
      {msg && (
        <div
          className={`mt-10 text-center py-3 rounded-xl text-sm font-semibold
            ${
              msg.includes("✅")
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
