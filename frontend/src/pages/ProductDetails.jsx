// src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/productApi";
import { useCartContext } from "../contexts/CartContext";
import { useWishlistContext } from "../contexts/Wishlist";
import { useTheme } from "../contexts/ThemeContext";
import Loader from "../components/common/Loader";
import { getReviewsForProduct, addReview } from "../api/reviewApi";
import axiosInstance from "../api/axiosInstance";

export default function ProductDetails() {
  const { id } = useParams();
  const { dark } = useTheme();

  const [product, setProduct] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  const { handleAddToCart } = useCartContext();
  const {
    handleAddToWishlist,
    handleRemoveFromWishlist,
    isInWishlist,
    fetchWishlist,
    wishlist,
  } = useWishlistContext();

  const token =
    sessionStorage.getItem("access_token") ||
    localStorage.getItem("access_token");

  // ─────────────────────────────────────────────
  // LOAD PRODUCT + SIZES
  // ─────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [productRes, sizeRes] = await Promise.all([
          getProductById(id),
          axiosInstance.get("/sizes"),
        ]);

        setProduct(productRes.data);
        setSizes(sizeRes.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ─────────────────────────────────────────────
  // LOAD WISHLIST
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (token && wishlist.length === 0) {
      fetchWishlist();
    }
  }, [token]);

  // ─────────────────────────────────────────────
  // LOAD REVIEWS
  // ─────────────────────────────────────────────
  async function fetchReviews() {
    const res = await getReviewsForProduct(id);
    setReviews(res.data || []);
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  // ─────────────────────────────────────────────
  // SUBMIT REVIEW
  // ─────────────────────────────────────────────
  async function handleSubmitReview(e) {
    e.preventDefault();
    setReviewLoading(true);

    try {
      await addReview(id, rating, comment);
      setRating("");
      setComment("");
      fetchReviews();
    } catch (err) {
      console.error(err);
    }

    setReviewLoading(false);
  }

  if (loading) return <Loader />;
  if (!product)
    return <p className="text-center mt-10">Product not found.</p>;

  const wishlisted = isInWishlist(product.id);

  const sizeName =
    sizes.find((s) => s.id === product.size_id)?.name || "N/A";

  return (
    <div
      className={`min-h-screen px-6 py-12 ${
        dark ? "bg-[#0F1012] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-14">

        {/* ───────── PRODUCT SECTION ───────── */}
        <div
          className={`grid md:grid-cols-2 gap-10 rounded-3xl p-8 border shadow-xl ${
            dark
              ? "bg-[#14161A] border-[#262626]"
              : "bg-white border-gray-200"
          }`}
        >
          <img
            src={
              product.photo_link && product.photo_link !== "no photo"
                ? product.photo_link
                : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
            }
            alt={product.name}
            className="w-full h-[420px] object-cover rounded-2xl"
          />

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#D4AF37]">
                {product.name}
              </h1>

              <p
                className={`mt-4 leading-relaxed ${
                  dark ? "text-[#A1A1AA]" : "text-gray-600"
                }`}
              >
                {product.description}
              </p>

              <p className="text-3xl font-semibold mt-6">
                ₹{product.price}
              </p>

              {/* ✅ SIZE DISPLAY */}
              <p
                className={`mt-2 text-sm ${
                  dark ? "text-[#A1A1AA]" : "text-gray-600"
                }`}
              >
                <span className="font-semibold text-[#D4AF37]">
                  Size:
                </span>{" "}
                {sizeName}
              </p>

              <p
                className={`text-xs mt-1 ${
                  dark ? "text-[#6B6B6B]" : "text-gray-500"
                }`}
              >
                Inclusive of all taxes · Free shipping
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => handleAddToCart(product.id, 1)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black font-semibold hover:brightness-110 transition"
              >
                Add to Cart
              </button>

              {wishlisted ? (
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="px-6 py-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Remove ❤️
                </button>
              ) : (
                <button
                  onClick={() => handleAddToWishlist(product.id)}
                  className={`px-6 py-3 rounded-full border transition ${
                    dark
                      ? "border-[#262626] text-[#A1A1AA] hover:bg-[#1F2126]"
                      : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  ❤️ Add to Wishlist
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ───────── WRITE REVIEW ───────── */}
        <div
          className={`rounded-3xl p-8 border shadow-xl ${
            dark
              ? "bg-[#14161A] border-[#262626]"
              : "bg-white border-gray-200"
          }`}
        >
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-6">
            Write a Review
          </h2>

          <form onSubmit={handleSubmitReview} className="space-y-5">
            <select
              className={`w-full rounded-lg px-4 py-3 border outline-none ${
                dark
                  ? "bg-[#0F1012] border-[#262626] text-white"
                  : "bg-gray-100 border-gray-300 text-gray-900"
              }`}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} ★
                </option>
              ))}
            </select>

            <textarea
              rows="4"
              className={`w-full rounded-lg px-4 py-3 border outline-none ${
                dark
                  ? "bg-[#0F1012] border-[#262626] text-white"
                  : "bg-gray-100 border-gray-300 text-gray-900"
              }`}
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={reviewLoading}
              className={`px-8 py-3 rounded-full font-semibold text-black transition ${
                reviewLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#D4AF37] to-[#B8962E] hover:brightness-110"
              }`}
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
