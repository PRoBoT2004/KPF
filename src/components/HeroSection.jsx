import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const images = ["/assets/Body.png", "/assets/cph.png", "/assets/bl.png"];

const HeroSection = () => {
  const boxRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false); // For mobile pop-up
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = (event) => {
      if (isHovered && boxRef.current) {
        event.preventDefault();
        boxRef.current.scrollTop += event.deltaY * 0.5;
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
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
    <section id="hero" className="relative flex flex-col w-screen h-screen sm:flex-row">
      {/* Left Content */}
      <div className="flex flex-col justify-center w-full h-full px-6 text-white bg-black sm:w-1/2 sm:px-16">
        <h1 className="mb-1 text-3xl font-bold sm:mb-2 sm:text-5xl md:text-6xl">
          I am Krishna,
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-orange-500 sm:mb-6 sm:text-4xl">
          UI/UX Designer
        </h2>
        <p className="mb-6 text-base font-medium text-gray-300 sm:mb-8 sm:text-lg">
          Designing Experiences, Not Just Screens
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={() => navigate("/works")}
            className="px-5 py-3 text-base font-semibold transition-all bg-orange-500 rounded-lg shadow-md sm:text-lg hover:bg-orange-600 hover:scale-105"
          >
            View My Work
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="px-5 py-3 text-base font-semibold transition-all bg-transparent border-2 border-white rounded-lg shadow-md sm:text-lg hover:bg-white hover:text-black hover:scale-105"
          >
            Contact Me
          </button>
        </div>

        {/* Sneak Peek Button for Mobile Only */}
        <div className="mt-6 sm:hidden">
          <button
            onClick={() => setShowPopup(true)}
            className="px-5 py-2 text-sm font-medium text-white transition-all border border-gray-400 rounded-md hover:bg-white hover:text-black"
          >
            👀 Sneak Peek
          </button>
        </div>
      </div>

      {/* Right Side - Scrollable Image Box (Desktop Only) */}
      <div
        ref={boxRef}
        className="absolute right-0 hidden w-1/2 h-full overflow-y-scroll border-l-2 border-gray-500 sm:block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={images[currentIndex]}
          alt="Scrollable UI Preview"
          className="w-full h-auto"
        />
      </div>

      {/* Navigation Buttons (Desktop Only) */}
      <button
        onClick={prevImage}
        className="hidden sm:flex absolute right-[44%] top-1/2 transform -translate-y-1/2 bg-white/30 backdrop-blur-3xl px-6 py-6 rounded-full text-white hover:bg-opacity-50 transition-all shadow-md"
      >
        ◀
      </button>
      <button
        onClick={nextImage}
        className="absolute hidden px-6 py-6 text-white transition-all transform -translate-y-1/2 rounded-full shadow-md sm:flex bg-white/30 backdrop-blur-3xl bg-opacity-30 right-6 top-1/2 hover:bg-opacity-50"
      >
        ▶
      </button>

      {/* Dot Navigation (Desktop Only) */}
      <div className="hidden sm:flex absolute gap-2 bottom-6 right-[25%] transform translate-x-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full transition-all ${
              currentIndex === index
                ? "bg-orange-500 scale-110"
                : "bg-gray-400 hover:bg-gray-300"
            }`}
            onClick={() => selectImage(index)}
          ></button>
        ))}
      </div>

      {/* Mobile Popup for Sneak Peek */}
      {/* Mobile Popup for Sneak Peek */}
{/* Mobile Popup for Sneak Peek */}
{showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                    w-[90vw] max-w-[90%] max-h-[90vh] flex flex-col items-center justify-center 
                    rounded-lg border border-gray-600 bg-black overflow-hidden">
      
      {/* Scrollable Image Inside Fixed Container */}
      <div
        ref={boxRef}
        className="w-full h-full overflow-y-scroll"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={images[currentIndex]} alt="Mobile UI Preview" className="object-contain w-full h-auto" />
      </div>

      {/* Close Button (Fixed in Pop-up, Not Image) */}
      <button
        onClick={() => setShowPopup(false)}
        className="absolute px-4 py-2 text-lg font-bold text-black bg-white rounded-full shadow-md top-3 right-3"
      >
        ✕
      </button>

      {/* Navigation Buttons (Fixed in Pop-up, Not Image) */}
      <button
        onClick={prevImage}
        className="absolute px-5 py-3 text-white transform -translate-y-1/2 rounded-full left-4 top-1/2 bg-white/30 hover:bg-white/50"
      >
        ◀
      </button>
      <button
        onClick={nextImage}
        className="absolute px-5 py-3 text-white transform -translate-y-1/2 rounded-full right-4 top-1/2 bg-white/30 hover:bg-white/50"
      >
        ▶
      </button>

      {/* Dot Navigation (Fixed in Pop-up, Not Image) */}
      <div className="absolute flex gap-2 bottom-6">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index ? "bg-orange-500 scale-110" : "bg-gray-400 hover:bg-gray-300"
            }`}
            onClick={() => selectImage(index)}
          ></button>
        ))}
      </div>
    </div>
  </div>
)}


    </section>
  );
};

export default HeroSection;
