import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MediTrackCaseStudy = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="relative w-full bg-[#030712] text-white overflow-hidden selection:bg-blue-500/30 font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-600/10 blur-[150px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-500/10 blur-[150px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            y: [0, -50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay"></div>
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 w-full pt-32 pb-24">
        {/* Navigation back */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <button
            onClick={() => navigate('/works')}
            className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300 text-sm tracking-widest uppercase font-medium"
          >
            <span className="transform transition-transform group-hover:-translate-x-1">←</span> Back to Works
          </button>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 mb-40">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-center text-center w-full"
          >
            <motion.div variants={fadeIn} className="flex gap-3 mb-8 justify-center">
              <span className="px-5 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold tracking-widest uppercase backdrop-blur-md">UI/UX Interface</span>
              <span className="px-5 py-2 rounded-full bg-white/5 text-white/80 border border-white/10 text-xs font-bold tracking-widest uppercase backdrop-blur-md">Product Strategy</span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-[clamp(3.5rem,8vw,7rem)] font-black leading-[1] tracking-tighter mb-8"
            >
              MediTrack.
            </motion.h1>

            <motion.h2
              variants={fadeIn}
              className="text-[clamp(1.5rem,3vw,2.5rem)] font-light text-white/80 mb-12 max-w-4xl leading-tight"
            >
              Building a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 font-medium">clinical source of truth</span> for Indian families managing elderly healthcare.
            </motion.h2>

            <motion.div
              variants={fadeIn}
              className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-white/10 w-full max-w-4xl text-left"
            >
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/40 mb-2 font-bold">Role</h4>
                <p className="text-lg font-medium">Lead UI/UX</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/40 mb-2 font-bold">Timeline</h4>
                <p className="text-lg font-medium">2026</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/40 mb-2 font-bold">Platform</h4>
                <p className="text-lg font-medium">Desktop Web</p>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-widest text-white/40 mb-2 font-bold">Industry</h4>
                <p className="text-lg font-medium">HealthTech</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Main Hero Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full mt-24 relative rounded-[2rem] md:rounded-[3rem] p-4 md:p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl shadow-blue-900/20"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent rounded-[3rem] pointer-events-none"></div>
            <div className="aspect-[16/9] w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden relative group shadow-2xl">
              <img
                src="/assets/meditrack-dashboard.png"
                alt="MediTrack Dashboard Interface"
                className="w-full h-full object-cover object-center transition-transform duration-[2s] ease-out group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-40"></div>
            </div>
          </motion.div>
        </div>

        {/* The Problem & Vision - Creative Layout */}
        <section className="py-32 relative w-full border-y border-white/5 bg-[#080d15]/50 backdrop-blur-3xl overflow-hidden">
          {/* Giant typography background */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full overflow-hidden whitespace-nowrap opacity-[0.02] pointer-events-none select-none">
            <h2 className="text-[20vw] font-black tracking-tighter">CLARITY THE VISION</h2>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                <motion.div variants={fadeIn} className="w-16 h-1 bg-blue-500 mb-8"></motion.div>
                <motion.h3 variants={fadeIn} className="text-blue-400 font-bold tracking-[0.2em] uppercase mb-4 text-sm">The Challenge</motion.h3>
                <motion.h2 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-[1.1] tracking-tight">Fragmented care in a complex system.</motion.h2>
                <div className="space-y-6 text-xl text-white/50 font-light leading-relaxed">
                  <motion.p variants={fadeIn}>
                    Indian families managing elderly parents' healthcare face three critical challenges: Information scattered across WhatsApp and paper files, missed essential medications, and absolute chaos managing multiple doctors.
                  </motion.p>
                  <motion.p variants={fadeIn}>
                    The mental load of asking "Did dad take his BP medicine?" three times a day becomes exhausting for the Family Health Manager.
                  </motion.p>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/30 via-transparent to-indigo-600/30 rounded-[2.5rem] blur-2xl"></div>
                <div className="relative p-12 md:p-16 rounded-[2.5rem] border border-white/10 bg-[#0d131f]/80 backdrop-blur-2xl h-full shadow-2xl">
                  <motion.h3 variants={fadeIn} className="text-indigo-400 font-bold tracking-[0.2em] uppercase mb-6 text-sm">The Vision</motion.h3>
                  <motion.p variants={fadeIn} className="text-3xl font-light italic text-white/90 leading-relaxed mb-12">
                    "To be India's most trusted healthcare companion, empowering families to manage their loved ones' health with absolute confidence and clarity."
                  </motion.p>

                  {/* Decorative elements */}
                  <motion.div variants={fadeIn} className="absolute bottom-12 right-12 w-16 h-16 border border-white/10 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Feature Showcase Grid - Behance Style */}
        <section className="py-40 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto mb-32"
          >
            <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-8">Designed for <span className="font-light italic text-white/60">humanity</span>.</h2>
            <p className="text-xl text-white/50 font-light leading-relaxed">Every screen was meticulously crafted with a medical-grade aesthetic—focusing heavily on clarity over creativity to instill trust immediately.</p>
          </motion.div>

          {/* Grid Layout of Screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group col-span-1 md:col-span-2 rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0d131f] p-4 shadow-2xl relative"
            >
              <div className="absolute top-0 right-0 w-full h-[50%] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>

              <div className="p-8 md:p-16 flex flex-col md:flex-row items-center gap-16 relative z-10">
                <div className="w-full md:w-1/3">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center mb-8 border border-blue-500/20 text-3xl">💊</div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Medication Tracking</h3>
                  <p className="text-white/50 text-xl font-light leading-relaxed">A zero-confusion daily checklist. Morning, afternoon, evening, and night slots clearly separated with instant adherence feedback.</p>
                </div>
                <div className="w-full md:w-2/3 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-20 pointer-events-none"></div>
                  <img
                    src="/assets/meditrack-medications.png"
                    alt="Medication Tracker"
                    className="w-full h-auto transform transition-all duration-[1.5s] ease-out group-hover:scale-[1.03]"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1584308666744-24d5e4a86b97?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0d131f] flex flex-col shadow-2xl relative"
            >
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-emerald-500/5 to-transparent"></div>
              <div className="p-10 md:p-14 flex-grow relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20 text-2xl">📄</div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Centralized Records</h3>
                <p className="text-white/50 text-lg font-light leading-relaxed">Find any blood test or past prescription in under 30 seconds. Categorized perfectly.</p>
              </div>
              <div className="px-10 pb-10 md:px-14 md:pb-14 pt-0 mt-auto relative z-10 w-full">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
                  <img
                    src="/assets/meditrack-records.png"
                    alt="Medical Records"
                    className="w-full h-auto transition-all duration-[2s] ease-out group-hover:scale-[1.03]"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1581363677334-a0fa4d17f8a9?auto=format&fit=crop&w=800&q=80"; }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0d131f] flex flex-col shadow-2xl relative"
            >
              <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-purple-500/5 to-transparent"></div>
              <div className="p-10 md:p-14 flex-grow relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 border border-purple-500/20 text-2xl">👨⚕️</div>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Doctor Directory</h3>
                <p className="text-white/50 text-lg font-light leading-relaxed">A unified rolodex of every specialist. One-click access to call clinics and view history.</p>
              </div>
              <div className="px-10 pb-10 md:px-14 md:pb-14 pt-0 mt-auto relative z-10 w-full">
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
                  <img
                    src="/assets/meditrack-doctors.png"
                    alt="Doctor Directory"
                    className="w-full h-auto transition-all duration-[2s] ease-out group-hover:scale-[1.03]"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1576091160550-2173ff9e9e9c?auto=format&fit=crop&w=800&q=80"; }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Feature 4 - Full width Insight */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group col-span-1 md:col-span-2 rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#0d131f] p-10 md:p-20 text-center relative shadow-2xl"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-transparent pointer-events-none"></div>

              <div className="relative z-10">
                <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Data-Driven Health Insights</h3>
                <p className="text-xl text-white/50 font-light max-w-3xl mx-auto mb-16 leading-relaxed">Visualizing vitals like blood pressure, blood sugar, and heart rate over time to detect anomalies before they become emergencies.</p>

                <div className="rounded-2xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 max-w-5xl mx-auto relative group">
                  <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>
                  <img
                    src="/assets/meditrack-insights.png"
                    alt="Health Insights Dashboard"
                    className="w-full h-auto transition-transform duration-[2s] ease-out group-hover:scale-[1.03]"
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"; }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Target Audience / Impact */}
        <section className="py-24 border-t border-white/5 bg-[#0a0f16]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                <h4 className="text-blue-400 text-5xl font-light mb-4 text-center">50M</h4>
                <p className="text-white/70 text-center font-medium">Urban Indian households facing this exact problem right now.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                <h4 className="text-emerald-400 text-5xl font-light mb-4 text-center">4x</h4>
                <p className="text-white/70 text-center font-medium">Average family size managed by a single caretker globally.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                <h4 className="text-purple-400 text-5xl font-light mb-4 text-center">100%</h4>
                <p className="text-white/70 text-center font-medium">Of surveyed users cited medication tracking as their #1 anxiety source.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                <h4 className="text-orange-400 text-5xl font-light mb-4 text-center">&lt; 30s</h4>
                <p className="text-white/70 text-center font-medium">Goal time to locate any medical document during a hospital emergency.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Figma Connect / CTA */}
        <div className="max-w-4xl mx-auto px-6 mt-32 text-center pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8">View the full prototype</h2>
            <button
              onClick={() => window.open('https://www.figma.com/design/sUaE2YWye6SpSRyi5osY3j/MediTrack---UI-UX-Portfolio?node-id=28-190&t=kqlHP0D7FjcN0Ebb-1', '_blank')}
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-4 text-sm font-semibold text-white transition-all hover:scale-105"
            >
              Open in Figma →
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MediTrackCaseStudy;
