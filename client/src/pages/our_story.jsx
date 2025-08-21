import React from "react";
import OurStoryBanner from "../components/banner-ourstory";
import Matecup from "../assets/matecup.jpg";
import StorySection from "../components/ourstory/StorySection";

const sections = [
  {
    id: 1,
    title: "The Mate Tradition",
    text: "Yerba Mate, cherished in South America for centuries, is more than just a drink — it's a symbol of friendship and energy.",
    image: Matecup,
  },
  {
    id: 2,
    title: "The Indian Masala",
    text: "India’s masala spices — cinnamon, cloves, cardamom, and star anise — have been warming hearts for generations.",
    image: "/images/masala.jpg",
  },
  {
    id: 3,
    title: "The Fusion",
    text: "Bringing together the earthy mate and spicy masala creates a bold fusion — refreshing, energizing, and truly unique.",
    image: "/images/fusion.jpg",
  },
];

const StoryJourney = () => {
  return (
    <div>
      <OurStoryBanner />
      <div className="bg-white py-16">
        <h2 className="text-3xl font-bold font-heading text-center mb-12">
          Our Story
        </h2>

        <div className="space-y-32">
          {sections.map((section, index) => (
            <StorySection key={section.id} section={section} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoryJourney;
