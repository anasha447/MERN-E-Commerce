import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaEye } from "react-icons/fa";
import Spinner from "../../components/Spinner";

const API_URL = "http://localhost:5000/api";

const OrderListPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`${API_URL}/admin/orders`, config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (userInfo && userInfo.isAdmin) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [userInfo]);

  const deliverHandler = async (id) => {
    if (window.confirm("Mark this order as delivered?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.put(`${API_URL}/admin/orders/${id}/deliver`, {}, config);
        const { data } = await axios.get(`${API_URL}/admin/orders`, config);
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
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
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[var(--color-darkgreen)] text-[var(--color-craemy)]">
              <tr>
                <th className="py-3 px-6 text-left font-heading">ID</th>
                <th className="py-3 px-6 text-left font-heading">User</th>
                <th className="py-3 px-6 text-left font-heading">Date</th>
                <th className="py-3 px-6 text-left font-heading">Total</th>
                <th className="py-3 px-6 text-left font-heading">Paid</th>
                <th className="py-3 px-6 text-left font-heading">Delivered</th>
                <th className="py-3 px-6 text-left font-heading">
                  Payment Method
                </th>
                <th className="py-3 px-6 text-left font-heading">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(orders) &&
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">{order._id}</td>
                    <td className="py-4 px-6">
                      {order.user ? order.user.name : "Guest"}
                    </td>
                    <td className="py-4 px-6">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      {order.isPaid ? (
                        <span className="text-green-500 font-bold">Paid</span>
                      ) : (
                        <span className="text-red-500 font-bold">No</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {order.isDelivered ? (
                        <span className="text-green-500 font-bold">Yes</span>
                      ) : (
                        <button
                          onClick={() => deliverHandler(order._id)}
                          className="bg-[var(--color-orange)] text-white py-1 px-3 rounded-full text-sm hover:opacity-90"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </td>
                    <td className="py-4 px-6">{order.paymentMethod}</td>
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
