// routes/userRoutes.js
import express from "express";
import {
  registerUser,
  registerGuest,
  logoutUser,
} from "../controllers/userController.js";
import User from "../models/userModel.js"; // ✅ Needed for /admin/users
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Guest Registration
router.post("/register-guest", registerGuest);

// ✅ User Registration
router.post("/register", registerUser);

// ✅ Logout
router.post("/logout", logoutUser);

// ✅ Protected Route Example (User Profile)
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// ✅ Admin Only Route Example


export default router;
