import mongoose from "mongoose";
import dotenv from "dotenv";
import products from "./data/product.js"; // your source products
import Product from "./models/productModel.js";
import User from "./models/userModel.js"; // must exist in your project
import connectDB from "./config/db.js";
import bcrypt from "bcryptjs";

dotenv.config();

await connectDB();

const ensureAdminUser = async () => {
  // Try to find an existing admin
  let admin = await User.findOne({ isAdmin: true });
  if (admin) return admin;

  // Create a default admin if none exists yet
  const defaultAdmin = new User({
    name: "Admin",
    email: "anashabib0101@gmail.com",
    password: bcrypt.hashSync("0930374821", 10),
    isAdmin: true,
  });
  admin = await defaultAdmin.save();
  return admin;
};

const normalizeImages = (p) => {
  // If product has "image", convert to "images"
  if (p.image && !p.images) {
    return [p.image.startsWith("/images") ? p.image : `/images/${p.image.replace(/^\/+/, "")}`];
  }
  if (Array.isArray(p.images)) {
    return p.images.map((img) =>
      img.startsWith("/images") ? img : `/images/${img.replace(/^\/+/, "")}`
    );
  }
  return [];
};

const toVariants = (p) => {
  // If you previously used "weights", map them to "variants"
  // Otherwise, create 3 size variants off base price:
  if (Array.isArray(p.weights) && p.weights.length > 0) {
    return p.weights.map((w) => ({
      name: w.label,
      price: Number(w.price),
      stock: 0,
      sku: "",
    }));
  }
  // fallback default variants for Mate category
  if (p.category === "Mate") {
    return [
      { name: "100g", price: p.price, stock: 0, sku: "" },
      { name: "200g", price: p.price * 2.3, stock: 0, sku: "" },
      { name: "500g", price: p.price * 4.5, stock: 0, sku: "" },
    ];
  }
  return []; // accessories without variants
};

const importData = async () => {
  try {
    const admin = await ensureAdminUser();

    await Product.deleteMany(); // clear old products only

    const prepared = products.map((p) => ({
      name: p.name,
      images: normalizeImages(p),
      description: p.description,
      brand: p.brand,
      category: p.category,
      price: p.price ?? 0,
      countInStock: p.countInStock ?? 0,
      isFeatured: Boolean(p.isFeatured),
      user: admin._id,                    // <-- REQUIRED
      variants: toVariants(p),            // <-- match your schema
      // reviews, rating, numReviews left to defaults
    }));

    await Product.insertMany(prepared);

    console.log("✅ Data Imported!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("🗑️ Data Destroyed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error destroying data:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  await destroyData();
} else {
  await importData();
}
