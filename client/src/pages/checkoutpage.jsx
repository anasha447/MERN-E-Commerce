import React, { useState, useContext, useEffect } from "react";
import { useCart } from "../context/cart-context";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api";

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  useEffect(() => {
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        address: userInfo.address?.street || "",
        city: userInfo.address?.city || "",
        postalCode: userInfo.address?.postalCode || "",
        country: userInfo.address?.country || "India",
      }));
    }
  }, [userInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const shippingCost = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const totalCost = subtotal + shippingCost + tax;

  const handlePayment = async (orderId) => {
    try {
      const { data: razorpayOrder } = await axios.post(
        `${API_URL}/payment/razorpay/create-order`,
        { orderId },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "MaTeesa",
        description: "Test Transaction",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            await axios.post(
              `${API_URL}/payment/razorpay/verify-payment`,
              response,
              { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            toast.success("Payment successful!");
            navigate(`/order-confirmation/${orderId}`);
          } catch (error) {
            toast.error("Payment verification failed.");
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3E5F2D",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp1.open();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    setLoading(true);
    const orderData = {
      orderItems: items.map((item) => ({ ...item, product: item.id })),
      shippingAddress: formData,
      paymentMethod,
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shippingCost,
      totalPrice: totalCost,
    };

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      if (userInfo) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
      const { data: newOrder } = await axios.post(
        `${API_URL}/orders`,
        orderData,
        config
      );

      clearCart();

      if (paymentMethod === "online") {
        await handlePayment(newOrder._id);
      } else {
        // For COD, redirect directly to the confirmation page
        toast.success("Order placed successfully with Cash on Delivery!");
        navigate(`/order-confirmation/${newOrder._id}`);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "There was an error placing your order.";
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-12 bg-[var(--color-white)]">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-[var(--color-darkgreen)]">
          Checkout
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 [color:var(--color-green)]">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form fields remain the same */}
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 [color:var(--color-green)]">
              Order Summary
            </h2>
            {/* Order summary remains the same */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 [color:var(--color-green)]">
                Payment Method
              </h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border rounded-md cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={paymentMethod === "online"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  Online Payment (Razorpay)
                </label>
                <label className="flex items-center p-4 border rounded-md cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  Cash on Delivery
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 text-white px-6 py-4 rounded-md font-semibold transition duration-300 [background-color:var(--color-orange)] hover:opacity-90 text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
