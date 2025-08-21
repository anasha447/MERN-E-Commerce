import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import orderConfirmationEmail from "../utils/emailTemplates/orderConfirmationEmail.js";
import crypto from "crypto";

const generateTrackingId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;
  const randomPart = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `ORD-${datePart}-${randomPart}`;
};

const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
    return;
  }

  let userForOrder;
  if (req.user) {
    userForOrder = req.user;
  } else {
    const { email, name } = shippingAddress;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Email is required for guest checkout" });
    }
    let guestUser = await User.findOne({ email, isGuest: true });
    if (!guestUser) {
      guestUser = await User.create({
        name: name || "Guest",
        email,
        password: Date.now().toString(),
        isGuest: true,
      });
    }
    userForOrder = guestUser;
  }

  const trackingId = generateTrackingId();
  let orderStatus = "Pending";
  let isPaid = false;

  if (paymentMethod === "COD") {
    orderStatus = "Confirmed";
    isPaid = false;
  }

  const order = new Order({
    orderItems,
    user: userForOrder._id,
    trackingId,
    shippingAddress,
    paymentMethod,
    status: orderStatus,
    isPaid: isPaid,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  try {
    await sendEmail({
      email: shippingAddress.email,
      subject: `Your MaTeesa Order Confirmation [${createdOrder.trackingId}]`,
      html: orderConfirmationEmail(createdOrder),
    });
  } catch (error) {
    console.error("Order confirmation email could not be sent.", error);
  }

  res.status(201).json(createdOrder);
};

const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

const trackOrder = async (req, res) => {
  const { orderId, email } = req.body;
  const order = await Order.findOne({ trackingId: orderId }).populate(
    "user",
    "email"
  );

  if (order && order.user.email === email) {
    res.json(order);
  } else {
    res.status(404).json({ message: "Order not found or email does not match" });
  }
};

const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = "Paid";
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: "Order not found" });
  }
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status;

    if (req.body.status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  trackOrder,
  updateOrderStatus,
};
