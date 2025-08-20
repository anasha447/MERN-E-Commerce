import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    login(email, password);
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--color-craemy)]">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-10">
        <h1 className="text-4xl font-bold mb-8 text-center text-[var(--color-darkgreen)] font-heading">
          Welcome Back
        </h1>
        <form onSubmit={submitHandler}>
          <div className="mb-6">
            <label
              className="block text-[var(--color-darkgreen)] text-lg font-bold mb-2 font-heading"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <label
              className="block text-[var(--color-darkgreen)] text-lg font-bold mb-2 font-heading"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center mb-6">
            <button
              className="bg-[var(--color-orange)] hover:opacity-90 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline text-lg"
              type="submit"
            >
              Sign In
            </button>
          </div>
          <div className="text-center">
            <Link
              className="inline-block align-baseline font-bold text-lg text-[var(--color-green)] hover:text-[var(--color-lightgreen)]"
              to="/register"
            >
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
