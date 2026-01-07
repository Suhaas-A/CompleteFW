import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/productApi";
import { useCartContext } from "../contexts/CartContext";
import { useWishlistContext } from "../contexts/Wishlist";
import { useTheme } from "../contexts/ThemeContext";
import Loader from "../components/common/Loader";
import { getReviewsForProduct, addReview } from "../api/reviewApi";
import axiosInstance from "../api/axiosInstance";

/* ───────── DATE FORMATTER ───────── */
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

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

  /* 🔥 DISCOUNT STATE */
  const [finalPrice, setFinalPrice] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(null);

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

  /* ───────── LOAD PRODUCT + SIZES + DISCOUNT ───────── */
  useEffect(() => {
    (async () => {
      try {
        const [productRes, sizeRes, discountRes] = await Promise.all([
          getProductById(id),
          axiosInstance.get("/sizes"),
          axiosInstance.get("/discounts"), // ✅ existing backend route
        ]);

        const prod = productRes.data;
        setProduct(prod);
        setSizes(sizeRes.data || []);

        // 🔥 APPLY DISCOUNT USING discount_id (NO backend change)
        if (prod.discount_id) {
          const discount = discountRes.data.find(
            (d) => d.id === prod.discount_id
          );

          if (discount) {
            const percent = discount.prop;
            const discounted =
              prod.price - (percent / 100) * prod.price;

            setDiscountPercent(percent);
            setFinalPrice(Math.round(discounted));
          } else {
            setFinalPrice(prod.price);
          }
        } else {
          setFinalPrice(prod.price);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ───────── LOAD WISHLIST ───────── */
  useEffect(() => {
    if (token && wishlist.length === 0) fetchWishlist();
  }, [token]);

  /* ───────── LOAD REVIEWS ───────── */
  const fetchReviews = async () => {
    const res = await getReviewsForProduct(id);
    setReviews(res.data || []);
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  /* ───────── SUBMIT REVIEW ───────── */
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewLoading(true);
    try {
      await addReview(id, rating, comment);
      setRating("");
      setComment("");
      fetchReviews();
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!product)
    return <p className="text-center mt-10">Product not found.</p>;

  const wishlisted = isInWishlist(product.id);
  const sizeName =
    sizes.find((s) => s.id === product.size_id)?.name || "N/A";

  return (
    <div
      className={`min-h-screen px-6 py-12 font-sans ${
        dark ? "bg-[#0F1012] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-12">

        {/* ───────── PRODUCT SECTION ───────── */}
        <div
          className={`grid md:grid-cols-2 gap-10 rounded-3xl p-8 border shadow-lg ${
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

              {/* 🔥 PRICE DISPLAY */}
              <div className="mt-6">
                {discountPercent ? (
                  <>
                    <p className="text-sm line-through text-gray-400">
                      ₹{product.price}
                    </p>
                    <p className="text-3xl font-semibold text-green-600">
                      ₹{finalPrice}
                    </p>
                    <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                      {discountPercent}% OFF
                    </span>
                  </>
                ) : (
                  <p className="text-3xl font-semibold">
                    ₹{finalPrice}
                  </p>
                )}
              </div>

              <p className="mt-3 text-sm">
                <span className="font-semibold text-[#D4AF37]">Size:</span>{" "}
                {sizeName}
              </p>

              <p className="text-xs mt-1 text-gray-500">
                Inclusive of all taxes · Free shipping
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => handleAddToCart(product.id, 1)}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black font-semibold"
              >
                Add to Cart
              </button>

              {wishlisted ? (
                <button
                  onClick={() => handleRemoveFromWishlist(product.id)}
                  className="px-6 py-3 rounded-full bg-red-600 text-white"
                >
                  Remove ❤️
                </button>
              ) : (
                <button
                  onClick={() => handleAddToWishlist(product.id)}
                  className={`px-6 py-3 rounded-full border ${
                    dark
                      ? "border-[#262626]"
                      : "border-gray-300 text-gray-700"
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
          className={`rounded-2xl p-6 border shadow ${
            dark
              ? "bg-[#14161A] border-[#262626]"
              : "bg-white border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold text-[#D4AF37] mb-4">
            Write a Review
          </h2>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
              className={`w-full rounded-lg px-4 py-2 border ${
                dark
                  ? "bg-[#0F1012] border-[#262626]"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r} ★
                </option>
              ))}
            </select>

            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review..."
              required
              className={`w-full rounded-lg px-4 py-2 border ${
                dark
                  ? "bg-[#0F1012] border-[#262626]"
                  : "bg-gray-100 border-gray-300"
              }`}
            />

            <button
              type="submit"
              disabled={reviewLoading}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-black font-semibold"
            >
              {reviewLoading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>

        {/* ───────── REVIEWS LIST ───────── */}
        <div
          className={`rounded-2xl p-6 border shadow ${
            dark
              ? "bg-[#14161A] border-[#262626]"
              : "bg-white border-gray-200"
          }`}
        >
          <h2 className="text-2xl font-bold text-[#D4AF37] mb-5">
            Customer Reviews
          </h2>

          {reviews.length === 0 ? (
            <p className="text-sm text-gray-500">
              No reviews yet. Be the first to review.
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className={`rounded-xl border p-4 ${
                    dark
                      ? "bg-[#0F1012] border-[#262626]"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {r.username}
                      </p>
                      <p className="text-yellow-400 text-xs leading-none">
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </p>
                    </div>

                    <p className="text-xs text-gray-400">
                      {formatDate(r.created_at)}
                    </p>
                  </div>

                  <p
                    className={`mt-2 text-sm leading-relaxed ${
                      dark ? "text-[#D1D5DB]" : "text-gray-700"
                    }`}
                  >
                    {r.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
