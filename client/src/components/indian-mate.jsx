// src/components/IndianMateStory.jsx
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import carda from "../assets/noideaa.png";
import cloves from "../assets/blackpa.png";
import cinnamon from "../assets/blackpa.png";
import indianmate from "../assets/matecup.png";

export default function IndianMateStory() {
  return (
    <section className="relative bg-gradient-to-b from-orange-50 to-green-50 py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Image with floating spices */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }}
          className="relative flex justify-center"
        >
          <div className="relative">
            <img 
              src={indianmate}
              alt="Indian Mate" 
              className="rounded-2xl shadow-xl w-80"
            />
            {/* Floating spice icons */}
            <motion.img 
              src={cinnamon} 
              alt="Cinnamon" 
              className="absolute -top-6 -left-8 w-12"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
            <motion.img 
              src= {cloves}
              alt="Cardamom" 
              className="absolute top-0 right-0 w-15"
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            <motion.img 
              src= {carda}
              alt="Cloves" 
              className="absolute bottom-0 -right-6 w-10"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
            />
          </div>
        </motion.div>

        {/* Right Side - Story Text */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-green-900 flex items-center gap-2">
            <Sparkles className="text-orange-500 w-7 h-7" />
            The Discovery of Indian Mate
          </h2>
          <p className="text-lg text-gray-700 mt-4 leading-relaxed font-body font-semibold">
            Yerba Mate has long been celebrated in South America as a drink of 
            <span className="font-semibold text-green-800"> energy, community, and tradition</span>.  
            In India, where spices have shaped wellness for centuries, a new story was born — 
            <span className="text-orange-600 font-semibold"> Indian Mate</span>.
          </p>
          <p className="text-lg text-gray-700 mt-4 leading-relaxed font-body font-semibold">
            Blending Mate with <span className="font-semibold text-orange-700">Masala spices</span> like cardamom, 
            ginger, cinnamon, and cloves created a harmony of cultures — balancing 
            <span className="text-green-700 font-semibold"> vitality</span> with 
            <span className="text-orange-700 font-semibold"> warmth and wellness</span>.
          </p>
          <p className="text-lg text-gray-700 mt-4 leading-relaxed font-body font-semibold">
            Today, Indian Mate is a drink of <span className="font-bold">balance, wellness, and global friendship</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
