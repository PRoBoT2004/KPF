import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const images = ["/assets/Body.png", "/assets/cph.png", "/assets/bl.png"];

const HeroSection = () => {
  const boxRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Handle scrolling inside the image box
  useEffect(() => {
    const handleScroll = (event) => {
      if (isHovered && boxRef.current) {
        event.preventDefault();
        boxRef.current.scrollTop += event.deltaY * 0.5; // Adjust speed if needed
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [isHovered]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const selectImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section id="hero" className="relative flex w-screen h-screen">
      {/* Left Content */}
      <div className="flex flex-col justify-center w-1/2 h-full px-16 text-white bg-black">
      <h1 className="mb-2 text-4xl font-bold sm:text-5xl md:text-6xl">I am Krishna,</h1>
<h2 className="mb-6 text-3xl font-semibold text-orange-500 sm:text-4xl">UI/UX Designer</h2>

        <p className="mb-8 text-lg font-medium text-gray-300">
          Designing Experiences, Not Just Screens
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate("/works")} 
            className="px-6 py-3 text-lg font-semibold transition-all bg-orange-500 rounded-lg shadow-md hover:bg-orange-600 hover:scale-105"
          >
            View My Work
          </button>
          <button 
            onClick={() => navigate("/contact")} 
            className="px-6 py-3 text-lg font-semibold transition-all bg-transparent border-2 border-white rounded-lg shadow-md hover:bg-white hover:text-black hover:scale-105"
          >
            Contact Me
          </button>
        </div>
      </div>

      {/* Right Side - Scrollable Image Box */}
      <div 
        ref={boxRef}
        className="absolute right-0 w-1/2 h-full overflow-y-scroll border-2 border-gray-500"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={images[currentIndex]} alt="Scrollable UI Preview" className="w-full h-auto" />
      </div>

      {/* Navigation Buttons */}
      <button onClick={prevImage} className="absolute right-[44%] top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-3xl px-6 py-6 rounded-full text-white hover:bg-opacity-50 transition-all shadow-md">◀</button>
      <button onClick={nextImage} className="absolute px-6 py-6 text-white transition-all transform -translate-y-1/2 rounded-full shadow-md bg-white/30 backdrop-blur-3xl bg-opacity-30 right-6 top-1/2 hover:bg-opacity-50">▶</button>

      {/* Dots Navigation */}
      <div className="absolute flex gap-2 bottom-6 right-[25%] transform translate-x-1/2">
        {images.map((_, index) => (
          <button key={index} className={`w-4 h-4 rounded-full transition-all ${currentIndex === index ? "bg-orange-500 scale-110" : "bg-gray-400 hover:bg-gray-300"}`} onClick={() => selectImage(index)}></button>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
