// backend/routes/productRoutes.js
import express from "express";
import {
  getProducts,
  getProductById,
  getFeaturedProducts, // ✅ import featured products controller
} from "../controllers/productController.js";

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get("/", getProducts);

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get("/featured", getFeaturedProducts);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get("/:id", getProductById);

export default router;
