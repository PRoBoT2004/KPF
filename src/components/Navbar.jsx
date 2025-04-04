import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isShrunk, setIsShrunk] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsShrunk(true); // Scrolling Down -> Show Mini Logo Navbar, Hide Full Navbar
      } else {
        setIsShrunk(false); // Scrolling Up -> Show Full Navbar, Hide Mini Logo
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Function to scroll smoothly to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Full Navbar (Balanced Spacing) */}
      <header
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-12 py-5 bg-white/80 backdrop-blur-md rounded-full shadow-lg z-50 transition-all duration-700 ease-in-out ${
          isShrunk ? "opacity-0 -translate-y-5 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        <nav className="flex items-center justify-between w-full mx-auto max-w-7xl">
          {/* Logo in Full Navbar */}
          <Link to="/" onClick={scrollToTop} className="text-2xl font-bold text-blue-700 transition-all duration-700 cursor-pointer">
            Krishna
          </Link>

          {/* Navigation Links (Properly Spaced) */}
          <div className="flex space-x-14"> {/* Increased spacing between links */}
            <Link
              to="/works"
              className="font-medium text-gray-700 transition duration-500 text-md hover:text-blue-500 hover:underline underline-offset-4"
            >
              Works
            </Link>
            <Link
              to="/contact"
              className="font-medium text-gray-700 transition duration-500 text-md hover:text-blue-500 hover:underline underline-offset-4"
            >
              Contact
            </Link>
          </div>
        </nav>
      </header>

      {/* Mini Logo Navbar (Perfectly Positioned) */}
      <div
        onClick={scrollToTop}
        className={`fixed top-4 left-6 z-50 text-3xl font-bold text-blue-700 transition-all duration-700 ease-in-out cursor-pointer ${
          isShrunk ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-5 scale-95 pointer-events-none"
        }`}
      >
        Krishna
      </div>
    </>
  );
};

export default Navbar;
