import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const DripStrideCaseStudy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gray-100">
      {/* Background Video */}
      <video
        className="fixed top-0 left-0 z-0 object-cover w-full h-full"
        autoPlay
        loop
        muted
        playsInline
        poster="/assets/k1.jpg"
      >
        <source src="/assets/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay Content */}
      <div className="relative z-10 px-4 py-16 sm:px-6 md:px-8 lg:px-12 bg-black/60 backdrop-blur-md">
        
        {/* Hero Section */}
        <section className="max-w-5xl py-16 mx-auto text-center">
          <img
            src="/assets/DS-logo.png"
            alt="DripStride"
            className="w-40 mx-auto mb-6 transition-transform duration-300 rounded-lg shadow-xl sm:w-52 hover:scale-105"
          />
          <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            DripStride – Sneaker E-commerce Store
          </h1>
          <p className="text-lg text-gray-300 sm:text-xl">
            A fully responsive, modern frontend built to showcase product browsing, filtering, and cart functionality.
          </p>
        </section>

        {/* Project Overview */}
        <section className="max-w-4xl px-2 mx-auto mb-12 text-white sm:px-0">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">Project Overview</h2>
          <p className="text-base leading-relaxed text-gray-200 sm:text-lg">
            DripStride is a dynamic sneaker e-commerce frontend designed with performance and reusability in mind. 
            Built using React, Tailwind CSS, and modular component strategy, 
            it simulates a real-world store experience with sorting, filtering, product pages, and cart system, ideal for fast prototyping and scalable frontend applications.
          </p>
        </section>

        {/* Tech Details */}
        <section className="flex flex-col justify-between max-w-4xl gap-6 mx-auto mb-12 lg:flex-row">
          <div className="flex-1 p-6 border border-gray-700 shadow-xl sm:p-8 rounded-xl bg-black/30 backdrop-blur-lg">
            <h3 className="mb-3 text-xl font-semibold text-white sm:text-2xl">🧱 Tech Stack</h3>
            <ul className="pl-5 space-y-2 text-sm text-white list-disc sm:text-base">
              <li>⚛️ React with functional components & hooks</li>
              <li>🌬️ Tailwind CSS for responsive custom UI</li>
              <li>🛍️ FakeStore API for product data simulation</li>
              <li>🛠️ Context API for cart state management</li>
              <li>📦 LocalStorage Integration</li>
            </ul>
          </div>

          <div className="flex-1 p-6 border border-gray-700 shadow-xl sm:p-8 rounded-xl bg-black/30 backdrop-blur-lg">
            <h3 className="mb-3 text-xl font-semibold text-white sm:text-2xl">✨ Features</h3>
            <ul className="pl-5 space-y-2 text-sm text-white list-disc sm:text-base">
              <li>Live product filtering & sorting</li>
              <li>Reusable grid & card components</li>
              <li>Add to cart functionality with dynamic badge display</li>
              <li>Responsive nav, product pages, and checkout view</li>
              <li>Built with scalability and performance in mind</li>
            </ul>
          </div>
        </section>

        {/* Architecture Description */}
        <section className="max-w-4xl px-2 mx-auto mb-16 text-left text-white sm:px-0">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">🏗️ Component Architecture</h2>
          <p className="mb-4 text-base leading-relaxed text-gray-200 sm:text-lg">
            All UI and logic in DripStride is broken down into well-structured, reusable components (e.g. ProductCard, Navbar, CartDrawer).
            Global cart state is managed through Context API allowing cross-page communication and component synchronization without prop drilling.
          </p>
          <p className="text-base leading-relaxed text-gray-200 sm:text-lg">
            Animations, conditional rendering, and controlled toggles add polish to the user interaction, matching expectations of modern e-commerce store UX.
          </p>
        </section>

        {/* Live Links */}
        <section className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">Visit the Live Store</h2>
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <a
              href="https://dripstride.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-base font-semibold text-white transition-transform bg-orange-500 rounded-lg hover:bg-orange-600 hover:scale-105"
            >
              🛒 Live Store
            </a>
            <a
              href="https://github.com/PRoBoT2004/Dripstride" // Replace with actual repo if available
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-base font-semibold text-white transition-transform bg-gray-700 rounded-lg hover:bg-gray-600 hover:scale-105"
            >
              💻 Source Code
            </a>
          </div>
        </section>

        {/* Back to Projects */}
        <div className="text-center">
          <Link to="/works/">
            <button className="px-6 py-3 font-semibold text-white transition-transform bg-gray-700 rounded-lg hover:bg-gray-600 hover:scale-105">
              ⬅ Back to Projects
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DripStrideCaseStudy;