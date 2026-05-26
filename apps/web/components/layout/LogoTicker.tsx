"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const logos = [
  { name: "Coca Cola", src: "/company/cocacola.webp" },
  { name: "Mercedes", src: "/company/mercedes.webp" },
  { name: "Red Bull", src: "/company/redbull.webp" },
  { name: "Samsung", src: "/company/samsung.webp" },
  { name: "Starbucks", src: "/company/starbucks.webp" },
  { name: "Tesla", src: "/company/tesla.webp" },
];

export default function LogoTicker() {
  return (
    <div className="w-full overflow-hidden py-16 container mx-auto">
      <h3 className="text-center font-heading italic text-2xl md:text-3xl mb-12">
        People are talking
      </h3>

      <div className="relative flex overflow-hidden group">
        {/* Optional: Gradient masks to fade the edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#FFFAF5] to-transparent z-10 dark:from-background" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#FFFAF5] to-transparent z-10 dark:from-background" />

        <motion.div
          className="flex whitespace-nowrap gap-16 pr-16 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25,
          }}
        >
          {/* We render the logos twice to create the seamless loop */}
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 relative w-32 h-12 flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={120}
                height={40}
                className="object-contain w-full h-full"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
