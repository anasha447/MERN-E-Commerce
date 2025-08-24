import React, { useEffect, useState } from "react";
import { useCart } from "../context/cart-context";
import { getProducts } from "../apis/product.api"; // API function
import { useNavigate } from "react-router-dom";
import ShopBanner from "../components/banner-shop"; // Example banner image
import { getImageUrl } from "../utils/imageUrl.js";
const ShopPage = ({ selectedCategory }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Category filtering
  const filteredProducts =
    !selectedCategory || selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (loading) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopBanner />
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-20 py-20">
      {filteredProducts.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">
          No products available
        </p>
      ) : (
        filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform duration-300 hover:scale-105 group cursor-pointer"
          >
            {/* Product Image - clickable */}
            <div
              className="relative overflow-hidden"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <img
                src={getImageUrl(product.images[0])}
                alt={product.name}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center px-4">
                <p className="text-center text-lg">{product.description}</p>
              </div>
            </div>

            {/* Product Info - clickable */}
            <div
              className="p-6 flex flex-col items-center text-center"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <h3 className="text-xl font-body font-semibold">
                {product.name}
              </h3>
              <p className="text-green-700 font-bold">₹{product.price}</p>
            </div>

            {/* Add to Cart separate */}
            <div className="p-4 flex justify-center">
              <button
                onClick={() =>
                  addToCart({
                    id: product._id,
                    name: product.name,
                    price: product.price,
 fix-product-image-fetching
                    image: getImageUrl(product.images[0]) || "",

                  
                    variant: "default",
                  })
                }
                className="bg-lightgreen text-white px-6 py-3 rounded-md font-semibold hover:bg-darkgreen cursor-pointer transition duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))
      )}
    </div>
    </div>
  );
};

export default ShopPage;
