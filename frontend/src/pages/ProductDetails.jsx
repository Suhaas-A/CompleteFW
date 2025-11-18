// src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/productApi";
import { useCartContext } from "../contexts/CartContext";
import { useWishlistContext } from "../contexts/Wishlist";
import Loader from "../components/common/Loader";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const { handleAddToCart } = useCartContext();
  const { handleAddToWishlist, handleRemoveFromWishlist, isInWishlist } =
    useWishlistContext();

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  const wishlisted = isInWishlist(product.id);

  return (
    <div className="max-w-5xl mx-auto mt-10 flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-lg p-6">
      <img
        src={product.photo_link}
        alt={product.name}
        className="w-full md:w-1/2 h-96 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-yellow-500">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.description}</p>
        <p className="text-2xl font-semibold mt-3">₹{product.price}</p>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => handleAddToCart(product.id)}
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
  );
}
