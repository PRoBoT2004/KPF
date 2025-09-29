import React from 'react';
import { MotionConfig } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import WorksPage from './components/WorksPage';
import ContactPage from './components/ContactPage';
import ColorPencilCaseStudy from './components/ColorPencilCaseStudy'; 
import LaunchpadCaseStudy from './components/LaunchpadCaseStudy';
import EndaCaseStudy from './components/EndaCaseStudy';
import BioconBiologicsCaseStudy from './components/BioconBiologicsCaseStudy';
import OnGoCaseStudy from './components/OnGoCaseStudy';
import DripStrideCaseStudy from './components/DripStrideCaseStudy';
import CryptoDashCaseStudy from './components/CryptoDashCaseStudy';

const App = () => {
  return (
    <MotionConfig transition={{ type: 'tween', duration: 0.5, ease: 'easeOut' }}>
      <Router>
        <div className="font-sans antialiased">
          <Navbar />
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
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </Router>
    </MotionConfig>
  );
};

export default App;
