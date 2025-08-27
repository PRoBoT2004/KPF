import { motion } from "framer-motion";

const socialLinks = [
  { name: "LinkedIn", link: "https://www.linkedin.com/in/krm00", icon: "/assets/linkedin.png" },
  { name: "Instagram", link: "https://instagram.com/krishna_2004_28", icon: "/assets/insta.png" },
  { name: "GitHub", link: "https://github.com/PRoBoT2004", icon: "/assets/github.png" }
];

const ContactMe = () => {
  // Subtle animated grid base (randomized phase per mount)
  const baseX = Math.floor(Math.random() * 50);
  const baseY = Math.floor(Math.random() * 50);

  // Floating Particles Component
  const FloatingParticles = () => {
    const particles = Array.from({ length: 30 }, (_, i) => ({
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
              y: [0, -60, 0],
              x: [0, Math.sin(particle.id) * 30, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [0.7, 1.4, 0.7],
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
      duration: Math.random() * 45 + 35,
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
              opacity: [0.03, 0.15, 0.03],
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

  // Floating Orbs Component
  const FloatingOrbs = () => {
    const orbs = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 40,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      duration: Math.random() * 30 + 25,
      delay: i * 8,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden">
        {orbs.map((orb) => (
          <motion.div
            key={orb.id}
            className="absolute rounded-full bg-gradient-radial from-white/8 to-transparent blur-2xl"
            style={{
              width: orb.size,
              height: orb.size,
              left: `${orb.startX}%`,
              top: `${orb.startY}%`,
            }}
            animate={{
              x: [0, 120, -60, 0],
              y: [0, -100, 140, 0],
              scale: [0.6, 1.8, 1.4, 0.6],
              opacity: [0.1, 0.4, 0.2, 0.1],
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
    <section id="contact" className="relative w-full min-h-screen bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
            `,
            backgroundSize: "58px 58px",
            backgroundPosition: `${baseX}px ${baseY}px`,
          }}
          animate={{
            backgroundPosition: [
              `${baseX}px ${baseY}px`,
              `${baseX + 58}px ${baseY + 58}px`,
            ],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 85, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Geometric Shapes */}
        <GeometricShapes />

        {/* Floating Orbs */}
        <FloatingOrbs />

        {/* Enhanced Soft Glows */}
        <motion.div
          className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-3xl bg-white/[0.02] blur-[140px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-5%] top-1/4 h-60 w-60 rotate-60 rounded-3xl bg-white/[0.025] blur-[80px]"
          animate={{ rotate: [60, 120, 60], x: [0, 30, 0], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[-5%] bottom-1/4 h-48 w-80 -rotate-60 rounded-3xl bg-white/[0.02] blur-[70px]"
          animate={{ rotate: [-60, -120, -60], y: [0, 25, 0], opacity: [0.06, 0.16, 0.06] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Enhanced gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5" />
        
        {/* Radial gradient for focus */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen pt-24 sm:pt-28 lg:pt-32 pb-24">
        {/* Lighter Watermark label */}
        <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 text-7xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white/[0.015] select-none">
          CONTACT
        </div>

        <div className="w-full px-5 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            {/* Section Header */}
            <motion.div
              className="mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-[clamp(1.75rem,5vw,3rem)] font-extrabold leading-tight text-white relative mb-6"
              >
                Get in Touch
                {/* Animated underline */}
                <motion.span
                  className="absolute -bottom-3 left-1/2 h-1 w-28 -translate-x-1/2 bg-gradient-to-r from-white/70 to-transparent"
                  initial={{ width: 0, opacity: 0.6 }}
                  whileInView={{ width: "7rem" }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                />
              </motion.h2>
              
              <motion.p
                className="text-[clamp(0.95rem,2.5vw,1.1rem)] leading-relaxed text-white/80 max-w-[50ch] mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Let's collaborate and create something amazing together. Feel free to reach out!
              </motion.p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-20"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social, index) => (
                <motion.div
                  key={index}
                  className="group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <motion.a
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/8"
                    whileHover={{ y: -12, scale: 1.02 }}
                    aria-label={`Link to ${social.name}`}
                  >
                    {/* Glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-16 h-16 mb-4 flex items-center justify-center">
                        <motion.img
                          src={social.icon}
                          alt={`${social.name} icon`}
                          className="max-w-full max-h-full object-contain transition-transform duration-300"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        />
                      </div>
                      <p className="text-base font-semibold text-white group-hover:text-white/90 transition-colors">
                        {social.name}
                      </p>
                    </div>

                    {/* Subtle border animation */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </motion.a>
                </motion.div>
              ))}
            </motion.div>

            {/* Contact Info Card */}
            <motion.div
              className="relative max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:border-white/20 hover:bg-white/8"
                whileHover={{ y: -4, scale: 1.01 }}
              >
                {/* Subtle moving glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)`,
                  }}
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                />

                <div className="relative z-10 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                  >
                    <p className="text-[clamp(0.95rem,2.5vw,1.1rem)] text-white/90">
                      <span className="text-white/70">Email: </span>
                      <motion.a
                        href="mailto:krishna200428@gmail.com"
                        className="text-white font-medium hover:text-white/80 transition-colors duration-300 break-all"
                        whileHover={{ scale: 1.02 }}
                      >
                        krishna200428@gmail.com
                      </motion.a>
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <p className="text-[clamp(0.95rem,2.5vw,1.1rem)] text-white/90">
                      <span className="text-white/70">Phone: </span>
                      <motion.a
                        href="tel:+919016116357"
                        className="text-white font-medium hover:text-white/80 transition-colors duration-300"
                        whileHover={{ scale: 1.02 }}
                      >
                        +91 9016116357
                      </motion.a>
                    </p>
                  </motion.div>
                </div>

                {/* Enhanced border glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border border-white/30 opacity-0 hover:opacity-100 transition-opacity duration-300"
                />
              </motion.div>
            </motion.div>

            {/* Optional CTA */}
            {/* <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="mailto:krishna200428@gmail.com"
                className="group relative inline-flex items-center justify-center rounded-xl border border-white/20 bg-white px-8 py-4 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-black overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/90 to-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Start a Conversation
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.a>
            </motion.div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMe;