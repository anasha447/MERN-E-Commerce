// src/components/MateTimeline.jsx
import { motion } from "framer-motion";

const timelineData = [
  { year: "1600s", event: "Mate consumed by indigenous Guaraní people." },
  { year: "1700s", event: "Spanish colonists adopt mate in South America." },
  { year: "1800s", event: "Yerba mate becomes a national drink in Argentina, Uruguay, and Paraguay." },
  { year: "1900s", event: "Mate culture expands into Chile & Brazil." },
  { year: "2000s", event: "Mate exports grow worldwide, reaching Europe & the U.S." },
  { year: "2020s", event: "Mate infused with new blends: Masala, Tulsi, Mint gaining popularity in India." },
];

export default function MateTimeline() {
  return (
    <section className="py-20 bg-gradient-to-b from-green-50 to-green-100">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold font-heading text-green-900">The Journey of Mate</h2>
        <p className="text-lg text-green-700 mt-2 font-body font-simibold">
          From its origins to worldwide popularity
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Line */}
        <div className="hidden md:block absolute top-[90px] left-0 w-full h-1 bg-green-400" />
        <div className="md:hidden absolute left-1/2 transform -translate-x-1/2 top-0 h-full w-1 bg-green-400" />

        {/* Timeline items */}
        <div className="grid md:grid-cols-6 grid-cols-1 gap-16 relative z-10">
          {timelineData.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.3 }}
              className="flex flex-col items-center text-center relative"
            >
              {/* Circle with line passing through */}
              <div className="relative flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-lightgreen text-white flex items-center justify-center font-bold text-lg shadow-xl border-3 border-lightgreen z-10">
                  {item.year}
                </div>
              </div>

              {/* Description below line */}
              <p className="text-green-800 text-sm md:text-base mt-6 max-w-xs">
                {item.event}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
