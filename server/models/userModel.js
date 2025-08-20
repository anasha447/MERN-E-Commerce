import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
email: {
  type: String,
  required: true,
  unique: true,
},
name: {
  type: String,
  required: false,
  default: "Guest",
},


    isGuest: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      ip: { type: String },
      country: { type: String },
      city: { type: String },
    },
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
      },
    ],
    orders: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
