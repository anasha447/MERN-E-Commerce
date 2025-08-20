// src/pages/Home.jsx
import React from "react";
import Banner from "../components/banner";
import FeaturedProducts from "../components/featured_products";
import ScrollingBar from "../components/scrolling_bar"; // Import your scrolling bar component
import YerbaMateBenefits from "../components/key-health"; // Import the benefits component
import CustomerReviews from "../components/review"; // Import the customer reviews component
const Home = () => {
  return (
    <div className="bg-white min-h-screen">
      <Banner />
      <ScrollingBar />
      <FeaturedProducts />
      <YerbaMateBenefits /> {/* Add the benefits section here */}
      <CustomerReviews/>
      
   </div>
  );
};

export default Home;
