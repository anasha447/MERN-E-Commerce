import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const API_URL = "http://localhost:5000/api";

const OrderHistoryPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) {
        setLoading(false);
        return;
      }
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`${API_URL}/orders/myorders`, config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo]);

  return (
    <div className="container mx-auto py-12 px-4 md:px-12 bg-[var(--color-white)]">
      <h1 className="text-4xl font-bold text-center mb-12 text-[var(--color-darkgreen)] font-heading">
        My Orders
      </h1>
      {loading ? (
        <Spinner />
      ) : !Array.isArray(orders) || orders.length === 0 ? (
        <div className="text-center text-gray-500">
          You have no orders.{" "}
          <Link to="/shop" className="text-[var(--color-orange)] hover:underline">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[var(--color-darkgreen)] text-[var(--color-craemy)]">
              <tr>
                <th className="py-3 px-6 text-left font-heading">ID</th>
                <th className="py-3 px-6 text-left font-heading">Date</th>
                <th className="py-3 px-6 text-left font-heading">Total</th>
                <th className="py-3 px-6 text-left font-heading">Paid</th>
                <th className="py-3 px-6 text-left font-heading">Delivered</th>
                <th className="py-3 px-6 text-left font-heading">
                  Payment Method
                </th>
                <th className="py-3 px-6 text-left font-heading"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 whitespace-nowrap">{order._id}</td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {order.isPaid ? (
                      <span className="text-green-500 font-bold">Yes</span>
                    ) : (
                      <span className="text-red-500 font-bold">No</span>
                    )}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {order.isDelivered ? (
                      <span className="text-green-500 font-bold">Yes</span>
                    ) : (
                      <span className="text-red-500 font-bold">No</span>
                    )}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    {order.paymentMethod}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-[var(--color-green)] hover:text-[var(--color-lightgreen)] font-bold"
                    >
                      Details
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

export default OrderHistoryPage;
