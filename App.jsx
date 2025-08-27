import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Navbar
import HomePage from './components/HomePage'; // Home
import WorksPage from './components/WorksPage'; // Works Page
import ContactPage from './components/ContactPage'; // Contact Page
import ColorPencilCaseStudy from './components/ColorPencilCaseStudy'; 
import LaunchpadCaseStudy from './components/LaunchpadCaseStudy';
import EndaCaseStudy from './components/EndaCaseStudy';
import BioconBiologicsCaseStudy from './components/BioconBiologicsCaseStudy';
import OnGoCaseStudy from './components/OnGoCaseStudy';// Case Study Page
import DripStrideCaseStudy from './components/DripStrideCaseStudy';
import CryptoDashCaseStudy from './components/CryptoDashCaseStudy'; // CryptoDash Case Study

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar stays across all pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/works/enda-case-study" element={<EndaCaseStudy />} />
        <Route path="/works/launchpad-case-study" element={<LaunchpadCaseStudy />} /> 
        <Route path="/works/colorpencil-case-study" element={<ColorPencilCaseStudy />} />
        <Route path="/works/bioconbiologics-case-study" element={<BioconBiologicsCaseStudy />} />
        <Route path="/works/ongo-case-study" element={<OnGoCaseStudy />} />
        <Route path="/works/dripstride-case-study" element={<DripStrideCaseStudy />} />
        <Route path="/works/cryptodash-case-study" element={<CryptoDashCaseStudy />} />
        
        
        {/* Add more case studies as needed */}
        <Route path="/contact" element={<ContactPage />} /> {/* Contact Page */}
      </Routes>
    </Router>
  );
};

export default App;
