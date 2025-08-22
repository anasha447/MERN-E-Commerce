import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api";

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([""]);
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageInput = () => {
    if (images.length < 5) {
      setImages([...images, ""]);
    }
  };

  const removeImageInput = (index) => {
    if (images.length > 1) {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products/${productId}`);
        setName(data.name);
        setPrice(data.price);
        setImages(data.images && data.images.length > 0 ? data.images : [""]);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      await axios.put(
        `${API_URL}/products/${productId}`,
        {
          name,
          price,
          images: images.filter(img => img),
          brand,
          category,
          countInStock,
          description,
        },
        config
      );
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-12 bg-[var(--color-white)]">
      <Link
        to="/admin/products"
        className="text-[var(--color-orange)] hover:underline font-bold mb-8 inline-block"
      >
        &larr; Go Back
      </Link>
      <h1 className="text-4xl font-bold text-center mb-12 text-[var(--color-darkgreen)] font-heading">
        Edit Product
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <label
                className="block text-[var(--color-darkgreen)] text-lg font-bold mb-2 font-heading"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-[var(--color-darkgreen)] text-lg font-bold mb-2 font-heading"
                htmlFor="price"
              >
                Price
              </label>
              <input
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-[var(--color-darkgreen)] text-lg font-bold mb-2 font-heading">
                Image URLs (up to 5)
              </label>
              {images.map((img, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder={`Image URL ${index + 1}`}
                    value={img}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageInput(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={addImageInput}
                  className="mt-2 text-sm text-[var(--color-orange)] hover:underline"
                >
                  + Add Another Image
                </button>
              )}
            </div>
            <div className="mb-6">
              <label
                className="block text-[var(--color-darkgreen)] text-lg font-bold mb-2 font-heading"
                htmlFor="brand"
              >
                Brand
              </label>
              <input
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="brand"
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-[var(--color-darkgreen)] text-lg font-bold mb-2 font-heading"
                htmlFor="category"
              >
                Category
              </label>
              <input
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="category"
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-[var(--color-darkgreen)] text-lg font-bold mb-2 font-heading"
                htmlFor="countInStock"
              >
                Count In Stock
              </label>
              <input
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="countInStock"
                type="number"
                placeholder="Enter count in stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </div>
            <div className="mb-8">
              <label
                className="block text-[var(--color-darkgreen)] text-lg font-bold mb-2 font-heading"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="description"
                rows="4"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-[var(--color-green)] hover:bg-[var(--color-lightgreen)] text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline text-lg"
                type="submit"
              >
                Update Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductEditPage;
