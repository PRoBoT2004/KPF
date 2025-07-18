import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

const LaunchpadCaseStudy = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const boxRef = useRef(null);

  const images = [
    "/assets/lp1.png",
    "/assets/lp2.png",
    "/assets/lp3.png",
    "/assets/lp4.png",
  ];

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const selectImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gray-100">
      {/* Background Video */}
      <video
        className="fixed top-0 left-0 z-0 object-cover w-full h-full"
        autoPlay
        loop
        muted
        playsInline
        poster="/assets/ok.jpg"
      >
        <source src="/assets/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay Content */}
      <div className="relative z-10 px-4 py-16 sm:px-6 md:px-8 lg:px-12 bg-black/60 backdrop-blur-md">
        {/* Hero Section */}
        <section className="max-w-5xl py-16 mx-auto text-center">
          <img
            src="/assets/lp-logo.png"
            alt="Launchpad Logo"
            className="mx-auto mb-6 transition-transform duration-300 w-28 sm:w-32 md:w-40 hover:scale-105"
          />
          <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            Launchpad UI Redesign
          </h1>
          <p className="text-lg text-gray-300 sm:text-xl">
            Redesigning Launchpad for a seamless and engaging learning experience for young children
          </p>
        </section>

        {/* Project Overview */}
        <section className="max-w-4xl px-2 mx-auto mb-12 text-white sm:px-0">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">Project Overview</h2>
          <p className="text-base leading-relaxed text-gray-200 sm:text-lg">
            Launchpad Kindergarten is a global school that provides a nurturing and engaging learning environment for young children. This redesign focused on creating a visually appealing and easy-to-use platform that supports early childhood development. The goal was to simplify the interface and enhance the overall user experience for both children and parents.
          </p>
        </section>

        {/* Problem & Solution */}
        <section className="flex flex-col justify-between max-w-4xl gap-6 mx-auto mb-12 lg:flex-row">
          <div className="flex-1 p-6 border border-gray-700 shadow-xl sm:p-8 rounded-xl bg-black/30 backdrop-blur-lg">
            <h3 className="mb-3 text-xl font-semibold text-white sm:text-2xl">❌ The Problem</h3>
            <ul className="pl-5 space-y-2 text-sm text-white list-disc sm:text-base">
              <li>Complex and confusing user interface</li>
              <li>Lack of intuitive navigation for management</li>
              <li>Overwhelming design with too many features on a single screen</li>
            </ul>
          </div>

          <div className="flex-1 p-6 border border-gray-700 shadow-xl sm:p-8 rounded-xl bg-black/30 backdrop-blur-lg">
            <h3 className="mb-3 text-xl font-semibold text-white sm:text-2xl">✅ The Solution</h3>
            <ul className="pl-5 space-y-2 text-sm text-white list-disc sm:text-base">
              <li>Simplified UI with intuitive navigation</li>
              <li>Reduced clutter and improved feature prioritization</li>
              <li>Enhanced branding with a fresh, modern design</li>
            </ul>
          </div>
        </section>

        {/* Final Screens Gallery */}
        <section className="max-w-4xl mx-auto mb-16 text-center text-white">
          <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">Final UI Screens</h2>
          <div className="relative w-full rounded-xl overflow-hidden border border-gray-500 shadow-lg h-72 sm:h-[400px]">
            <div className="w-full h-full overflow-y-auto">
              <img
                src={images[currentIndex]}
                alt={`UI Preview ${currentIndex}`}
                className="object-contain object-top w-full"
              />
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute px-4 py-2 text-white transform -translate-y-1/2 rounded-full top-1/2 left-3 bg-black/40 hover:bg-black/60"
            >
              ◀
            </button>
            <button
              onClick={nextImage}
              className="absolute px-4 py-2 text-white transform -translate-y-1/2 rounded-full top-1/2 right-3 bg-black/40 hover:bg-black/60"
            >
              ▶
            </button>

            {/* Dots Navigation */}
            <div className="absolute flex gap-2 transform -translate-x-1/2 bottom-4 left-1/2">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentIndex === index
                      ? "bg-orange-500 scale-110"
                      : "bg-gray-400 hover:bg-gray-300"
                  }`}
                  onClick={() => selectImage(index)}
                ></button>
              ))}
            </div>
          </div>
        </section>

        {/* External Links */}
        <section className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">Explore the Designs</h2>
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <a
              href="https://thelaunchpad.school/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-base font-semibold text-white transition-transform bg-orange-500 rounded-lg hover:bg-orange-600 hover:scale-105"
            >
              🔗 Live Website
            </a>
            <a
              href="https://www.figma.com/design/DsGMoqInLzYyDGChRvXSDa/Launchpad?node-id=0-1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-base font-semibold text-white transition-transform bg-blue-600 rounded-lg hover:bg-blue-700 hover:scale-105"
            >
              🎨 Figma Design
            </a>
          </div>
        </section>

        {/* Back Button */}
        <div className="text-center">
          <Link to="/works/">
            <button className="px-6 py-3 font-semibold text-white transition-transform bg-gray-700 rounded-lg hover:bg-gray-600 hover:scale-105">
              ⬅ Back to UI/UX Projects
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LaunchpadCaseStudy;
