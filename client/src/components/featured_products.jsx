import React, { useEffect, useState } from "react";
import { getFeaturedProducts } from "../apis/product.api.js";
import { useCart } from "../context/cart-context";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl.js";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFeaturedProducts();
        setProducts(data);
      } catch (err) {
        console.error("Error fetching featured products:", err);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(
      {
        id: product._id,
        name: product.name,
        price: product.price,
        image: getImageUrl(product.images[0]) || "",
        variant: "default",
      },
      1
    );
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? products.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === products.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const getVisibleProducts = () => {
    if (products.length === 0) return [];
    const visible = [];
    // This logic ensures we can show up to 3 products, and handles looping.
    for (let i = 0; i < Math.min(3, products.length); i++) {
      visible.push(products[(currentIndex + i) % products.length]);
    }
    return visible;
  };

  if (products.length === 0) {
    return (
      <section className="py-12 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold mb-10 text-center">
          🌟 Featured Products
        </h2>
        <p className="text-center text-gray-500">
          No featured products available
        </p>
      </section>
    );
  }

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">🌟 Featured Products</h2>
        <div className="relative">
          <div className="flex overflow-hidden justify-center items-center space-x-8">
            {/* Arrow Buttons */}
            <button
              onClick={goToPrevious}
              className="flex-shrink-0 bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-10"
            >
              &lt;
            </button>

            {getVisibleProducts().map((product, index) => (
              <div
                key={`${product._id}-${currentIndex}-${index}`} // More stable key
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 w-full max-w-xs"
              >
                <div
                  className="relative overflow-hidden cursor-pointer group"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center px-4">
                    <p className="text-center text-lg">
                      {product.description}
                    </p>
                  </div>
                </div>
                <div
                  className="p-6 flex flex-col items-center text-center cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="[color:var(--color-green)] font-bold">
                    ₹{product.price}
                  </p>
                </div>
                <div className="p-4 flex justify-center">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-lightgreen text-white px-6 py-3 rounded-md font-semibold hover:bg-darkgreen cursor-pointer transition duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={goToNext}
              className="flex-shrink-0 bg-white/80 p-2 rounded-full shadow-md hover:bg-white z-10"
            >
              &gt;
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-8">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 rounded-full mx-1 transition-colors duration-300 ${
                  currentIndex === index
                    ? "bg-gray-800"
                    : "bg-gray-400 hover:bg-gray-600"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
