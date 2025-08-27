import { motion } from "framer-motion";

// Skill Data
const skills = [
  { name: "UI/UX Design", level: "Expert", percentage: 95 },
  { name: "Graphic Design", level: "Advanced", percentage: 85 },
  { name: "Prototyping", level: "Intermediate", percentage: 80 },
  { name: "Frontend Development", level: "Intermediate", percentage: 75 },
  { name: "Video Editing", level: "Beginner", percentage: 20 },
];

// Tools Data - Mixed Frontend & Design
const tools = [
  // Design Tools
  { name: "Figma", icon: "/assets/figma.png", category: "design" },
  { name: "Photoshop", icon: "/assets/photoshop.png", category: "design" },
  { name: "Illustrator", icon: "/assets/illustrator.png", category: "design" },
  { name: "After Effects", icon: "/assets/aftereffects.png", category: "design" },
  // Frontend Tools
  { name: "React", icon: "/assets/React.png", category: "frontend" },
  { name: "JavaScript", icon: "/assets/JS.png", category: "frontend" },
  { name: "Vue.js", icon: "/assets/Vue.png", category: "frontend" },
  { name: "HTML", icon: "/assets/HTML.png", category: "frontend" },
];

const SkillsTools = () => {
  // Subtle animated grid base (randomized phase per mount)
  const baseX = Math.floor(Math.random() * 50);
  const baseY = Math.floor(Math.random() * 50);

  // Floating Particles Component
  const FloatingParticles = () => {
    const particles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 1,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: Math.random() * 30 + 25,
      delay: Math.random() * 12,
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
              y: [0, -50, 0],
              x: [0, Math.sin(particle.id) * 25, 0],
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
    const shapes = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      size: Math.random() * 80 + 60,
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
            className="absolute border border-white/8 bg-white/3"
            style={{
              width: shape.size,
              height: shape.size,
              left: `${shape.initialX}%`,
              top: `${shape.initialY}%`,
              borderRadius: shape.id % 3 === 0 ? "50%" : shape.id % 2 === 0 ? "16px" : "0",
            }}
            animate={{
              rotate: [shape.rotation, shape.rotation + 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.05, 0.2, 0.05],
              x: [0, Math.cos(shape.id) * 30, 0],
              y: [0, Math.sin(shape.id) * 20, 0],
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
    <section id="skills" className="relative w-full min-h-screen bg-black overflow-hidden">
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
            backgroundSize: "55px 55px",
            backgroundPosition: `${baseX}px ${baseY}px`,
          }}
          animate={{
            backgroundPosition: [
              `${baseX}px ${baseY}px`,
              `${baseX + 55}px ${baseY + 55}px`,
            ],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
        />

        {/* Floating Particles */}
        <FloatingParticles />

        {/* Geometric Shapes */}
        <GeometricShapes />

        {/* Soft Glows */}
        <motion.div
          className="absolute -top-32 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-3xl bg-white/[0.025] blur-[120px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.35, 0.15] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-8%] top-1/3 h-52 w-52 rotate-45 rounded-3xl bg-white/[0.03] blur-[70px]"
          animate={{ rotate: [45, 75, 45], x: [0, 25, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[-8%] bottom-1/3 h-44 w-72 -rotate-45 rounded-3xl bg-white/[0.025] blur-[60px]"
          animate={{ rotate: [-45, -75, -45], y: [0, 20, 0], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/8 via-transparent to-black/8" />
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 sm:pt-28 lg:pt-32 pb-24">
        {/* Watermark label */}
        <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 text-7xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white/5 select-none">
          SKILLS
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
                Skills & Tools
                {/* Animated underline */}
                <motion.span
                  className="absolute -bottom-3 left-1/2 h-1 w-32 -translate-x-1/2 bg-gradient-to-r from-white/70 to-transparent"
                  initial={{ width: 0, opacity: 0.6 }}
                  whileInView={{ width: "8rem" }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                />
              </motion.h2>
            </motion.div>

            {/* Skills Section */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-32"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {skills.map((skill, index) => (
                <motion.div 
                  key={index}
                  className="relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="relative h-[200px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/8 overflow-hidden"
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Subtle glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />

                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                      <h3 className="text-lg font-bold text-white mb-4">{skill.name}</h3>
                      
                      {/* Silver Progress Bar */}
                      <div className="relative w-full mb-4 h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-gray-300 to-gray-400"
                          initial={{ width: "0%" }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 + (index * 0.1) }}
                        />
                      </div>
                      
                      <p className="text-sm text-white/70">{skill.level}</p>
                      
                      {/* Percentage Badge */}
                      <motion.div
                        className="absolute top-4 right-4 text-xs font-semibold text-white/60 bg-white/10 px-2 py-1 rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
                      >
                        {skill.percentage}%
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>

            {/* Tools Section */}
            <div className="w-full">
              <motion.h3 
                className="text-[clamp(1.25rem,3.5vw,2rem)] font-bold text-white mb-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Tools I Use
              </motion.h3>

              {/* Design Tools */}
              <motion.div 
                className="mb-20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-semibold text-white/90 mb-8 text-center">Design Tools</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {tools.filter(tool => tool.category === 'design').map((tool, index) => (
                    <motion.div 
                      key={index}
                      className="group relative flex flex-col items-center text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/8"
                      whileHover={{ y: -12, scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      viewport={{ once: true }}
                    >
                      {/* Tool icon glow */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      
                      <div className="relative z-10">
                        <div className="w-16 h-16 mb-4 flex items-center justify-center">
                          <motion.img 
                            src={tool.icon} 
                            alt={tool.name} 
                            className="max-w-full max-h-full object-contain transition-transform duration-300"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          />
                        </div>
                        <p className="text-sm font-semibold text-white">{tool.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Frontend Tools */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 className="text-xl font-semibold text-white/90 mb-8 text-center">Frontend Tools</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {tools.filter(tool => tool.category === 'frontend').map((tool, index) => (
                    <motion.div 
                      key={index}
                      className="group relative flex flex-col items-center text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 transition-all duration-300 hover:border-white/20 hover:bg-white/8"
                      whileHover={{ y: -12, scale: 1.05 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      viewport={{ once: true }}
                    >
                      {/* Tool icon glow */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      
                      <div className="relative z-10">
                        <div className="w-16 h-16 mb-4 flex items-center justify-center">
                          <motion.img 
                            src={tool.icon} 
                            alt={tool.name} 
                            className="max-w-full max-h-full object-contain transition-transform duration-300"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                          />
                        </div>
                        <p className="text-sm font-semibold text-white">{tool.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsTools;