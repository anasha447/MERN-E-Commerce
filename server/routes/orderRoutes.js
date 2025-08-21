import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(addOrderItems);
router.route("/myorders").get(protect, getMyOrders);
router.route("/:id").get(getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);

export default router;
