import { useEffect, useState } from "react";
import AdminLayout from "../components/admin/AdminLayout";
import { getAllProducts, deleteProduct } from "../api/productApi";
import { Link } from "react-router-dom";
import Loader from "../components/common/Loader";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getAllProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      await load();
      alert("Deleted successfully!");
    } catch {
      alert("Delete failed.");
    }
  };

  if (loading) return <Loader />;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F9F9F7] px-4 sm:px-10 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
          <h2 className="text-3xl font-serif font-semibold text-[#3A3A3A] border-b-4 border-[#C9A227] pb-1">
            Products
          </h2>
          <Link
            to="/admin/products/new"
            className="w-full sm:w-auto text-center bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200 font-medium"
          >
            + New Product
          </Link>
        </div>

        {/* Product Grid — wider & responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-10 justify-center">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white p-6 rounded-2xl shadow-md border border-[#EDE6D8] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full max-w-[600px] mx-auto"
            >
              {/* ✅ Image section (fixed image rendering) */}
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl bg-[#FAF9F5] flex items-center justify-center">
                <img
                  src={
                    p.photo_link && p.photo_link.trim() !== ""
                      ? p.photo_link
                      : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                  }
                  alt={p.name || "Product Image"}
                  onError={(e) => {
                    e.target.src =
                      "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                  }}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-[#2E2E2E] truncate">
                    {p.name}
                  </h3>
                  <p className="text-[#8C6B1F] font-medium text-base mt-1">
                    ₹{p.price?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#666] mt-2 line-clamp-2 leading-snug">
                {p.description || "No description available."}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 mt-5">
                <Link
                  to={`/admin/products/${p.id}/edit`}
                  className="flex-1 text-center bg-[#FFF9E3] border border-[#C9A227] text-[#3A3A3A] font-medium py-2 rounded-md hover:bg-[#F5E3A4] transition-all duration-200"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex-1 text-center bg-[#F8D7DA] text-[#8C1C13] font-medium py-2 rounded-md hover:bg-[#F5B7B1] transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Products */}
        {products.length === 0 && (
          <div className="text-center text-gray-500 text-lg mt-10">
            No products found.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
