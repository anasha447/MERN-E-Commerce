import { useState, useEffect } from "react";
import bannerImg from "../assets/banner.png"; // adjust path if needed
import bannerImg1 from "../assets/banner2.jpg"; // adjust path if needed
import bannerImg2 from "../assets/banner4.png"; // adjust path if needed

const images = [bannerImg, bannerImg1, bannerImg2];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-[800px] overflow-hidden relative">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`banner ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-center transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dots Container */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Show banner ${index + 1}`}
            className={`
              w-4 h-4 rounded-full
              ${index === current ? "bg-[#FF6600]" : "bg-gray-300"}
              hover:bg-[#FF6600]
              transition-colors duration-300
              focus:outline-none
              focus:ring-2 focus:ring-[#FF6600] focus:ring-opacity-50
            `}
          />
        ))}
      </div>
    </div>
  );
}
