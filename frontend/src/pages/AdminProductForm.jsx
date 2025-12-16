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

  // ✅ Fetch metadata for dropdowns
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
        console.error("Error fetching metadata:", err);
      }
    })();
  }, [token]);

  // ✅ Load existing product if editing
  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await getProductById(id);
        const data = res.data;
        setForm({
          name: data.name || "",
          price: data.price || 0,
          description: data.description || "",
          photo_link: data.photo_link || "",
          category_id: data.category_id || null,
          size_id: data.size_id || null,
          coupon_id: data.coupon_id || null,
          discount_id: data.discount_id || null,
          pattern_id: data.pattern_id || null,
          color_id: data.color_id || null,
          material_id: data.material_id || null,
          pack_id: data.pack_id || null,
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ✅ Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) await updateProduct(id, form);
      else await createProduct(form);
      alert("✅ Product saved successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      alert("❌ Save failed");
    }
  };

  // ✅ Reusable dropdown renderer
  const renderSelect = (label, key, items, displayField = "name") => (
    <div>
      <label className="block text-sm font-semibold text-[#3A3A3A] mb-1">
        {label}
      </label>
      <select
        value={form[key] || ""}
        onChange={(e) =>
          setForm({ ...form, [key]: e.target.value ? Number(e.target.value) : null })
        }
        className="border border-[#E0D8C3] focus:ring-2 focus:ring-[#C9A227] p-2 rounded-lg w-full outline-none"
      >
        <option value="">Select {label}</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item[displayField]}
          </option>
        ))}
      </select>
    </div>
  );

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-[#3A3A3A]">Loading product details...</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="bg-[#F9F9F7] p-8 rounded-2xl shadow-xl border border-[#EDE6D8] max-w-5xl mx-auto">
        {/* Header */}
        <h2 className="text-3xl font-serif font-semibold text-[#3A3A3A] mb-8 border-b-4 border-[#C9A227] inline-block pb-2">
          {isEdit ? "Edit Product" : "Create New Product"}
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Top Section */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <input
                required
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-[#E0D8C3] focus:ring-2 focus:ring-[#C9A227] p-3 rounded-lg w-full outline-none"
              />
              <input
                required
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="border border-[#E0D8C3] focus:ring-2 focus:ring-[#C9A227] p-3 rounded-lg w-full outline-none"
              />
              <textarea
                placeholder="Product Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border border-[#E0D8C3] focus:ring-2 focus:ring-[#C9A227] p-3 rounded-lg w-full h-32 resize-none outline-none"
              />
              <input
                placeholder="Photo URL"
                value={form.photo_link}
                onChange={(e) => setForm({ ...form, photo_link: e.target.value })}
                className="border border-[#E0D8C3] focus:ring-2 focus:ring-[#C9A227] p-3 rounded-lg w-full outline-none"
              />
            </div>

            {/* Live Image Preview */}
            <div className="flex items-center justify-center">
              <img
                src={
                  form.photo_link ||
                  "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                }
                alt="Product preview"
                className="rounded-xl border border-[#EDE6D8] shadow-md object-contain h-64 w-64 bg-white"
              />
            </div>
          </div>

          {/* Dropdown Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderSelect("Category", "category_id", options.categories)}
            {renderSelect("Color", "color_id", options.colors)}
            {renderSelect("Size", "size_id", options.sizes)}
            {renderSelect("Pack", "pack_id", options.packs)}
            {renderSelect("Material", "material_id", options.materials)}
            {renderSelect("Pattern", "pattern_id", options.patterns)}
            {renderSelect("Discount", "discount_id", options.discounts)}
            {renderSelect("Coupon", "coupon_id", options.coupons)}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-[0_0_10px_rgba(201,162,39,0.4)] transition-all duration-300"
            >
              {isEdit ? "Update Product" : "Create Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-lg border border-[#C9A227]/60 text-[#3A3A3A] font-medium hover:bg-[#F3EBD0] transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
