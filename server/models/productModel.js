import mongoose from "mongoose"; 

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Mate", "Accessories"], // only 2 categories
    },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    isFeatured: { type: Boolean, default: false },

    // ✅ NEW FIELD (only used for Mate)
    weights: [
      {
        label: { type: String }, // "250g", "500g", "1kg"
        price: { type: Number }, // optional: custom price per weight
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
