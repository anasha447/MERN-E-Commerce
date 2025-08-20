import React from "react";
import { useCart } from "../context/cart-context";
import { Link } from "react-router-dom";

export default function Cart() {
  const { items, subtotal, setQty, removeFromCart, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-25">
        <h1 className="text-3xl font-heading font-bold text-[#2F3B28] mb-4 ">Your Cart</h1>
        <p className="text-[#2F3B28] font-heading">
          Your cart is empty.{" "}
          <Link to="/shop" className="text-[#F26323] underline">
            Continue shopping
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-[#2F3B28] mb-6">Your Cart</h1>

      <div className="bg-[#F9F7F3] rounded-xl shadow-lg overflow-hidden">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-4 border-b border-[#E6E0D2] p-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                className="h-16 w-16 object-contain"
                alt={item.name}
              />
              <div>
                <p className="text-[#2F3B28] font-medium">
                  {item.name} {item.variant ? `• ${item.variant}` : ""}
                </p>
                <p className="text-[#F26323] font-semibold">₹ {item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded bg-[#EADBA2] hover:bg-[#F3CB57] text-[#2F3B28]"
                onClick={() => setQty(item.key, item.qty - 1)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={item.qty}
                onChange={(e) => setQty(item.key, parseInt(e.target.value || "1", 10))}
                className="w-14 text-center border border-[#CFC497] rounded bg-white"
              />
              <button
                className="w-8 h-8 rounded bg-[#EADBA2] hover:bg-[#F3CB57] text-[#2F3B28]"
                onClick={() => setQty(item.key, item.qty + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
              <button
                className="ml-4 text-red-600 hover:underline"
                onClick={() => removeFromCart(item.key)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="p-4 flex items-center justify-between">
          <button
            onClick={clearCart}
            className="px-4 py-2 rounded bg-[#EADBA2] text-[#2F3B28] hover:bg-[#F3CB57]"
          >
            Clear Cart
          </button>

          <div className="text-right">
            <p className="text-lg text-[#2F3B28]">
              Subtotal: <span className="font-bold text-[#F26323]">₹ {subtotal.toFixed(2)}</span>
            </p>
            <button 
            onClick={() => window.location.href = '/checkoutpage'}
            className="mt-3 w-full md:w-auto px-6 py-3 rounded-lg bg-[#2F3B28] text-[#E9DDAF] hover:bg-[#7A9D3E] cursor-pointer transition">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
