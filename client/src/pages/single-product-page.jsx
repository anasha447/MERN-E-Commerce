import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { getProductById } from "../apis/product.api";
import Spinner from "../components/Spinner";

const SingleProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error("❌ Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleVariantChange = (e) => {
    const variantName = e.target.value;
    const variant = product.variants.find((v) => v.name === variantName);
    setSelectedVariant(variant);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const itemToAdd = {
      id: product._id,
      name: product.name,
      image: product.image,
      price: selectedVariant ? selectedVariant.price : product.price,
      variant: selectedVariant ? selectedVariant.name : null,
    };
    addToCart(itemToAdd, 1);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkoutpage");
  };

  if (loading) {
    return <Spinner />;
  }

  if (!product) {
    return <p className="text-center text-red-500">Product not found</p>;
  }

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center py-12 px-6 md:px-20">
      <div className="w-full md:w-1/2 flex justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-xl shadow-lg max-h-[500px] object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 mt-10 md:mt-0 md:pl-12">
        <h1 className="text-4xl font-bold [color:var(--color-darkgreen)]">
          {product.name}
        </h1>
        <p className="text-gray-700 mt-4">{product.description}</p>

        {product.variants && product.variants.length > 0 && (
          <div className="mt-6">
            <label className="block text-gray-800 mb-2">Choose Variant:</label>
            <select
              value={selectedVariant ? selectedVariant.name : ""}
              onChange={handleVariantChange}
              className="border p-2 rounded-lg bg-white"
            >
              {product.variants.map((v, index) => (
                <option key={index} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <p className="[color:var(--color-green)] font-bold text-3xl mt-6">
          ₹{displayPrice.toFixed(2)}
        </p>

        <div className="mt-8 flex items-center space-x-4">
          <button
            onClick={handleAddToCart}
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
