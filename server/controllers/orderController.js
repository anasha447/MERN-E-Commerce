import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import orderConfirmationEmail from "../utils/emailTemplates/orderConfirmationEmail.js";

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
      res.status(400).json({ message: "Email is required for guest checkout" });
      return;
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

  const order = new Order({
    orderItems,
    user: userForOrder._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  try {
    await sendEmail({
      email: shippingAddress.email,
      subject: `Your MaTeesa Order Confirmation [${createdOrder._id}]`,
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
  const order = await Order.findById(orderId).populate("user", "email");

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

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, trackOrder };
