import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const options = {
    amount: order.totalPrice * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: order._id.toString(),
  };

  try {
    const razorpayOrder = await instance.orders.create(options);
    if (!razorpayOrder) {
      return res
        .status(500)
        .json({ message: "Something went wrong with Razorpay" });
    }

    // Save the razorpay_order_id to our order document
    order.paymentResult = { razorpay_order_id: razorpayOrder.id };
    await order.save();

    res.json(razorpayOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong with Razorpay" });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    const order = await Order.findOne({
      "paymentResult.razorpay_order_id": razorpay_order_id,
    });

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult.id = razorpay_payment_id;
      order.paymentResult.status = "succeeded";
      order.paymentResult.update_time = new Date().toISOString();
      order.paymentResult.email_address = order.shippingAddress.email;
      await order.save();
      res.json({ message: "Payment successful", orderId: order._id });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } else {
    res.status(400).json({ message: "Invalid signature" });
  }
};

export { createRazorpayOrder, verifyRazorpayPayment };
