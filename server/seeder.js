import mongoose from "mongoose";
import dotenv from "dotenv";
import products from "./data/product.js";
import Product from "./models/productModel.js";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany(); // Clear old data

    // ✅ Insert products with weights for Mate category
    const updatedProducts = products.map((p) => {
      if (p.category === "Mate") {
        return {
          ...p,
          weights: [
            { label: "100g", price: p.price },
            { label: "200g", price: p.price * 2.3 },
            { label: "500g", price: p.price * 4.5 },
          ],
        };
      }
      return p; // accessories stay the same
    });

    await Product.insertMany(updatedProducts);

    console.log("✅ Data Imported with weights & isFeatured!");
    process.exit();
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("🗑️ Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error("❌ Error destroying data:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
