import React, { useState, useEffect, useContext } from "react";
import { MdShoppingCart } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useCart } from "../context/cart-context";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  const { userInfo, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${
        isScrolled ? "bg-[#2E422D]/50 shadow-md" : "bg-[#2E422D]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 items-center h-26 md:h-25">
          <nav className="hidden md:block">
            <ul className="flex gap-8 font-body font-bold text-base lg:text-lg">
              {[
                { name: "Home", path: "/" },
                { name: "Shop", path: "/shop" },
                { name: "What is mate?!", path: "/what.is.mate" },
                { name: "Our Story", path: "/our_story" },
              ].map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `text-[#E9DDAF] hover:text-[#E85D1F] transition-colors ${
                        isActive ? "underline underline-offset-4" : ""
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="justify-self-center relative group">
            <Link to="/" aria-label="Matessa home">
              <img
                src={logo}
                alt="Matessa Logo"
                className="h-20 md:h-23 object-contain transition-transform duration-500 group-hover:scale-105 group-hover:animate-pulse-glow"
              />
            </Link>
          </div>

          <div className="justify-self-end flex items-center gap-4">
            <Link to="/cart" aria-label="Cart" className="relative group">
              <MdShoppingCart
                size={26}
                className="text-[#E9DDAF] hover:text-[#E85D1F] transition-colors duration-300"
              />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E85D1F] text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                  {itemCount}
                </span>
              )}
            </Link>
            {userInfo && userInfo.isAdmin && (
              <div className="relative group">
                <button className="text-[#E9DDAF] hover:text-[#E85D1F] transition-colors">
                  Admin
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  <Link
                    to="/admin/users"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Orders
                  </Link>
                </div>
              </div>
            )}
            {userInfo ? (
              <div className="relative group">
                <button className="text-[#E9DDAF] hover:text-[#E85D1F] transition-colors">
                  {userInfo.name}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/myorders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-[#E9DDAF] hover:text-[#E85D1F] transition-colors font-bold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
