import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getOrders,
  updateOrderToDelivered,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/users").get(protect, admin, getUsers);
router
  .route("/users/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);
router.route("/orders").get(protect, admin, getOrders);
router.route("/orders/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
