import React, { useState, useEffect } from "react";
import { MdShoppingCart } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { useCart } from "../context/cart-context";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart(); // ✅ pulls live count from context

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
          {/* Left: Nav */}
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

          {/* Center: Logo */}
          <div className="justify-self-center relative group">
            <Link to="/" aria-label="Matessa home">
              <img
                src={logo}
                alt="Matessa Logo"
                className="h-20 md:h-23 object-contain transition-transform duration-500 group-hover:scale-105 group-hover:animate-pulse-glow"
              />
            </Link>
          </div>

          {/* Right: Cart */}
          <div className="justify-self-end relative">
            <Link to="/cart" aria-label="Cart" className="relative group">
              <MdShoppingCart
                size={26}
                className="text-[#E9DDAF] hover:text-[#E85D1F] transition-colors duration-300"
              />
              {/* Badge for cart count */}
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#E85D1F] text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Glow Pulse Animation */}
      <style>
        {`
          @keyframes glowPulse {
            0% { filter: drop-shadow(0 0 0px #E9DDAF); }
            50% { filter: drop-shadow(0 0 12px #E9DDAF); }
            100% { filter: drop-shadow(0 0 0px #E9DDAF); }
          }
          .animate-pulse-glow {
            animation: glowPulse 1.5s infinite;
          }
        `}
      </style>
    </header>
  );
};

export default Header;
