import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const caseStudies = [
  {
    id: "cryptodash",
    title: "CryptoDash",
    description: "A live cryptocurrency dashboard demonstrating real-time API integration and responsive UI.",
    image: "/assets/4.png",
    route: "/works/cryptodash-case-study",
    liveLink: "https://crypto-dash-blush-three.vercel.app/",
    type: "development"
  },
  {
    id: "dripstride",
    title: "DripStride",
    description: "An e-commerce sneaker store showcasing component-based frontend architecture and smooth user experience.",
    image: "/assets/5.png",
    route: "/works/dripstride-case-study",
    liveLink: "https://dripstride.vercel.app/",
    type: "development"
  },
  {
    id: "meditrack",
    title: "MediTrack",
    description: "Healthcare management platform designed for Indian families. Complete UX strategy and interface design.",
    image: "/assets/meditrack-dashboard.png",
    route: "/works/meditrack-case-study",
    type: "design"
  },
  {
    id: "launchpad",
    title: "Launchpad",
    description: "Helping a global school with a modern web presence for better interaction.",
    image: "/assets/2.png",
    route: "/works/launchpad-case-study",
    figmaLink: "https://www.figma.com/design/DsGMoqInLzYyDGChRvXSDa/Launchpad?node-id=0-1&t=6xeU81sgbfEAcuWM-1",
    type: "design"
  },
];

const HighlightedWorks = () => {
  const navigate = useNavigate();

  // Subtle animated grid base (randomized phase per mount)
  const baseX = Math.floor(Math.random() * 50);
  const baseY = Math.floor(Math.random() * 50);

  // Floating Particles Component
  const FloatingParticles = () => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
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
              y: [0, -40, 0],
              x: [0, Math.sin(particle.id) * 20, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [0.8, 1.2, 0.8],
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

  return (
    <section id="works" className="relative w-full min-h-screen bg-black overflow-hidden gpu">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Grid */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            backgroundPosition: `${baseX}px ${baseY}px`,
          }}
          animate={{
            backgroundPosition: [
              `${baseX}px ${baseY}px`,
              `${baseX + 60}px ${baseY + 60}px`,
            ],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Soft Glows */}
        <motion.div
          className="absolute -top-24 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-3xl bg-white/[0.03] blur-[100px]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-10%] top-1/4 h-48 w-48 rotate-12 rounded-3xl bg-white/[0.04] blur-[60px]"
          animate={{ rotate: [12, 24, 12], x: [0, 20, 0], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[-10%] bottom-1/4 h-40 w-64 -rotate-12 rounded-3xl bg-white/[0.035] blur-[50px]"
          animate={{ rotate: [-12, -24, -12], y: [0, 15, 0], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 sm:pt-28 lg:pt-32 pb-24">
        {/* Watermark label */}
        <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 text-7xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white/5 select-none">
          WORKS
        </div>

        <div className="w-full px-5 sm:px-6">
          <div className="mx-auto max-w-6xl">
            {/* Section Header */}
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-[clamp(1.75rem,5vw,3rem)] font-extrabold leading-tight text-white relative"
              >
                Highlighted Works
                {/* Animated underline */}
                <motion.span
                  className="absolute -bottom-3 left-1/2 h-1 w-24 -translate-x-1/2 bg-gradient-to-r from-white/70 to-transparent"
                  initial={{ width: 0, opacity: 0.6 }}
                  whileInView={{ width: "6rem" }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                />
              </motion.h2>
            </motion.div>

            {/* Projects */}
            <div className="space-y-32">
              {caseStudies.map((project, index) => (
                <motion.div
                  key={project.id}
                  className={`flex flex-col lg:flex-row items-center justify-between gap-12 ${
                    index % 2 !== 0 ? "lg:flex-row-reverse" : ""
                  }`}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {/* Enhanced Image Card - Fixed Size */}
                  <div className="w-full lg:w-1/2">
                    <motion.div
                      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.02] p-4 backdrop-blur-sm w-full max-w-[600px] mx-auto"
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Project Type Badge */}
                      <div className="absolute top-6 right-6 z-10">
                        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border backdrop-blur-sm ${
                          project.type === 'development' 
                            ? 'bg-blue-400/10 text-blue-300 border-blue-400/20' 
                            : 'bg-purple-400/10 text-purple-300 border-purple-400/20'
                        }`}>
                          {project.type === 'development' ? '⚡' : '🎨'}
                          {project.type === 'development' ? 'Dev' : 'Design'}
                        </span>
                      </div>

                      {/* Media Container */}
                      <div className="relative z-10 overflow-hidden rounded-xl aspect-[4/3] w-full">
                        <motion.img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover object-center cursor-pointer transition-all duration-500 group-hover:scale-105"
                          onClick={() =>
                            window.open(project.liveLink || project.figmaLink, "_blank")
                          }
                          whileHover={{ scale: 1.05 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      
                      {/* Subtle inner soft vignette */}
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[0.04] via-transparent to-transparent" />
                    </motion.div>
                  </div>

                  {/* Enhanced Text Section */}
                  <motion.div
                    className={`w-full lg:w-1/2 text-center lg:text-left ${
                      index % 2 !== 0 ? "lg:pr-8" : "lg:pl-8"
                    }`}
                    initial={{ opacity: 0, x: index % 2 !== 0 ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <motion.h3
                      className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold text-white mb-4 relative"
                    >
                      {project.title}
                      {/* Subtle accent line */}
                      <motion.span
                        className="absolute -bottom-1 left-1/2 lg:left-0 h-0.5 w-16 -translate-x-1/2 lg:translate-x-0 bg-white/60"
                        initial={{ width: 0 }}
                        whileInView={{ width: "4rem" }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      />
                    </motion.h3>
                    
                    <motion.p
                      className="text-[clamp(0.95rem,2.5vw,1.1rem)] leading-relaxed text-white/80 mb-8 max-w-[50ch] mx-auto lg:mx-0"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      {project.description}
                    </motion.p>
                    
                    {/* Enhanced CTA Button */}
                    <motion.button
                      onClick={() => navigate(project.route)}
                      className="group relative inline-flex items-center justify-center rounded-xl border border-white/20 bg-white px-8 py-4 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-offset-2 focus:ring-offset-black overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/90 to-white"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "0%" }}
                        transition={{ duration: 0.3 }}
                      />
                      <span className="relative z-10 flex items-center gap-2">
                        Explore Now
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </span>
                    </motion.button>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightedWorks;