import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const OrderPage = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`/api/orders/${orderId}`, config);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (userInfo) {
      fetchOrder();
    }
  }, [orderId, userInfo]);

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
              <div key={index} className="flex justify-between items-center mb-4">
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
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Order not found</div>
  );
};

export default OrderPage;
