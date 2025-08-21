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
  const [paymentMethod, setPaymentMethod] = useState("online");
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
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );

      const options = {
        key: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "MaTeesa",
        description: "Test Transaction",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          await axios.post(
            `${API_URL}/payment/razorpay/verify-payment`,
            response,
            { headers: { Authorization: `Bearer ${userInfo?.token}` } }
          );
          toast.success("Payment successful!");
          navigate(`/order/${orderId}`);
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
      rzp1.open();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
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
        toast.success("Order placed successfully with Cash on Delivery!");
        navigate(`/order/${newOrder._id}`);
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "There was an error placing your order.";
      toast.error(message);
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
          {/* Left Side - Shipping Info */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-[var(--color-green)]">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-3"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Side - Order Summary */}
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-[var(--color-green)]">
              Order Summary
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Shipping:</span>
                <span>₹{shippingCost.toFixed(2)}</span>
              </li>
              <li className="flex justify-between">
                <span>Tax (18%):</span>
                <span>₹{tax.toFixed(2)}</span>
              </li>
              <li className="flex justify-between font-bold border-t pt-3">
                <span>Total:</span>
                <span>₹{totalCost.toFixed(2)}</span>
              </li>
            </ul>

            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-[var(--color-green)]">
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
              className="w-full mt-8 text-white px-6 py-4 rounded-md font-semibold transition duration-300 [background-color:var(--color-orange)] hover:opacity-90 text-lg"
            >
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
