import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const API_URL = "http://localhost:5000/api";

const UserEditPage = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(
          `${API_URL}/admin/users/${userId}`,
          config
        );
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (userInfo && userInfo.isAdmin) {
      fetchUser();
    } else {
      navigate("/login");
    }
  }, [userId, userInfo, navigate]);

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
        `${API_URL}/admin/users/${userId}`,
        { name, email, isAdmin },
        config
      );
      navigate("/admin/users");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-12 bg-[var(--color-white)]">
      <Link
        to="/admin/users"
        className="text-[var(--color-orange)] hover:underline font-bold mb-8 inline-block"
      >
        &larr; Go Back
      </Link>
      <h1 className="text-4xl font-bold text-center mb-12 text-[var(--color-darkgreen)] font-heading">
        Edit User
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
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-8">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-[var(--color-green)]"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                />
                <span className="ml-3 text-lg text-gray-700">Is Admin</span>
              </label>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-[var(--color-green)] hover:bg-[var(--color-lightgreen)] text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline text-lg"
                type="submit"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserEditPage;
