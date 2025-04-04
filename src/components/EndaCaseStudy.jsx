import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

const EndaCaseStudy = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const boxRef = useRef(null);

    const images = [
        "/assets/e2.png",
        "/assets/e1.png",
        "/assets/e3.png",
        "/assets/e4.png",
        // "/assets/enda5.png", // Add more images as necessary
    ];

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
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
                poster="/assets/k1.jpg"
            >
                <source src="/assets/bg-video.mp4" type="video/mp4" />
            </video>

            {/* Overlay Content */}
            <div className="relative z-10 p-8 bg-black bg-opacity-50">
                {/* Hero Section */}
                <section className="max-w-5xl py-32 mx-auto text-center">
                    <img
                        src="/assets/enda-logo.png"
                        alt="Enda Logo"
                        className="mx-auto mb-8 max-w-[160px] transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                    <h1 className="mb-4 text-5xl font-extrabold leading-tight text-white">
                        Enda Web UI Redesign
                    </h1>
                    <p className="text-xl text-gray-300">
                        Redesigning Enda’s Website to improve user experience and accessibility
                    </p>
                </section>

                {/* Project Overview */}
                <section className="max-w-4xl mx-auto mb-16 text-white">
                    <h2 className="mb-6 text-3xl font-semibold">Project Overview</h2>
                    <p className="text-lg leading-relaxed text-gray-200">
                    Enda Sportswear is a leading brand specializing in performance-oriented footwear and apparel. Focused on providing high-quality, durable products for athletes and outdoor enthusiasts. The brand combines innovative design with sustainability, ensuring both comfort and environmental responsibility.
                    </p>
                </section>

                {/* Problem & Solution */}
                <section className="flex flex-wrap justify-between max-w-4xl gap-8 mx-auto mb-16">
                    <div className="flex-1 p-8 border-gray-700 rounded-lg shadow-lg bg-opacity-30 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl">
                        <h3 className="mb-4 text-2xl font-semibold text-white">❌ The Problem</h3>
                        <ul className="pl-6 space-y-2 text-white list-disc">
                            <li>Confusing navigation with too many hidden features</li>
                            <li>Unintuitive workout tracking system</li>
                            <li>Visually outdated design and user experience</li>
                        </ul>
                    </div>

                    <div className="flex-1 p-8 border-gray-700 rounded-lg shadow-lg bg-opacity-30 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl">
                        <h3 className="mb-4 text-2xl font-semibold text-white">✅ The Solution</h3>
                        <ul className="pl-6 space-y-2 text-white list-disc">
                            <li>Optimized navigation with a clearer layout</li>
                            <li>Improved tracking system with easy-to-understand metrics</li>
                            <li>Modernized UI with engaging visuals and animations</li>
                        </ul>
                    </div>
                </section>

                {/* Scrollable UI Screens with Navigation */}
                <section className="max-w-4xl mx-auto mb-16 text-white">
                    <h2 className="mb-6 text-3xl font-semibold">Final UI Screens</h2>
                    <div className="relative">
                        <div
                            ref={boxRef}
                            className="relative w-full overflow-y-auto border-2 border-gray-500 rounded-lg h-96"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <img
                                src={images[currentIndex]}
                                alt="Scrollable UI Preview"
                                className="w-full h-auto"
                            />
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={prevImage}
                            className="absolute px-6 py-6 text-white transition-all transform -translate-y-1/2 rounded-full shadow-md left-4 top-1/2 bg-white/30 backdrop-blur-3xl hover:bg-opacity-50"
                        >
                            ◀
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute px-6 py-6 text-white transition-all transform -translate-y-1/2 rounded-full shadow-md right-4 top-1/2 bg-white/30 backdrop-blur-3xl bg-opacity-30 hover:bg-opacity-50"
                        >
                            ▶
                        </button>

                        {/* Dots Navigation */}
                        <div className="absolute flex gap-2 transform -translate-x-1/2 bottom-4 left-1/2">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-4 h-4 rounded-full transition-all ${currentIndex === index
                                            ? "bg-orange-500 scale-110"
                                            : "bg-gray-400 hover:bg-gray-300"
                                        }`}
                                    onClick={() => selectImage(index)}
                                ></button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Links */}
                <section className="mb-16 text-center">
                    <h2 className="mb-6 text-3xl font-semibold text-white">Explore the Designs</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        <a
                            href="https://www.endasportswear.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 font-semibold text-white transition-all duration-300 transform bg-orange-500 rounded-lg shadow-md hover:scale-105 hover:bg-orange-600"
                        >
                            🔗 Live Website
                        </a>
                        <a
                            href="https://www.figma.com/design/Pv13MUB4JVLSDxbbf5b5hn/Enda?node-id=0-1&t=Xxchf8ZdGzfiRrIs-1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 font-semibold text-white transition-all duration-300 transform bg-blue-600 rounded-lg shadow-md hover:scale-105 hover:bg-blue-700"
                        >
                            🎨 Figma Design
                        </a>
                    </div>
                </section>

                {/* Back Button */}
                <div className="text-center">
                    <Link to="/works/">
                        <button className="px-8 py-4 text-white transition-all duration-300 transform bg-gray-800 rounded-lg shadow-md hover:scale-105 hover:bg-gray-700">
                            ⬅ Back to UI/UX Projects
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default EndaCaseStudy;
