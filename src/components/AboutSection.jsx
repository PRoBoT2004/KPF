import { useState, useEffect, forwardRef } from "react";
import { motion } from "framer-motion";

const images = ["/assets/k1.jpg", "/assets/profile.jpg", "/assets/k3.jpg"];

const AboutSection = forwardRef(({ text, controls }, ref) => {
  const [aboutImageIndex, setAboutImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAboutImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="about"
  className="relative flex flex-col items-center justify-center w-screen min-h-screen px-6 py-16 space-y-12 bg-gradient-to-t from-slate-950 to-black lg:flex-row lg:space-y-0 lg:space-x-10 lg:px-16"
    >
      {/* Left Text */}
      <motion.div
        ref={ref}
        className="w-full text-center lg:text-left lg:w-1/3"
        initial={{ opacity: 0, x: -50 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: { duration: 1 } },
        }}
      >
        <h2 className="mb-4 text-4xl font-bold text-orange-500 sm:text-5xl">{text}</h2>
        <p className="text-base text-gray-300 sm:text-lg">
          I specialize in crafting intuitive digital experiences that blend aesthetics with functionality. My goal is to make design seamless, engaging, and user-centric.
        </p>
      </motion.div>

      {/* Center Image */}
      <motion.div
        className="flex justify-center w-full lg:w-1/3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1, delay: 0.3 } }}
      >
        <div className="relative overflow-hidden border-4 border-gray-700 shadow-lg rounded-2xl w-64 h-[400px] sm:w-80 sm:h-[500px]">
          <motion.img
            key={aboutImageIndex}
            src={images[aboutImageIndex]}
            alt="Krishna"
            className="object-cover w-full h-full transition-all duration-500 ease-in-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 1 } }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          />
        </div>
      </motion.div>

      {/* Right Experience */}
      <motion.div
        className="w-full text-center lg:text-right lg:w-1/3"
        initial={{ opacity: 0, x: 50 }}
        animate={controls}
        variants={{
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0, transition: { duration: 1, delay: 0.5 } },
        }}
      >
        <h2 className="mb-4 text-4xl font-bold sm:text-5xl">Work Experience</h2>
        <div className="relative mx-auto space-y-6 border-r-2 border-gray-600 lg:pr-6 lg:mx-0">
          {[
            { title: "UI/UX Designer", company: "UMM Digital", duration: "2024 - Present" },
            { title: "Freelance UI Designer", company: "Self-Employed", duration: "2023 - 2024" },
            { title: "UI Designer", company: "College Project", duration: "2022 - 2023" },
          ].map((job, index) => (
            <motion.div
              key={index}
              className="transition-all cursor-pointer hover:scale-105"
            >
              <h3 className="text-xl font-semibold text-orange-400 sm:text-2xl">{job.title}</h3>
              <p className="text-sm text-gray-400">{job.company} | {job.duration}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
});

export default AboutSection;
