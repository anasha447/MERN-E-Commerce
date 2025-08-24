import axios from "axios";

// Base Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Get all products
export const getProducts = async () => {
  try {
    const { data } = await api.get("/products");
    return data;
  } catch (error) {
    console.error("❌ Error fetching products:", error.message);
    throw error;
  }
};

// Create a product review
export const createProductReview = async (productId, review, token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await api.post(
      `/products/${productId}/reviews`,
      review,
      config
    );
    return data;
  } catch (error) {
    console.error(
      `❌ Error creating review for product ${productId}:`,
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

// Get single product
export const getProductById = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data;
  } catch (error) {
    console.error(`❌ Error fetching product with id ${id}:`, error.message);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async () => {
  try {
    const { data } = await api.get("/products/featured");
    return data;
  } catch (error) {
    console.error("❌ Error fetching featured products:", error.message);
    throw error;
  }
};
