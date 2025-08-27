import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const BioconBiologicsCaseStudy = () => {
  // Animated grid base
  const baseX = Math.floor(Math.random() * 50);
  const baseY = Math.floor(Math.random() * 50);

  // Floating Particles Component
  const FloatingParticles = () => {
    const particles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: Math.random() * 25 + 20,
      delay: Math.random() * 10,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-white rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.initialX}%`,
              top: `${particle.initialY}%`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.sin(particle.id) * 30, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  // Geometric Shapes Component
  const GeometricShapes = () => {
    const shapes = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      size: Math.random() * 100 + 80,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      rotation: Math.random() * 360,
      duration: Math.random() * 40 + 30,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute border border-white/6 bg-white/2"
            style={{
              width: shape.size,
              height: shape.size,
              left: `${shape.initialX}%`,
              top: `${shape.initialY}%`,
              borderRadius: shape.id % 3 === 0 ? "50%" : shape.id % 2 === 0 ? "20px" : "0",
            }}
            animate={{
              rotate: [shape.rotation, shape.rotation + 360],
              scale: [0.7, 1.3, 0.7],
              opacity: [0.02, 0.1, 0.02],
              x: [0, Math.cos(shape.id) * 40, 0],
              y: [0, Math.sin(shape.id) * 25, 0],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            backgroundPosition: `${baseX}px ${baseY}px`,
          }}
          animate={{
            backgroundPosition: [
              `${baseX}px ${baseY}px`,
              `${baseX + 60}px ${baseY + 60}px`,
            ],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Geometric Shapes */}
        <GeometricShapes />

        {/* Soft Glows */}
        <motion.div
          className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-3xl bg-white/[0.015] blur-[150px]"
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.03, 0.08, 0.03],
            x: [0, 150, 0]
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-[-15%] h-80 w-80 rotate-45 rounded-3xl bg-white/[0.02] blur-[100px]"
          animate={{ 
            rotate: [45, 180, 45], 
            x: [0, -100, 0], 
            opacity: [0.02, 0.06, 0.02] 
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/3 via-transparent to-black/3" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 sm:pt-32 pb-24">
        {/* Watermark */}
        <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 text-[clamp(3rem,10vw,6rem)] font-black tracking-tighter text-white/[0.008] select-none z-0">
          BIOCON
        </div>

        <div className="w-full px-5 sm:px-6">
          <div className="mx-auto max-w-6xl">
            {/* Hero Section */}
            <motion.section 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 overflow-hidden"
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                {/* Subtle glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/8 via-transparent to-white/4"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative z-10">
                  <motion.img
                    src="/assets/biocon-logo.png"
                    alt="Biocon Biologics Logo"
                    className="mx-auto mb-6 w-24 sm:w-28 md:w-32"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                  />
                  <motion.h1 
                    className="text-[clamp(1.75rem,5vw,3rem)] font-extrabold leading-tight text-white mb-4 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    Biocon Biologics Website Redesign
                    {/* Animated underline */}
                    <motion.span
                      className="absolute -bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 bg-gradient-to-r from-white/70 to-transparent"
                      initial={{ width: 0 }}
                      animate={{ width: "8rem" }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </motion.h1>
                  <motion.p 
                    className="text-[clamp(1rem,2.5vw,1.2rem)] leading-relaxed text-white/80 max-w-[60ch] mx-auto"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    Revamping Biocon Biologics' digital presence to enhance accessibility and engagement.
                  </motion.p>
                </div>
              </motion.div>
            </motion.section>

            {/* Project Overview */}
            <motion.section 
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden"
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                {/* Subtle moving glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)`,
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative z-10">
                  <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-white mb-6">Project Overview</h2>
                  <p className="text-[clamp(0.95rem,2.5vw,1.1rem)] leading-relaxed text-white/80">
                    Biocon Biologics is a global leader in biosimilars and biologics. This redesign focused on navigation, accessibility, and content structure, creating a seamless experience for healthcare professionals and patients alike.
                  </p>
                </div>
              </motion.div>
            </motion.section>

            {/* Problem & Solution */}
            <motion.section 
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {[
                {
                  title: "❌ The Problem",
                  items: [
                    "Outdated design with complex navigation",
                    "Inconsistent experience across devices", 
                    "Poor information flow for key users"
                  ]
                },
                {
                  title: "✅ The Solution",
                  items: [
                    "Modern, responsive layout",
                    "Clean content segregation",
                    "Faster access to resources"
                  ]
                }
              ].map((section, index) => (
                <motion.div
                  key={section.title}
                  className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden"
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl bg-white/3 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  />
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
                    <ul className="space-y-3">
                      {section.items.map((item, i) => (
                        <motion.li
                          key={i}
                          className="flex items-start gap-3 text-white/80"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 * i }}
                          viewport={{ once: true }}
                        >
                          <span className="w-1.5 h-1.5 bg-white/60 rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.section>

            {/* External Links */}
            <motion.section 
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-white mb-8 text-center">Explore the Designs</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                {[
                  {
                    href: "https://www.bioconbiologics.com/",
                    text: "🔗 Live Website",
                    color: "from-orange-500 to-red-500"
                  },
                  {
                    href: "https://www.figma.com/design/ev6q1EMF47vz1J8c3wNcfD/Biocon?node-id=0-1&t=BUgERbQY4ml3mXDl-1",
                    text: "🎨 Figma Design", 
                    color: "from-blue-500 to-purple-500"
                  }
                ].map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center rounded-xl border border-white/20 bg-white px-8 py-4 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-black overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/90 to-white"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      {link.text}
                      <motion.span
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.section>

            {/* Back Button */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link to="/works/">
                <motion.button 
                  className="group relative inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-2">
                    ← Back to Projects
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioconBiologicsCaseStudy;