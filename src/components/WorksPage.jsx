import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const WorkSection = ({ title, description, videoSrc, imgSrc, reverse, link, index }) => {
  const navigate = useNavigate();

  return (
    <motion.section
      className="relative w-full py-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.05,
        ease: "easeOut"
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="w-full px-5 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className={`flex flex-col lg:flex-row items-center gap-16 ${
            reverse ? "lg:flex-row-reverse" : ""
          }`}>
            {/* Enhanced Media Card - Fixed Size */}
            <motion.div
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4,
                delay: 0.1,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
            >
              <motion.div
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm w-full max-w-[600px] mx-auto"
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {/* Continuous Rotating Border Animation */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `conic-gradient(from ${index * 45}deg, 
                      transparent 0deg, 
                      rgba(255,255,255,0.15) 90deg, 
                      transparent 180deg, 
                      rgba(255,255,255,0.08) 270deg, 
                      transparent 360deg)`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
                
                {/* Secondary rotating border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `conic-gradient(from ${-index * 60}deg, 
                      transparent 0deg, 
                      rgba(255,255,255,0.1) 120deg, 
                      transparent 240deg, 
                      rgba(255,255,255,0.05) 300deg, 
                      transparent 360deg)`,
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
                
                {/* Inner border */}
                <div className="absolute inset-[2px] rounded-3xl bg-black/80 backdrop-blur-sm" />
                
                {/* Sweeping light effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `linear-gradient(${45 + index * 30}deg, 
                      transparent 0%, 
                      transparent 45%, 
                      rgba(255,255,255,0.1) 50%, 
                      transparent 55%, 
                      transparent 100%)`,
                  }}
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: "easeInOut",
                  }}
                />

                {/* Project Type Badge */}
                <div className="absolute top-8 right-8 z-20">
                  <motion.span 
                    className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    {videoSrc ? '🎬' : '🖼️'}
                    {videoSrc ? 'Interactive' : 'Design'}
                  </motion.span>
                </div>

                {/* Media Container - Fixed Aspect Ratio */}
                <div className="relative z-10 overflow-hidden rounded-2xl aspect-[4/3] w-full">
                  {videoSrc ? (
                    <motion.video
                      className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={videoSrc} type="video/mp4" />
                    </motion.video>
                  ) : (
                    <motion.img
                      src={imgSrc}
                      alt={title}
                      className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
                    />
                  )}
                  
                  {/* Media overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  
                  {/* Floating particles on hover */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white/60 rounded-full"
                        style={{
                          left: `${20 + i * 15}%`,
                          top: `${30 + i * 10}%`,
                        }}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.6, 1, 0.6],
                          scale: [1, 1.5, 1],
                        }}
                        transition={{
                          duration: 2,
                          delay: i * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </motion.div>
                </div>

                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </motion.div>
            </motion.div>

            {/* Enhanced Text Content */}
            <motion.div
              className={`w-full lg:w-1/2 text-center lg:text-left ${
                reverse ? "lg:pr-12" : "lg:pl-12"
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4,
                delay: 0.15,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
            >
              <motion.h1
                className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-white mb-6 leading-tight relative"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {title}
                {/* Animated underline */}
                <motion.span
                  className="absolute -bottom-2 left-1/2 lg:left-0 h-1 -translate-x-1/2 lg:translate-x-0 bg-gradient-to-r from-white/70 via-white/40 to-transparent"
                  initial={{ width: 0 }}
                  whileInView={{ width: "5rem" }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </motion.h1>
              
              <motion.p
                className="text-[clamp(0.95rem,2.5vw,1.1rem)] leading-relaxed text-white/80 mb-8 max-w-[50ch] mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                {description}
              </motion.p>
              
              <motion.button
                onClick={() => navigate(link)}
                className="group relative inline-flex items-center justify-center rounded-xl border border-white/20 bg-white px-8 py-4 text-sm font-semibold text-black shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-black overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/90 to-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.2 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Explore Now
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const WorkPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animated grid base
  const baseX = Math.floor(Math.random() * 50);
  const baseY = Math.floor(Math.random() * 50);

  // Floating Particles Component
  const FloatingParticles = () => {
    const particles = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: Math.random() * 30 + 25,
      delay: Math.random() * 15,
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
              y: [0, -70, 0],
              x: [0, Math.sin(particle.id) * 35, 0],
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
    const shapes = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: Math.random() * 120 + 100,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      rotation: Math.random() * 360,
      duration: Math.random() * 50 + 40,
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
              borderRadius: shape.id % 3 === 0 ? "50%" : shape.id % 2 === 0 ? "24px" : "0",
            }}
            animate={{
              rotate: [shape.rotation, shape.rotation + 360],
              scale: [0.6, 1.4, 0.6],
              opacity: [0.02, 0.12, 0.02],
              x: [0, Math.cos(shape.id) * 50, 0],
              y: [0, Math.sin(shape.id) * 30, 0],
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

  const projects = [
    {
      title: "CryptoDash",
      description: "A live cryptocurrency dashboard demonstrating real-time API integration and responsive UI.",
      imgSrc: "/assets/4.png",
      link: "/works/cryptodash-case-study"
    },
    {
      title: "DripStride",
      description: "An e-commerce sneaker store showcasing component-based frontend architecture and smooth user experience.",
      imgSrc: "/assets/5.png",
      link: "/works/dripstride-case-study"
    },
    {
      title: "Color Pencil",
      description: "Explore how Color Pencil brings creativity to the forefront through engaging UI/UX design.",
      videoSrc: "/assets/1.mp4",
      link: "/works/colorpencil-case-study"
    },
    {
      title: "Launchpad",
      description: "Dive into the digital transformation process with Launchpad's comprehensive user experience journey.",
      videoSrc: "/assets/2.mp4",
      link: "/works/launchpad-case-study"
    },
    {
      title: "Enda",
      description: "Enda showcases how branding and design converge to create an impactful narrative.",
      videoSrc: "/assets/3.mp4",
      link: "/works/enda-case-study"
    },
    {
      title: "Biocon Biologics",
      description: "Biocon Biologics project highlights educational innovation in the digital space.",
      videoSrc: "/assets/4.mp4",
      link: "/works/bioconbiologics-case-study"
    },
    {
      title: "OnGo",
      description: "OnGo simplifies commutes with intuitive mobile UX and sharp branding.",
      imgSrc: "/assets/ongo.png",
      link: "/works/ongo-case-study"
    }
  ];

  return (
    <div className="relative w-full bg-black overflow-hidden">
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
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Geometric Shapes */}
        <GeometricShapes />

        {/* Enhanced Soft Glows */}
        <motion.div
          className="absolute -top-40 left-1/3 h-[700px] w-[700px] rounded-3xl bg-white/[0.01] blur-[180px]"
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.03, 0.08, 0.03],
            x: [0, 150, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 right-[-15%] h-96 w-96 rotate-45 rounded-3xl bg-white/[0.015] blur-[120px]"
          animate={{ 
            rotate: [45, 225, 45], 
            x: [0, -100, 0], 
            opacity: [0.02, 0.06, 0.02] 
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-[-15%] h-80 w-80 -rotate-45 rounded-3xl bg-white/[0.018] blur-[120px]"
          animate={{ 
            rotate: [-45, -135, -45], 
            y: [0, 50, 0], 
            opacity: [0.02, 0.07, 0.02] 
          }}
          transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Enhanced gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/3 via-transparent to-black/8" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/2 via-transparent to-black/2" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 sm:pt-32">
        {/* Watermark */}
        <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 text-[clamp(4rem,12vw,8rem)] font-black tracking-tighter text-white/[0.006] select-none z-0">
          PROJECTS
        </div>

        {/* Header Section */}
        <motion.div
          className="text-center mb-8 px-5 sm:px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h1
            className="text-[clamp(2rem,6vw,4rem)] font-extrabold leading-tight text-white relative mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            All Projects
            {/* Animated underline */}
            <motion.span
              className="absolute -bottom-4 left-1/2 h-1 -translate-x-1/2 bg-gradient-to-r from-white/70 via-white/40 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: "10rem" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <motion.span
              className="absolute -bottom-4 left-1/2 h-1 -translate-x-1/2 bg-gradient-to-r from-white/30 to-transparent blur-sm"
              initial={{ width: 0 }}
              animate={{ width: "10rem" }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </motion.h1>
          
          <motion.p
            className="text-[clamp(1rem,2.5vw,1.2rem)] leading-relaxed text-white/80 max-w-[65ch] mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            Explore my complete portfolio of design and development work, showcasing innovative solutions and creative excellence.
          </motion.p>
        </motion.div>

        {/* Projects */}
        <div className="space-y-8">
          {projects.map((project, index) => (
            <WorkSection
              key={project.title}
              title={project.title}
              description={project.description}
              videoSrc={project.videoSrc}
              imgSrc={project.imgSrc}
              link={project.link}
              reverse={index % 2 !== 0}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkPage;