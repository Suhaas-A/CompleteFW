import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===================== CONTEXTS ===================== */
import { useCartContext } from "../contexts/CartContext";
import { useTheme } from "../contexts/ThemeContext";

/* ===================== API ===================== */
import axiosInstance from "../api/axiosInstance";
import { createOrder } from "../api/orderApi";
import { getAllProducts } from "../api/productApi";

/* ====================================================
   CHECKOUT COMPONENT
==================================================== */
export default function Checkout() {
  /* ===================== ROUTER ===================== */
  const navigate = useNavigate();

  /* ===================== THEME ===================== */
  const { dark } = useTheme();

  /* ===================== CART ===================== */
  const {
    cartItems,
    clearCart,
  } = useCartContext();

  /* ===================== ADDRESS STATE ===================== */
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");

  /* ===================== PAYMENT ===================== */
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  /* ===================== DATA ===================== */
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);

  /* ===================== COUPONS ===================== */
  const [couponList, setCouponList] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState("");

  /* ====================================================
     FETCH PRODUCTS + DISCOUNTS + COUPONS
     (SAME LOGIC AS CART — GUARANTEED MATCH)
  ==================================================== */
  useEffect(() => {
    getAllProducts()
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]));

    axiosInstance
      .get("/discounts")
      .then((res) => setDiscounts(res.data || []))
      .catch(() => setDiscounts([]));

    axiosInstance
      .get("/coupons")
      .then((res) => setCouponList(res.data || []))
      .catch(() => setCouponList([]));
  }, []);

  /* ====================================================
     ENRICH CART ITEMS WITH FULL PRODUCT DATA
  ==================================================== */
  const enrichedCart = useMemo(() => {
    return cartItems.map((item) => {
      const full = products.find((p) => p.id === item.id);
      return full ? { ...item, ...full } : item;
    });
  }, [cartItems, products]);

  /* ====================================================
     PRODUCT DISCOUNT CALCULATION
  ==================================================== */
  const getItemFinalPrice = (item) => {
    if (!item.discount_id) return item.price;

    const discount = discounts.find(
      (d) => d.id === item.discount_id
    );

    if (!discount) return item.price;

    const discounted =
      item.price - (discount.prop / 100) * item.price;

    return Math.round(discounted);
  };

  /* ====================================================
     CART TOTAL (DISCOUNT-AWARE)
  ==================================================== */
  const cartSubtotal = useMemo(() => {
    return enrichedCart.reduce((sum, item) => {
      return sum + getItemFinalPrice(item) * item.quantity;
    }, 0);
  }, [enrichedCart, discounts]);

  /* ====================================================
     APPLY COUPON
  ==================================================== */
  const applyCoupon = () => {
    if (!couponCode.trim()) return;

    const found = couponList.find(
      (c) => c.name.toLowerCase() === couponCode.toLowerCase()
    );

    if (!found) {
      setCouponError("Invalid coupon code");
      setCouponApplied(null);
      return;
    }

    setCouponError("");
    setCouponApplied(found);
  };

  /* ====================================================
     FINAL TOTAL (PRODUCT DISCOUNT + COUPON)
  ==================================================== */
  const couponPercent = couponApplied?.offer || 0;
  const couponDiscount = Math.round(
    (cartSubtotal * couponPercent) / 100
  );
  const finalAmount = cartSubtotal - couponDiscount;

  /* ====================================================
     PLACE ORDER
  ==================================================== */
  const handlePlaceOrder = async () => {
    if (!phone || !address1) {
      alert("Phone number and address are required");
      return;
    }

    if (enrichedCart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setLoading(true);

    const fullAddress = [
      `Phone: ${phone}`,
      address1,
      address2,
      address3,
      couponApplied ? `Coupon: ${couponApplied.name}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const productsPayload = enrichedCart.map((item) => [
      item.id,
      item.quantity,
    ]);

    try {
      /* CREATE ORDER */
      const orderRes = await createOrder({
        deliver_address: fullAddress,
        products: productsPayload,
        delivery_link:
          paymentMethod === "online" ? "pending" : "cod",
        status: "Pending",
      });

      const orderId = orderRes.data.order_id;
;

      /* COD */
      if (paymentMethod === "cod") {
        clearCart();
        navigate("/orders");
        return;
      }

      /* ONLINE PAYMENT */
      const paymentRes = await axiosInstance.post(
        "/payments/create",
        {
          order_id: orderId,
          amount: finalAmount,
        }
      );

      const { payment_session_id } = paymentRes.data;

      if (!window.Cashfree) {
        alert("Payment SDK not loaded");
        setLoading(false);
        return;
      }

      const cashfree = new window.Cashfree();
      cashfree.checkout({
        paymentSessionId: payment_session_id,
        redirectTarget: "_self",
      });

    } catch (err) {
      console.error(err);
      alert("Checkout failed");
      setLoading(false);
    }
  };

  /* ====================================================
     UI
  ==================================================== */
  return (
    <div
      className={`min-h-screen px-6 py-12 ${
        dark ? "bg-[#0F1012] text-white" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-[#D4AF37] mb-10 text-center">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            {/* ADDRESS */}
            <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 space-y-4">
              <h2 className="text-xl font-semibold">
                Shipping Details
              </h2>

              <input
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0F1012] border border-[#262626]"
              />
              <input
                placeholder="Address Line 1"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0F1012] border border-[#262626]"
              />
              <input
                placeholder="Address Line 2"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0F1012] border border-[#262626]"
              />
              <input
                placeholder="Address Line 3"
                value={address3}
                onChange={(e) => setAddress3(e.target.value)}
                className="w-full p-4 rounded-xl bg-[#0F1012] border border-[#262626]"
              />
            </div>

            {/* PAYMENT */}
            <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6">
              <h2 className="text-xl font-semibold mb-4">
                Payment Method
              </h2>

              <label className="flex gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>

              <label className="flex gap-3 mt-2">
                <input
                  type="radio"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                Online Payment
              </label>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-[#14161A] border border-[#262626] rounded-3xl p-6 h-fit space-y-4">
            <h2 className="text-xl font-semibold">
              Order Summary
            </h2>

            {enrichedCart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  ₹{getItemFinalPrice(item) * item.quantity}
                </span>
              </div>
            ))}

            {/* COUPON */}
            <div className="pt-4 border-t border-[#262626]">
              <div className="flex gap-2">
                <input
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 p-2 rounded bg-[#0F1012] border border-[#262626]"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 bg-[#D4AF37] text-black rounded font-semibold"
                >
                  Apply
                </button>
              </div>

              {couponApplied && (
                <p className="text-green-500 text-sm mt-2">
                  Applied {couponApplied.name} (
                  {couponApplied.offer}% OFF)
                </p>
              )}

              {couponError && (
                <p className="text-red-500 text-sm mt-2">
                  {couponError}
                </p>
              )}
            </div>

            {/* TOTAL */}
            <div className="border-t border-[#262626] pt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>

              {couponPercent > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Coupon Discount</span>
                  <span>-₹{couponDiscount}</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-[#D4AF37]">
                  ₹{finalAmount}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962E]
                         text-black py-3 rounded-full font-semibold"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}


