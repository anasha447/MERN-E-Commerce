// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Pages
import Home from "./pages/home";
import ConsumptionMap from "./pages/what.is.mate";
import StoryPage from "./pages/our_story";
import ShopPage from "./pages/shop";
import Cart from "./pages/cart";
import SingleProductPage from "./pages/single-product-page"; // 👈 added
import CheckoutPage from "./pages/checkoutpage"; // 👈 added
import GuestPopup from "./components/guestpopup";

// ✅ Components
import Header from "./components/header";
import AppFooter from "./components/footer";

// ✅ Context
import { CartProvider } from "./context/cart-context";

function App() {
  return (
    <CartProvider>
      <Router>
        {/* ✅ Always visible Header */}
        <Header />
        <GuestPopup />

        {/* ✅ Routes */}
        <main className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/what.is.mate" element={<ConsumptionMap />} />
            <Route path="/our_story" element={<StoryPage />} />
            <Route path="/cart" element={<Cart />} />

            {/* ✅ New Routes */}
            <Route path="/product/:id" element={<SingleProductPage />} />
            <Route path="/checkoutpage" element={<CheckoutPage />} />
          </Routes>
        </main>

        {/* ✅ Always visible Footer */}
        <AppFooter />
      </Router>
    </CartProvider>
  );
}

export default App;
