// src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/productApi";
import { useCartContext } from "../contexts/CartContext";
import { useWishlistContext } from "../contexts/Wishlist";
import Loader from "../components/common/Loader";
import { getReviewsForProduct, addReview } from "../api/reviewApi";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  // ⭐ NEW: loading state for submitting review
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

  // ⭐ Load product
  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  // ⭐ Load wishlist only if needed
  useEffect(() => {
    if (token && wishlist.length === 0) {
      fetchWishlist();
    }
  }, [token]);

  // ⭐ Fetch reviews
  async function fetchReviews() {
    let res = await getReviewsForProduct(id);
    let data = await res.data;
    console.log(data);
    setReviews(data);
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  // ⭐ UPDATED: shows loading while posting review
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
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  const wishlisted = isInWishlist(product.id);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      {/* ---------- PRODUCT SECTION ---------- */}
      <div className="flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-lg p-6">
        <img
          src={
            product.photo_link && product.photo_link !== "no photo"
              ? product.photo_link
              : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
          }
          alt={product.name}
          className="w-full md:w-1/2 h-96 object-cover rounded-lg"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-yellow-500">{product.name}</h1>
          <p className="text-gray-600 mt-2">{product.description}</p>
          <p className="text-2xl font-semibold mt-3">₹{product.price}</p>

          <div className="flex gap-3 mt-5">
            {/* ⭐ FIXED: CART BUTTON (updates navbar instantly) */}
            <button
              onClick={() => handleAddToCart(product.id, 1)}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md"
            >
              Add to Cart
            </button>

            {wishlisted ? (
              <button
                onClick={() => handleRemoveFromWishlist(product.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Remove ❤️
              </button>
            ) : (
              <button
                onClick={() => handleAddToWishlist(product.id)}
                className="bg-gray-800 text-white px-4 py-2 rounded-md"
              >
                ❤️ Add to Wishlist
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------- REVIEW INPUT UI ---------- */}
      <div className="bg-white mt-10 p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Write a Review</h2>

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">Rating</label>
            <select
              className="border rounded-md p-2 w-full"
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
          </div>

          <div>
            <label className="block mb-1 font-semibold">Comment</label>
            <textarea
              className="border rounded-md p-2 w-full"
              rows="3"
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>

          {/* ⭐ Submit button with loading animation */}
          <button
            type="submit"
            disabled={reviewLoading}
            className={`px-4 py-2 rounded-md text-white ${
              reviewLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {reviewLoading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>

      {/* ---------- DISPLAY REVIEWS UI ---------- */}
      <div className="bg-white mt-10 p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

        {reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet.</p>
        )}

        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="border rounded-md p-4 bg-gray-50 shadow-sm"
            >
              <p className="font-semibold text-yellow-600">
                Rating: {rev.rating} ★
              </p>
              <p className="mt-1">{rev.comment}</p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(rev.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
