"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const carouselImages = [
  { src: "/images/hero-carousel/tahu-bakso-kukus.jpeg", alt: "Tahu Bakso Original" },
  { src: "/images/hero-carousel/tahu-bakso-goreng.jpeg", alt: "Tahu Bakso Pedas" },
  { src: "/images/hero-carousel/lunpia.jpeg", alt: "Tahu Bakso Spesial" },
];

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentImage((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentImage((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-300 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 rounded-full text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              Produk Halal & Bergizi
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
            >
              Tahu Bakso{" "}
              <span className="text-[#22c55e]">Sabrina</span>
              <br />
              
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-lg"
            >
              Tahu Bakso Sabrina (Ibu Ani) khas Jl. Gergaji Balekambang Semarang. Fresh, kenyal, dan nikmat setiap hari.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/produk"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[#22c55e] text-white rounded-full font-semibold hover:bg-[#16a34a] transition-all shadow-lg shadow-green-200"
              >
                Lihat Produk
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#featured"
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-full font-semibold hover:border-[#22c55e] hover:text-[#22c55e] transition-all"
              >
                Pelajari Lagi
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto group">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-br from-[#22c55e] to-[#ef4444] rounded-[3rem] rotate-6 shadow-2xl opacity-20"
              />
              <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl overflow-hidden flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={carouselImages[currentImage].src}
                    src={carouselImages[currentImage].src}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                    alt={carouselImages[currentImage].alt}
                    onError={(e) => {
                      (e.target as any).src = "https://placehold.co/600x600/22c55e/ffffff?text=Tahu+Bakso+Sabrina";
                    }}
                  />
                </AnimatePresence>
                
                {/* Navigation Buttons */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 p-2 bg-white/80 dark:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 p-2 bg-white/80 dark:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-6 h-6 text-gray-800 dark:text-white" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-6 flex gap-2">
                  {carouselImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImage === idx ? "w-6 bg-[#22c55e]" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
