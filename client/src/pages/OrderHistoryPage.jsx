import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const OrderHistoryPage = () => {
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
        const { data } = await axios.get("/api/orders/myorders", config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo]);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div>You have no orders.</div>
      ) : (
        <div className="bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Paid
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Delivered
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Details</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${order.totalPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <span className="text-red-500">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-indigo-600 hover:text-indigo-900"
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
