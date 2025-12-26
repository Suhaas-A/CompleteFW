import { useEffect, useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import { createProduct, getProductById, updateProduct } from "../api/productApi";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const blank = {
  name: "",
  price: 0,
  description: "",
  photo_link: "",
  category_id: null,
  size_id: null,
  coupon_id: null,
  discount_id: null,
  pattern_id: null,
  color_id: null,
  material_id: null,
  pack_id: null,
};

export default function AdminProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(!!isEdit);
  const [options, setOptions] = useState({
    categories: [],
    colors: [],
    sizes: [],
    packs: [],
    materials: [],
    patterns: [],
    discounts: [],
    coupons: [],
  });

  const navigate = useNavigate();
  const API_URL = "http://127.0.0.1:8000/api";
  const token = localStorage.getItem("access_token");

  /* ---------------- FETCH METADATA ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const endpoints = [
          "categories",
          "colors",
          "sizes",
          "packs",
          "materials",
          "patterns",
          "discounts",
          "coupons",
        ];

        const responses = await Promise.all(
          endpoints.map((ep) =>
            axios.get(`${API_URL}/${ep}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        );

        setOptions({
          categories: responses[0].data,
          colors: responses[1].data,
          sizes: responses[2].data,
          packs: responses[3].data,
          materials: responses[4].data,
          patterns: responses[5].data,
          discounts: responses[6].data,
          coupons: responses[7].data,
        });
      } catch (err) {
        console.error("Metadata error", err);
      }
    })();
  }, [token]);

  /* ---------------- LOAD PRODUCT ---------------- */
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await getProductById(id);
        const d = res.data;
        setForm({
          name: d.name || "",
          price: d.price || 0,
          description: d.description || "",
          photo_link: d.photo_link || "",
          category_id: d.category_id || null,
          size_id: d.size_id || null,
          coupon_id: d.coupon_id || null,
          discount_id: d.discount_id || null,
          pattern_id: d.pattern_id || null,
          color_id: d.color_id || null,
          material_id: d.material_id || null,
          pack_id: d.pack_id || null,
        });
      } catch (err) {
        alert("Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) await updateProduct(id, form);
      else await createProduct(form);
      alert("✅ Product saved successfully!");
      navigate("/admin/products");
    } catch {
      alert("❌ Save failed");
    }
  };

  const renderSelect = (label, key, items) => (
    <div>
      <label className="text-xs uppercase tracking-wide text-[#D4AF37]">
        {label}
      </label>
      <select
        value={form[key] || ""}
        onChange={(e) =>
          setForm({ ...form, [key]: e.target.value ? Number(e.target.value) : null })
        }
        className="mt-2 w-full rounded-xl bg-[#0F1012] border border-[#262626] px-4 py-2 text-white"
      >
        <option value="">Select {label}</option>
        {items.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name}
          </option>
        ))}
      </select>
    </div>
  );

  if (loading)
    return (
      <AdminLayout>
        <p className="text-center py-20 text-[#A1A1AA]">Loading product…</p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="bg-[#0F1012] border border-[#262626] p-10 shadow-2xl">
        <h1 className="text-3xl font-bold text-[#D4AF37] mb-10">
          {isEdit ? "Edit Product" : "Create Product"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* TOP */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <input
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="input"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={5}
                className="input resize-none"
              />
              <input
                placeholder="Image URL"
                value={form.photo_link}
                onChange={(e) => setForm({ ...form, photo_link: e.target.value })}
                className="input"
              />
            </div>

            {/* PREVIEW */}
            <div className="flex items-center justify-center">
              <img
                src={
                  form.photo_link ||
                  "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                }
                alt="preview"
                className="w-72 h-72 object-cover rounded-2xl border border-[#262626]"
              />
            </div>
          </div>

          {/* DROPDOWNS */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderSelect("Category", "category_id", options.categories)}
            {renderSelect("Color", "color_id", options.colors)}
            {renderSelect("Size", "size_id", options.sizes)}
            {renderSelect("Pack", "pack_id", options.packs)}
            {renderSelect("Material", "material_id", options.materials)}
            {renderSelect("Pattern", "pattern_id", options.patterns)}
            {renderSelect("Discount", "discount_id", options.discounts)}
            {renderSelect("Coupon", "coupon_id", options.coupons)}
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <button className="bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black px-8 py-3 rounded-full font-semibold">
              {isEdit ? "Update Product" : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 rounded-full border border-[#262626] text-[#A1A1AA]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 14px;
          background: #14161A;
          border: 1px solid #262626;
          color: white;
          outline: none;
        }
        .input::placeholder {
          color: #71717A;
        }
      `}</style>
    </AdminLayout>
  );
}
