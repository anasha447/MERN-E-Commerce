import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const ProductListPage = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/products");
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        await axios.delete(`/api/products/${id}`, config);
        setProducts(products.filter((product) => product._id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.post("/api/products", {}, config);
        navigate(`/admin/product/${data._id}/edit`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-12 bg-[var(--color-white)]">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-[var(--color-darkgreen)] font-heading">
          Product Management
        </h1>
        <button
          onClick={createProductHandler}
          className="bg-[var(--color-orange)] text-white py-2 px-4 rounded-full flex items-center gap-2 hover:opacity-90"
        >
          <FaPlus /> Create Product
        </button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[var(--color-darkgreen)] text-[var(--color-craemy)]">
              <tr>
                <th className="py-3 px-6 text-left font-heading">ID</th>
                <th className="py-3 px-6 text-left font-heading">Name</th>
                <th className="py-3 px-6 text-left font-heading">Price</th>
                <th className="py-3 px-6 text-left font-heading">Category</th>
                <th className="py-3 px-6 text-left font-heading">Brand</th>
                <th className="py-3 px-6 text-left font-heading">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Array.isArray(products) &&
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">{product._id}</td>
                    <td className="py-4 px-6">{product.name}</td>
                    <td className="py-4 px-6">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-6">{product.category}</td>
                    <td className="py-4 px-6">{product.brand}</td>
                    <td className="py-4 px-6 flex items-center gap-4">
                      <Link
                        to={`/admin/product/${product._id}/edit`}
                        className="text-[var(--color-green)] hover:text-[var(--color-lightgreen)]"
                      >
                        <FaEdit size={20} />
                      </Link>
                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="text-[var(--color-orange)] hover:text-red-700"
                      >
                        <FaTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
