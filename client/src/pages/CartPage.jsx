import React from "react";
import { useCart } from "../context/cart-context";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { openCart } = useCart();

  return (
    <div className="container mx-auto text-center py-20">
      <h1 className="text-3xl font-bold mb-4">Your Cart Has a New Home!</h1>
      <p className="text-lg text-gray-600 mb-8">
        We've moved the cart to a convenient slide-out drawer.
      </p>
      <button
        onClick={openCart}
        className="bg-[var(--color-orange)] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
      >
        Open Cart
      </button>
      <Link
        to="/shop"
        className="block mt-4 text-[var(--color-green)] hover:underline"
      >
        Or continue shopping
      </Link>
    </div>
  );
};

export default CartPage;
