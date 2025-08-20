import React from "react";
import { motion } from "framer-motion";

// ✅ Import local images from assets
import LeafPattern from "../assets/leaf-pattern1.png";
import MateCup from "../assets/mate-cup.jpg";
import IndianStreet from "../assets/indian-street.jpg";

export default function WhatIsMate() {
  return (
    <section
  className="py-16 px-6 md:px-20 relative overflow-hidden"
  style={{
    backgroundColor: "#EADBA2", // Light beige tone
  }}
>
  {/* Background Image Layer */}
  <div
    className="absolute inset-0  bg-[#3E5F2D]/50 mix-blend-multiply"
    style={{
      backgroundImage: `url(${LeafPattern})`,
      backgroundSize: "1515px",
      backgroundRepeat: "repeat",
      backgroundPosition: "center",
      opacity: 0.3, // Image opacity
      filter:  "grayscale(0.2) saturate(0.9) brightness(0.88) contrast(1.05)", // Filters
      zIndex: 0,
    }}
    ></div>
   {/* Content Grid */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-heading font-simibold text-black mb-6"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            Discover Mate – A Sip of the World, with an Indian Heart
          </motion.h2>
          <p className="text-lg font-body font-semibold text-black mb-4">
            Mate (pronounced <em>mah-teh</em>) is a traditional herbal infusion
            loved for centuries in South America. Known for its smooth energy,
            antioxidants, and earthy taste, it’s more than a drink — it’s a
            ritual of friendship.
          </p>
          <p className="text-lg font-body font-semibold text-black mb-4">
            From the streets of Buenos Aires to the cafes of Paris, mate has
            become a global favorite. Athletes, artists, and health lovers enjoy
            this energizing brew as a natural alternative to coffee.
          </p>
          <p className="text-lg font-body font-semibold text-black mb-4">
            At <strong>Matessa</strong>, we blend authentic mate with the warmth
            of Indian spices, creating a drink that’s global in spirit but feels
            like home.
          </p>
          <motion.button
            whileHover={{
              scale: 1.05,
              backgroundColor: "#F26323",
              boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 bg-[#7A9D3E] text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300"
          >
            Taste Indian Mate Today
          </motion.button>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <motion.img
            src={MateCup}
            alt="Mate cup with bombilla"
            className="rounded-2xl shadow-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
          />
          <motion.img
            src={IndianStreet}
            alt="Indian street life with tea vibes"
            className="absolute -bottom-8 -left-8 w-32 md:w-48 rounded-xl shadow-md border-4 border-white"
            initial={{ opacity: 0, rotate: -10, y: 20 }}
            whileInView={{ opacity: 1, rotate: 0, y: 0 }}
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          />
        </motion.div>
      </div>
    </section>
  );
}
