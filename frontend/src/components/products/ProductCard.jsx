// src/components/products/ProductCard.jsx
import { Link } from "react-router-dom";
import { useCartContext } from "../../contexts/CartContext";
import { formatPrice } from "../../utils/helpers";

export default function ProductCard({ product }) {
  const { handleAddToCart } = useCartContext();

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-xl transition p-3 flex flex-col">
      <Link to={`/product/${product.id}`}>
        <img
          src={product.photo_link}
          alt={product.name}
          className="rounded-lg w-full h-48 object-cover"
        />
      </Link>
      <h3 className="mt-3 font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-600">{formatPrice(product.price)}</p>
      <button
        onClick={() => handleAddToCart(product.id)}
        className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 mt-3 rounded-lg"
      >
        Add to Cart
      </button>
    </div>
  );
}
