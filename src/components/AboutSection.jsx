import { forwardRef } from "react";
import { motion } from "framer-motion";

const AboutSection = forwardRef(({ text, controls }, ref) => {
  // Subtle animated grid base (randomized phase per mount)
  const baseX = Math.floor(Math.random() * 50);
  const baseY = Math.floor(Math.random() * 50);

  const jobs = [
    { title: "Frontend Developer", company: "Prime Digitals", duration: "2024 - 2025", type: "frontend" },
    { title: "UI/UX Designer", company: "UMM Digital", duration: "2024 - 2025", type: "design" },
    { title: "Frontend Developer", company: "Freelance Projects", duration: "2023 - 2024", type: "frontend" },
    { title: "UI Designer", company: "College Project", duration: "2022 - 2023", type: "design" },
  ];

  return (
    <section id="about" className="relative w-full min-h-screen bg-black overflow-hidden gpu">
      {/* Background accents to match Hero */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Grid (very subtle) */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "54px 54px",
            backgroundPosition: `${baseX}px ${baseY}px`,
          }}
          animate={{
            backgroundPosition: [
              `${baseX}px ${baseY}px`,
              `${baseX + 54}px ${baseY + 54}px`,
            ],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        />

        {/* Soft glows, toned down */}
        <motion.div
          className="absolute -top-24 left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-3xl bg-white/[0.04] blur-[80px] sm:h-[420px] sm:w-[420px] sm:blur-[100px]"
          animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-15%] top-1/3 h-36 w-36 rotate-6 rounded-3xl bg-white/[0.05] blur-[40px] sm:h-52 sm:w-52"
          animate={{ rotate: [6, 14, 6], x: [0, 16, 0], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute left-[-18%] bottom-1/4 h-32 w-56 -rotate-6 rounded-3xl bg-white/[0.045] blur-[38px] sm:h-44 sm:w-64"
          animate={{ rotate: [-6, -12, -6], y: [0, 12, 0], opacity: [0.16, 0.26, 0.16] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-[100svh] flex items-center pt-24 sm:pt-28 lg:pt-32">
        {/* Watermark label */}
        <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 text-7xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-white/5 select-none">
          ABOUT
        </div>
        <div className="w-full px-5 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left: About copy */}
            <motion.div
              ref={ref}
              className="lg:col-span-7 text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
              }}
            >
              <motion.h2
                className="text-[clamp(1.5rem,4.5vw,2.5rem)] font-extrabold leading-tight text-white relative"
              >
                UI/UX Designer and Frontend Developer
                {/* Subtle underline */}
                <motion.span
                  className="absolute -bottom-2 left-1/2 h-1 w-1/2 -translate-x-1/2 bg-gradient-to-r from-white/70 to-transparent lg:left-0 lg:translate-x-0"
                  initial={{ width: 0, opacity: 0.6 }}
                  whileInView={{ width: "50%" }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                />
              </motion.h2>

              <motion.p
                className="mt-6 max-w-[68ch] text-[clamp(0.95rem,2.4vw,1.05rem)] leading-relaxed text-white/80 mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                I specialize in crafting intuitive digital experiences that blend aesthetics with functionality,
                while bringing designs to life through clean, efficient code. My expertise spans both UI/UX design
                and frontend development, ensuring seamless, engaging, and user‑centric solutions.
              </motion.p>

              {/* Skills chip cloud */}
              <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
                {[
                  "React",
                  "Tailwind CSS",
                  "Framer Motion",
                  "Figma",
                  "Accessibility",
                  "Performance",
                  "UX Writing",
                  "Design Systems",
                ].map((chip, idx) => (
                  <motion.span
                    key={chip}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * idx }}
                  >
                    {chip}
                  </motion.span>
                ))}
              </div>

              {/* Metrics / highlights */}
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 max-w-xl mx-auto lg:mx-0">
                {[
                  { label: "Projects", value: "20+" },
                  { label: "Tools", value: "Figma • React" },
                  { label: "Focus", value: "Perf • UX" },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/80 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * idx }}
                  >
                    <div className="text-sm">{item.label}</div>
                    <div className="text-lg font-semibold text-white">{item.value}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Experience timeline */}
            <motion.div
              className="lg:col-span-5 text-center lg:text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, delay: 0.2 } },
              }}
            >
              <h3 className="text-[clamp(1.2rem,3.5vw,1.75rem)] font-bold text-white mb-6">Work Experience</h3>
              <div className="relative mx-auto lg:mx-0">
                {/* Enhanced Timeline rail with gradient */}
                <motion.div 
                  className="absolute left-4 top-0 w-px bg-gradient-to-b from-white/20 via-white/10 to-white/5"
                  style={{ height: "100%" }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                />
                
                <div className="space-y-6">
                  {jobs.map((job, index) => (
                    <motion.div
                      key={index}
                      className="relative pl-12 group"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                    >
                      {/* Enhanced Timeline Dot */}
                      <motion.div 
                        className="absolute left-[13px] top-2 w-3 h-3 -translate-x-1/2"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 * index }}
                      >
                        <div className={`w-full h-full rounded-full ${
                          job.type === 'frontend' 
                            ? 'bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.4)]' 
                            : 'bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.3)]'
                        }`} />
                        {/* Subtle pulsing ring */}
                        <motion.div 
                          className="absolute inset-0 rounded-full border border-white/30"
                          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                        />
                      </motion.div>

                      {/* Job Content */}
                      <motion.div 
                        className="rounded-lg border border-white/8 bg-white/3 px-4 py-3 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/5"
                        whileHover={{ x: 4, scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        {/* Duration badge */}
                        <div className="flex items-center justify-between mb-1">
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/60">
                            {job.duration}
                          </span>
                        </div>

                        <h4 className="text-base font-semibold text-white mb-1 group-hover:text-white/90 transition-colors">
                          {job.title}
                        </h4>
                        <p className="text-sm text-white/70">{job.company}</p>

                        {/* Subtle progress line */}
                        <motion.div 
                          className="mt-3 h-0.5 rounded-full bg-white/10"
                          initial={{ width: 0 }}
                          whileInView={{ width: '100%' }}
                          transition={{ duration: 0.8, delay: 0.3 * index }}
                        />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* Timeline end dot */}
                <motion.div 
                  className="absolute left-4 bottom-0 w-1.5 h-1.5 -translate-x-1/2 rounded-full bg-white/40"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default AboutSection;