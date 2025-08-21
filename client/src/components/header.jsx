import React, { useState, useEffect, useContext } from "react";
import { MdShoppingCart } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import md5 from "md5";
import logo from "../assets/logo.png";
import { useCart } from "../context/cart-context";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  let userMenuTimeout;
  let adminMenuTimeout;

  const { itemCount } = useCart();
  const { userInfo, logout } = useContext(AuthContext);

  const getGravatarURL = (email) => {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
  };

  const handleUserMenuEnter = () => {
    clearTimeout(userMenuTimeout);
    setIsUserMenuOpen(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeout = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 1000);
  };

  const handleAdminMenuEnter = () => {
    clearTimeout(adminMenuTimeout);
    setIsAdminMenuOpen(true);
  };

  const handleAdminMenuLeave = () => {
    adminMenuTimeout = setTimeout(() => {
      setIsAdminMenuOpen(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(userMenuTimeout);
      clearTimeout(adminMenuTimeout);
    };
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

          <div className="justify-self-center relative">
            <Link to="/" aria-label="Matessa home">
              <img
                src={logo}
                alt="Matessa Logo"
                className="h-20 md:h-23 object-contain transition-transform duration-500 hover:scale-105"
              />
            </Link>
          </div>

          <div className="justify-self-end flex items-center gap-4">
            <Link to="/cart" aria-label="Cart" className="relative">
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

            {userInfo && userInfo.isAdmin ? (
              <div
                className="relative"
                onMouseEnter={handleAdminMenuEnter}
                onMouseLeave={handleAdminMenuLeave}
              >
                <button className="text-[#E9DDAF] hover:text-[#E85D1F] transition-colors font-bold">
                  Admin
                </button>
                {isAdminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[var(--color-craemy)] rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-white hover:bg-[var(--color-lightgreen)]"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block px-4 py-2 text-sm text-white hover:bg-[var(--color-lightgreen)]"
                    >
                      Users
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="block px-4 py-2 text-sm text-white hover:bg-[var(--color-lightgreen)]"
                    >
                      Orders
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block px-4 py-2 text-sm text-white hover:bg-[var(--color-lightgreen)]"
                    >
                      Products
                    </Link>
                     <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[var(--color-lightgreen)]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="relative"
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <button className="text-[#E9DDAF] hover:text-[#E85D1F] transition-colors">
                  {userInfo ? (
                    <img
                      src={getGravatarURL(userInfo.email)}
                      alt={userInfo.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <FaUserCircle size={26} />
                  )}
                </button>
                {isUserMenuOpen &&
                  (userInfo ? (
                    <div className="absolute right-0 mt-2 w-48 bg-[var(--color-craemy)] rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 text-sm text-white border-b border-white/20">
                        Signed in as <strong>{userInfo.name}</strong>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-[var(--color-lightgreen)]"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/myorders"
                        className="block px-4 py-2 text-sm text-white hover:bg-[var(--color-lightgreen)]"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[var(--color-lightgreen)]"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="absolute right-0 mt-2 w-48 bg-[var(--color-craemy)] rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-white hover:bg-[var(--color-lightgreen)]"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-white hover:bg-[var(--color-lightgreen)]"
                      >
                        Register
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
