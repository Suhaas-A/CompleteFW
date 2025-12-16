import { useEffect, useState } from "react";
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
    <div className="min-h-screen bg-[#0F1012] text-white px-6 py-12">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <h2 className="text-4xl font-bold text-[#D4AF37]">
            Products
          </h2>
          <p className="text-sm text-[#A1A1AA] mt-1">
            Manage all products in your store
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center
                     bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                     text-black px-7 py-3 rounded-full font-semibold
                     hover:brightness-110 transition"
        >
          + Add Product
        </Link>
      </div>

      {/* PRODUCT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => (
          <div
            key={p.id}
            className="
              bg-[#14161A] border border-[#262626]
              rounded-3xl overflow-hidden
              shadow-sm hover:shadow-2xl
              hover:-translate-y-1
              transition-all duration-300
            "
          >
            {/* IMAGE */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={
                  p.photo_link && p.photo_link.trim() !== ""
                    ? p.photo_link
                    : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                }
                alt={p.name}
                onError={(e) => {
                  e.target.src =
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
                }}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* CONTENT */}
            <div className="p-5 flex flex-col gap-4">
              <div>
                <h3 className="font-semibold text-lg truncate">
                  {p.name}
                </h3>
                <p className="text-[#D4AF37] font-bold mt-1">
                  ₹{p.price?.toLocaleString() || "N/A"}
                </p>
              </div>

              <p className="text-sm text-[#A1A1AA] line-clamp-2">
                {p.description || "No description available."}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-3 pt-2">
                <Link
                  to={`/admin/products/${p.id}/edit`}
                  className="
                    flex-1 text-center
                    border border-[#D4AF37]
                    text-[#D4AF37]
                    py-2 rounded-full font-medium
                    hover:bg-[#D4AF37]
                    hover:text-black
                    transition
                  "
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="
                    flex-1 text-center
                    bg-[#2A1414]
                    text-red-400
                    py-2 rounded-full font-medium
                    hover:bg-red-600
                    hover:text-white
                    transition
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 && (
        <div className="text-center text-[#A1A1AA] text-lg mt-20">
          No products found.
        </div>
      )}
    </div>
  );
}
