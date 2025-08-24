import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { getProductById, createProductReview } from "../apis/product.api";
import Spinner from "../components/Spinner";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaStar, FaRegStar } from "react-icons/fa";
import Questions from "../components/questions";
import { getImageUrl } from "../utils/imageUrl.js";

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-400" />);
    }
  }
  return <div className="flex">{stars}</div>;
};

const SingleProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProductById(id);
      setProduct(data);
      if (data.images && data.images.length > 0) {
        setMainImage(data.images[0]);
      }
      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(data.variants[0]);
      }
    } catch (error) {
      console.error("❌ Failed to fetch product:", error);
      toast.error("Could not load product details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = (openDrawer = true) => {
    if (!product) return;

    const itemToAdd = {
      id: product._id,
      name: product.name,
      image: product.images[0] || "", // Use the first image for cart
      price: selectedVariant ? selectedVariant.price : product.price,
      variant: selectedVariant ? selectedVariant.name : null,
    };
    addToCart(itemToAdd, 1, { openDrawer });
  };

  const handleBuyNow = () => {
    handleAddToCart(false); // Add to cart without opening the drawer
    navigate("/checkoutpage");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!comment || rating === 0) {
      toast.error("Please provide a rating and a comment.");
      return;
    }
    try {
      await createProductReview(
        id,
        { rating, comment },
        userInfo.token
      );
      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      fetchProduct(); // Refresh product to show new review
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!product) {
    return <p className="text-center text-red-500">Product not found</p>;
  }

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;

  return (
    <div className="py-12 px-4 md:px-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-start">
          <div className="w-full md:w-1/2 flex flex-col items-center">
            {mainImage && (
              <>
                <div className="w-full flex justify-center">
                  <img
                    src={getImageUrl(mainImage)}
                    alt={product.name}
                    className="rounded-xl shadow-lg max-h-[500px] object-cover"
                  />
                </div>
                <div className="flex space-x-2 mt-4">
                  {product.images &&
                    product.images.map((img, index) => (
                      <img
                        key={index}
                        src={getImageUrl(img)}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${
                          mainImage === img
                            ? "border-[var(--color-orange)]"
                            : "border-transparent"
                        }`}
                        onClick={() => setMainImage(img)}
                      />
                    ))}
                </div>
              </>
            )}
          </div>

          <div className="w-full md:w-1/2 mt-10 md:mt-0 md:pl-12">
            <h1 className="text-4xl font-bold [color:var(--color-darkgreen)]">
              {product.name}
            </h1>
            <div className="flex items-center mt-2">
              <StarRating rating={product.rating} />
              <span className="ml-2 text-gray-600">
                ({product.numReviews} reviews)
              </span>
            </div>
            <p className="text-gray-700 mt-4">{product.description}</p>

            {product.variants && product.variants.length > 0 && (
              <div className="mt-6">
                <label className="block text-gray-800 mb-2 font-semibold">
                  Choose Weight:
                </label>
                <div className="flex space-x-2">
                  {product.variants.map((v, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(v)}
                      className={`py-2 px-4 rounded-full border-2 transition-colors ${
                        selectedVariant && selectedVariant.name === v.name
                          ? "bg-[var(--color-orange)] text-white border-[var(--color-orange)]"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-500"
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
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

        <div className="mt-16 border-t pt-12">
          <h2 className="text-3xl font-bold mb-6">Reviews</h2>
          {product.reviews.length === 0 && <p>No reviews yet.</p>}
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <strong className="mr-4">{review.name}</strong>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-gray-500 text-sm">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-6">Write a Customer Review</h2>
          {userInfo ? (
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Rating</label>
                <select
                  value={rating}
                  onChange={e => setRating(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-semibold">Comment</label>
                <textarea
                  rows="4"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>
              <button type="submit" className="bg-[var(--color-orange)] text-white py-2 px-4 rounded hover:opacity-90">
                Submit Review
              </button>
            </form>
          ) : (
            <p>Please <a href="/login" className="text-blue-500">sign in</a> to write a review.</p>
          )}
        </div>
        <Questions />
      </div>
    </div>
  );
};

export default SingleProductPage;
