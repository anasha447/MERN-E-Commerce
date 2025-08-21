import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      await axios.post(`${API_URL}/users/forgotpassword`, { email }, config);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      const errorMsg =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      setMessage(`Error: ${errorMsg}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--color-craemy)]">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-[var(--color-darkgreen)] font-heading">
          Forgot Password
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label
              className="block text-[var(--color-darkgreen)] text-lg font-bold mb-2 font-heading"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center mb-6">
            <button
              className="bg-[var(--color-orange)] hover:opacity-90 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline text-lg"
              type="submit"
            >
              Send Reset Link
            </button>
          </div>
        </form>
        {message && <p className="text-center mt-4">{message}</p>}
        <div className="text-center mt-4">
          <Link
            className="inline-block align-baseline font-bold text-lg text-[var(--color-green)] hover:text-[var(--color-lightgreen)]"
            to="/login"
          >
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
