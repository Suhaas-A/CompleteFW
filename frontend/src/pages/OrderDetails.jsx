import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderDetails } from "../api/orderApi";
import { useAuthContext } from "../contexts/AuthContext";

export default function OrderDetails() {
  const { id } = useParams();
  const { token } = useAuthContext();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await getOrderDetails(id, token);
        setOrder(res.data.order);
        setProducts(res.data.products);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 text-lg">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-700">
        <p className="mb-3 text-lg">Order not found.</p>
        <Link
          to="/orders"
          className="bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white px-6 py-2 rounded-full hover:scale-105 transition-all"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  const total = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <div className="bg-[#FFFDF5] min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-bold text-[#8C6B1F]">
            Order #{order.id}
          </h2>
          <p className="text-gray-600 mt-2">Thank you for shopping with Eleganza ✨</p>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-[#E8D9A6]/60 rounded-2xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">Order Summary</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-gray-700 text-sm">
            <p>
              <span className="font-semibold text-[#C9A227]">Status:</span>{" "}
              {order.status || "Pending"}
            </p>
            <p>
              <span className="font-semibold text-[#C9A227]">Delivery Address:</span>{" "}
              {order.delivery_address || "Not Provided"}
            </p>
            <p>
              <span className="font-semibold text-[#C9A227]">Ordered On:</span>{" "}
              {new Date(order.ordered_at || order.created_at).toLocaleString()}
            </p>
            {order.delivery_link && (
              <p>
                <span className="font-semibold text-[#C9A227]">Tracking:</span>{" "}
                <a
                  href={order.delivery_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8C6B1F] underline hover:text-[#C9A227]"
                >
                  View Tracking
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white border border-[#E8D9A6]/60 rounded-2xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-[#3A3A3A] mb-5">Ordered Products</h3>
          <div className="divide-y divide-[#F3EBD0]">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex flex-col sm:flex-row items-center justify-between py-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={
                      p.photo_link && p.photo_link !== "no photo"
                        ? p.photo_link
                        : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                    }
                    alt={p.name}
                    className="w-24 h-24 object-cover rounded-lg border border-[#E8D9A6]"
                  />
                  <div>
                    <p className="font-semibold text-[#2E2E2E]">{p.name}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
                    <p className="text-sm text-gray-600 mt-1">Qty: {p.quantity}</p>
                  </div>
                </div>

                <div className="text-right mt-3 sm:mt-0">
                  <p className="font-semibold text-[#8C6B1F] text-lg">₹{p.price}</p>
                  <p className="text-gray-500 text-sm">
                    Subtotal: ₹{(p.price * p.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-right mt-6 border-t pt-4">
            <p className="text-xl font-bold text-[#C9A227]">
              Total Amount: ₹{total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">
          <Link
            to="/orders"
            className="inline-block bg-gradient-to-r from-[#C9A227] to-[#8C6B1F] text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all"
          >
            ← Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
