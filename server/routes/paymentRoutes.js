import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/razorpay/create-order", protect, createRazorpayOrder);
router.post("/razorpay/verify-payment", protect, verifyRazorpayPayment);

export default router;
