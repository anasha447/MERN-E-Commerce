import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaEye } from "react-icons/fa";
import Spinner from "../../components/Spinner";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api";

const OrderListPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/admin/orders`, config);
      setOrders(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [userInfo, fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(`${API_URL}/orders/${orderId}/status`, { status: newStatus }, config);
      toast.success(`Order status updated to ${newStatus}`);
      setOrders(orders.map(o => o._id === orderId ? {...o, status: newStatus, isDelivered: newStatus === 'Delivered'} : o));
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update order status.";
      toast.error(message);
      console.error("Status Update Error:", error.response || error);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-12 bg-[var(--color-white)]">
      <h1 className="text-4xl font-bold text-center mb-12 text-[var(--color-darkgreen)] font-heading">
        Order Management
      </h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[var(--color-darkgreen)] text-[var(--color-craemy)]">
              <tr>
                <th className="py-3 px-6 text-left font-heading">Tracking ID</th>
                <th className="py-3 px-6 text-left font-heading">User</th>
                <th className="py-3 px-6 text-left font-heading">Date</th>
                <th className="py-3 px-6 text-left font-heading">Products</th>
                <th className="py-3 px-6 text-left font-heading">Total</th>
                <th className="py-3 px-6 text-left font-heading">Paid</th>
                <th className="py-3 px-6 text-left font-heading">Shipping Info</th>
                <th className="py-3 px-6 text-left font-heading">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(orders) &&
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-mono text-sm">{order.trackingId}</td>
                    <td className="py-4 px-6">
                      {order.user ? order.user.name : "Guest"}
                    </td>
                    <td className="py-4 px-6">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      {order.orderItems.map(item => item.product ? item.product.name : 'N/A').join(', ')}
                    </td>
                    <td className="py-4 px-6">
                      ₹{order.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      {order.isPaid ? (
                        <span className="text-green-500 font-bold">Paid</span>
                      ) : (
                        <span className="text-red-500 font-bold">No</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="p-1 border rounded-md text-sm"
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
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/order/${order._id}`}
                        className="text-[var(--color-green)] hover:text-[var(--color-lightgreen)]"
                      >
                        <FaEye size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderListPage;
