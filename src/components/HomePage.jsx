import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import HighlightedWorks from "./HighlightedWorks";
import SkillsTools from "./SkillsTools";
import ContactMe from "./ContactMe";

const HomePage = () => {
  const [text, setText] = useState("");
  const fullText = "I'm Krishna, a passionate UI/UX Designer.";
  const typingSpeed = 100;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) clearInterval(interval);
    }, typingSpeed);
    return () => clearInterval(interval);
  }, []);

  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 }); // Adjusted threshold

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [inView, controls]);

  return (
    <div className="w-screen h-auto text-white bg-slate-950">
      <HeroSection />
      <AboutSection text={text} controls={controls} ref={ref} />
      <HighlightedWorks />
      <SkillsTools />
      <ContactMe />
    </div>
  );
};

export default HomePage;
