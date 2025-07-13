import React from "react";
import { Link } from "react-router-dom";

const OnGoCaseStudy = () => {
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
      <div className="relative z-10 px-4 py-8 bg-black bg-opacity-60 sm:px-6 md:px-12 lg:px-24">
        {/* Hero Section */}
        <section className="max-w-5xl py-24 mx-auto text-center sm:py-32">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            OnGo: Peer-to-Peer Ride Sharing App
          </h1>
          <p className="text-lg text-gray-300 sm:text-xl">
            A platform designed to enable cost-effective and convenient ride-sharing for solo travelers.
          </p>
        </section>

        {/* Project Overview */}
        <section className="max-w-4xl mx-auto mb-16 text-white">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">Project Overview</h2>
          <p className="text-base leading-relaxed text-gray-200 sm:text-lg">
            OnGo is a peer-to-peer ride-sharing app designed for individuals who are traveling solo and looking to
            reduce their transportation costs. This app allows users to give a ride to others who are traveling in the
            same direction. By doing so, they can split the expenses, making it a cost-effective solution for both drivers
            and passengers.
          </p>
        </section>

        {/* Key Features & Functionality */}
        <section className="max-w-4xl mx-auto mb-16 text-white">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">Key Features & Functionality</h2>
          <ul className="pl-5 space-y-2 text-base leading-relaxed text-gray-200 list-disc sm:text-lg">
            <li>Peer-to-peer ride-sharing platform for solo travelers</li>
            <li>Drivers can offer rides to passengers traveling in the same direction</li>
            <li>Cost-sharing feature to reduce transportation expenses</li>
            <li>Real-time ride-matching between drivers and passengers</li>
            <li>Simple and intuitive interface for easy ride booking</li>
            <li>Secure payment system to ensure safe transactions</li>
          </ul>
        </section>

        {/* Figma Prototype Embedded */}
        <section className="max-w-4xl mx-auto mb-16 text-white">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">Explore the Prototype</h2>
          <div className="relative w-full h-64 overflow-hidden rounded-lg sm:h-96">
            <iframe
              src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/iT4uf5LpimAhCd2NWLKqGk/OnGo-%3A-Peer-to-peer-ride-sharing-app?node-id=0-1&t=qlTS5d7jSabrPMvw-1"
              className="w-full h-full border-0"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        {/* Links */}
        <section className="mb-16 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-white sm:text-3xl">Explore the Designs</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://www.figma.com/design/iT4uf5LpimAhCd2NWLKqGk/OnGo-%3A-Peer-to-peer-ride-sharing-app?node-id=72-62&t=NQI7I7AtLsV4MJDp-1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 text-white transition-transform duration-300 bg-blue-600 rounded-lg shadow-md hover:scale-105 hover:bg-blue-700"
            >
              🎨 Figma Design
            </a>
          </div>
        </section>

        {/* Back Button */}
        <div className="text-center">
          <Link to="/works/">
            <button className="px-6 py-3 text-white transition-transform duration-300 bg-gray-800 rounded-lg shadow-md hover:scale-105 hover:bg-gray-700">
              ⬅ Back to UI/UX Projects
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OnGoCaseStudy;
