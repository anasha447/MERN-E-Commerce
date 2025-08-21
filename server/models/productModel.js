import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "250g", "500g", "Red", "Blue"
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  sku: { type: String },
});

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      required: true,
    },
    // The 'price' and 'countInStock' fields at the top level can be used as a default
    // or as a base price if no variants exist.
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },
    variants: [variantSchema],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
