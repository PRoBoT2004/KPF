import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const images = ["/assets/k1.jpg", "/assets/profile.jpg", "/assets/k3.jpg"];

const AboutSection = ({ text, controls, ref }) => {
  const [aboutImageIndex, setAboutImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAboutImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="about" className="relative flex items-center justify-between w-screen h-screen px-16 py-20 bg-linear-to-t from-salte-950 to-black">
      
      {/* Left Part - Typing Effect */}
      <motion.div
        ref={ref}
        className="w-1/3"
        initial={{ opacity: 0, x: -50 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: { duration: 1 } },
        }}
      >
        <h2 className="mb-4 text-5xl font-bold text-orange-500">{text}</h2>
        <p className="text-lg leading-relaxed text-gray-300">
          I specialize in crafting intuitive digital experiences that blend aesthetics with functionality. My goal is to make design seamless, engaging, and user-centric.
        </p>
      </motion.div>

      {/* Center Part - Auto-changing Images with Smooth Transition */}
      <motion.div
        ref={ref}
        className="relative flex justify-center w-1/3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1, delay: 0.3 } }}
      >
        <div className="relative overflow-hidden border-4 border-gray-700 shadow-lg group rounded-2xl">
          <motion.img
            key={aboutImageIndex} // Ensure proper re-render and transition effect
            src={images[aboutImageIndex]}
            alt="Krishna"
            className="w-80 h-[500px] object-cover transition-all duration-500 ease-in-out"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { opacity: { duration: 1, ease: "easeInOut" } },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
          />
        </div>
      </motion.div>

      {/* Right Part - Work Experience */}
      <motion.div
        ref={ref}
        className="w-1/3 text-right"
        initial={{ opacity: 0, x: 50 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0, transition: { duration: 1, delay: 0.5 } },
        }}
      >
        <h2 className="mb-4 text-5xl font-bold">Work Experience</h2>
        <div className="relative pr-6 space-y-6 border-r-2 border-gray-600">
          {[ 
            { title: "UI/UX Designer", company: "UMM Digital", duration: "2024 - Present" },
            { title: "Freelance UI Designer", company: "Self-Employed", duration: "2023 - 2024" },
            { title: "UI Designer", company: "College Project", duration: "2022 - 2023" }
          ].map((job, index) => (
            <motion.div key={index} className="transition-all cursor-pointer hover:scale-105">
              <h3 className="text-2xl font-semibold text-orange-400">{job.title}</h3>
              <p className="text-sm text-gray-400">{job.company} | {job.duration}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </section>
  );
};

export default AboutSection;
