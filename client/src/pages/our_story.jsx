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
          {sections.map((section, index) => {
            const { ref, inView } = useInView({
              triggerOnce: true,
              threshold: 0.2,
            });

            return (
              <div
                key={section.id}
                ref={ref}
                className={`flex flex-col md:flex-row items-center justify-center gap-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Main Image with subtle zoom-in */}
                <motion.img
                  src={section.image}
                  alt={section.title}
                  className="w-80 h-100 object-cover rounded-2xl shadow-xl"
                  initial={{ opacity: 0, scale: 0.9, x: index % 2 === 0 ? -100 : 100 }}
                  animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
                  transition={{ duration: 1 }}
                />

                {/* Text with fade-up effect */}
                <motion.div
                  className="max-w-md"
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1.2 }}
                >
                  <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
                  <p className="text-gray-600">{section.text}</p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoryJourney;
