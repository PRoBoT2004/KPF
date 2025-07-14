import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const images = ["/assets/Body.png", "/assets/cph.png", "/assets/bl.png"];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const selectImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section id="hero" className="relative flex flex-col w-screen h-screen overflow-hidden bg-black sm:flex-row">
      {/* Left Content */}
      <div className="z-10 flex flex-col justify-center w-full h-full px-6 text-white sm:w-1/2 sm:px-16">
        <h1 className="mb-2 text-3xl font-extrabold leading-tight sm:text-5xl md:text-6xl text-shadow-lg">
          Hey, I'm Krishna
        </h1>
        <h2 className="mb-4 text-2xl font-bold text-orange-500 sm:text-4xl">
          UI/UX Designer & Web Developer
        </h2>
        <p className="max-w-lg mb-8 text-lg font-medium text-gray-300">
          I design beautiful interfaces that also work beautifully under the hood — 
          transforming ideas into interactive, user-focused digital experiences.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate("/works")}
            className="px-6 py-3 text-base font-semibold text-white transition duration-300 bg-orange-500 rounded-md hover:bg-orange-600 hover:scale-105"
          >
            View My Work
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="px-6 py-3 text-base font-semibold text-white transition border-2 border-white rounded-md hover:bg-white hover:text-black hover:scale-105"
          >
            Contact Me
          </button>
        </div>

        {/* Sneak Peek (Mobile) */}
        <div className="mt-6 sm:hidden">
          <button
            onClick={() => setShowPopup(true)}
            className="px-5 py-3 text-base font-medium text-white transition duration-300 border-2 border-gray-400 rounded-md hover:bg-white hover:text-black"
          >
            👀 Sneak Peek
          </button>
        </div>
      </div>

      {/* Right Side - Image Box (Desktop Only) - No Scrollbars */}
      <div
        ref={boxRef}
        className="absolute top-0 right-0 hidden w-1/2 h-full overflow-hidden border-l-2 border-orange-500/30 sm:block backdrop-blur-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt="UI Preview"
          loading="lazy"
          className="w-full h-auto transition-all duration-500 ease-in-out"
        />
      </div>

      {/* Arrows (Desktop Only) */}
      <button
        onClick={prevImage}
        className="hidden sm:flex absolute right-[47%] top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-lg px-4 py-4 rounded-full text-white hover:bg-white/40 transition-all shadow-md"
      >
        ◀
      </button>
      <button
        onClick={nextImage}
        className="absolute hidden px-4 py-4 text-white transition-all transform -translate-y-1/2 rounded-full shadow-md sm:flex right-6 top-1/2 bg-white/20 backdrop-blur-lg hover:bg-white/40"
      >
        ▶
      </button>

      {/* Navigation dots */}
      <div className="hidden sm:flex absolute gap-2 bottom-6 right-[25%] transform translate-x-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => selectImage(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index
                ? "bg-orange-500 scale-110"
                : "bg-gray-400 hover:bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Pop-up Preview (Mobile only) */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="relative w-[90vw] max-w-[90%] max-h-[90vh] flex flex-col items-center justify-center rounded-lg border border-gray-600 bg-black overflow-hidden">
            <div className="w-full h-full overflow-hidden">
              <img
                key={`mobile-${currentIndex}`}
                src={images[currentIndex]}
                alt="Mobile preview"
                className="object-contain w-full h-auto"
                loading="lazy"
              />
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute px-4 py-2 text-lg font-bold text-black bg-white rounded-full shadow-md top-3 right-3"
            >
              ✕
            </button>

            {/* Arrows */}
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

            {/* Dots */}
            <div className="absolute flex gap-2 bottom-6">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => selectImage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentIndex === index ? "bg-orange-500 scale-110" : "bg-gray-400 hover:bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;