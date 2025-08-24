import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api";

const OrderPage = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  const fetchOrder = useCallback(async () => {
    if (!userInfo) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(
        `${API_URL}/orders/${orderId}`,
        config
      );
      setOrder(data);
      setStatus(data.status);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  }, [orderId, userInfo]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { status },
        config
      );
      toast.success("Order status updated successfully!");
      fetchOrder(); // Refresh order data
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update order status.";
      toast.error(message);
    }
  };

  return loading ? (
    <div>Loading...</div>
  ) : order ? (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Order {order._id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Shipping</h2>
            <p>
              <strong>Name: </strong> {order.user.name}
            </p>
            <p>
              <strong>Email: </strong>{" "}
              <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
            </p>
            <p>
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
              {order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg mt-4">
                Delivered on {order.deliveredAt}
              </div>
            ) : (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mt-4">
                Not Delivered
              </div>
            )}
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
            <p>
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg mt-4">
                Paid on {order.paidAt}
              </div>
            ) : (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg mt-4">
                Not Paid
              </div>
            )}
          </div>
          <div className="bg-white shadow-md rounded-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4">Order Items</h2>
            {order.orderItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-4"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg mr-4"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                  </div>
                </div>
                <div>
                  {item.qty} x ${item.price} = ${item.qty * item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-white shadow-md rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Items</span>
              <span>${order.itemsPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>${order.shippingPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>${order.taxPrice}</span>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>${order.totalPrice}</span>
            </div>
            {userInfo && userInfo.isAdmin && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Update Status</h3>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Paid">Paid</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Shipped">Shipped</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Returned">Returned</option>
                </select>
                <button
                  onClick={handleStatusUpdate}
                  className="w-full mt-4 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Update Status
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Order not found</div>
  );
};

export default OrderPage;
