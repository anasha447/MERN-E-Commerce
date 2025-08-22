import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bannerImg from "../assets/banner.png";
import bannerImg1 from "../assets/banner2.jpg";
import bannerImg2 from "../assets/banner4.png";

const images = [bannerImg, bannerImg1, bannerImg2];

const variants = {
  enter: {
    opacity: 0,
  },
  center: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000); // 5 seconds auto-slide
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-[600px] md:h-[800px] overflow-hidden relative">
      <AnimatePresence initial={false}>
        <motion.img
          key={current}
          src={images[current]}
          alt={`banner ${current + 1}`}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 1.0 },
          }}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </AnimatePresence>

      {/* Dots Container */}
      <div className="absolute bottom-8 right-8 flex items-center space-x-4.5 px-4 py-2.5 bg-black/10 rounded-full">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className="relative h-3 w-3.5 rounded-full focus:outline-none hover: cursor-pointer"
          >
            <span
              className={`block h-full w-full rounded-full transition-colors duration-300 ${
                current === index ? "bg-transparent" : "bg-white/50 hover:bg-white/80"
              }`}
            />
            {current === index && (
              <motion.div
                className="absolute inset-0 bg-[var(--color-orange)] rounded-full"
                layoutId="active-pill"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{
                  width: "24px", // Pill shape width
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}