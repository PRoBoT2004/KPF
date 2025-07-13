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
      className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center justify-center min-h-screen w-full px-4 py-16 sm:px-8 lg:px-20 bg-black scroll-snap-start gap-10 overflow-hidden`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      {/* Media Content */}
      <div className="w-full lg:w-3/5">
        {videoSrc ? (
          <motion.video
            className="object-cover w-full h-full transform scale-160 rounded-xl transition-transform duration-700 hover:scale-[1.7]"
            autoPlay
            loop
            muted
            playsInline
            whileHover={{ scale: 1.05 }}
          >
            <source src={videoSrc} type="video/mp4" />
          </motion.video>
        ) : (
          <motion.img
            src={imgSrc}
            alt={title}
            className="object-cover w-full h-auto max-w-full overflow-hidden transition-transform duration-700 rounded-xl hover:scale-105"
            whileHover={{ scale: 1.05 }}
          />
        )}
      </div>

      {/* Text Content */}
      <div className="z-10 w-full text-center text-white lg:w-2/5 lg:text-left">
        <motion.h1 className="mb-4 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">{title}</motion.h1>
        <motion.p className="mb-6 text-sm text-gray-300 sm:text-base lg:text-lg">{description}</motion.p>
        <motion.button
          onClick={() => navigate(link)}
          className="px-6 py-3 text-sm font-semibold text-white transition-transform bg-orange-500 rounded-lg shadow-md sm:text-base lg:text-lg hover:bg-orange-600 hover:scale-105"
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
      {/* New Projects on top */}

      <WorkSection
        title="CryptoDash"
        description="A live cryptocurrency dashboard demonstrating real-time API integration and responsive UI."
        imgSrc="/assets/4.png"
        link="/works/cryptodash-case-study"
      />

      <WorkSection
        title="DripStride"
        description="An e-commerce sneaker store showcasing component-based frontend architecture and smooth user experience."
        imgSrc="/assets/5.png"
        link="/works/dripstride-case-study"
        reverse
      />

      {/* Existing Projects */}

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
        
      />
    </div>
  );
};

export default WorkPage;