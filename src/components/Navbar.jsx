import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isShrunk, setIsShrunk] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* Full Navbar */}
      <header
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-4 bg-white/80 backdrop-blur-md rounded-full shadow-lg z-50 transition-all duration-700 ease-in-out max-w-[95%] w-auto ${
          isShrunk ? "opacity-0 -translate-y-5 pointer-events-none" : "opacity-100 translate-y-0"
        }`}
      >
        <nav className="flex items-center justify-between space-x-14">
          {/* Logo */}
          <Link
            to="/"
            onClick={scrollToTop}
            className="text-2xl font-bold text-orange-600 transition-all duration-700 cursor-pointer"
          >
            Krishna
          </Link>

          {/* Simple Links */}
          <Link
            to="/works"
            className="font-medium text-gray-700 transition duration-500 text-md hover:text-orange-500 hover:underline underline-offset-4"
          >
            Works
          </Link>
          <Link
            to="/contact"
            className="font-medium text-gray-700 transition duration-500 text-md hover:text-orange-500 hover:underline underline-offset-4"
          >
            Contact
          </Link>
        </nav>
      </header>

      {/* Mini Logo Navbar */}
      <div
        onClick={scrollToTop}
        className={`fixed top-4 left-6 z-50 text-3xl font-bold text-orange-600 transition-all duration-700 ease-in-out cursor-pointer ${
          isShrunk ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-5 scale-95 pointer-events-none"
        }`}
      >
        Krishna
      </div>
    </>
  );
};

export default Navbar;
