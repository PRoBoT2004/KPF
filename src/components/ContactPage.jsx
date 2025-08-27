import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const socialLinks = [
    { name: "LinkedIn", link: "https://www.linkedin.com/in/krm00", icon: "/assets/linkedin.png" },
    { name: "Instagram", link: "https://instagram.com/krishna_2004_28", icon: "/assets/insta.png" },
    { name: "GitHub", link: "https://github.com/PRoBoT2004", icon: "/assets/github.png" }
  ];

  // Animated grid base
  const baseX = Math.floor(Math.random() * 50);
  const baseY = Math.floor(Math.random() * 50);

  // Floating Particles Component
  const FloatingParticles = () => {
    const particles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: Math.random() * 35 + 30,
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
              y: [0, -80, 0],
              x: [0, Math.sin(particle.id) * 40, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [0.8, 1.4, 0.8],
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
    const shapes = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      size: Math.random() * 150 + 120,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      rotation: Math.random() * 360,
      duration: Math.random() * 60 + 50,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute border border-white/5 bg-white/2"
            style={{
              width: shape.size,
              height: shape.size,
              left: `${shape.initialX}%`,
              top: `${shape.initialY}%`,
              borderRadius: shape.id % 3 === 0 ? "50%" : shape.id % 2 === 0 ? "30px" : "0",
            }}
            animate={{
              rotate: [shape.rotation, shape.rotation + 360],
              scale: [0.5, 1.5, 0.5],
              opacity: [0.01, 0.08, 0.01],
              x: [0, Math.cos(shape.id) * 60, 0],
              y: [0, Math.sin(shape.id) * 40, 0],
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

  // Floating Orbs Component
  const FloatingOrbs = () => {
    const orbs = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      size: Math.random() * 80 + 60,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      duration: Math.random() * 40 + 35,
      delay: i * 10,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden">
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full bg-gradient-radial from-white/6 to-transparent blur-3xl"
            style={{
              width: orb.size,
              height: orb.size,
              left: `${orb.startX}%`,
              top: `${orb.startY}%`,
            }}
            animate={{
              x: [0, 150, -80, 0],
              y: [0, -120, 160, 0],
              scale: [0.5, 2, 1.5, 0.5],
              opacity: [0.1, 0.3, 0.15, 0.1],
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
    <div className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)
            `,
            backgroundSize: "70px 70px",
            backgroundPosition: `${baseX}px ${baseY}px`,
          }}
          animate={{
            backgroundPosition: [
              `${baseX}px ${baseY}px`,
              `${baseX + 70}px ${baseY + 70}px`,
            ],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Geometric Shapes */}
        <GeometricShapes />

        {/* Floating Orbs */}
        <FloatingOrbs />

        {/* Enhanced Soft Glows */}
        <motion.div
          className="absolute -top-40 left-1/4 h-[800px] w-[800px] rounded-3xl bg-white/[0.008] blur-[200px]"
          animate={{ 
            scale: [1, 1.4, 1], 
            opacity: [0.02, 0.06, 0.02],
            x: [0, 200, 0],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ duration: 50, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-[-20%] h-[500px] w-[500px] rotate-45 rounded-3xl bg-white/[0.01] blur-[150px]"
          animate={{ 
            rotate: [45, 270, 45], 
            x: [0, -150, 0], 
            opacity: [0.015, 0.04, 0.015] 
          }}
          transition={{ duration: 45, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 left-[-20%] h-[600px] w-[600px] -rotate-45 rounded-3xl bg-white/[0.012] blur-[180px]"
          animate={{ 
            rotate: [-45, -270, -45], 
            y: [0, 100, 0], 
            opacity: [0.01, 0.035, 0.01] 
          }}
          transition={{ duration: 55, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Enhanced gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/2 via-transparent to-black/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/1 via-transparent to-black/1" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 sm:pt-32 pb-24">
        {/* Watermark */}
        <div className="pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 text-[clamp(4rem,12vw,8rem)] font-black tracking-tighter text-white/[0.004] select-none z-0">
          CONTACT
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-6">
          {/* Header Section */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-[clamp(2rem,6vw,4rem)] font-extrabold leading-tight text-white relative mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Let's <span className="text-white/80">Connect</span>
              {/* Animated underline */}
              <motion.span
                className="absolute -bottom-4 left-1/2 h-1 -translate-x-1/2 bg-gradient-to-r from-white/70 via-white/40 to-transparent"
                initial={{ width: 0 }}
                animate={{ width: "12rem" }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.h1>
            <motion.p 
              className="text-[clamp(1rem,2.5vw,1.2rem)] leading-relaxed text-white/80 max-w-[70ch] mx-auto"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              I'm always open to discussing new opportunities, creative projects, or just having a chat about design and development. 
              Feel free to reach out through any of the channels below.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Enhanced Contact Form with New Background */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                {/* New Background Effects */}
                {/* Gentle breathing glow */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.04]"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Moving gradient waves */}
                <motion.div
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `linear-gradient(45deg, 
                      transparent 0%, 
                      rgba(255,255,255,0.05) 25%, 
                      transparent 50%, 
                      rgba(255,255,255,0.03) 75%, 
                      transparent 100%)`,
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                {/* Floating dots around the form */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white/30 rounded-full"
                      style={{
                        left: `${10 + i * 10}%`,
                        top: `${20 + (i % 3) * 20}%`,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.5, 1],
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
                
                {/* Subtle border highlight */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border border-white/20 opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Form content */}
                <div className="relative z-10">
                  <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-white mb-8">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      <label htmlFor="name" className="text-white/90 block mb-3 text-sm font-medium">
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all duration-300"
                        placeholder="Your full name"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <label htmlFor="email" className="text-white/90 block mb-3 text-sm font-medium">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                      <label htmlFor="subject" className="text-white/90 block mb-3 text-sm font-medium">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all duration-300"
                        placeholder="What's this about?"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 }}
                    >
                      <label htmlFor="message" className="text-white/90 block mb-3 text-sm font-medium">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all duration-300 resize-none"
                        placeholder="Tell me about your project or inquiry..."
                      />
                    </motion.div>

                    <motion.button
                      type="submit"
                      className="group relative w-full inline-flex items-center justify-center rounded-xl border border-white/20 bg-white px-6 py-4 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-black overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/90 to-white"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10 flex items-center gap-2">
                        Send Message
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </span>
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-8"
            >
              <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold text-white">Get in Touch</h2>
              
              {/* Direct Contact Cards */}
              <div className="space-y-6">
                {[
                  {
                    title: "Email",
                    content: "krishna200428@gmail.com",
                    href: "mailto:krishna200428@gmail.com",
                    icon: "📧"
                  },
                  {
                    title: "Phone",
                    content: "+91 9016116357",
                    href: "tel:+919016116357",
                    icon: "📞"
                  },
                  {
                    title: "Location",
                    content: "India",
                    href: null,
                    icon: "📍"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/8 overflow-hidden"
                    whileHover={{ y: -4, scale: 1.02 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    {/* Subtle glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-white/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    
                    <div className="relative z-10 flex items-center gap-4">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <h3 className="text-white/90 font-semibold mb-1">{item.title}</h3>
                        {item.href ? (
                          <a 
                            href={item.href}
                            className="text-white hover:text-white/80 transition-colors"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-white">{item.content}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Social Links */}
              <div>
                <h3 className="text-white/90 mb-6 text-lg font-semibold">Follow Me</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:border-white/20 hover:bg-white/8 overflow-hidden"
                      whileHover={{ y: -8, scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                      aria-label={`Link to ${social.name}`}
                    >
                      {/* Hover glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      
                      <div className="relative z-10">
                        <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                          <motion.img
                            src={social.icon}
                            alt={`${social.name} icon`}
                            className="max-w-full max-h-full object-contain transition-transform duration-300"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          />
                        </div>
                        <p className="text-sm font-semibold text-white group-hover:text-white/90 transition-colors">
                          {social.name}
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;