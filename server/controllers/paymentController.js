import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";

// ✅ Only create Razorpay instance if keys are present
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// ----------------- CREATE ORDER -----------------
const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ If Razorpay is not configured, return placeholder
    if (!razorpayInstance) {
      return res.json({
        id: `placeholder_${order._id}`,
        currency: "INR",
        amount: order.totalPrice * 100,
        status: "created (placeholder)",
        message: "Razorpay not configured yet. Using placeholder response.",
      });
    }

    const options = {
      amount: Math.round(order.totalPrice * 100), // amount in paise
      currency: "INR",
      receipt: order._id.toString(),
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({ message: "Something went wrong with Razorpay" });
    }

    // Save the razorpay_order_id to our order document
    order.paymentResult = { razorpay_order_id: razorpayOrder.id };
    await order.save();

    res.json(razorpayOrder);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Server error creating Razorpay order" });
  }
};

// ----------------- VERIFY PAYMENT -----------------
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ If Razorpay not configured, just mark as paid (mock)
    if (!razorpayInstance) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: "mock_payment_id",
        status: "succeeded",
        update_time: new Date().toISOString(),
        email_address: order.shippingAddress?.email || "test@example.com",
      };
      await order.save();
      return res.json({
        message: "Payment successful (placeholder mode)",
        orderId: order._id,
      });
    }

    // ✅ Normal Razorpay verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        razorpay_order_id,
        id: razorpay_payment_id,
        status: "succeeded",
        update_time: new Date().toISOString(),
        email_address: order.shippingAddress?.email,
      };
      await order.save();

      res.json({ message: "Payment successful", orderId: order._id });
    } else {
      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ message: "Server error verifying Razorpay payment" });
  }
};

export { createRazorpayOrder, verifyRazorpayPayment };
