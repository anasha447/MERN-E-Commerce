import React, { useState, useContext } from "react";
import { useCart } from "../context/cart-context";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const shippingCost = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.18;
  const totalCost = subtotal + shippingCost + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const orderData = {
      orderItems: items.map((item) => ({
        ...item,
        product: item.id,
      })),
      shippingAddress: formData,
      paymentMethod,
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shippingCost,
      totalPrice: totalCost,
    };

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(
        `${API_URL}/orders`,
        orderData,
        config
      );
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-12 [background-color:var(--color-white)]">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 [color:var(--color-darkgreen)]">
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
              <div>
                <label htmlFor="address" className="block text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-gray-700 mb-2"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 [color:var(--color-green)]">
              Order Summary
            </h2>
            <div className="space-y-4">
              {items.length > 0 ? (
                items.map((item) => (
                  <div key={item.key} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.variant}</p>
                    </div>
                    <div className="text-right">
                      <p>
                        {item.qty} x ₹{item.price.toFixed(2)} = ₹
                        {(item.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>
            <hr className="my-6" />
            <div className="space-y-3">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>₹{subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>₹{shippingCost.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax (18%)</p>
                <p>₹{tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold text-lg [color:var(--color-darkgreen)]">
                <p>Total</p>
                <p>₹{totalCost.toFixed(2)}</p>
              </div>
            </div>

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
                  Online Payment
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
