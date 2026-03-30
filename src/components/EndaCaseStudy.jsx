import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EndaCaseStudy = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const boxRef = useRef(null);

  const images = [
    "/assets/e2.png",
    "/assets/e1.png",
    "/assets/e3.png",
    "/assets/e4.png",
  ];

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const selectImage = (index) => {
    setCurrentIndex(index);
  };

  // Animated grid base
  const baseX = Math.floor(Math.random() * 50);
  const baseY = Math.floor(Math.random() * 50);

  const Section = ({ children, className = "" }) => (
    <section className={`relative w-full ${className}`}>
      <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6">{children}</div>
    </section>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)
            `,
            backgroundSize: "65px 65px",
            backgroundPosition: `${baseX}px ${baseY}px`,
          }}
          animate={{
            backgroundPosition: [
              `${baseX}px ${baseY}px`,
              `${baseX + 65}px ${baseY + 65}px`,
            ],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />

        {/* Soft glows */}
        <motion.div
          className="absolute -top-32 left-1/3 h-[600px] w-[600px] rounded-3xl bg-white/[0.02] blur-[160px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.04, 0.08, 0.04], x: [0, 120, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-[-15%] h-[500px] w-[500px] rotate-12 rounded-3xl bg-white/[0.015] blur-[140px]"
          animate={{ rotate: [12, 180, 12], opacity: [0.02, 0.06, 0.02], x: [0, -100, 0] }}
          transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/3 via-transparent to-black/3" />
      </div>

      {/* Watermark */}
      <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 text-[clamp(3.5rem,11vw,8rem)] font-black tracking-tighter text-white/[0.008] select-none z-0">
        ENDA
      </div>

      <div className="relative z-10 pt-24 sm:pt-32 pb-24">
        {/* Hero Section */}
        <Section className="mb-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.img
              src="/assets/enda-logo.png"
              alt="Enda Logo"
              className="w-28 sm:w-36 mx-auto mb-5 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
            <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-extrabold text-white leading-tight mb-4">
              Enda — Web UI Redesign
            </h1>
            <p className="text-[clamp(1rem,2.5vw,1.2rem)] text-white/80 max-w-[70ch] mx-auto">
              Redesigning Enda’s website to improve usability, accessibility, and modernize the visual language.
            </p>
          </motion.div>
        </Section>

        {/* Overview + Solution */}
        <Section className="mb-16">
          <div className="mx-auto max-w-5xl grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div
              className="rounded-2xl border border-white/10 bg白/5 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-white text-xl font-semibold mb-3">The Problem</h3>
              <ul className="list-disc list-inside text-white/80 space-y-2 text-base">
                <li>Confusing navigation with hidden features</li>
                <li>Unintuitive workout tracking system</li>
                <li>Outdated design and lack of visual hierarchy</li>
              </ul>
            </motion.div>
            <motion.div
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              <h3 className="text-white text-xl font-semibold mb-3">The Solution</h3>
              <ul className="list-disc list-inside text-white/80 space-y-2 text-base">
                <li>Optimized navigation with clearer layout</li>
                <li>Improved tracking system with readable metrics</li>
                <li>Modernized UI with engaging visuals and subtle motion</li>
              </ul>
            </motion.div>
          </div>
        </Section>

        {/* Final Screens Gallery */}
        <Section className="mb-16">
          <motion.div
            className="max-w-5xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="relative w-full rounded-xl overflow-hidden border border-white/10 h-72 sm:h-[420px]">
              <div className="w-full h-full overflow-y-auto">
                <img
                  src={images[currentIndex]}
                  alt={`UI Preview ${currentIndex}`}
                  className="object-contain object-top w-full"
                />
              </div>
              <button
                onClick={prevImage}
                className="absolute px-4 py-2 text-white transform -translate-y-1/2 rounded-full top-1/2 left-3 bg-black/40 hover:bg-black/60"
              >
                ◀
              </button>
              <button
                onClick={nextImage}
                className="absolute px-4 py-2 text-white transform -translate-y-1/2 rounded-full top-1/2 right-3 bg-black/40 hover:bg-black/60"
              >
                ▶
              </button>
              <div className="absolute flex gap-2 transform -translate-x-1/2 bottom-4 left-1/2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${currentIndex === index
                      ? "bg-white scale-110"
                      : "bg-white/50 hover:bg-white/70"
                      }`}
                    onClick={() => selectImage(index)}
                  ></button>
                ))}
              </div>
            </div>
          </motion.div>
        </Section>

        {/* External Links */}
        <Section className="mb-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://enda-website.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center rounded-xl border border-white/20 bg-white px-8 py-4 text-sm font-semibold text-black shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-black overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/90 to-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.25 }}
                />
                <span className="relative z-10">Live Website</span>
              </a>
              <a
                href="https://www.figma.com/design/S3yz8PnbcsXQMVAEW9QlJo/ENDA?node-id=0-1&t=AgF8CtpwB99ndyvH-1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white/90 backdrop-blur-sm transition-all hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Figma Design
              </a>
            </div>
          </motion.div>
        </Section>

        {/* Back Button */}
        <Section>
          <div className="text-center">
            <Link to="/works/">
              <button className="group relative inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur-sm transition-all hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                ← Back to UI/UX Projects
              </button>
            </Link>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default EndaCaseStudy;
