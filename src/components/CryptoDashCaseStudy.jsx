import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const CryptoDashCaseStudy = () => {
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
        poster="/assets/ok.avif"
      >
        <source src="/assets/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay Content */}
      <div className="relative z-10 px-4 py-16 sm:px-6 md:px-8 lg:px-12 bg-black/60 backdrop-blur-md">

        {/* Hero Section */}
        <section className="max-w-5xl py-16 mx-auto text-center">
          <img
            src="/assets/CD-logo.png"
            alt="CryptoDash"
            className="w-40 mx-auto mb-6 transition-transform duration-300 rounded-lg shadow-xl sm:w-52 hover:scale-105"
          />
          <h1 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
            CryptoDash – Real-Time Crypto Dashboard
          </h1>
          <p className="text-lg text-gray-300 sm:text-xl">
            Built with React, Tailwind, and live API integrations for next-gen financial dashboards.
          </p>
        </section>

        {/* Project Overview */}
        <section className="max-w-4xl px-2 mx-auto mb-12 text-white sm:px-0">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">Project Overview</h2>
          <p className="text-base leading-relaxed text-gray-200 sm:text-lg">
            CryptoDash is a real-time cryptocurrency dashboard designed to showcase front-end engineering
            skills, API integration, and component architecture. This project demonstrates how
            modern web applications can deliver fast, responsive, and data-driven user experiences.
          </p>
        </section>

        {/* Key Features */}
        <section className="flex flex-col justify-between max-w-4xl gap-6 mx-auto mb-12 lg:flex-row">
          <div className="flex-1 p-6 border border-gray-700 shadow-xl sm:p-8 rounded-xl bg-black/30 backdrop-blur-lg">
            <h3 className="mb-3 text-xl font-semibold text-white sm:text-2xl">🧱 Tech Stack</h3>
            <ul className="pl-5 space-y-2 text-sm text-white list-disc sm:text-base">
              <li>⚛️ React (SPA)</li>
              <li>🌬️ Tailwind CSS for custom UI components</li>
              <li>📡 CoinGecko REST API (Live crypto prices)</li>
              <li>📈 Chart.js for dynamic data visualizations</li>
              <li>📂 Component-driven folder structure</li>
            </ul>
          </div>

          <div className="flex-1 p-6 border border-gray-700 shadow-xl sm:p-8 rounded-xl bg-black/30 backdrop-blur-lg">
            <h3 className="mb-3 text-xl font-semibold text-white sm:text-2xl">⚙️ Key Features</h3>
            <ul className="pl-5 space-y-2 text-sm text-white list-disc sm:text-base">
              <li>Global and coin-specific live market data</li>
              <li>Dark mode UI with smooth transitions</li>
              <li>Responsive design for mobile and desktop</li>
              <li>Real-time search with debounced API calls</li>
              <li>Skeleton loading states and API error handling</li>
            </ul>
          </div>
        </section>

        {/* Performance & Architecture */}
        <section className="max-w-4xl px-2 mx-auto mb-16 text-left text-white sm:px-0">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">🏗️ Architecture & Performance</h2>
          <p className="mb-4 text-base leading-relaxed text-gray-200 sm:text-lg">
            CryptoDash was developed with a focus on reusability and speed. UI components
            are modular, state is locally managed with hooks, and async operations are optimized with
            `useEffect` and debouncing logic.
          </p>
          <p className="text-base leading-relaxed text-gray-200 sm:text-lg">
            It reflects best practices in front-end architecture, including clean separation of logic,
            styling with utility-first CSS, and responsiveness without bloating the page.
          </p>
        </section>

        {/* External Links */}
        <section className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">Checkout the Live Project</h2>
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <a
              href="https://crypto-dash-blush-three.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-base font-semibold text-white transition-transform bg-orange-500 rounded-lg hover:bg-orange-600 hover:scale-105"
            >
              🚀 Live Dashboard
            </a>
            <a
              href="https://github.com/PRoBoT2004/CryptoDash" // replace with actual repo if applicable
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-base font-semibold text-white transition-transform bg-gray-700 rounded-lg hover:bg-gray-600 hover:scale-105"
            >
              🛠️ Source Code
            </a>
          </div>
        </section>

        {/* Back Button */}
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

export default CryptoDashCaseStudy;