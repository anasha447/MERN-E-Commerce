import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { getProductById } from "../apis/product.api";

const SingleProductPage = () => {
  const { id } = useParams(); // product id from URL
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeight, setSelectedWeight] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        if (data.weights && data.weights.length > 0) {
          setSelectedWeight(data.weights[0].label); // default first weight's label
        }
      } catch (error) {
        console.error("❌ Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center text-red-500">Product not found</p>;
  }

  const handleBuyNow = () => {
    addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        variant: selectedWeight,
      },
      1
    );
    navigate("/checkoutpage");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center py-12 px-6 md:px-20">
      {/* Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-xl shadow-lg max-h-[500px] object-cover"
        />
      </div>

      {/* Info */}
      <div className="w-full md:w-1/2 mt-10 md:mt-0 md:pl-12">
        <h1 className="text-4xl font-bold [color:var(--color-darkgreen)]">
          {product.name}
        </h1>
        <p className="text-gray-700 mt-4">{product.description}</p>

        {/* Weights dropdown */}
        {product.weights && product.weights.length > 0 && (
          <div className="mt-6">
            <label className="block text-gray-800 mb-2">Choose Weight:</label>
            <select
              value={selectedWeight}
              onChange={(e) => setSelectedWeight(e.target.value)}
              className="border p-2 rounded-lg bg-white"
            >
              {product.weights.map((w, index) => (
                <option key={index} value={w.label}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Price */}
        <p className="[color:var(--color-green)] font-bold text-3xl mt-6">
          ₹{product.price}
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center space-x-4">
          <button
            onClick={() =>
              addToCart(
                {
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  variant: selectedWeight,
                },
                1
              )
            }
            className="text-white px-6 py-3 rounded-md font-semibold transition duration-300 [background-color:var(--color-lightgreen)] hover:[background-color:var(--color-darkgreen)]"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="text-white px-6 py-3 rounded-md font-semibold transition duration-300 [background-color:var(--color-orange)] hover:opacity-90"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
