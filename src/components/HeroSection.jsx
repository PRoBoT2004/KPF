import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  // Continuous Floating Particles Component
  const FloatingParticles = () => {
    const particles = Array.from({ length: 35 }, (_, i) => {
      const duration = Math.random() * 20 + 18;
      const ampX = (Math.random() * 20 + 8) * (Math.random() > 0.5 ? 1 : -1);
      const ampY = Math.random() * 30 + 12;
      return {
        id: i,
        size: Math.random() * 2.5 + 1,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        duration,
        delay: -(Math.random() * duration), // negative to randomize initial phase
        ampX,
        ampY,
        opacityBase: Math.random() * 0.2 + 0.1,
      };
    });

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
              // Organic multi-point drift per particle
              x: [0, particle.ampX, -particle.ampX * 0.6, 0],
              y: [0, -particle.ampY, particle.ampY * 0.4, 0],
              opacity: [particle.opacityBase, particle.opacityBase + 0.25, particle.opacityBase, particle.opacityBase],
              scale: [0.9, 1.15, 0.95, 0.9],
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

  // Continuous Geometric Shapes Component
  const GeometricShapes = () => {
    const shapes = Array.from({ length: 6 }, (_, i) => {
      const duration = Math.random() * 35 + 28;
      const driftX = (Math.random() * 24 + 8) * (Math.random() > 0.5 ? 1 : -1);
      const driftY = (Math.random() * 18 + 6) * (Math.random() > 0.5 ? 1 : -1);
      return {
        id: i,
        size: Math.random() * 60 + 40,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        rotation: Math.random() * 360,
        duration,
        delay: -(Math.random() * duration),
        driftX,
        driftY,
        opacityHigh: Math.random() * 0.12 + 0.12,
      };
    });

    return (
      <div className="absolute inset-0 overflow-hidden">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute border border-white/10 bg-white/5"
            style={{
              width: shape.size,
              height: shape.size,
              left: `${shape.initialX}%`,
              top: `${shape.initialY}%`,
              borderRadius: shape.id % 3 === 0 ? "50%" : shape.id % 2 === 0 ? "12px" : "0",
            }}
            animate={{
              // Organic rotation and drift
              rotate: [shape.rotation, shape.rotation + 360],
              scale: [0.95, 1.1, 0.98, 0.95],
              opacity: [0.06, shape.opacityHigh, 0.06, 0.06],
              x: [0, shape.driftX, -shape.driftX * 0.5, 0],
              y: [0, shape.driftY, -shape.driftY * 0.5, 0],
            }}
            transition={{
              duration: shape.duration,
              delay: shape.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  // Continuous Animated Grid Component
  const AnimatedGrid = () => {
    const baseX = Math.floor(Math.random() * 50);
    const baseY = Math.floor(Math.random() * 50);
    return (
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            backgroundPosition: `${baseX}px ${baseY}px`,
          }}
          animate={{
            backgroundPosition: [
              `${baseX}px ${baseY}px`,
              `${baseX + 50}px ${baseY + 50}px`,
            ],
            opacity: [0.08, 0.16, 0.08],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    );
  };

  // Continuous Shooting Stars Component
  const ShootingStars = () => {
    const stars = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      delay: i * 5, // Increased delay between stars
      startX: Math.random() * 50,
      startY: Math.random() * 50,
      duration: 6, // Increased from 4 to 6
      repeatDelay: 12, // Increased from 8 to 12
    }));

    return (
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
            }}
            animate={{
              // Slower shooting movement
              x: [0, 250], // Increased distance
              y: [0, 125], // Increased distance
              opacity: [0, 0.8, 0.8, 0], // Longer visibility
              scale: [0, 1.2, 1.2, 0], // Added scaling
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              repeatDelay: star.repeatDelay,
              ease: "easeOut",
            }}
          >
            <motion.div
              className="absolute h-0.5 bg-gradient-to-r from-white to-transparent"
              style={{ 
                left: -25, 
                top: 0,
                width: 25
              }}
              animate={{
                width: [15, 35, 35, 15], // Animated trail length
                opacity: [0.5, 1, 1, 0.5],
              }}
              transition={{
                duration: star.duration,
                delay: star.delay,
                repeat: Infinity,
                repeatDelay: star.repeatDelay,
                ease: "easeOut",
              }}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  // Continuous Flowing Orbs Component (New)
  const FlowingOrbs = () => {
    const orbs = Array.from({ length: 4 }, (_, i) => {
      const duration = Math.random() * 25 + 22;
      return {
        id: i,
        size: Math.random() * 40 + 20,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        duration,
        delay: -(Math.random() * duration),
        ampX: (Math.random() * 120 + 60) * (Math.random() > 0.5 ? 1 : -1),
        ampY: (Math.random() * 140 + 80) * (Math.random() > 0.5 ? 1 : -1),
      };
    });

    return (
      <div className="absolute inset-0 overflow-hidden">
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full bg-gradient-radial from-white/10 to-transparent blur-xl"
            style={{
              width: orb.size,
              height: orb.size,
              left: `${orb.startX}%`,
              top: `${orb.startY}%`,
            }}
            animate={{
              x: [0, orb.ampX * 0.4, -orb.ampX * 0.2, 0],
              y: [0, -orb.ampY * 0.35, orb.ampY * 0.25, 0],
              scale: [0.9, 1.35, 1.1, 0.9],
              opacity: [0.12, 0.28, 0.18, 0.12],
            }}
            transition={{
              duration: orb.duration,
              delay: orb.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="relative w-full min-h-[100svh] bg-black overflow-hidden gpu">
      {/* Continuous Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Grid - very subtle */}
        <AnimatedGrid />
        
        {/* Floating Particles - organic drift */}
        <FloatingParticles />
        
        {/* Geometric Shapes - organic drift */}
        <GeometricShapes />
        
        {/* Shooting Stars removed from render for a calmer feel */}
        
        {/* New Flowing Orbs */}
        <FlowingOrbs />

        {/* Slower Enhanced center glow (toned down) */}
        <motion.div 
          className="absolute -top-24 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-3xl bg-white/[0.045] blur-[80px] sm:h-[520px] sm:w-[520px] sm:blur-[100px]"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.35, 0.65, 0.35],
            rotate: [0, 3, -3, 0],
          }}
          transition={{
            duration: 12, // Increased from 6 to 12
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Slower Animated side glows (toned down) */}
        <motion.div 
          className="absolute right-[-20%] top-1/3 h-40 w-40 rotate-6 rounded-3xl bg-white/[0.06] blur-[40px] sm:right-[-10%] sm:h-64 sm:w-64 sm:blur-[60px]"
          animate={{
            rotate: [6, 18, 6],
            scale: [1, 1.05, 1],
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 18, // Increased from 10 to 18
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div 
          className="absolute left-[-25%] bottom-1/4 h-36 w-60 -rotate-6 rounded-3xl bg-white/[0.055] blur-[40px] sm:left-[-12%] sm:h-48 sm:w-72 sm:blur-[50px]"
          animate={{
            rotate: [-6, -18, -6],
            scale: [1, 1.05, 1],
            x: [0, -20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 22, // Increased from 12 to 22
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        {/* Animated noise texture (softer) */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:4px_4px]"
          animate={{
            opacity: [0.14, 0.24, 0.14],
            backgroundPosition: ["0px 0px", "4px 4px"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-[100svh] pt-24 sm:pt-28 lg:pt-32">
        <div className="w-full px-5 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-12">
            {/* Left: Text Content */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <motion.h1
                  className="text-[clamp(1.9rem,6vw,3.75rem)] font-extrabold leading-[1.08] text-white relative"
                  style={{
                    textShadow: "0 0 30px rgba(255,255,255,0.3)",
                  }}
                >
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 30px rgba(255,255,255,0.3)",
                        "0 0 45px rgba(255,255,255,0.6)",
                        "0 0 30px rgba(255,255,255,0.3)",
                      ],
                    }}
                    transition={{ duration: 8, repeat: Infinity }} // Slower text glow
                  >
                    Frontend Developer
                  </motion.span>
                  <span className="block">
                    & UI/UX Designer
                  </span>
                </motion.h1>

                {/* Animated underline */}
                <motion.div
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-white/80 to-transparent"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: "60%",
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{ 
                    width: { duration: 1, delay: 1 },
                    opacity: { duration: 3, repeat: Infinity },
                  }}
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 max-w-[60ch] text-[clamp(0.95rem,2.5vw,1.05rem)] leading-relaxed text-white/80"
              >
                I turn ideas into modern, usable digital products — with code that performs and design that connects.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8"
              >
                <motion.a
                  href="#contact"
                  className="group relative inline-flex items-center justify-center rounded-xl border border-white/20 bg-white px-8 py-4 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-black overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 20px 25px -5px rgba(255,255,255,0.1)",
                      "0 25px 35px -5px rgba(255,255,255,0.2)",
                      "0 20px 25px -5px rgba(255,255,255,0.1)",
                    ],
                  }}
                  transition={{
                    boxShadow: { duration: 4, repeat: Infinity },
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/90 to-white"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Work with me 
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity }} // Slower arrow animation
                    >
                      ➝
                    </motion.span>
                  </span>
                </motion.a>
              </motion.div>
            </div>

            {/* Right: Enhanced Image */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 30, rotateY: 10 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mx-auto w-full max-w-xs sm:max-w-sm"
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  className="relative rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm shadow-2xl sm:rounded-3xl sm:p-4"
                  animate={{
                    y: [0, -8, 0], // Gentle floating
                    rotateY: [0, 2, -2, 0], // Subtle rotation
                  }}
                  transition={{
                    duration: 8, // Slow floating
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ 
                    rotateY: 5, 
                    rotateX: 5,
                    scale: 1.02,
                  }}
                >
                  {/* Glowing border effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border border-white/40 sm:rounded-3xl"
                    animate={{
                      opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                      duration: 6, // Slower glow
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  
                  <div className="relative overflow-hidden rounded-xl border border-white/15 sm:rounded-2xl">
                    <div className="aspect-[4/5] w-full">
                      <motion.img
                        src="/assets/profile.jpg"
                        alt="Profile"
                        className="h-full w-full object-cover"
                        loading="eager"
                        decoding="async"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    
                    {/* Enhanced overlay gradients */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/20" />
                    <motion.div 
                      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent"
                      animate={{
                        opacity: [0.15, 0.35, 0.15],
                      }}
                      transition={{
                        duration: 8, // Slower overlay animation
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;