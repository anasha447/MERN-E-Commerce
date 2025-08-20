import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/home";
import ConsumptionMap from "./pages/what.is.mate";
import StoryPage from "./pages/our_story";
import ShopPage from "./pages/shop";
import Cart from "./pages/cart";
import SingleProductPage from "./pages/single-product-page";
import CheckoutPage from "./pages/checkoutpage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import OrderPage from "./pages/OrderPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import UserListPage from "./pages/admin/UserListPage";
import UserEditPage from "./pages/admin/UserEditPage";
import OrderListPage from "./pages/admin/OrderListPage";
import DashboardPage from "./pages/admin/DashboardPage";
import ProductListPage from "./pages/admin/ProductListPage";
import ProductEditPage from "./pages/admin/ProductEditPage";
import GuestPopup from "./components/guestpopup";

// Components
import Header from "./components/header";
import AppFooter from "./components/footer";

// Context
import { CartProvider } from "./context/cart-context";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <GuestPopup />
          <main className="min-h-screen bg-white">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/what.is.mate" element={<ConsumptionMap />} />
              <Route path="/our_story" element={<StoryPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<SingleProductPage />} />
              <Route path="/checkoutpage" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/myorders" element={<OrderHistoryPage />} />
              <Route path="/admin/dashboard" element={<DashboardPage />} />
              <Route path="/admin/users" element={<UserListPage />} />
              <Route path="/admin/user/:id/edit" element={<UserEditPage />} />
              <Route path="/admin/orders" element={<OrderListPage />} />
              <Route path="/admin/products" element={<ProductListPage />} />
              <Route
                path="/admin/product/:id/edit"
                element={<ProductEditPage />}
              />
            </Routes>
          </main>
          <AppFooter />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
