import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const WorkSection = ({ title, description, videoSrc, imgSrc, reverse, link }) => {
  const navigate = useNavigate();

  return (
    <motion.section
      className={`flex ${reverse ? 'flex-row-reverse' : ''} items-center h-screen px-20 bg-black scroll-snap-start`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="relative z-0 w-3/5">
        {videoSrc ? (
          <motion.video
            className="object-cover w-full h-full transform scale-160 rounded-xl transition-transform duration-700 hover:scale-[1.7]"
            autoPlay
            loop
            muted
            playsInline
            whileHover={{ scale: 1.2 }}
          >
            <source src={videoSrc} type="video/mp4" />
          </motion.video>
        ) : (
          <motion.img
            src={imgSrc}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-700 transform scale-110 rounded-xl hover:scale-125"
            whileHover={{ scale: 1.2 }}
          />
        )}
      </div>

      <div className="z-10 w-2/5 pl-8 text-white">
        <motion.h1 className="mb-5 text-4xl font-bold">{title}</motion.h1>
        <motion.p className="mb-5 text-lg">{description}</motion.p>
        <motion.button
          onClick={() => navigate(link)}
          className="px-6 py-3 text-lg font-semibold text-white transition-all bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 hover:scale-105"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Explore Now
        </motion.button>
      </div>
    </motion.section>
  );
};

const WorkPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="overflow-x-hidden font-sans bg-black scroll-smooth">
      <WorkSection
        title="Color Pencil"
        description="Explore how Color Pencil brings creativity to the forefront through engaging UI/UX design."
        videoSrc="/assets/1.mp4"
        link="/works/colorpencil-case-study"
      />

      <WorkSection
        title="Launchpad"
        description="Dive into the digital transformation process with Launchpad's comprehensive user experience journey."
        videoSrc="/assets/2.mp4"
        link="/works/launchpad-case-study"
        reverse
      />

      <WorkSection
        title="Enda"
        description="Enda showcases how branding and design converge to create an impactful narrative."
        videoSrc="/assets/3.mp4"
        link="/works/enda-case-study"
      />

      <WorkSection
        title="Biocon Biologics"
        description="Biocon Biologics project highlights educational innovation in the digital space."
        videoSrc="/assets/4.mp4"
        link="/works/bioconbiologics-case-study"
        reverse
      />

      <WorkSection
        title="OnGo"
        description="OnGo simplifies commutes with intuitive mobile UX and sharp branding."
        imgSrc="/assets/ongo.png"
        link="/works/ongo-case-study"
        reverse
      />
    </div>
  );
};

export default WorkPage;
