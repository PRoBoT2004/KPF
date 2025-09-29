import React, { Suspense, lazy } from 'react';
import { MotionConfig } from 'framer-motion';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
const HomePage = lazy(() => import('./components/HomePage'));
const WorksPage = lazy(() => import('./components/WorksPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));
const ColorPencilCaseStudy = lazy(() => import('./components/ColorPencilCaseStudy'));
const LaunchpadCaseStudy = lazy(() => import('./components/LaunchpadCaseStudy'));
const EndaCaseStudy = lazy(() => import('./components/EndaCaseStudy'));
const BioconBiologicsCaseStudy = lazy(() => import('./components/BioconBiologicsCaseStudy'));
const OnGoCaseStudy = lazy(() => import('./components/OnGoCaseStudy'));
const DripStrideCaseStudy = lazy(() => import('./components/DripStrideCaseStudy'));
const CryptoDashCaseStudy = lazy(() => import('./components/CryptoDashCaseStudy'));

const App = () => {
  return (
    <MotionConfig transition={{ type: 'tween', duration: 0.5, ease: 'easeOut' }}>
      <Router>
        <div className="font-sans antialiased">
          <Navbar />
          <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
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
          </Suspense>
        </div>
      </Router>
    </MotionConfig>
  );
};

export default App;
